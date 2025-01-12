import {Button, FileInput, Flex, Group, Image, Modal, Table, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {ShopItem} from "@app/shared-models/src/shopItem.model.ts";
import {apiClient} from "../../api-client.ts";
import {useForm} from "@mantine/form";
import {toast} from "react-toastify";

export default function AdminManageShopItems() {
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
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
                value && !isNaN(Number(value)) && Number(value) > 0
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

        const response = await fetch("API_ENDPOINT_FOR_IMAGE_UPLOAD", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Image upload failed");
        }

        const { url } = await response.json(); // Assuming the response contains the image URL
        return url;
    };

    const saveShopItem = async (values: typeof form.values) => {
        try {
            console.log('values::', values);
            // setIsProcessing(true);
            //
            // // Upload the image if provided
            // let imageUrl = editingItem?.image || "";
            // if (values.image) {
            //     imageUrl = await uploadImage(values.image);
            // }
            //
            // const payload = {
            //     name: values.name,
            //     description: values.description,
            //     quantity: Number(values.quantity),
            //     price: Number(values.price),
            //     image: imageUrl,
            // };
            //
            // if (editingItem) {
            //     // Edit existing item
            //     await apiClient.shopItem.updateOne(editingItem.id, payload, "your-auth-token");
            //     toast.success("Shop item updated successfully!");
            // } else {
            //     // Add new item
            //     await apiClient.shopItem.createOne(payload, "your-auth-token");
            //     toast.success("Shop item created successfully!");
            // }
            //
            // // Refresh the list
            // const updatedShopItems = await apiClient.shopItem.getAll();
            // setShopItems(updatedShopItems);
            //
            // // Close modal and reset form
            // setIsOpenModal(false);
            // setEditingItem(null);
            // form.reset();
        } catch (error: any) {
            toast.error(error.toString());
        } finally {
            setIsProcessing(false);
        }
    };


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
                                    <Button>Edit</Button>
                                    <Button color={'red'} variant={'outline'}>Delete</Button>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))
                }</Table.Tbody>
            </Table>
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