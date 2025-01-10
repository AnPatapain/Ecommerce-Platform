import {Badge, Button, Card, Container, Grid, Group, Image, Text} from "@mantine/core";
import {useEffect, useState} from "react";
import {apiClient} from "../../api-client.ts";
import {ShopItem} from "@app/shared-models/src/shopItem.model.ts";
import {useAuth} from "../../auth.context.tsx";
import {toast} from "react-toastify";

export const Home = () => {
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const {token, currentUser} = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    console.log('currentUser::', currentUser);

    useEffect(() => {
        async function fetchShopItems() {
            try {
                const shopItems_ = await apiClient.shopItem.getAll();
                setShopItems(shopItems_);
            } catch(error: any) {
                setError(error.toString());
            }
        }
        fetchShopItems();
    }, []);

    const handleAddToCart = async (shopItem: ShopItem) => {
        if(!token) {
            toast.info(`Please signin to add ${shopItem.name} to cart`);
            return;
        }
        try {
            setIsProcessing(true);
            await apiClient.cart.addShopItemToCart({
                shopItemsToAdd: [shopItem.id],
                shopItemsToRemove: [],
            }, token);
            setIsProcessing(false);
            toast.success('Product is added to cart successfully.');
        } catch (error: any) {
            setIsProcessing(false)
            setError(error.toString());
        }
    }

    return (
        <Container size={'xl'}>
            <Grid>
                {
                    shopItems.map((shopItem: ShopItem) => (
                        <Grid.Col span={3} key={shopItem.id}>
                            <Card shadow="sm"
                                  padding="lg"
                                  radius="md" withBorder
                                  style={{ height: '100%'}}
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
                                        style={{ marginTop: 'auto' }}
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
