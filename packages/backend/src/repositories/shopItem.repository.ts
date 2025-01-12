import {PRISMA_CLIENT} from "../../prisma";
import {ShopItem} from "@app/shared-models/src/shopItem.model";
import {ShopItemCreationRequest, ShopItemUpdateRequest} from "@app/shared-models/src/api.type";

export class ShopItemRepository{
    private static instance: ShopItemRepository | null = null;

    private constructor() {}

    public static getInstance(): ShopItemRepository {
        if (!ShopItemRepository.instance) {
            ShopItemRepository.instance = new ShopItemRepository();
        }
        return ShopItemRepository.instance;
    }

    public async findAll() : Promise<Array<ShopItem>> {
        return PRISMA_CLIENT.shopItem.findMany({
            include: {
                orderedShopItems: true,
                carts: true
            }
        });
    }

    public async findById(id: number): Promise<ShopItem | null> {
        return PRISMA_CLIENT.shopItem.findUnique({
            where: {
                id: id
            },
            include: {
                orderedShopItems: true,
                carts: true
            }
        });
    }

    public async findByName(name: string): Promise<ShopItem | null> {
        return PRISMA_CLIENT.shopItem.findUnique({
            where: {
                name: name,
            },
            include: {
                orderedShopItems: true,
                carts: true
            }
        });
    }

    public async createOne(shopItemCreationData: ShopItemCreationRequest){
        return PRISMA_CLIENT.shopItem.create({
            data: {
                name: shopItemCreationData.name,
                price: shopItemCreationData.price,
                description: shopItemCreationData.description,
                image: shopItemCreationData.image,
                quantity: shopItemCreationData.quantity,
                orderedShopItems: undefined,
                carts: undefined,
            }
        });
    }

    public async updateOne(id: number, shopItemUpdateData: ShopItemUpdateRequest){
        return PRISMA_CLIENT.shopItem.update({
            where: {
                id: id
            },
            data: {
                ...shopItemUpdateData,
                orderedShopItems: undefined,
                carts: undefined
            }
        });
    }

    public async deleteMany() {
        return PRISMA_CLIENT.shopItem.deleteMany({});
    }

    public async count(): Promise<number> {
        return PRISMA_CLIENT.shopItem.count();
    }
}