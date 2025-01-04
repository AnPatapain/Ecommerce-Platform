import {OrderedProduct} from "./orderedProduct.model";
import {Cart} from "./cart.model";

export type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    quantity: number;

    //relationship
    orderedProduct : OrderedProduct[];
    carts : Cart[];
}