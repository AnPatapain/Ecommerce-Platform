import {ShopItem} from "./shopItem.model";
import {OrderedShopItem} from "./orderedShopItem.model";

export type Order = {
    id: number;
    totalPrice: number;
    //relationship;
    orderedShopItems: OrderedShopItem[];
}