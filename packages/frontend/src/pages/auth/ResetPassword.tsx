import {useState} from "react";
import {useAuth} from "../../auth.context.tsx";
import {useForm} from "@mantine/form";
import {toast} from "react-toastify";
import {Alert, Button, Container, Group, PasswordInput} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import AppLink from "../../components/AppLink.tsx";

export default function ResetPassword() {
    const [error, setError] = useState<string | null>(null);
    const [verificationRequested, setVerificationRequested] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const { resetPassword } = useAuth();
    const targetEmail = new URLSearchParams(window.location.search).get('email');
    const resetPasswordToken = new URLSearchParams(window.location.search).get('token');
    const navigate = useNavigate();

    // Initialize Mantine form
    const form = useForm({
        initialValues: {
            password: "",
            confirmedPassword: ""
        },
        validate: {
            password: (value) =>
                value.length >= 6 ? null : "Password must be at least 6 characters",
            confirmedPassword: (value) =>
                value.length >= 6 ? null : "Password must be at least 6 characters",
        },
    });

    const handleSubmit = async (values: { password: string, confirmedPassword: string }) => {
        setError(null);

        try {
            setIsProcessing(true);

            if (values.password !== values.confirmedPassword) throw new Error("Confirmed password does not match");
            if (!resetPasswordToken) throw new Error("Unexpected error");

            await resetPassword(resetPasswordToken, values.password);

            setIsProcessing(false);
            setVerificationRequested(true);
            toast.success('Password updated successfully!');

            navigate('/signin');
        } catch (err: any) {
            setIsProcessing(false);
            setError(err.toString());
        }
    };

    return (
        <Container size="xs">
            <h1>Hello {targetEmail}</h1>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <PasswordInput
                    withAsterisk
                    label="Please type your new password"
                    {...form.getInputProps("password")}
                />

                <PasswordInput
                    withAsterisk
                    label="Please confirm your new password"
                    {...form.getInputProps("confirmedPassword")}
                />

                {error && (
                    <Alert color="red" mt="md">
                        {error}
                    </Alert>
                )}

                <Group justify="" mt="md">
                    <Button loading={isProcessing} loaderProps={{type: 'dots'}} type="submit" variant='filled' disabled={verificationRequested}>Submit</Button>
                    <AppLink href={'/signin'}>Back to sign in</AppLink>
                </Group>
            </form>
        </Container>
    )
}