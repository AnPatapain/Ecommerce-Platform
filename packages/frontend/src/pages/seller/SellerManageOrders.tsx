import {Badge, Button, Container, Flex, Group, Table, Text} from "@mantine/core";
import {ShopItem} from "@app/shared-models/src/shopItem.model.ts";
import {useEffect, useState} from "react";
import {Order} from "@app/shared-models/src/order.model.ts";
import {useAuth} from "../../auth.context.tsx";
import {apiClient} from "../../api-client.ts";
import {toast} from "react-toastify";
import {OrderedShopItem} from "@app/shared-models/src/orderedShopItem.model.ts";

type DisplayOrder = ShopItem & {valid: boolean, userEmail: string, orderId: number};

export default function SellerManageOrders() {
    const {token} = useAuth();
    const [displayOrders, setDisplayOrders] = useState<DisplayOrder[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDisplayOrders = async () => {
            try {
                const orders = await apiClient.order.getAllOrders(token as string);
                const allDisplayOrders = await Promise.all(
                    orders.flatMap(async (order: Order) => {
                        const user = await apiClient.user.getOneById(order.userId, token as string);
                        return await Promise.all(
                            order.orderedShopItems.map(async (orderedShopItem: OrderedShopItem) => {
                                const shopItem: ShopItem = await apiClient.shopItem.getOneById(
                                    orderedShopItem.shopItemId,
                                    token as string
                                );
                                return {
                                    ...shopItem,
                                    valid: order.valid,
                                    userEmail: user ? user.email : 'unknown',
                                    orderId: orderedShopItem.orderId,
                                };
                            })
                        );
                    })
                );

                // Flatten the nested arrays and set the result
                setDisplayOrders(allDisplayOrders.flat());
            } catch (error: any) {
                setError(error.toString());
            }
        };

        fetchDisplayOrders();
    }, [token]);

    const totalPrice = displayOrders.reduce((total, item) => total + item.price, 0);

    return (
        <Container size={"xl"}>
            <Flex direction={"column"} pt={"xl"} mx={"auto"}>
                <Flex direction={"column"} justify="space-between" align="flex-start" mb={"xs"}>
                    <h1>Manage orders</h1>
                    <Group>
                        <Text>Total price: ${totalPrice}</Text>
                    </Group>
                </Flex>
                <Table highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Id</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Description</Table.Th>
                            <Table.Th>Quantity</Table.Th>
                            <Table.Th>Price</Table.Th>
                            <Table.Th>State</Table.Th>
                            <Table.Th>Ordered By</Table.Th>
                            <Table.Th>Action</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{
                        displayOrders.map((shopItem, index) => (
                            <Table.Tr key={`${shopItem.orderId}-${index}`}>
                                <Table.Td>
                                    {shopItem.orderId.toString()}
                                </Table.Td>
                                <Table.Td>{shopItem.name}</Table.Td>
                                <Table.Td>{shopItem.description}</Table.Td>
                                <Table.Td>1</Table.Td>
                                <Table.Td>{shopItem.price}</Table.Td>
                                <Table.Td>
                                    { shopItem.valid ?
                                        <Badge color="green">validated</Badge> :
                                        <Badge color="gray">wait for validation</Badge>
                                    }
                                </Table.Td>
                                <Table.Td>
                                    {shopItem.userEmail}
                                </Table.Td>
                                <Table.Td>
                                    <Group>
                                        <Button
                                            size={'xs'}
                                        >
                                            Validate
                                        </Button>
                                        <Button
                                            size={'xs'}
                                            color={'danger'}
                                            variant={'outline'}
                                        >
                                            Refuse
                                        </Button>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    }</Table.Tbody>
                </Table>
            </Flex>
            {error && toast.error(error)}
        </Container>
    )
}