import {Badge, Container, Flex, Group, Image, Table, Text} from "@mantine/core";
import {useAuth} from "../../auth.context.tsx";

export default function MyOrders(){
    const {historicalOrderedShopItems} = useAuth();

    const totalPrice = historicalOrderedShopItems.reduce((total, item) => total + item.price, 0);

    return (
        <Container size={"md"}>
            <Flex direction={"column"} pt={"xl"} mx={"auto"}>
                <Flex direction={"column"} justify="space-between" align="flex-start" mb={"xs"}>
                    <h1>My orders</h1>
                    <Group>
                        <Text>Total price: ${totalPrice}</Text>
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
                            <Table.Th>State</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{
                        historicalOrderedShopItems.map((shopItem, index) => (
                            <Table.Tr key={`${shopItem.id}-${index}`}>
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
                                    { shopItem.valid ?
                                        <Badge color="green">validated</Badge> :
                                        <Badge color="gray">wait for validation</Badge>
                                    }
                                </Table.Td>
                            </Table.Tr>
                        ))
                    }</Table.Tbody>
                </Table>
            </Flex>
        </Container>
    );
}