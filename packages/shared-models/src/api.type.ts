import {User} from "./user.model";
import {ShopItem} from "./shopItem.model";

////////////////////
// API Request type
export type UserCreationRequest = Omit<User, 'id' | 'role' | 'verified'>;
export type LoginRequest = Pick<User, 'email' | 'password'>;
export type ShopItemCreationRequest = Omit<ShopItem, 'id' |'carts'|'orderedShopItems' >
export type ShopItemUpdateRequest = Partial<Omit<ShopItem,|'id'>>

////////////////////
// API Response type
export type APITokenResponse = {
    apiAccessToken: string;
};
export type MailVerificationResponse = {
    createdUser: User,
    mailPreviewUrl: string;
}