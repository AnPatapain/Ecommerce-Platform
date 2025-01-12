import {Body, Controller, Delete, Get, Post, Query, Request, Res, Route, Security, Tags, type TsoaResponse} from "tsoa";
import {UserRepository} from "../repositories/user.repository";
import express from "express";
import {APISuccessResponse, type SellerCreationRequest, SellerCreationResponse} from "@app/shared-models/src/api.type";
import {User, type UserRole} from "@app/shared-models/src/user.model";
import {generateAndReturnToken, generatePasswordHashed} from "../services/auth.service";
import {sendEmail} from "../services/mail.service";
import {CONFIG} from "../backend-config";
import { RESET_SELLER_PASSWORD_TEMPLATE} from "../utils/email-template";
import {APIErrorType} from "@app/shared-models/src/error.type";

@Route('/api/users')
export class UserController extends Controller {
    private userRepository: UserRepository = UserRepository.getInstance();

    /**
     * Retrieve the current user's information.
     * @param req - The request object.
     * @returns The current user's information.
     */
    @Get('current')
    @Security('token', ['user:current.read'])
    @Tags('User/Current')
    public async getCurrentUser(@Request() req: express.Request) {
        return req.securityContext ? req.securityContext.user : null;
    }

    ////////////////
    // Admin routes


    /**
     * Create a new seller.
     * @param sellerCreationRequest - The seller creation request data.
     * @param errUserAlreadyExisted - Response if the user already exists.
     * @returns The created seller and a mail preview URL.
     */
    @Post('')
    @Security('token', ['user.write'])
    @Tags('User/Admin')
    public async createSeller(
        @Body() sellerCreationRequest: SellerCreationRequest,
        @Res() errUserAlreadyExisted: TsoaResponse<409, APIErrorType>
    ): Promise<SellerCreationResponse> {
        const existingUser = await this.userRepository.findByEmail(sellerCreationRequest.email);
        if (existingUser && existingUser.role === 'seller') {
            throw errUserAlreadyExisted(409, {
                code: 'ERR_USER_ALREADY_EXISTS'
            });
        }

        const user = await this.userRepository.createOne({
            email: sellerCreationRequest.email,
            name: sellerCreationRequest.name,
            password: generatePasswordHashed(sellerCreationRequest.password),
            verified: false,
        });
        const updatedUser = await this.userRepository.updateOne(user.id, {
            role: 'seller',
        });

        const mailPreviewUrl = await this._sendSellerResetPasswordEmail(user);

        return {
            createdSeller: {
                ...updatedUser,
                cart: updatedUser.cart? {...updatedUser.cart} : undefined,
            },
            mailPreviewUrl: mailPreviewUrl,
        };
    }

    @Get('{userId}')
    @Security('token', ['user.read'])
    @Tags('User/Admin')
    public async getUserById(userId: number): Promise<User | null> {
        return await this.userRepository.findOneById(userId);
    }


    /**
     * Retrieve all users by role.
     * @param role - The role of the users to retrieve.
     * @returns The users with the specified role.
     */
    @Get('')
    @Security('token', ['user.read'])
    @Tags('User/Admin')
    public async getAllUsersByRole(
        @Query() role: UserRole,
    ) {
        const users = await this.userRepository.findAll();
        return users.filter(user => user.role === role);
    }

    /**
     * Delete a seller by user ID.
     * @param userId - The ID of the user to delete.
     * @returns A success response indicating the user was deleted.
     */
    @Delete('{userId}')
    @Security('token', ['user.write'])
    @Tags('User/Admin')
    public async deleteSeller(
        userId: number,
    ): Promise<APISuccessResponse> {
        await this.userRepository.deleteOneById(userId);
        return {
            success: true,
        }
    }

    ///////////////////
    // Private methods
    private async _sendSellerResetPasswordEmail(user: User): Promise<string> {
        const resetPasswordToken = await generateAndReturnToken({
            tokenType: 'reset_password',
            userId: user.id,
        })

        const resetPasswordEndpoint = `${CONFIG.PUBLIC_URL}/reset-password?token=${resetPasswordToken}&email=${user.email}`;

        return await sendEmail(
            user.email,
            'Seller account created by admin',
            `You need to reset password, click this link to reset password: ${resetPasswordEndpoint}`,
            RESET_SELLER_PASSWORD_TEMPLATE(resetPasswordEndpoint),
        );
    }
}