import { useState } from "react";
import { useAuth } from "../auth.context.tsx";
import { useForm } from "@mantine/form";
import {TextInput, PasswordInput, Button, Group, Alert, Container} from "@mantine/core";

export default function Signin() {
    const [error, setError] = useState<string | null>(null);
    const { signin } = useAuth();

    // Initialize Mantine form
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            password: (value) =>
                value.length >= 6 ? null : "Password must be at least 6 characters",
        },
    });

    const handleSubmit = async (values: { email: string; password: string }) => {
        setError(null);

        try {
            await signin(values.email, values.password);
        } catch (err: any) {
            console.log(err);
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <Container size="xs">
            <h1>Sign In</h1>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    {...form.getInputProps("email")}
                />

                <PasswordInput
                    withAsterisk
                    label="Password"
                    placeholder="Your password"
                    mt="md"
                    {...form.getInputProps("password")}
                />

                {error && (
                    <Alert color="red" mt="md">
                        {error}
                    </Alert>
                )}

                <Group justify="" mt="md">
                    <Button type="submit">Sign In</Button>
                </Group>
            </form>
        </Container>
    );
}
