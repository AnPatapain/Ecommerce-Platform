import {Button, Container, Flex, Group, Image, Table, Text} from "@mantine/core";
import {useAuth} from "../../auth.context.tsx";
import {useEffect, useState} from "react";
import {ShopItem} from "@app/shared-models/src/shopItem.model.ts";
import {apiClient} from "../../api-client.ts";
import {User} from "@app/shared-models/src/user.model.ts";
import {Cart} from "@app/shared-models/src/cart.model.ts";
import {toast} from "react-toastify";


export default function MyCart() {
    const {token, currentUser, reloadAuthContext} = useAuth();
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isProcessingDelete, setIsProcessingDelete] = useState<boolean>(false);
    const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);

    // Fetch shop items when currentUser changes
    useEffect(() => {
        if (!currentUser || !currentUser.cart) {
            setShopItems([]);
            return;
        }

        const fetchShopItems = async () => {
            const shopItemsOnCart = ((currentUser as User).cart as Cart).shopItems || [];
            const fetchedItems: ShopItem[] = [];

            for (const item of shopItemsOnCart) {
                const shopItem: ShopItem = await apiClient.shopItem.getOneById(item.shopItemId, token as string);
                fetchedItems.push({ ...shopItem });
            }

            setShopItems(fetchedItems);
        };

        fetchShopItems();
    }, [currentUser, token]);

    const removeShopItem = async (id: number) => {
        try {
            setIsProcessingDelete(true);
            await apiClient.cart.removeShopItemToCart({
                shopItemsToAdd: [],
                shopItemsToRemove: [id]
            }, token as string);
            await reloadAuthContext();
            setIsProcessingDelete(false);
            toast.info('Item is remove from cart successfully!');
        } catch(error: any) {
            setIsProcessingDelete(false);
            setError(error.toString());
        }
    }

    const order = async() => {
        try {
            setIsProcessingOrder(true);
            await apiClient.order.createOrder({
                shopItems: [...shopItems]
            }, token as string);
            await reloadAuthContext();
            setIsProcessingOrder(false);
            toast.success('Your order will be processed by our seller. Thanks for your purchase!');
        } catch (error: any) {
            setIsProcessingOrder(false);
            setError(error.toString());
        }
    }

    const totalPrice = shopItems.reduce((total, item) => total + item.price, 0);

    return (
        <Container size={"md"}>
            <Flex direction={"column"} pt={"xl"} mx={"auto"}>
                <Flex direction={"column"} justify="space-between" align="flex-start" mb={"xs"}>
                    <h1>My carts</h1>
                    <Group>
                        <Text>Total price: ${totalPrice}</Text>
                        <Button
                            loading={isProcessingOrder}
                            loaderProps={{type: 'dots'}}
                            disabled={shopItems.length <= 0 || isProcessingOrder}
                            onClick={() => {order()}}
                        >Order</Button>
                    </Group>
                </Flex>
                <Table highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Image</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Description</Table.Th>
                            <Table.Th>Quantity</Table.Th>
                            <Table.Th>Price</Table.Th>
                            <Table.Th>Action</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{
                        shopItems.map((shopItem) => (
                            <Table.Tr key={shopItem.id}>
                                <Table.Td>
                                    <Image
                                        src={shopItem.image}
                                        alt={shopItem.name}
                                        width={100}
                                        height={50}
                                        radius="sm"
                                    />
                                </Table.Td>
                                <Table.Td>{shopItem.name}</Table.Td>
                                <Table.Td>{shopItem.description}</Table.Td>
                                <Table.Td>1</Table.Td>
                                <Table.Td>{shopItem.price}</Table.Td>
                                <Table.Td>
                                    <Group>
                                        <Button
                                            disabled={isProcessingDelete}
                                            loading={isProcessingDelete}
                                            loaderProps={{type: 'dots'}}
                                            color={'red'}
                                            variant={'outline'}
                                            onClick={() => {removeShopItem(shopItem.id)}}
                                        >Delete</Button>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    }</Table.Tbody>
                </Table>
            </Flex>
            {error && toast.error(error)}
        </Container>
    );
}