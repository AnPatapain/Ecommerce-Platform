import {Badge, Button, Card, Container, Group, Image, Text} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../auth.context.tsx";

export const Home = () => {
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    console.log('currentUser::', currentUser);

    return (
        <Container size={'xs'}>
            <h3>Fullstack MERN Boilerplate powered by: TypeScript, Node, React, Docker, Nginx, BashScript.</h3>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                    <Image
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                        height={160}
                        alt="Norway"
                    />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>Product</Text>
                    <Badge color="pink">On Sale</Badge>
                </Group>

                <Text size="sm" c="dimmed">
                    With Fjord Tours you can explore more of the magical fjord landscapes with tours and
                    activities on and around the fjords of Norway
                </Text>

                <Button mt="md" radius="md" onClick={() => {navigate('/order-product')}}>
                    Order now
                </Button>
            </Card>
        </Container>
    );
};
