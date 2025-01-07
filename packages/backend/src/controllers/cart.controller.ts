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
    SuccessResponse,
} from "tsoa";

import {APIErrorType} from "@app/shared-models/src/error.type";
import { CartRepository } from "src/repositories/cart.repository";


@Route('/api/cart')
export class CartController extends Controller{
    private cartRepository: CartRepository = CartRepository.getInstance();

    @Get('{id}')
    @Security('token', ['cart.read'])
    @SuccessResponse('200', 'OK')
    public async getCart(
        @Path() id: number,
        @Res() errCartNotFound: TsoaResponse<404, APIErrorType>
    ) {
        const cart = await this.cartRepository.findById(id);
        if (!cart) {
            throw errCartNotFound(404, {
                code: 'ERR_CART_NOT_FOUND'
            });
        }
        return cart;
    }

    @Put('{id}')
    @Security('token', ['cart.write'])
    @SuccessResponse('200', 'OK')
    public async updateCart(
        @Path() id: number,
        @Body() cartData: any,
        @Res() errCartNotFound: TsoaResponse<404, APIErrorType>
    ) {
        const cart = await this.cartRepository.findById(id);
        if (!cart) {
            throw errCartNotFound(404, {
                code: 'ERR_CART_NOT_FOUND'
            });
        }
        return this.cartRepository.updateOne(id, cartData);
    }
}
