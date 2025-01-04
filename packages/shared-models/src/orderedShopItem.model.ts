import {Product} from "./product.model";

export type OrderedProduct ={
    id: number;
    quantity: number;
    priceAtPurchase : number;

    //relationship
    productId : Product;
}

