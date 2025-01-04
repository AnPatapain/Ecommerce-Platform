import {User} from "./user.model";
import {ShopItem} from "./shopItem.model";

export type UserCreationRequest = Omit<User, 'id' | 'role' | 'verified'>;
export type LoginRequest = Pick<User, 'email' | 'password'>;
export type TokenResponse = {
    apiAccessToken: string;
};


export type ShopItemCreationRequest = Omit<ShopItem, 'id' |'carts'|'orderedShopItems' >
export type ShopItemUpdateRequest = Partial<Omit<ShopItem,|'id'>>