import {PRISMA_CLIENT} from "../../prisma";
import {ShopItem} from "@app/shared-models/src/shopItem.model";

export class ProductRepository{
    private static instance: ProductRepository | null = null;

    private constructor() {}

    public static getInstance(): ProductRepository {
        if (!ProductRepository.instance) {
            ProductRepository.instance = new ProductRepository();
        }
        return ProductRepository.instance;
    }

    public async findAll() : Promise<Array<ShopItem>> {
        return await PRISMA_CLIENT.shopItem.findMany({
            include: {
                orderedShopItems: true,
                carts: {
                    include: {
                        shopItems: true
                    }
                }
            }
        });

    }


    public async findOneById(id: number): Promise<ShopItem | null> {
        return await PRISMA_CLIENT.shopItem.findUnique({
            where: {
                id: id
            },
            include: {
                orderedShopItems: true,
                carts: true
            }
        });
    }

}