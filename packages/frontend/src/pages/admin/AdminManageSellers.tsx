import {Container} from "@mantine/core";
import {User} from "@app/shared-models/src/user.model.ts";

const users: User[] = [
    {
        id: 1,
        email: 'seller1@ecm.fr',
        password: 'password1',
        name: 'seller 1',
        role: 'seller',
        verified: true,
    },
    {
        id: 2,
        email: 'seller2@ecm.fr',
        password: 'password1',
        name: 'seller 2',
        role: 'seller',
        verified: true,
    },
]

export default function AdminManageSellers() {
    return (
        <Container size={'xs'}>
            Admin can add/edit/delete sellers
        </Container>
    )
}