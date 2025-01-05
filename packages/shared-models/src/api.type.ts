import {User} from "./user.model";
import {ShopItem} from "./shopItem.model";

////////////////////
// API Request type
export type SignupRequest = Pick<User, 'email' | 'password' | 'name'>;
export type SigninRequest = Pick<User, 'email' | 'password'>;
export type ResetPasswordRequest = { newPassword: string };
export type ShopItemCreationRequest = Omit<ShopItem, 'id' |'carts'|'orderedShopItems' >
export type ShopItemUpdateRequest = Partial<Omit<ShopItem,|'id'>>

////////////////////
// API Response type
export type APISuccessResponse = {
    success: boolean,
}

export type APITokenResponse = {
    apiAccessToken: string;
};
export type SignupSuccessResponse = {
    createdUser: User,
    mailPreviewUrl: string,
}
export type MailVerificationResponse = {
    mailPreviewUrl: string;
}