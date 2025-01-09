import {ShopItem} from "./shopItem.model";
import {OrderedShopItem} from "./orderedShopItem.model";

export type Order = {
    id: number;
    valid : boolean;
    //relationship;
    orderedShopItems: OrderedShopItem[];
    userId: number;
}