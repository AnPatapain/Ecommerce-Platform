import {UserRole} from "@app/shared-models/src/user.model";
import {Token} from "@app/shared-models/src/token.model";

export type SecurityScope =
    | 'user.read'           // read all users
    | 'user.write'          // write all users
    | 'user:current.verify'         // Special permission: verify user
    | 'user:current.read'   // read current user
    | 'user:current.write'  // write current user
    | 'token:current.read'  // read all token belong to you
    | 'token:current.write' // write all token belong to you
    | 'shopItem.read'      // read all shop items
    | 'shopItem.write'    // write all shop items
    | 'cart:current.read'  // user read current cart
    | 'cart:current.write' // user write current cart
    | 'order:current.read' // user read current order
    | 'order.read'     // read all orders
    | 'order.write'         // write all orders
    | 'order:current.write';    // user write current order


export const API_VERIFICATION_SCOPES: Set<SecurityScope> = new Set<SecurityScope>([
    'user:current.verify',
]);

export const RESET_PASSWORD_TOKEN: Set<SecurityScope> = new Set<SecurityScope>([
    'user:current.write',
])

export const BASE_SCOPES: Set<SecurityScope> = new Set<SecurityScope>([
    'user:current.read',
    'user:current.write',
    'token:current.read',
    'token:current.write',
    'order:current.read',
    'order:current.write',
]);

export const USER_SCOPES: Set<SecurityScope> = new Set<SecurityScope>([
    ...BASE_SCOPES,
    'cart:current.read',
    'cart:current.write',
    'order:current.read',
    'order:current.write',
]);

export const SELLER_SCOPES: Set<SecurityScope> = new Set<SecurityScope>([
    ...USER_SCOPES,
    'user.read',
    'order.read',
    'order.write',
]);

export const ADMIN_SCOPES: Set<SecurityScope> = new Set<SecurityScope>([
    ...BASE_SCOPES,
    'user.read',
    'user.write',
    'order.read',
    'shopItem.read',
    'shopItem.write',
]);

export function getScopesBasedOnUserRoleOrTokenType(userRole: UserRole, token: Token) {
    if (userRole === 'user') {
        if (token.tokenType === 'account_verification') return API_VERIFICATION_SCOPES;

        else if (token.tokenType === 'reset_password') return RESET_PASSWORD_TOKEN;

        return USER_SCOPES;
    }
    else if (userRole === 'admin') {
        if (token.tokenType === 'account_verification') return API_VERIFICATION_SCOPES;

        else if (token.tokenType === 'reset_password') return RESET_PASSWORD_TOKEN;

        return ADMIN_SCOPES;
    }
    else if (userRole === 'seller') {
        if (token.tokenType === 'account_verification') return API_VERIFICATION_SCOPES;

        else if (token.tokenType === 'reset_password') return RESET_PASSWORD_TOKEN;

        return SELLER_SCOPES;
    }

    else {
        return USER_SCOPES;
    }
}