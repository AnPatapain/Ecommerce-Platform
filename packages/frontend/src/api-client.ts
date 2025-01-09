import {User} from "@app/shared-models/src/user.model.ts";
import {APIError} from "@app/shared-models/src/error.type.ts";
import {
    APITokenResponse,
    SigninRequest,
    MailVerificationResponse,
    SignupRequest,
    ResetPasswordRequest,
    APISuccessResponse,
    SignupSuccessResponse,
    SellerCreationRequest, SellerCreationResponse
} from "@app/shared-models/src/api.type.ts";
import {CONFIG} from "./frontend-config.ts";

export const apiClient = {
    user: {
        getAll: (token: string): Promise<Array<User>> => sendRequest('GET', 'api/users', undefined, token),
        getCurrent: (token: string): Promise<User> => sendRequest('GET', 'api/users/current', undefined, token),
    },
    auth: {
        signup: (data: SignupRequest): Promise<SignupSuccessResponse> =>
            sendRequest("POST", "api/auth/signup", data),
        signin: (data: SigninRequest): Promise<APITokenResponse> =>
            sendRequest("POST", "api/auth/signin", data),
        sendVerifyAccountEmail: (email: string): Promise<MailVerificationResponse> =>
            sendRequest("GET", `api/auth/send-verification-mail?email=${email}`),
        verifyAccount: (token: string): Promise<APITokenResponse> =>
            sendRequest("GET", `api/auth/verify?token=${token}`),
        sendResetPasswordEmail: (email: string): Promise<MailVerificationResponse> =>
            sendRequest("GET", `api/auth/send-reset-password-email?email=${email}`),
        resetPassword: (resetPasswordToken: string, data: ResetPasswordRequest): Promise<APISuccessResponse> =>
            sendRequest("POST", `api/auth/reset-password`, data, resetPasswordToken),
    },
    shopItem: {
        getAll: () => sendRequest('GET', 'api/shop-item'),
    },
    admin: {
        getAllSellers: (token: string): Promise<User[]> =>
            sendRequest('GET', 'api/users?role=seller', undefined, token),
        addSeller: (data: SellerCreationRequest, token: string): Promise<SellerCreationResponse> =>
            sendRequest('POST', 'api/users', data, token),
        deleteSeller: (sellerId: number, token: string): Promise<APISuccessResponse> =>
            sendRequest('DELETE', `api/users/${sellerId}`, undefined, token),
    }
}

async function sendRequest(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    body?: any,
    token?: string): Promise<any> {
    const options: any = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': token ? token : '',
        }
    }
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(`${CONFIG.PUBLIC_URL}/${endpoint}`, options);
    if (!response.ok) {
        // Throw an error with the status and status text
        const errorData = await response.json(); // Optionally parse the response body

        throw new APIError(
            response.status,
            errorData.code,
            errorData.message,
        );
    }

    return await response.json();
}