import {Button, Flex, Group, Table} from "@mantine/core";
import {useEffect, useState} from "react";
import {ShopItem} from "@app/shared-models/src/shopItem.model.ts";
import {apiClient} from "../../api-client.ts";

export default function AdminManageShopItems() {
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);

    useEffect(() => {
        async function fetchShopItems() {
            const shopItems_ = await apiClient.shopItem.getAll();
            setShopItems(shopItems_);
        }
        fetchShopItems();
    }, []);
    console.log(shopItems);

    return (
        <Flex direction={'column'} pt={'md'}>
            <Flex direction={'column'} justify="space-between" align="flex-start" mb={'xs'}>
                <h1>Manage shop items</h1>
                <Button>Add</Button>
            </Flex>
            <Table highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Id</Table.Th>
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
                            <Table.Td>{shopItem.id}</Table.Td>
                            <Table.Td>{shopItem.image}</Table.Td>
                            <Table.Td>{shopItem.name}</Table.Td>
                            <Table.Td>{shopItem.description}</Table.Td>
                            <Table.Td>{shopItem.quantity}</Table.Td>
                            <Table.Td>{shopItem.price}</Table.Td>
                            <Table.Td>
                                <Group>
                                    <Button>Edit</Button>
                                    <Button color={'red'} variant={'outline'}>Delete</Button>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))
                }</Table.Tbody>
            </Table>
        </Flex>
    )
}