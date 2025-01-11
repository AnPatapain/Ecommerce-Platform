import {User} from "./user.model";
import {ShopItem} from "./shopItem.model";
import {Cart} from "./cart.model";
import {Order} from "./order.model";
import {OrderedShopItem} from "./orderedShopItem.model";

////////////////////
// API Request type
export type SignupRequest = Pick<User, 'email' | 'password' | 'name'>;
export type SigninRequest = Pick<User, 'email' | 'password'>;
export type ResetPasswordRequest = { newPassword: string };

// shopItem
export type ShopItemCreationRequest = Omit<ShopItem, 'id' |'carts'|'orderedShopItems' >
export type ShopItemUpdateRequest = Partial<Omit<ShopItem,|'id'>>
// cart
export type CartCreationRequest = Omit<Cart,"id"|"shopItems">
export type CartUpdateRequest = {
    shopItemsToAdd: Array<number>,
    shopItemsToRemove: Array<number>,
}
// order
export type OrderCreationRequest = {
    shopItems: Array<ShopItem>,
}
export type OrderUpdateRequest = {
    orderedShopItemsToAdd: Array<ShopItem>,
    orderedShopItemsToRemove: Array<ShopItem>,
}
// orderedShopItem
export type OrderedShopItemCreationRequest = Omit<OrderedShopItem,"id">
export type OrderedShopItemUpdateRequest = Partial<Omit<OrderedShopItem,"id">>
export type SellerCreationRequest = Omit<User, 'id' | 'role' | 'verified'>;

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
export type SellerCreationResponse = {
    createdSeller: User,
    mailPreviewUrl: string,
}