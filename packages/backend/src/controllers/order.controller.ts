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
    Tags,
} from "tsoa";
import {OrderRepository} from "../repositories/order.repository";
import {ShopItemRepository} from "../repositories/shopItem.repository";
import {APIErrorType} from "@app/shared-models/src/error.type";
import {getCurrentUser} from "../security/auth.handler";
import {APISuccessResponse, type OrderCreationRequest} from "@app/shared-models/src/api.type";
import {CartRepository} from "../repositories/cart.repository";


@Route('/api/order')
export class OrderController extends Controller{
    private orderRepository: OrderRepository = OrderRepository.getInstance();
    private shopItemRepository: ShopItemRepository = ShopItemRepository.getInstance();
    private cartRepository: CartRepository = CartRepository.getInstance();


    @Get('/me')
    @Security('token', ['order:current.read'])
    @SuccessResponse('200', 'OK')
    @Tags('Order/Current')
    public async getCurrentUserOrders(
        @Request() req: express.Request
    ){
        const userId = getCurrentUser(req).id;
        return await this.orderRepository.findAllByUserId(userId);
    }

    /**
     * Retrieve a specific order of the current user by order ID.
     * @param orderId - The ID of the order.
     * @param req - The request object.
     * @param errOrderNotFound - Response if the order is not found.
     * @returns The specified order.
     */
    @Get('/me/{orderId}')
    @Security('token', ['order:current.read'])
    @SuccessResponse('200', 'OK')
    @Tags('Order/Current')
    public async getCurrentUserOrderById(
        @Path() orderId: number,
        @Request() req: express.Request,
        @Res() errOrderNotFound: TsoaResponse<404, APIErrorType>
    ){
        const userId = getCurrentUser(req).id;
        const order = await this.orderRepository.findOneByUserId(orderId, userId);
        if (!order || order.userId !== userId) {
            throw errOrderNotFound(404, {
                code: 'ERR_ORDER_NOT_FOUND'
            });
        }
        return order;
    }

