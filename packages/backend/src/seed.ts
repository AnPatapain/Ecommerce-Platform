import {UserRepository} from "./repositories/user.repository";
import {ShopItemRepository} from "./repositories/shopItem.repository";
import {ShopItemCreationRequest} from "@app/shared-models/src/api.type";

const userRepository = UserRepository.getInstance();
const shopItemRepository = ShopItemRepository.getInstance();

const RepositoryToBeSeeded = [
    shopItemRepository,
]

export async function seed() {
    const oneOfReposIsEmpty = await checkOneOfReposIsEmpty();
    if (oneOfReposIsEmpty) {
        await cleanEmptyRepos();
        console.log('Seed user');
        await seedUser();
        console.log('Seed shopItems');
        await seedShopItem();
    }
}

export async function cleanEmptyRepos() {
    for (const repo of RepositoryToBeSeeded) {
        const numRecords = await repo.count();
        if (numRecords === 0) {
            await repo.deleteMany();
        }
    }
}

async function checkOneOfReposIsEmpty() {
    for (const repo in RepositoryToBeSeeded) {
        const numsRecord = await RepositoryToBeSeeded[repo].count();
        if (numsRecord === 0) return true;
    }
    return false;
}

async function seedUser() {
}

async function seedShopItem() {
    const SHOP_ITEMS: ShopItemCreationRequest[] = [
        {
            name: 'vps-ubuntu',
            price: 10,
            description: 'VPS with ubuntu 24.0.1 os',
            quantity: 5,
            image: 'https://www.interserver.net/vps/includes/images/vps-ubuntu.png'
        },
        {
            name: 'vps-arch',
            price: 5,
            description: 'VPS with arch linux, for brave person only',
            quantity: 1,
            image: 'https://jeremywsherman.com/images/posts/2013/archlinux-logo-dark.png'
        },
        {
            name: 'vps-windows',
            price: 5,
            description: 'VPS with windows 10 server, for managing Active Directory',
            quantity: 3,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXtoJOx_vffMyNTEyQrA3pSlCK5ukEJkOsWg&s'
        },
        {
            name: 'vps-oracle',
            price: 20,
            description: 'VPS with pre-configured ORACLE database',
            quantity: 1,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUyrfS8QE_tbgrhlIWf3qKTHW3rMPD0SSfzA&s'
        },
    ]
    for (const shopItem of SHOP_ITEMS) {
        const createdShopItem = await shopItemRepository.createOne({
            ...shopItem
        });
    }
}