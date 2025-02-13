import {User} from "@app/shared-models/src/user.model.ts";
import {APIError} from "@app/shared-models/src/error.type.ts";
import {
    APISuccessResponse,
    APITokenResponse,
    CartUpdateRequest,
    MailVerificationResponse,
    OrderCreationRequest,
    ResetPasswordRequest,
    SellerCreationRequest,
    SellerCreationResponse,
    ShopItemCreationRequest,
    ShopItemUpdateRequest,
    SigninRequest,
    SignupRequest,
    SignupSuccessResponse
} from "@app/shared-models/src/api.type.ts";
import {CONFIG} from "./frontend-config.ts";
import {Order} from "@app/shared-models/src/order.model.ts";
import {ShopItem} from "@app/shared-models/src/shopItem.model.ts";

export const apiClient = {
    user: {
        getAll: (token: string): Promise<Array<User>> => sendRequest('GET', 'api/users', undefined, token),
        getCurrent: (token: string): Promise<User> => sendRequest('GET', 'api/users/current', undefined, token),
        getOneById: (userId: number, token: string): Promise<User | null> => sendRequest('GET', `api/users/${userId}`, undefined, token),
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
        getOneById: (id: number, token: string): Promise<ShopItem> =>
            sendRequest('GET', `api/shop-item/${id}`, undefined, token),
        uploadShopItemImage: (formData: FormData, token: string) =>
            sendRequest('POST', 'api/shop-item/upload-image', formData, token),
        createOne: (data: ShopItemCreationRequest, token: string) =>
            sendRequest('POST', 'api/shop-item', data, token),
        updateOne: (shopItemId: number, data: ShopItemUpdateRequest, token: string) =>
            sendRequest('PUT', `api/shop-item/${shopItemId}`, data, token),
        deleteOne: (shopItemId: number, token: string) =>
            sendRequest('DELETE', `api/shop-item/${shopItemId}`, undefined, token),
    },
    cart: {
        addShopItemToCart: (data: CartUpdateRequest, token: string) =>
            sendRequest('PUT', 'api/cart', data, token),
        removeShopItemToCart: (data: CartUpdateRequest, token: string) =>
            sendRequest('PUT', 'api/cart', data, token)
    },
    order: {
        createOrder: (data: OrderCreationRequest, token: string): Promise<Order> =>
            sendRequest('POST', 'api/order/me', data, token),
        getMyOrders: (token: string): Promise<Order[]> =>
            sendRequest('GET', 'api/order/me', undefined, token),
        getAllOrders: (token: string): Promise<Order[]> =>
            sendRequest('GET', 'api/order', undefined, token),
        validateOrder: (orderId: number, token: string): Promise<APISuccessResponse> =>
            sendRequest('PUT', `api/order/${orderId}`, undefined, token),
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
            // 'Content-Type': 'application/json',
            'x-api-key': token ? token : '',
        }
    }
    // Only set Content-Type if the body is not FormData
    if (body && !(body instanceof FormData)) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body); // Serialize JSON payload
    } else if (body instanceof FormData) {
        options.body = body; // Let the browser handle the Content-Type
    }

    // if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    //     options.body = JSON.stringify(body);
    // }
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