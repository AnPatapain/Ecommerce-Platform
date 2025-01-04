import {ShopItem} from "./shopItem.model";

export type OrderedShopItem ={
    id: number;
    quantity: number;
    priceAtPurchase : number;

    //relationship
    shopItemId : number;
    orderId : number;
}

