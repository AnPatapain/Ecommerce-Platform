import {Badge, Button, Container, Flex, Group, Modal, ScrollArea, Table, Text} from "@mantine/core";
import {ShopItem} from "@app/shared-models/src/shopItem.model.ts";
import {useEffect, useState} from "react";
import {Order} from "@app/shared-models/src/order.model.ts";
import {useAuth} from "../../auth.context.tsx";
import {apiClient} from "../../api-client.ts";
import {toast} from "react-toastify";
import {OrderedShopItem} from "@app/shared-models/src/orderedShopItem.model.ts";

export type DisplayOrder = {
    orderId: number;
    userEmail: string;
    valid: boolean;
    totalPrice: number;
    items: ShopItem[]
};

function generateRandomPassword(): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    return Array(12)
        .fill("")
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join("");
}

export default function SellerManageOrders() {
    const { token } = useAuth();
    const [groupedOrders, setGroupedOrders] = useState<DisplayOrder[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [modalData, setModalData] = useState<{ userEmail: string; items: { name: string; password: string }[] } | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const fetchAndLoadDisplayOrders = async () => {
        const orders = await apiClient.order.getAllOrders(token as string);
        const groupedOrders: DisplayOrder[] = await Promise.all(
            orders.map(async (order: Order) => {
                const user = await apiClient.user.getOneById(order.userId, token as string);
                const shopItems = await Promise.all(
                    order.orderedShopItems.map(async (orderedShopItem: OrderedShopItem) => {
                        return await apiClient.shopItem.getOneById(
                            orderedShopItem.shopItemId,
                            token as string
                        );
                    })
                );
                return {
                    orderId: order.id,
                    userEmail: user?.email || "unknown",
                    valid: order.valid,
                    totalPrice: shopItems.reduce((total, item) => total + item.price, 0),
                    items: shopItems,
                };
            })
        );
        setGroupedOrders(groupedOrders);
    }

    useEffect(() => {
        const fetchGroupedOrders= async (): Promise<void> => {
            try {
                await fetchAndLoadDisplayOrders();
            } catch (error: any) {
                toast.error(error.toString());
            }
        };

        fetchGroupedOrders();
    }, [token]);

    const validateOrder = async (orderId: number) => {
        try {
            setIsProcessing(true);

            // Fetch the order details to populate modal data
            const order = groupedOrders.find((o) => o.orderId === orderId);
            if (!order) throw new Error("Order not found");
            const generatedPasswords = order.items.map((item) => ({
                name: item.name,
                password: generateRandomPassword(),
            }));

            // Mark order as validated via API
            await apiClient.order.validateOrder(orderId, token as string);
            await fetchAndLoadDisplayOrders();

            setIsProcessing(false);

            // Set modal data and open modal
            setModalData({ userEmail: order.userEmail, items: generatedPasswords });
            setModalOpen(true);
            toast.success(`Order ${orderId} is successfully validated`);
        } catch (error: any) {
            setIsProcessing(false);
            toast.error(error.toString());
        }
    };

    const sendCredentialsViaEmail = () => {
        if (!modalData) return;
        toast.success(`Credentials sent to ${modalData.userEmail}`);
        // setModalOpen(false);
    };

    return (
        <Container size={"xl"}>
            <Flex direction={"column"} pt={"xl"} mx={"auto"}>
                <h1>Manage orders</h1>
                <ScrollArea h={'80vh'}>
                    <Table highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Order ID</Table.Th>
                                <Table.Th>User Email</Table.Th>
                                <Table.Th>Total Price</Table.Th>
                                <Table.Th>State</Table.Th>
                                <Table.Th>Items</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {groupedOrders
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
                                    <Table.Td>
                                        <Group>
                                            <Button
                                                key={order.orderId}
                                                disabled={isProcessing || order.valid}
                                                loading={isProcessing}
                                                loaderProps={{type: 'dots'}}
                                                size="xs"
                                                onClick={() => validateOrder(order.orderId)}
                                            >
                                                Validate
                                            </Button>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Flex>
            {/* Modal for showing validated order details */}
            <Modal
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                title={<h2>Order Validation Details</h2>}
                closeOnClickOutside={false}
                size={'lg'}
            >
                {modalData && (
                    <>
                        <Text size="sm" mb="md">
                            You have validated the order for <strong>{modalData.userEmail}</strong>. Below is the credentials
                            of these vps:
                        </Text>
                        <ul>
                            {modalData.items.map((item, index) => (
                                <li key={index}>
                                    <Text size="sm">
                                        <strong>{item.name}</strong>: Username: <strong>root</strong>, Password:{" "}
                                        <strong>{item.password}</strong>
                                    </Text>
                                </li>
                            ))}
                        </ul>
                        <Button fullWidth mt="lg" onClick={sendCredentialsViaEmail}>
                            Send vps credentials to user email
                        </Button>
                    </>
                )}
            </Modal>
        </Container>
    );
}
