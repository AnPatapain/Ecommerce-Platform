import {PRISMA_CLIENT} from "../../prisma";
import {Cart} from "@app/shared-models/src/cart.model";
import {CartCreationRequest, CartUpdateRequest} from "@app/shared-models/src/api.type";
import {create} from "node:domain";


export class CartRepository {
    private static instance: CartRepository | null = null;
    private constructor() {}

    public static getInstance(): CartRepository {
        if (!CartRepository.instance) {
            CartRepository.instance = new CartRepository();
        }
        return CartRepository.instance;
    }

    /**
     * Retrieve all carts.
     */
    public async findAll() : Promise<Array<Cart>> {
        return PRISMA_CLIENT.cart.findMany({
            include: {
                shopItems: true,
            }
        });
    }

    /**
     * Retrieve a specific cart by ID.
     * @param id
     */
    public async findById(id: number): Promise<Cart | null> {
        return PRISMA_CLIENT.cart.findUnique({
            where: {
                id: id
            },
            include: {
                shopItems: {
                    include: {
                        ShopItem: true,
                    }
                },
            }
        });
    }

    /**
     * Retrieve a specific cart by user ID.
     * @param userId
     */
    public async findByUserId(userId: number): Promise<Cart | null> {
        return PRISMA_CLIENT.cart.findUnique({
            where: {
                userId: userId
            },
            include: {
                shopItems: {
                    include: {
                        ShopItem: true,
                    }
                },
            }
        });
    }

    /**
     * Retrieve a specific cart by ID and item IDs.
     * @param id
     * @param itemIds
     */
    public async findItemsInCart(id: number,itemIds: number[]) {
        return PRISMA_CLIENT.cart.findUnique({
            where: {
                id: id,
                shopItems: {
                    some: {
                        shopItemId: {
                            in: itemIds
                        }
                    }
                }
            }, include: {
                shopItems: {
                    include: {
                        ShopItem: true,
                    }
                },
            }
        });
    }

    /**
     * Create a new cart.
     * @param cartCreationData
     */
    public async createOne(cartCreationData: CartCreationRequest): Promise<Cart>{
        return PRISMA_CLIENT.cart.create({
            data: {
                userId: cartCreationData.userId,
                shopItems: {
                    create: []
                },
            },
            include: {
                shopItems: true,
            }
        });
    }

    /**
     * Update a specific cart by ID.
     * @param id
     * @param cartData
     */
    public async updateOne(id: number, cartData: CartUpdateRequest) {
        return PRISMA_CLIENT.cart.update({
            where: {id: id},
            data: {
                shopItems: {
                    // Safely handle adding new items
                    create: (cartData.shopItemsToAdd ?? []).map((itemId) => ({
                        ShopItem: {
                            connect: {id: itemId}
                        }
                    })),
                    // Safely handle removing items
                    deleteMany: (cartData.shopItemsToRemove ?? []).map((itemId) => ({
                        shopItemId: itemId
                    }))
                }
            },
            include: {shopItems: true},
        });
    }


}