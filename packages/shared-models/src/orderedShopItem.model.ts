import {ShopItem} from "./shopItem.model";

export type OrderedShopItem ={
    id: number;
    priceAtPurchase : number;

    //relationship
    shopItemId : number;
    orderId : number;
}

