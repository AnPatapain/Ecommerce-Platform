import {Cart} from "./cart.model";

export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    verified: boolean;

    cart?: Cart;
}

export type UserRole = 'user' | 'admin';