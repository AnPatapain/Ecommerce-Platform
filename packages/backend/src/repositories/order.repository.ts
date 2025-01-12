
import {PRISMA_CLIENT} from "../../prisma";
import {Order} from "@app/shared-models/src/order.model";
import {OrderCreationRequest} from "@app/shared-models/src/api.type";
import {ShopItem} from "@app/shared-models/src/shopItem.model";

export class OrderRepository{
    private static instance: OrderRepository | null = null;
    private constructor() {}

    public static getInstance(): OrderRepository {
        if (!OrderRepository.instance) {
            OrderRepository.instance = new OrderRepository();
        }
        return OrderRepository.instance;
    }

    public async findAll() : Promise<Array<Order>> {
        return PRISMA_CLIENT.order.findMany({
            include: {
                orderedShopItems: true,
            }
        });
    }
    public async findOneById(id: number): Promise<Order | null> {
        return PRISMA_CLIENT.order.findUnique({
            where: {
                id: id
            },
            include: {
                orderedShopItems: true,
            }
        });
    }


    public async findOneByUserId(id:number, userId: number): Promise<Order | null> {
        return PRISMA_CLIENT.order.findUnique({
            where: {
                id: id,
                userId: userId
            },
            include: {
                orderedShopItems: true,
            }
        });
    }

    public async findAllByUserId(userId: number): Promise<Array<Order> | null> {
        return PRISMA_CLIENT.order.findMany({
            where: {
                userId: userId
            },
            include: {
                orderedShopItems: true,
            }
        });
    }

    public async createOne(orderCreationData: {
        userId: number,
        shopItems: Array<ShopItem>
    }): Promise<Order> {
        return PRISMA_CLIENT.order.create({
            data: {
                userId: orderCreationData.userId,
                valid: false,
                orderedShopItems: {
                    create: orderCreationData.shopItems.map(shopItem => (
                        {
                            shopItemId: shopItem.id,
                            priceAtPurchase: shopItem.price
                        }
                    ))
                }
            },
            include: {
                orderedShopItems: true,
            }
        });
    }
    public async validateOne(id: number){
        return PRISMA_CLIENT.order.update({
            where: {id: id},
            data: {
                valid: true
            }
        });
    }

    // public async updateOne(id: number, orderData: OrderUpdateRequest){
    //
    //     const updateData ={
    //         orderedShopItems: {
    //             deleteMany: orderData.orderedShopItemsToRemove.map(itemId => ({
    //                 shopItemId: itemId
    //             })),
    //             create: orderData.orderedShopItemsToAdd.map(itemId => ({
    //                 shopItem: {
    //                     connect: { id: itemId }
    //                 },
    //                 priceAtPurchase: 100,
    //                 quantity: 1
    //             }))
    //         }
    //     }
    //
    //     return await PRISMA_CLIENT.order.update({
    //         where: { id },
    //         data: {
    //             orderedShopItems: {
    //                 deleteMany: orderData.orderedShopItemsToRemove.map(ShopItem => ({
    //                     shopItemId: ShopItem.id
    //                 })),
    //                 create: orderData.orderedShopItemsToAdd.map(ShopItem => ({
    //                     shopItem: {
    //                         connect: { id: ShopItem.id }
    //                     },
    //                     priceAtPurchase: ShopItem.price,
    //                 }))
    //             }
    //         },
    //         include: {
    //             orderedShopItems: true
    //         }
    //     });
    //
    // }

    public async deleteOne(id: number){
        return PRISMA_CLIENT.order.delete({
            where: {
                id: id
            }
        });
    }
}