// import {OrderedShopItem} from "@app/shared-models/src/orderedShopItem.model";
// import {PRISMA_CLIENT} from "../../prisma";
// import {OrderedShopItemCreationRequest, OrderedShopItemUpdateRequest} from "@app/shared-models/src/api.type";
//
//
// export class OrderedShopItemRepository{
//     private static instance: OrderedShopItemRepository | null = null;
//     private constructor() {}
//
//     public static getInstance(): OrderedShopItemRepository {
//         if (!OrderedShopItemRepository.instance) {
//             OrderedShopItemRepository.instance = new OrderedShopItemRepository();
//         }
//         return OrderedShopItemRepository.instance;
//     }
//
//
//     public async findAll() : Promise<Array<OrderedShopItem>> {
//         return await PRISMA_CLIENT.orderedShopItem.findMany({});
//     }
//
//
//     public async findById(id: number): Promise<OrderedShopItem | null> {
//         return await PRISMA_CLIENT.orderedShopItem.findUnique({
//             where: {
//                 id: id
//             }
//         });
//     }
//
//
//     public async findItemsInOrder(orderId: number): Promise<Array<OrderedShopItem>> {
//         return await PRISMA_CLIENT.orderedShopItem.findMany({
//             where: {
//                 orderId: orderId
//             }
//         });
//     }
//
//     public async createOne(orderedShopItemCreationData : OrderedShopItemCreationRequest): Promise<OrderedShopItem> {
//         return await PRISMA_CLIENT.orderedShopItem.create({
//             data:{
//                 shopItemId: orderedShopItemCreationData.shopItemId,
//                 orderId: orderedShopItemCreationData.orderId,
//                 priceAtPurchase: orderedShopItemCreationData.priceAtPurchase
//             }
//         });
//     }
//
//
//
//     public async updateOne(id: number, orderedShopItemUpdateData: OrderedShopItemUpdateRequest){
//         return await PRISMA_CLIENT.orderedShopItem.update({
//             where: {
//                 id: id
//             },
//             data: {
//                 ...orderedShopItemUpdateData
//             }
//         });
//     }
//
//     public async deleteOne(id: number){
//         return await PRISMA_CLIENT.orderedShopItem.delete({
//             where: {
//                 id: id
//             }
//         });
//     }
// }