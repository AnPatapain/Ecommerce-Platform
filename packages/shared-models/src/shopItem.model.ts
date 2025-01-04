import {OrderedShopItem} from "./orderedShopItem.model";
import {Cart} from "./cart.model";


export type ShopItem = {
    id: number;
    name: string;
    price: number;
    description: string;
    quantity: number;
    image: string;

    //relationship
    orderedShopItems : OrderedShopItem[];
    carts : Cart[];
}