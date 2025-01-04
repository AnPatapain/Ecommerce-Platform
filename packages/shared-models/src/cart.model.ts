import {ShopItem} from "./shopItem.model";

export type Cart = {
    id: number;

    //relationship
    shopItems : ShopItem[];
    userId: number;
}