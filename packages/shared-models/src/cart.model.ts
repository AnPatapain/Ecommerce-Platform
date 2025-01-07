import {ShopItemOnCart} from "./shopItemOnCart.model";

export type Cart = {
    id: number;

    //relationship
    shopItems : ShopItemOnCart[];
    userId: number;
}