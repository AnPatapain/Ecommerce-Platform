import {Badge, Button, Card, Container, Grid, Group, Image, Text} from "@mantine/core";
import {useEffect, useState} from "react";
import {apiClient} from "../../api-client.ts";
import {ShopItem} from "@app/shared-models/src/shopItem.model.ts";
import {useAuth} from "../../auth.context.tsx";
import {toast} from "react-toastify";

export const Home = () => {
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const {token, currentUser, reloadCurrentUser} = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        async function fetchShopItems() {
            try {
                const shopItems_ = await apiClient.shopItem.getAll();
                setShopItems(shopItems_);
            } catch (error: any) {
                setError(error.toString());
            }
        }

        fetchShopItems();
    }, []);

    const handleAddToCart = async (shopItem: ShopItem) => {
        if (!token) {
            toast.info(`Please signin to add ${shopItem.name} to cart`);
            return;
        }
        if (currentUser && currentUser.cart && currentUser.cart.shopItems) {
            if (
                currentUser.cart.shopItems.find(
                    (existingShopItem => existingShopItem.shopItemId === shopItem.id))
            ) {
                toast.info(`You have already added this item in cart. Please order it.`);
                return;
            }
        }
        try {
            setIsProcessing(true);
            await apiClient.cart.addShopItemToCart({
                shopItemsToAdd: [shopItem.id],
                shopItemsToRemove: [],
            }, token);
            await reloadCurrentUser();
            setIsProcessing(false);
            toast.success('Product is added to cart successfully.');
        } catch (error: any) {
            setIsProcessing(false)
            setError(error.toString());
        }
    }

    return (
        <Container size={'md'} mt={'xl'}>
            <h2>Our products</h2>
            <Grid>
                {
                    shopItems.map((shopItem: ShopItem) => (
                        <Grid.Col span={4} key={shopItem.id}>
                            <Card shadow="sm"
                                  padding="lg"
                                  radius="md" withBorder
                                  style={{height: '100%'}}
                            >
                                <Card.Section>
                                    <Image
                                        src={shopItem.image}
                                        height={160}
                                        alt="Norway"
                                    />
                                </Card.Section>

                                <Group justify="space-between" mt="md" mb="xs">
                                    <Text fw={500}>{shopItem.name}</Text>
                                    <Badge color="green">Available</Badge>
                                </Group>

                                <Text size="sm" c="dimmed">
                                    {shopItem.description}
                                </Text>

                                <Button disabled={isProcessing}
                                        loading={isProcessing}
                                        loaderProps={{type: 'dots'}}
                                        fullWidth
                                        radius="md"
                                        style={{marginTop: 'auto'}}
                                        onClick={() => {
                                            handleAddToCart(shopItem)
                                        }}
                                >
                                    Add to card
                                </Button>
                            </Card>
                        </Grid.Col>
                    ))
                }
            </Grid>
            {error && toast.error(error)}
        </Container>
    );
};
