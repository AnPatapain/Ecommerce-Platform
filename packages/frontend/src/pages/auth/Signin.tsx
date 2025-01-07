import { useState } from "react";
import { useAuth } from "../../auth.context.tsx";
import { useForm } from "@mantine/form";
import {TextInput, PasswordInput, Button, Group, Alert, Container} from "@mantine/core";
import {APIError} from "@app/shared-models/src/error.type.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {getEmailValidator} from "@app/shared-utils/src/email-validator.ts";
import AppLink from "../../components/AppLink.tsx";
import {toast} from "react-toastify";

export default function Signin() {
    const [error, setError] = useState<string | null>(null);
    const { signin } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    // Get the "from" location or default to "/". It were set in PrivateRoute
    const location = useLocation(); // Access location state
    const from = location.state?.from?.pathname || "/";

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
            setIsProcessing(true);
            const user= await signin(values.email, values.password);
            setIsProcessing(false);

            if (user.role === 'admin') {
                navigate('/admin', {replace: true});
                return;
            }

            // Redirect to the original page or home page. Replace ensures that signin page is removed from browser history stack
            navigate(from, { replace: true });
        } catch (err: any) {
            setIsProcessing(false);
            if (err instanceof APIError) {
                if (err.code === 'ERR_USER_NOT_VERIFIED') {
                    toast.warn('Your email is not verified', {
                        theme: 'dark'
                    });
                    navigate('/send-verify-account-email');
                    return;
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
                    <Button loading={isProcessing} loaderProps={{type: 'dots'}} type="submit" variant='filled'>Sign In</Button>
                    <AppLink href={'/forgot-password'}>Forgot password?</AppLink>
                </Group>
                <AppLink href={'/signup'}>Don't have an account? Register now</AppLink>
            </form>
        </Container>
    );
}
