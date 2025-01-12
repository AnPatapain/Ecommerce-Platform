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
    Post, Delete, Tags,
    Request,
    Response
} from "tsoa";

import {APIErrorType} from "@app/shared-models/src/error.type";
import {type BufferedFile, type ShopItemCreationRequest, type ShopItemUpdateRequest} from "@app/shared-models/src/api.type";
import {ShopItemRepository} from "../repositories/shopItem.repository";
import { MinioClient } from "../services/minio.service";
import express, {response} from "express";
import multer from "multer";



@Route('/api/shop-item')
export class ShopItemController extends Controller{
    private shopItemRepository: ShopItemRepository = ShopItemRepository.getInstance();
    private minioClient: MinioClient = MinioClient.getInstance();

    /**
     * Retrieve all shop items.
     * @returns All shop items.
     */
    @Get('')
    @NoSecurity()
    @SuccessResponse('200', 'OK')
    @Tags('Shop Item')
    public async getAllShopItems(){
        return this.shopItemRepository.findAll();
    }


    /**
     * Retrieve a specific shop item by ID.
     * @param id - The ID of the shop item.
     * @param errShopItemNotFound - Response if the shop item is not found.
     * @returns The specified shop item.
     */
    @Get('{id}')
    @NoSecurity()
    @SuccessResponse('200', 'OK')
    @Tags('Shop Item')
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

    @Post('upload-image')
    @NoSecurity()
    @SuccessResponse('201', 'Created')
    @Tags('Shop Item')
    public async uploadImage(
        @Request() req: express.Request,
        @Res() errNotSupportedFileType: TsoaResponse<400, APIErrorType>
    ){
        await this.handleFile(req);
        const image = req.file as BufferedFile;
        // console.log(image);
        if (!(image.mimetype.includes('jpeg') || image.mimetype.includes('png'))) {
            throw errNotSupportedFileType(400, {
                code: 'ERR_NOT_SUPPORTED_FILE_TYPE',
            });
        }
        return this.minioClient.upload(image);
    }
    ////////////////
    // Admin routes


    /**
     * Update a specific shop item by ID.
     * @param id - The ID of the shop item.
     * @param shopItemData - The shop item update request data.
     * @param errShopItemNotFound - Response if the shop item is not found.
     * @returns The updated shop item.
     */
    @Put('{id}')
    @Security('token', ['shopItem.write'])
    @SuccessResponse('200', 'OK')
    @Tags('Shop Item/Admin')
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


    /**
     * Create a new shop item.
     * @param shopItemData - The shop item creation request data.
     * @param errDuplicateShopItem - Response if the shop item already exists.
     * @returns The created shop item.
     */
    @Post('')
    @Security('token', ['shopItem.write'])
    @SuccessResponse('201', 'Created')
    @Tags('Shop Item/Admin')
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

    /**
     * Delete a specific shop item by ID.
     * @param id - The ID of the shop item.
     * @param errShopItemNotFound - Response if the shop item is not found.
     * @returns The deleted shop item.
     */
    @Delete('{id}')
    @Security('token', ['shopItem.write'])
    @SuccessResponse('200', 'OK')
    @Tags('Shop Item/Admin')
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



    private handleFile(request: express.Request): Promise<void> {
        const multerSingle = multer().single("file");
        return new Promise((resolve, reject) => {
            multerSingle(request, null as any, async (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

}