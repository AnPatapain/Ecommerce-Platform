
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

    /**
     * Retrieve all orders.
     */
    public async findAll() : Promise<Array<Order>> {
        return PRISMA_CLIENT.order.findMany({
            include: {
                orderedShopItems: true,
            }
        });
    }

    /**
     * Retrieve a specific order by ID.
     * @param id
     */
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


    /**
     * Retrieve a specific order by ID and user ID.
     * @param id
     * @param userId
     */
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

    /**
     * Retrieve all orders by user ID.
     * @param userId
     */
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

    /**
     * Create a new order.
     * @param orderCreationData
     */
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

    /**
     * Validate an order.
     * @param id
     */
    public async validateOne(id: number){
        return PRISMA_CLIENT.order.update({
            where: {id: id},
            data: {
                valid: true
            }
        });
    }


    /**
     * ! Unimplemented
     * @param id
     */
    public async deleteOne(id: number){
        return PRISMA_CLIENT.order.delete({
            where: {
                id: id
            }
        });
    }
}