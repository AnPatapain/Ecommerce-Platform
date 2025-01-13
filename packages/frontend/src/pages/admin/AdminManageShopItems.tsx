import {Button, FileInput, Flex, Group, Image, Modal, Table, Text, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {ShopItem} from "@app/shared-models/src/shopItem.model.ts";
import {apiClient} from "../../api-client.ts";
import {useForm} from "@mantine/form";
import {toast} from "react-toastify";
import {useAuth} from "../../auth.context.tsx";

export default function AdminManageShopItems() {
    const {token} = useAuth();
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
    const [toBeDeleteShopItem, setToBeDeleteShopItem] = useState<ShopItem | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        async function fetchShopItems() {
            const shopItems_ = await apiClient.shopItem.getAll();
            setShopItems(shopItems_);
        }

        fetchShopItems();
    }, []);

    // Form initialization
    const form = useForm({
        initialValues: {
            id: null,
            name: "",
            description: "",
            quantity: "",
            price: "",
            image: null as File | null,
        },
        validate: {
            name: (value) => (value.trim() ? null : "Name is required"),
            description: (value) => (value.trim() ? null : "Description is required"),
            quantity: (value) =>
                value && !isNaN(Number(value)) && Number(value) >= 0
                    ? null
                    : "Quantity must be a positive number",
            price: (value) =>
                value && !isNaN(Number(value)) && Number(value) > 0
                    ? null
                    : "Price must be a positive number",
        },
    });

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.shopItem.uploadShopItemImage(formData, token as string);

        return response.url;
    };

    const saveShopItem = async (values: typeof form.values) => {
        try {
            setIsProcessing(true);

            // Upload the image if provided
            let imageUrl = editingItem?.image || "";
            if (values.image) {
                imageUrl = await uploadImage(values.image);
            }

            const payload = {
                name: values.name,
                description: values.description,
                quantity: Number(values.quantity),
                price: Number(values.price),
                image: imageUrl,
            };

            if (editingItem) {
                // Edit existing item
                await apiClient.shopItem.updateOne(editingItem.id, payload, token as string);
                toast.success("Shop item updated successfully!");
            } else {
                // Add new item
                await apiClient.shopItem.createOne(payload, token as string);
                toast.success("Shop item created successfully!");
            }

            // Refresh the list
            const updatedShopItems = await apiClient.shopItem.getAll();
            setShopItems(updatedShopItems);

            // Close modal and reset form
            setIsOpenModal(false);
            setEditingItem(null);
            form.reset();
        } catch (error: any) {
            console.error(error);
            toast.error(error.toString());
        } finally {
            setIsProcessing(false);
        }
    };

    const deleteShopItem = async (shopItemId: number) => {
        try {
            setIsProcessing(true);
            await apiClient.shopItem.updateOne(shopItemId, {
                quantity: -1
            }, token as string);
            // Refresh the list
            const updatedShopItems = await apiClient.shopItem.getAll();
            setShopItems(updatedShopItems);
            toast.info('Shop item is successfully deleted');
        } catch (error: any) {
            toast.error(error.toString());
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <Flex direction={'column'} pt={'md'}>
            <Flex direction={'column'} justify="space-between" align="flex-start" mb={'xs'}>
                <h1>Manage shop items</h1>
                <Button onClick={() => {
                    setEditingItem(null);
                    setIsOpenModal(true);
                    form.reset();
                }}>Add</Button>
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
                            <Table.Td>{shopItem.quantity}</Table.Td>
                            <Table.Td>{shopItem.price}</Table.Td>
                            <Table.Td>
                                <Group>
                                    <Button
                                        onClick={() => {
                                            setEditingItem(shopItem);
                                            form.setValues({
                                                name: shopItem.name,
                                                description: shopItem.description,
                                                quantity: shopItem.quantity.toString(),
                                                price: shopItem.price.toString(),
                                                image: null,
                                            });
                                            setIsOpenModal(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        color={'red'}
                                        variant={'outline'}
                                        onClick={() => {
                                            setToBeDeleteShopItem(shopItem);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))
                }</Table.Tbody>
            </Table>
            {
                toBeDeleteShopItem &&
                <Modal
                    size={'md'}
                    opened={!!toBeDeleteShopItem}
                    onClose={() => {setToBeDeleteShopItem(null)}}
                    closeOnClickOutside={true}
                    title={<h2>Delete Shop Item</h2>}
                >
                    <Text>
                        This action will delete the shop item from platform, users can not see it anymore. Are you sure ?
                    </Text>
                    <Group mt={'xl'}>
                        <Button
                            loading={isProcessing}
                            loaderProps={{type: 'dots'}}
                            disabled={isProcessing}
                            color={'red'}
                            variant={'outline'}
                            onClick={() => {
                                deleteShopItem((toBeDeleteShopItem as ShopItem).id);
                            }}
                        >
                            Confirm
                        </Button>
                        <Button
                            color={'gray'}
                            variant={'outline'}
                            onClick={() => {
                                setToBeDeleteShopItem(null);
                            }}
                        >
                            Close
                        </Button>
                    </Group>
                </Modal>
            }
            {
                isOpenModal && <Modal
                    size={"md"}
                    opened={isOpenModal}
                    onClose={() => setIsOpenModal(false)}
                    closeOnClickOutside={false}
                    title={editingItem ? "Edit Item" : "Add Item"}
                >
                    <form onSubmit={form.onSubmit(saveShopItem)}>
                        <FileInput
                            label="Product image"
                            placeholder="Upload product image"
                            accept={'image/*'}
                            value={form.values.image}
                            onChange={(file) => {form.setFieldValue('image', file)}}
                        />
                        <TextInput
                            label="Name"
                            placeholder="Item Name"
                            withAsterisk
                            {...form.getInputProps("name")}
                        />
                        <TextInput
                            label="Description"
                            placeholder="Item Description"
                            withAsterisk
                            {...form.getInputProps("description")}
                        />
                        <TextInput
                            label="Quantity"
                            placeholder="Item Quantity"
                            withAsterisk
                            {...form.getInputProps("quantity")}
                        />
                        <TextInput
                            label="Price"
                            placeholder="Item Price"
                            withAsterisk
                            {...form.getInputProps("price")}
                        />
                        <Button
                            mt={"md"}
                            loading={isProcessing}
                            loaderProps={{ type: "dots" }}
                            type="submit"
                            fullWidth
                        >
                            {editingItem ? "Update" : "Add"}
                        </Button>
                    </form>
                </Modal>
            }
        </Flex>
    )
}