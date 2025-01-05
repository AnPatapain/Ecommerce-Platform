import { useState } from "react";
import { useAuth } from "../../auth.context.tsx";
import { useForm } from "@mantine/form";
import {TextInput, PasswordInput, Button, Group, Alert, Container, Anchor} from "@mantine/core";
import {APIError} from "@app/shared-models/src/error.type.ts";
import {useNavigate} from "react-router-dom";
import {getEmailValidator} from "@app/shared-utils/src/email-validator.ts";

export default function Signin() {
    const [error, setError] = useState<string | null>(null);
    const { signin } = useAuth();
    const navigate = useNavigate();

    // Initialize Mantine form
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
        validate: {
            email: (value) => (getEmailValidator().test(value) ? null : "Invalid email"),
            password: (value) =>
                value.length >= 6 ? null : "Password must be at least 6 characters",
        },
    });

    const handleSubmit = async (values: { email: string; password: string }) => {
        setError(null);
        try {
            await signin(values.email, values.password);
        } catch (err: any) {
            if (err instanceof APIError) {
                if (err.code === 'ERR_USER_NOT_VERIFIED') {
                    navigate('/send-verify-account-email');
                }
            }
            setError(err.toString());
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

                <Group justify="" mt="md" mb={'md'}>
                    <Button type="submit" variant='filled'>Sign In</Button>
                    <Anchor underline='always' href={'/forgot-password'}>Forgot password?</Anchor>
                </Group>
                <Anchor underline='always' href={'/signup'}>Don't have an account? Register now</Anchor>
            </form>
        </Container>
    );
}