    /**
     * Create a new order.
     * @param orderData - The order creation request data.
     * @param req - The request object.
     * @param errShopItemNotFound - Response if a shop item is not found.
     * @param errShopItemInvalidStock - Response if a shop item has invalid stock.
     * @param errCartNotFound - Response if the cart is not found.
     * @returns The created order.
     */
    @Post('/me')
    @Security('token', ['order:current.write'])
    @SuccessResponse('201', 'Created')
    @Tags('Order/Current')
    public async createOrder(
        @Body() orderData: Omit<OrderCreationRequest,"userId">,
        @Request() req: express.Request,
        @Res() errShopItemNotFound: TsoaResponse<404, APIErrorType>,
        @Res() errShopItemInvalidStock: TsoaResponse<400, APIErrorType>,
        @Res() errCartNotFound: TsoaResponse<404, APIErrorType>,
    ){
        for(const shopItem of orderData.shopItems){
            const shopItemFound = await this.shopItemRepository.findById(shopItem.id);
            if (!shopItemFound) {
                throw errShopItemNotFound(404, {
                    code: 'ERR_SHOP_ITEM_NOT_FOUND'
                });
            }
            if (shopItemFound.quantity < 0) {
                throw errShopItemInvalidStock(400, {
                    code: 'ERR_SHOP_ITEM_INVALID_STOCK'
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

        const orderCreationData ={
            ...orderData,
            userId: userId,
        }
        const order = await this.orderRepository.createOne(orderCreationData);
        await this.cartRepository.updateOne(cart.id, {shopItemsToAdd:[],shopItemsToRemove:orderData.shopItems.map(shopItem => shopItem.id)});

        return order;
    }

    // @Post('')
    // @Security('token', ['order:current.write'])
    // @SuccessResponse('201', 'Created')
    // public async createOrder(
    //     @Request() req: express.Request,
    //     @Body() orderData: OrderCreationRequest,
    //     @Res() errShopItemNotFound: TsoaResponse<404, APIErrorType>,
    //     @Res() errCartNotFound: TsoaResponse<404, APIErrorType>,
    //     @Res() errShopItemInvalidStock: TsoaResponse<400, APIErrorType>,
    // ){
    //     const currentUser = getCurrentUser(req);
    //     for(const shopItem of orderData.shopItems){
    //         const shopItemFound = await this.shopItemRepository.findById(shopItem.id);
    //         if (!shopItemFound) {
    //             throw errShopItemNotFound(404, {
    //                 code: 'ERR_SHOP_ITEM_NOT_FOUND'
    //             });
    //         }
    //         if (shopItemFound.quantity < 0) {
    //             throw errShopItemInvalidStock(400, {
    //                 code: 'ERR_SHOP_ITEM_INVALID_STOCK'
    //             });
    //         }
    //     }
    //
    //     const createdOrder = await this.orderRepository.createOne({
    //         userId: currentUser.id,
    //         shopItems: orderData.shopItems,
    //     });
    //
    //     // Remove corresponding item in cart
    //     const cartController = new CartController();
    //     await cartController.updateCart(
    //         req,
    //         {
    //             shopItemsToAdd: [],
    //             shopItemsToRemove: [...orderData.shopItems.map(item => item.id)]
    //         },
    //         errCartNotFound,
    //         errShopItemNotFound
    //     )
    //
    //
    //     return createdOrder
    // }
    //

    ////////////////
    // Seller routes

    /**
     * Retrieve all orders.
     * @returns All orders.
     */
    @Get('')
    @Security('token', ['order.read'])
    @SuccessResponse('200', 'OK')
    @Tags('Order/Seller')
    public async getAllOrders(){
        return await this.orderRepository.findAll();
    }


    /**
     * Retrieve a specific order by order ID.
     * @param orderId - The ID of the order.
     * @param errOrderNotFound - Response if the order is not found.
     * @returns The specified order.
     */
    @Get('/{orderId}')
    @Security('token', ['order:read'])
    @SuccessResponse('200', 'OK')
    @Tags('Order/Seller')
    public async getOrderById(
        @Path() orderId: number,
        @Res() errOrderNotFound: TsoaResponse<404, APIErrorType>
    ){
        const order = await this.orderRepository.findOneById(orderId);
        if (!order) {
            throw errOrderNotFound(404, {
                code: 'ERR_ORDER_NOT_FOUND'
            });
        }
        return order;
    }

    /**
     * Validate an order by order ID.
     * @param orderId - The ID of the order.
     * @param errOrderAlreadyValidated
     * @param errOrderNotFound - Response if the order is not found.
     * @param errShopItemNotFound - Response if a shop item is not found.
     * @param errShopItemInvalidStock - Response if a shop item has invalid stock.
     * @returns A message indicating the order validation status.
     */
    @Put('/{orderId}')
    @Security('token', ['order.write'])
    @SuccessResponse('200', 'OK')
    @Tags('Order/Seller')
    public async validateOrder(
        @Path() orderId: number,
        @Res() errOrderAlreadyValidated: TsoaResponse<400, APIErrorType>,
        @Res() errOrderNotFound: TsoaResponse<404, APIErrorType>,
        @Res() errShopItemNotFound: TsoaResponse<404, APIErrorType>,
        @Res() errShopItemInvalidStock: TsoaResponse<400, APIErrorType>,
    ): Promise<APISuccessResponse>
    {
        const order = await this.orderRepository.findOneById(orderId);
        if (!order) {
            throw errOrderNotFound(404, {
                code: 'ERR_ORDER_NOT_FOUND'
            });
        }
        if (order.valid){
            throw errOrderAlreadyValidated(400, {code: 'ERR_ORDER_ALREADY_VALIDATED'});
        }

        for(const orderedShopItem of order.orderedShopItems){
            const shopItem = await this.shopItemRepository.findById(orderedShopItem.shopItemId);
            if (!shopItem) {
                throw errShopItemNotFound(404, {
                    code: 'ERR_SHOP_ITEM_NOT_FOUND'
                });
            }
            if(shopItem.quantity < 1){
                throw errShopItemInvalidStock(400, {
                    code: 'ERR_SHOP_ITEM_INVALID_STOCK'
                });
            }
            await this.shopItemRepository.updateOne(shopItem.id, {quantity: shopItem.quantity - 1});
        }
        await this.orderRepository.validateOne(orderId);
        return {
            success: true
        }
    }


}