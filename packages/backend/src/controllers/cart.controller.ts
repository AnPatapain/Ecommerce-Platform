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
    Query,
} from "tsoa";
import {APIErrorType} from "@app/shared-models/src/error.type";
import { CartRepository } from "../repositories/cart.repository";
import {ShopItemRepository} from "../repositories/shopItem.repository";
import {getCurrentUser} from "../security/auth.handler";
import { UserRepository } from "../repositories/user.repository";

@Route('/api/cart')
export class CartController extends Controller{
    private cartRepository: CartRepository = CartRepository.getInstance();
    private userRepository: UserRepository = UserRepository.getInstance();
    private shopItemRepository: ShopItemRepository = ShopItemRepository.getInstance();

    @Get('')
    @Security('token', ['cart.read'])
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

    @Post('')
    @Security('token', ['cart.write'])
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



    @Put('{id}')
    @Security('token', ['cart.write'])
    @SuccessResponse('200', 'OK')
    public async updateCart(
        @Path() id: number,
        @Body() cartData: any,
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
        const existItems = await this.cartRepository.findItemsInCart(id, cartData.shopItemsToAdd);

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

        const cart = await this.cartRepository.findById(id);
        if (!cart) {
            throw errCartNotFound(404, {
                code: 'ERR_CART_NOT_FOUND'
            });
        }
        return this.cartRepository.updateOne(id, cartData);
    }
}
