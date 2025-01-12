import {Badge, Container, Flex, Group, ScrollArea, Table} from "@mantine/core";
import {useAuth} from "../../auth.context.tsx";
import {ShopItem} from "@app/shared-models/src/shopItem.model.ts";


export default function MyOrders(){
    const {historicalOrders} = useAuth();

    const totalSpent = historicalOrders.reduce((total, order) => {
        return total + order.totalPrice;
    }, 0);
    return (
        <Container size={"md"}>
            <Flex direction={"column"} pt={"xl"} mx={"auto"}>
                <h1>My historical orders</h1>
                <Group gap={'xs'} mb={'md'}>
                    <strong>Total Spent:</strong>
                    <Badge size="lg" radius="lg">
                        ${totalSpent}
                    </Badge>
                </Group>
                <ScrollArea h={'70vh'}>
                    <Table highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Order ID</Table.Th>
                                <Table.Th>User Email</Table.Th>
                                <Table.Th>Total Price</Table.Th>
                                <Table.Th>State</Table.Th>
                                <Table.Th>Items</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {historicalOrders
                                .sort((a, b) => Number(a.valid) - Number(b.valid))
                                .map((order) => (
                                    <Table.Tr key={order.orderId}>
                                        <Table.Td>{order.orderId}</Table.Td>
                                        <Table.Td>{order.userEmail}</Table.Td>
                                        <Table.Td>${order.totalPrice}</Table.Td>
                                        <Table.Td>
                                            {order.valid ? (
                                                <Badge color="green">Validated</Badge>
                                            ) : (
                                                <Badge color="gray">Wait for validation</Badge>
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            <ul>
                                                {order.items.map((item: ShopItem) => (
                                                    <li key={`${order.orderId}-${item.id}`}>
                                                        {item.name} (${item.price})
                                                    </li>
                                                ))}
                                            </ul>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Flex>
        </Container>
    );
}