type APIErrorCode =
    | 'ERR_UNKNOWN'
    | 'ERR_EMAIL_COULD_NOT_BE_SENT'
    | 'ERR_TOKEN_MISSING_IN_HEADER_OR_REQ_QUERY'
    | 'ERR_TOKEN_INVALID'
    | 'ERR_TOKEN_SUBJECT_INVALID'
    | 'ERR_PERMISSION_DENIED'
    | 'ERR_VALIDATION'
    | 'ERR_USER_ALREADY_EXISTS'
    | 'ERR_USER_ALREADY_VERIFIED'
    | 'ERR_USER_NOT_VERIFIED'
    | 'ERR_USER_NOT_FOUND'
    | 'ERR_USERNAME_PASSWORD_INVALID'
    | 'ERR_SECURITY_CONTEXT_NOT_SET'
    | 'ERR_SHOP_ITEM_NOT_FOUND'
    | 'ERR_SHOP_ITEM_INVALID_STOCK'
    | 'ERR_SHOP_ITEM_ALREADY_EXISTS'
    | 'ERR_CART_EMPTY'
    | 'ERR_CART_NOT_FOUND'
    | 'ERR_CART_ALREADY_EXISTS'
    | 'ERR_ORDER_NOT_FOUND'
    | 'ERR_ORDERED_SHOP_ITEM_ALREADY_EXISTS'
    | 'ERR_ORDERED_SHOP_ITEM_NOT_FOUND'
    | 'ERR_SELLER_NEED_TO_RESET_PASSWORD'
    | 'ERR_ORDER_ALREADY_VALIDATED'
    | 'ERR_NOT_SUPPORTED_FILE_TYPE'

const ERROR_CODE_TO_STRING: Record<APIErrorCode, string> = {
    'ERR_UNKNOWN': 'Unknown error from server',
    'ERR_EMAIL_COULD_NOT_BE_SENT': 'Email can not be sent by our fake SMTP server',
    'ERR_TOKEN_MISSING_IN_HEADER_OR_REQ_QUERY': 'Token is missing in header or request query',
    'ERR_TOKEN_INVALID': 'The token is invalid',
    'ERR_TOKEN_SUBJECT_INVALID': 'The token subject is invalid',
    'ERR_PERMISSION_DENIED': 'You do not have permission to perform this action',
    'ERR_VALIDATION': 'Validation failed',
    'ERR_USER_ALREADY_EXISTS': 'User already exists',
    'ERR_USER_NOT_VERIFIED': 'User is not verified',
    'ERR_USER_ALREADY_VERIFIED': 'User is already verified',
    'ERR_USER_NOT_FOUND': 'User were not registered to platform',
    'ERR_USERNAME_PASSWORD_INVALID': 'Username or password is invalid',
    'ERR_SECURITY_CONTEXT_NOT_SET': 'Security context is not set',
    'ERR_SHOP_ITEM_NOT_FOUND': 'Shop item not found',
    'ERR_SHOP_ITEM_INVALID_STOCK': "One of items in order is out of stock. Please contact admin to increase item's quantity in stock",
    'ERR_SHOP_ITEM_ALREADY_EXISTS': 'Shop item already exists',
    'ERR_CART_EMPTY': 'Cart is empty',
    'ERR_CART_NOT_FOUND': 'Cart not found',
    'ERR_CART_ALREADY_EXISTS': 'Cart already exists',
    'ERR_ORDER_NOT_FOUND': 'Order not found',
    'ERR_ORDERED_SHOP_ITEM_ALREADY_EXISTS': 'Ordered shop item already exists',
    'ERR_ORDERED_SHOP_ITEM_NOT_FOUND': 'Ordered shop item not found',
    'ERR_SELLER_NEED_TO_RESET_PASSWORD': 'Seller need to reset password on the first signin',
    'ERR_ORDER_ALREADY_VALIDATED': 'Order were already validated',
    'ERR_NOT_SUPPORTED_FILE_TYPE': 'File type is not supported',
};


export type APIErrorType = {
    code: APIErrorCode,
    message?: string,
}

export class APIError extends Error {
    httpStatus: number;
    code: APIErrorCode;
    errMessage?: string;

    constructor(httpStatus: number, code: APIErrorCode, errMessage?: string) {
        super();
        this.httpStatus = httpStatus;
        this.code = code;
        this.errMessage = errMessage;
    }

    toJSON(): APIErrorType {
        const errJson: APIErrorType = {
            code: this.code,
        }
        if (this.errMessage) {
            errJson.message = this.errMessage;
        }
        return errJson;
    }

    toString(): string {
        return ERROR_CODE_TO_STRING[this.code];
    }
}