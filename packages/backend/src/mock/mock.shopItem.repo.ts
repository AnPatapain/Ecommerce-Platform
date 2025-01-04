import {ShopItem} from "@app/shared-models/src/shopItem.model";
import {ShopItemCreationRequest, ShopItemUpdateRequest} from "@app/shared-models/src/api.type";

export class MockShopItemRepository {

    private static instance: MockShopItemRepository | null = null;

    private shopItems: ShopItem[] = [
        { id: 1, name: 'Item1', description: 'Desc1', image: 'img1.png', quantity: 10, price: 100, orderedShopItems: [], carts: [] },
        { id: 2, name: 'Item2', description: 'Desc2', image: 'img2.png', quantity: 15, price: 150, orderedShopItems: [], carts: [] },
        { id: 3, name: 'Item3', description: 'Desc3', image: 'img3.png', quantity: 5, price: 200, orderedShopItems: [], carts: [] }
    ];

    private constructor() {}

    public static getInstance(): MockShopItemRepository {
        if (!MockShopItemRepository.instance) {
            MockShopItemRepository.instance = new MockShopItemRepository();
        }
        return MockShopItemRepository.instance;
    }

    public async count(): Promise<number> {
        return this.shopItems.length
    }
    public async getAll(): Promise<ShopItem[]> {
        return [...this.shopItems];
    }

    public async findById(id: number): Promise<ShopItem | null> {
        return this.shopItems.find(item => item.id === id) || null;
    }

    public async findByName(name: string): Promise<ShopItem | null> {
        return this.shopItems.find(item => item.name === name) || null;
    }

    public async createOne(shopItemData: ShopItemCreationRequest): Promise<ShopItem> {
        const newItem = {
            ...shopItemData,
            id: this.shopItems.length + 1,
            orderedShopItems: [],
            carts: []
        };
        this.shopItems.push(newItem);
        return newItem;
    }

    public async updateOne(id: number, shopItemData: ShopItemUpdateRequest): Promise<ShopItem | null> {
        const index = this.shopItems.findIndex(item => item.id === id);
        if (index === -1) return null;

        this.shopItems[index] = {
            ...this.shopItems[index],
            ...shopItemData,
        };
        return this.shopItems[index];
    }

    public async deleteOne(id: number): Promise<boolean> {
        const initialLength = this.shopItems.length;
        this.shopItems = this.shopItems.filter(item => item.id !== id);
        return this.shopItems.length !== initialLength;
    }

}