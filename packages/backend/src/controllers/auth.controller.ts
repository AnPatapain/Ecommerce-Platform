import {Body, Controller, Get, NoSecurity, Post, Query, Request, Res, Route, Security, type TsoaResponse} from "tsoa";
import {
    type SigninRequest,
    type APITokenResponse,
    type SignupRequest,
    type MailVerificationResponse,
    type APISuccessResponse,
    type ResetPasswordRequest, SignupSuccessResponse
} from "@app/shared-models/src/api.type";
import {UserRepository} from "../repositories/user.repository";
import {APIErrorType} from "@app/shared-models/src/error.type";
import {generateAndReturnToken, generatePasswordHashed, verifyPassword} from "../services/auth.service";
import {sendEmail} from "../services/mail.service";
import express from "express";
import {User} from "@app/shared-models/src/user.model";
import {RESET_PASSWORD_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE} from "../utils/email-template";
import {CONFIG} from "../backend-config";
import {TokenRepository} from "../repositories/token.repository";
import {getCurrentUser} from "../security/auth.handler";

@Route('/api/auth')
export class AuthController extends Controller {
    private userRepository: UserRepository = UserRepository.getInstance();
    private tokenRepository: TokenRepository = TokenRepository.getInstance();

    @Post('signup')
    @NoSecurity()
    public async signup(
        @Body() requestBody: SignupRequest,
        @Res() errUserAlreadyExisted: TsoaResponse<409, APIErrorType>
    ): Promise<SignupSuccessResponse> {
        const user = await this.userRepository.findByEmail(requestBody.email);
        if (user) {
            throw errUserAlreadyExisted(409, {
                code: 'ERR_USER_ALREADY_EXISTS'
            });
        }
        const hashedPassword = generatePasswordHashed(requestBody.password);

        const createdUser = await this.userRepository.createOne({
            ...requestBody,
            password: hashedPassword,
            verified: false,
        });

        const mailPreviewUrl = await this._sendVerificationEmail(createdUser);

        return {
            createdUser: createdUser,
            mailPreviewUrl: mailPreviewUrl,
        };
    }

    @Get('send-verification-mail')
    @NoSecurity()
    public async sendVerifyAccountEmail(
        @Query() email: string,
        @Res() errUserNotFound: TsoaResponse<404, APIErrorType>
    ): Promise<MailVerificationResponse> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw errUserNotFound(404, {
                code: 'ERR_USER_NOT_FOUND'
            });
        }
        const mailPreviewUrl = await this._sendVerificationEmail(user);
        return {
            mailPreviewUrl: mailPreviewUrl
        };
    }

    @Get('verify')
    @Security('token', ['user:current.verify'])
    public async verifyAccount(
        @Request() req: express.Request,
        @Query() token: string
    ): Promise<APITokenResponse> {
        const user = getCurrentUser(req);
        await this.userRepository.updateOne(user.id, {
            verified: true,
        });

        // Before return API access token, we delete all old tokens (api + verification token) of user
        await this.tokenRepository.deleteMany({userId: user.id});

        // Return API access token after user verification
        const apiToken = await generateAndReturnToken({
            userId: user.id,
            tokenType: 'api'
        });

        return {
            apiAccessToken: apiToken,
        };
    }

    @Post('signin')
    @NoSecurity()
    public async signin(
        @Body() requestBody: SigninRequest,
        @Res() errUsernameOrPasswordInvalid: TsoaResponse<401, APIErrorType>,
        @Res() errUserNotVerified: TsoaResponse<401, APIErrorType>
    ) : Promise<APITokenResponse> {
        const user = await this.userRepository.findByEmail(requestBody.email);
        if (!user || !verifyPassword(requestBody.password, user.password)) {
            throw errUsernameOrPasswordInvalid(401, {
                code: 'ERR_USERNAME_PASSWORD_INVALID'
            });
        }
        if (!user.verified) {
            throw errUserNotVerified(401, {
                code: 'ERR_USER_NOT_VERIFIED'
            });
        }

        const token = await generateAndReturnToken({
            userId: user.id,
            tokenType: 'api'
        });

        return {
            apiAccessToken: token
        };
    }

    @Get('send-reset-password-email')
    public async sendResetPasswordEmail(
        @Query() email: string,
        @Res() errUserNotFound: TsoaResponse<404, APIErrorType>,
    ): Promise<MailVerificationResponse> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw errUserNotFound(404, {
                code: 'ERR_USER_NOT_FOUND'
            });
        }
        const mailPreviewUrl = await this._sendResetPasswordEmail(user);
        return {
            mailPreviewUrl: mailPreviewUrl
        };
    }

    @Post('reset-password')
    @Security('token', ['user:current.write'])
    public async resetPassword(
        @Request() req: express.Request,
        @Body() requestBody: ResetPasswordRequest,
    ): Promise<APISuccessResponse> {
        const currentUser = getCurrentUser(req);
        const newHashedPassword = generatePasswordHashed(requestBody.newPassword);
        await this.userRepository.updateOne(currentUser.id, {password: newHashedPassword});
        return {
            success: true
        };
    }

    ////////////////////
    // Private methods
    private async _sendVerificationEmail(user: User): Promise<string> {
        const verificationToken = await generateAndReturnToken({
            tokenType: 'account_verification',
            userId: user.id,
        });

        const verificationEndpoint = `${CONFIG.PUBLIC_URL}/verify-account-email?token=${verificationToken}`;

        return await sendEmail(
            user.email,
            'Verify account',
            `Click this link to verify account: ${verificationEndpoint}`,
            VERIFICATION_EMAIL_TEMPLATE(verificationEndpoint)
        );
    }

    private async _sendResetPasswordEmail(user: User): Promise<string> {
        const resetPasswordToken = await generateAndReturnToken({
            tokenType: 'reset_password',
            userId: user.id,
        })

        const resetPasswordEndpoint = `${CONFIG.PUBLIC_URL}/reset-password?token=${resetPasswordToken}&email=${user.email}`;

        return await sendEmail(
            user.email,
            'Reset password',
            `Click this link to reset password: ${resetPasswordEndpoint}`,
            RESET_PASSWORD_TEMPLATE(resetPasswordEndpoint),
        );
    }
}