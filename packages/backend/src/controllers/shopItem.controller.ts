import {
    Controller,
    Get,
    NoSecurity,
    Route,
    Path,
    Res,
    type TsoaResponse,
    Put,
    Security,
    Body,
    SuccessResponse,
    Post, Delete
} from "tsoa";

import {APIErrorType} from "@app/shared-models/src/error.type";
import {type ShopItemCreationRequest,type ShopItemUpdateRequest} from "@app/shared-models/src/api.type";
import {ShopItemRepository} from "../repositories/shopItem.repository";



@Route('/api/shop-item')
export class ShopItemController extends Controller{
    private shopItemRepository: ShopItemRepository = ShopItemRepository.getInstance();

    @Get('')
    @NoSecurity()
    @SuccessResponse('200', 'OK')
    public async getAllShopItems(){
        return this.shopItemRepository.findAll();
    }

    @Get('{id}')
    @NoSecurity()
    @SuccessResponse('200', 'OK')
    public async getShopItem(
        @Path() id: number,
        @Res() errShopItemNotFound: TsoaResponse<404, APIErrorType>
    ) {
        const shopItem = await this.shopItemRepository.findById(id);
        if (!shopItem) {
            throw errShopItemNotFound(404, {
                code: 'ERR_SHOP_ITEM_NOT_FOUND'
            });
        }
        return shopItem;
    }

    ////////////////
    // Admin routes



    @Put('{id}')
    @Security('token', ['shopItem:update'])
    @SuccessResponse('200', 'OK')
    public async updateShopItem(
        @Path() id: number,
        @Body() shopItemData: ShopItemUpdateRequest,
        @Res() errShopItemNotFound: TsoaResponse<404, APIErrorType>
    ){
        const shopItem = await this.shopItemRepository.findById(id);
        if (!shopItem) {
            throw errShopItemNotFound(404, {
                code: 'ERR_SHOP_ITEM_NOT_FOUND'
            });
        }
        return this.shopItemRepository.updateOne(id, shopItemData);
    }


    @Post('')
    @Security('token', ['shopItem:create'])
    @SuccessResponse('201', 'Created')
    public async createShopItem(
        @Body() shopItemData: ShopItemCreationRequest,
        @Res() errDuplicateShopItem: TsoaResponse<409, APIErrorType>
    ){
        const existingShopItem = await this.shopItemRepository.findByName(shopItemData.name);
        if (existingShopItem) {
            throw errDuplicateShopItem(409, {
                code: 'ERR_SHOP_ITEM_ALREADY_EXISTS'
            });
        }
        return this.shopItemRepository.createOne(shopItemData);
    }

    @Delete('{id}')
    @Security('token', ['shopItem:delete'])
    @SuccessResponse('200', 'OK')
    public async deleteShopItem(
        @Path() id: number,
        @Res() errShopItemNotFound: TsoaResponse<404, APIErrorType>
    ){
        const shopItem = await this.shopItemRepository.findById(id);
        if (!shopItem) {
            throw errShopItemNotFound(404, {
                code: 'ERR_SHOP_ITEM_NOT_FOUND'
            });
        }
        return this.shopItemRepository.deleteOne(id);
    }


}