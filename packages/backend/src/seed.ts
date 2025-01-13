import {UserRepository} from "./repositories/user.repository";
import {ShopItemRepository} from "./repositories/shopItem.repository";
import {ShopItemCreationRequest} from "@app/shared-models/src/api.type";
import {generatePasswordHashed} from "./services/auth.service";
import {CONFIG} from "./backend-config";


const shopItemRepository = ShopItemRepository.getInstance();
const userRepository = UserRepository.getInstance();


const RepositoryToBeSeeded = [
    userRepository,
    shopItemRepository,
]

export async function seed() {
    const oneOfReposIsEmpty = await checkOneOfReposIsEmpty();
    if (oneOfReposIsEmpty) {
        await cleanEmptyRepos();
        console.log('Seed shopItems');
        await seedShopItem();
        console.log('Seed admin');
        await seedAdminAndDefaultSeller();
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

async function seedAdminAndDefaultSeller() {
    const admin = {
        email: CONFIG.ADMIN_EMAIL as string,
        password:generatePasswordHashed(CONFIG.ADMIN_PASSWORD as string),
        name:"admin",
        verified:true,
    }
    const seller = {
        email: CONFIG.DEFAULT_SELLER as string,
        password:generatePasswordHashed(CONFIG.DEFAULT_SELLER_PASSWORD as string),
        name:"seller",
        verified:true,
    }
    const createdAdmin = await userRepository.createOne({
        ...admin
    });
    const createdSeller = await userRepository.createOne({
        ...seller
    });

    await userRepository.updateOne(createdSeller.id, {role: 'seller'});
    await userRepository.updateOne(createdAdmin.id, {role: 'admin'});
}

async function seedShopItem() {
    const SHOP_ITEMS: ShopItemCreationRequest[] = [
        {
            name: 'vps-ubuntu',
            price: 10,
            description: 'VPS with ubuntu 24.0.1 os. Suitable for web application deployment.',
            quantity: 5,
            image: 'https://www.interserver.net/vps/includes/images/vps-ubuntu.png'
        },
        {
            name: 'vps-arch',
            price: 5,
            description: 'VPS with arch linux, for brave person only. Only suitable for brave heart.',
            quantity: 1,
            image: 'https://jeremywsherman.com/images/posts/2013/archlinux-logo-dark.png'
        },
        {
            name: 'vps-windows',
            price: 5,
            description: 'VPS with windows 10 server. Suitable for managing Active Directory',
            quantity: 3,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXtoJOx_vffMyNTEyQrA3pSlCK5ukEJkOsWg&s'
        },
        {
            name: 'vps-oracle',
            price: 1000,
            description: 'VPS with pre-configured ORACLE database. Suitable for large banking server system',
            quantity: 1,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUyrfS8QE_tbgrhlIWf3qKTHW3rMPD0SSfzA&s'
        },
    ]
    for (const shopItem of SHOP_ITEMS) {
        await shopItemRepository.createOne({
            ...shopItem
        });
    }
}