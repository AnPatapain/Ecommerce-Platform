import {Alert, Badge, Button, Flex, Group, Modal, Table, Text, TextInput} from "@mantine/core";
import {User} from "@app/shared-models/src/user.model.ts";
import {useEffect, useState} from "react";
import {apiClient} from "../../api-client.ts";
import {useAuth} from "../../auth.context.tsx";
import {useForm} from "@mantine/form";
import {getEmailValidator} from "@app/shared-utils/src/email-validator.ts";
import {toast} from "react-toastify";

/**
 * Admin create seller with default password. But this is not security risk because
 * seller need to reset password using the link sent to their mail on the first sign-in
 */
const DEFAULT_SELLER_PASSWORD = 'azerty'

export default function AdminManageSellers() {
    const [sellers, setSellers] = useState<User[]>([]);
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [toBeDeleteUser, setToBeDeleteUser] = useState<User | null>(null);
    const {token} = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const form = useForm({
        initialValues: {
            email: "",
            name: "",
        },
        validate: {
            email: (value) => (getEmailValidator().test(value) ? null : "Invalid email"),
        },
    });

    useEffect(() => {
        async function fetchSellers() {
            const sellers_ = await apiClient.admin.getAllSellers(token as string);
            setSellers(sellers_);
        }

        fetchSellers();
    }, []);

    const addSeller = async (values: {email: string, name: string}) => {
        try {
            setIsProcessing(true);
            await apiClient.admin.addSeller({
                email: values.email,
                name: values.name,
                password: DEFAULT_SELLER_PASSWORD
            }, token as string);
            setIsProcessing(false);
            const updatedSellers = await apiClient.admin.getAllSellers(token as string);
            setSellers(updatedSellers);
            toast.success('Seller is added successfully!');
        } catch (error: any) {
            setIsProcessing(false);
            setError(error.toString());
        }
    }

    const deleteSeller= async (id: number) => {
        try {
            await apiClient.admin.deleteSeller(id, token as string);
            const updatedSellers = await apiClient.admin.getAllSellers(token as string);
            setSellers(updatedSellers);
            setToBeDeleteUser(null);
            toast.success('Seller is deleted successfully!');
        } catch (error: any) {
            setError(error.toString());
        }
    }

    return (
        <Flex direction={'column'} pt={'md'}>
            <Flex direction={'column'} justify="space-between" align="flex-start" mb={'xs'}>
                <h1>Manage seller for your shop</h1>
                <Button onClick={() => {setIsAdd(true)}}>Add</Button>
            </Flex>
            <Table highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Id</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Role</Table.Th>
                        <Table.Th>State</Table.Th>
                        <Table.Th>Action</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{
                    sellers.map((seller) => (
                        <Table.Tr key={seller.email}>
                            <Table.Td>{seller.id}</Table.Td>
                            <Table.Td>{seller.email}</Table.Td>
                            <Table.Td>{seller.name}</Table.Td>
                            <Table.Td>{seller.role}</Table.Td>
                            <Table.Td>{
                                seller.verified ? <Badge color={'green'}>active account</Badge> : <Badge color={'gray'}>account inactive</Badge>
                            }</Table.Td>
                            <Table.Td>
                                <Group>
                                    <Button
                                        color={'red'}
                                        variant={'outline'}
                                        onClick={() => {
                                            setToBeDeleteUser(seller);
                                            // deleteSeller(seller.id);
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
                toBeDeleteUser &&
                <Modal
                    size={'md'}
                    opened={!!toBeDeleteUser}
                    onClose={() => {setToBeDeleteUser(null)}}
                    closeOnClickOutside={true}
                    title={<h2>Delete seller</h2>}
                >
                    <Text>
                        This action will delete the seller on platform, they can not validate the orders anymore. Are you sure ?
                    </Text>
                    <Group mt={'xl'}>
                        <Button
                            color={'red'}
                            variant={'outline'}
                            onClick={() => {
                                deleteSeller((toBeDeleteUser as User).id);
                            }}
                        >
                            Confirm
                        </Button>
                        <Button
                            color={'gray'}
                            variant={'outline'}
                            onClick={() => {
                                setToBeDeleteUser(null);
                            }}
                        >
                            Close
                        </Button>
                    </Group>
                </Modal>
            }
            {
                isAdd &&
                <Modal
                    size={'md'}
                    opened={isAdd}
                    onClose={() => {setIsAdd(false)}}
                    closeOnClickOutside={false}
                    title= {<h2>Add seller</h2>}
                >
                    <form onSubmit={form.onSubmit(addSeller)}>
                        <TextInput
                            label="Email"
                            placeholder="seller-1@ecm.fr"
                            {...form.getInputProps("email")}
                        />
                        <TextInput
                            label="Name"
                            placeholder="Seller 1"
                            {...form.getInputProps("name")}
                        />
                        <Button mt={'xs'} loading={isProcessing} loaderProps={{type: 'dots'}} type='submit' disabled={isProcessing}>Add</Button>
                    </form>

                    {error && (
                        <Alert color="red" mt="md">
                            {error}
                        </Alert>
                    )}

                    <Alert variant="light" color="blue" mt={'xl'} title="Notice">
                        If there is no existing seller with such email, a new seller account will be created.
                        <br/><br/>
                        <></>
                        <Group gap={'xs'}>
                            Password for the first signin: <Text fw={700}>{DEFAULT_SELLER_PASSWORD}</Text>
                        </Group>
                        <br/>
                        Don't worry about hard code password because seller always need to reset password using
                        the link sent to their mail-box on the first sign-in
                    </Alert>
                </Modal>
            }
        </Flex>
    )
}