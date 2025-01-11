import express from "express";

import {
    Controller,
    Get,
    Route,
    Path,
    Res,
    type TsoaResponse,
    Put,
    Security,
    Body,
    SuccessResponse, Post,
    Request,
    Query, Tags,
} from "tsoa";
import {APIErrorType} from "@app/shared-models/src/error.type";
import { CartRepository } from "../repositories/cart.repository";
import {ShopItemRepository} from "../repositories/shopItem.repository";
import {getCurrentUser} from "../security/auth.handler";
import { UserRepository } from "../repositories/user.repository";
import {type CartUpdateRequest} from "@app/shared-models/src/api.type";

@Route('/api/cart')
@Tags('Cart')
export class CartController extends Controller{
    private cartRepository: CartRepository = CartRepository.getInstance();
    private userRepository: UserRepository = UserRepository.getInstance();
    private shopItemRepository: ShopItemRepository = ShopItemRepository.getInstance();


    /**
     * Send a reset password email to the user.
     * @returns A mail verification response containing the mail preview URL.
     * @param req
     * @param errCartNotFound
     */

    @Get('')
    @Security('token', ['cart:current.read'])
    @SuccessResponse('200', 'OK')
    public async getCart(
        @Request() req: express.Request,
        @Res() errCartNotFound: TsoaResponse<404, APIErrorType>,

    ) {
        const user = getCurrentUser(req).id;
        const cart = await this.cartRepository.findByUserId(user);
        if (!cart) {
            throw errCartNotFound(404, {
                code: 'ERR_CART_NOT_FOUND'
            });
        }
        return cart;
    }
    /**
     * Create a new cart for the current user.
     * @param req - The request object.
     * @param errCartAlreadyExists - Response if the cart already exists.
     * @returns The created cart.
     */
    @Post('')
    @Security('token', ['cart:current.write'])
    @SuccessResponse('201', 'Created')
    public async createCart(
        @Request() req: express.Request,
        @Res() errCartAlreadyExists: TsoaResponse<404, APIErrorType>
    ) {
        const userId = getCurrentUser(req).id;
        const oldCart = await this.cartRepository.findByUserId(userId);
        if (oldCart) {
            throw errCartAlreadyExists(404, {
                code: 'ERR_CART_ALREADY_EXISTS'
            });
        }
        const cart = await this.cartRepository.createOne({ userId });
        await this.userRepository.updateOne(userId, { cart: cart });
        return cart;
    }


    /**
     * Update the current user's cart.
     * @param req - The request object.
     * @param cartData - The cart update request containing items to add or remove.
     * @param errCartNotFound - Response if the cart is not found.
     * @param errShopItemNotFound - Response if a shop item is not found.
     * @returns The updated cart.
     */
    @Put('')
    @Security('token', ['cart:current.write'])
    @SuccessResponse('200', 'OK')
    public async updateCart(
        @Request() req: express.Request,
        @Body() cartData: CartUpdateRequest,
        @Res() errCartNotFound: TsoaResponse<404, APIErrorType>,
        @Res() errShopItemNotFound: TsoaResponse<404, APIErrorType>
    ) {
        for(const shopItemId of cartData.shopItemsToAdd){
            const shopItem = await this.shopItemRepository.findById(shopItemId);
            if (!shopItem) {
                throw errShopItemNotFound(404, {
                    code: 'ERR_SHOP_ITEM_NOT_FOUND'
                });
            }
        }
        const userId = getCurrentUser(req).id;
        const cart = await this.cartRepository.findByUserId(userId);
        if (!cart) {
            throw errCartNotFound(404, {
                code: 'ERR_CART_NOT_FOUND'
            });
        }

        const existItems = await this.cartRepository.findItemsInCart(cart.id, cartData.shopItemsToAdd);

        if (existItems && existItems.shopItems.length > 0) {
            cartData.shopItemsToAdd = cartData.shopItemsToAdd.filter(
                (shopItemId: number) => !existItems.shopItems.some((item) => item.shopItemId === shopItemId)
            );
        }

        for (const shopItemId of cartData.shopItemsToRemove){
            const shopItem = await this.shopItemRepository.findById(shopItemId);
            if (!shopItem) {
                throw errShopItemNotFound(404, {
                    code: 'ERR_SHOP_ITEM_NOT_FOUND'
                });
            }
        }

        return this.cartRepository.updateOne(cart.id, cartData);
    }
}
