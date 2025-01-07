// import {PRISMA_CLIENT} from "../../prisma";
// import {ShopItem} from "@app/shared-models/src/shopItem.model";
// import {ShopItemCreationRequest, ShopItemUpdateRequest} from "@app/shared-models/src/api.type";
//
// export class ProductRepository{
//     private static instance: ProductRepository | null = null;
//
//     private constructor() {}
//
//     public static getInstance(): ProductRepository {
//         if (!ProductRepository.instance) {
//             ProductRepository.instance = new ProductRepository();
//         }
//         return ProductRepository.instance;
//     }
//
//     public async findAll() : Promise<Array<ShopItem>> {
//         return await PRISMA_CLIENT.shopItem.findMany({
//             include: {
//                 orderedShopItems: true,
//                 carts: true
//             }
//         });
//     }
//
//     public async findOneById(id: number): Promise<ShopItem | null> {
//         return await PRISMA_CLIENT.shopItem.findUnique({
//             where: {
//                 id: id
//             },
//             include: {
//                 orderedShopItems: true,
//                 carts: true
//             }
//         });
//     }
//
//     public async createOne(shopItemCreationData: ShopItemCreationRequest){
//         return await PRISMA_CLIENT.shopItem.create({
//             data:{
//                 name: shopItemCreationData.name,
//                 price: shopItemCreationData.price,
//                 description: shopItemCreationData.description,
//                 image: shopItemCreationData.image,
//                 quantity: shopItemCreationData.quantity
//             }
//         });
//     }
//
//     public async updateOne(id: number, shopItemUpdateData: ShopItemUpdateRequest){
//         const updateData ={
//             name : shopItemUpdateData.name ? shopItemUpdateData.name : undefined,
//             price : shopItemUpdateData.price ? shopItemUpdateData.price : undefined,
//             description : shopItemUpdateData.description ? shopItemUpdateData.description : undefined,
//             image : shopItemUpdateData.image ? shopItemUpdateData.image : undefined,
//             quantity : shopItemUpdateData.quantity ? shopItemUpdateData.quantity : undefined,
//             carts : undefined,
//             orderedShopItems : undefined
//         };
//         if(shopItemUpdateData.orderedShopItems){
//             updateData.orderedShopItems = {
//                 upsert:{
//                     create: {
//                         quantity: shopItemUpdateData.orderedShopItems.quantity,
//                         priceAtPurchase: shopItemUpdateData.orderedShopItems.priceAtPurchase,
//                         shopItemId: shopItemUpdateData.orderedShopItems.shopItemId,
//                         orderId: shopItemUpdateData.orderedShopItems.orderId
//                     },
//                     update: shopItemUpdateData.orderedShopItems
//                 }
//             }
//         }
//         return await PRISMA_CLIENT.shopItem.update({
//             where: {
//                 id: id
//             },
//             data:{
//                ...shopItemUpdateData,
//                 orderedShopItems: {
//                    upsert:{
//                        create: {
//                             quantity: shopItemUpdateData.orderedShopItems.quantity,
//                             priceAtPurchase: shopItemUpdateData.orderedShopItems.priceAtPurchase,
//                             shopItemId: shopItemUpdateData.orderedShopItems.shopItemId,
//                             orderId: shopItemUpdateData.orderedShopItems.orderId
//                        },
//                        update: shopItemUpdateData.orderedShopItems
//                    }
//                 },
//             }
//         });
//     }
// }