import {OrderedShopItem} from "./orderedShopItem.model";
import {ShopItemOnCart} from "./shopItemOnCart.model";


export type ShopItem = {
    id: number;
    name: string;
    price: number;
    description: string;
    quantity: number;
    image: string;

    //relationship
    orderedShopItems : OrderedShopItem[];
    carts : ShopItemOnCart[];
}