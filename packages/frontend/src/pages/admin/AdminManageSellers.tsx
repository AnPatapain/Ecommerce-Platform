import {Alert, Button, Flex, Group, Modal, Table, TextInput} from "@mantine/core";
import {User} from "@app/shared-models/src/user.model.ts";
import {useState} from "react";
import AppLink from "../../components/AppLink.tsx";

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
    const [editSeller, setEditSeller] = useState<User | null>(null);

    return (
        <Flex direction={'column'} pt={'md'}>
            <Flex direction={'column'} justify="space-between" align="flex-start" mb={'xs'}>
                <h1>Manage seller for your shop</h1>
                <Button>Add</Button>
            </Flex>
            <Table highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Id</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Role</Table.Th>
                        <Table.Th>Verified</Table.Th>
                        <Table.Th>Action</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{
                    users.map((user) => (
                        <Table.Tr key={user.email}>
                            <Table.Td>{user.id}</Table.Td>
                            <Table.Td>{user.email}</Table.Td>
                            <Table.Td>{user.name}</Table.Td>
                            <Table.Td>{user.role}</Table.Td>
                            <Table.Td>{user.verified.toString()}</Table.Td>
                            <Table.Td>
                                <Group>
                                    <Button onClick={() => {setEditSeller(user)}}>Edit</Button>
                                    <Button color={'red'} variant={'outline'}>Delete</Button>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))
                }</Table.Tbody>
            </Table>
            {
                editSeller && <Modal size={'md'} opened={!!editSeller} onClose={() => {setEditSeller(null)}} title="Add seller">
                    <TextInput
                        label="Email"
                        placeholder="seller-1@ecm.fr"
                    />
                    <TextInput
                        label="Name"
                        placeholder="Seller 1"
                    />
                    <Button mt={'xs'}>Add</Button>

                    <Alert variant="light" color="blue" mt={'xl'} title="Notice">
                        After adding a seller, if the seller email is correct, a reset password link
                        will be sent to their mailbox so that they can set the password
                    </Alert>
                </Modal>
            }
        </Flex>
    )
}