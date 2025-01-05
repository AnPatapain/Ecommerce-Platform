import {useState} from "react";
import {useAuth} from "../../auth.context.tsx";
import {useForm} from "@mantine/form";
import {Alert, Button, Container, Group, PasswordInput, TextInput} from "@mantine/core";
import {toast} from "react-toastify";
import {getEmailValidator} from "@app/shared-utils/src/email-validator.ts";
import {APIError} from "@app/shared-models/src/error.type.ts";
import AppLink from "../../components/AppLink.tsx";

export default function Signup() {
    const [error, setError] = useState<string | null>(null);
    const [verificationNoti, setVerificationNoti] = useState<{ message: string, mailBox: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [signupDone, setSignupDone] = useState<boolean>(false);
    const {signup} = useAuth();

    // Initialize Mantine form
    const form = useForm({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmedPassword: "",
        },
        validate: {
            email: (value) => (getEmailValidator().test(value) ? null : "Invalid email"),
            password: (value) =>
                value.length >= 6 ? null : "Password must be at least 6 characters",
            confirmedPassword: (value) =>
                value.length >= 6 ? null : "Password must be at least 6 characters",
        },
    });

    const handleSubmit = async (values: {
        name: string,
        email: string;
        password: string,
        confirmedPassword: string
    }) => {
        setError(null);

        try {
            if (values.password !== values.confirmedPassword) throw new Error('Confirm password does not match');
            setIsProcessing(true);
            const response = await signup(values.name, values.email, values.password);
            setIsProcessing(false);
            setSignupDone(true);
            toast.info('Account verification email successfully sent to fake SMTP mailbox');
            setVerificationNoti({
                message: `Please verify your email ${values.email} at this fake SMTP mailbox:`,
                mailBox: response.mailPreviewUrl
            });
        } catch (err: any) {
            setIsProcessing(false);
            if (err instanceof APIError) {
                setError(err.toString());
                return;
            }
            setError(err.toString());
        }
    };

    return (
        <Container size="xs">
            <h1>Sign Up</h1>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    withAsterisk
                    label="Name"
                    placeholder="Your name"
                    {...form.getInputProps("name")}
                />

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

                <PasswordInput
                    withAsterisk
                    label="Confirm password"
                    placeholder="Your password"
                    mt="md"
                    {...form.getInputProps("confirmedPassword")}
                />

                {error && (
                    <Alert color="red" mt="md">
                        {error}
                    </Alert>
                )}

                <Group justify="" mt="md">
                    <Button loading={isProcessing} loaderProps={{type: 'dots'}} type="submit" variant='filled' disabled={signupDone}>Sign Up</Button>
                    <AppLink href={'/signin'} >Back to sign in</AppLink>
                </Group>
                {
                    verificationNoti && (
                        <Alert variant="light" color="blue" title="Notification">
                            {verificationNoti.message}
                            <br/>
                            <AppLink href={verificationNoti.mailBox} openInNewTab={true}>{verificationNoti.mailBox}</AppLink>
                        </Alert>
                    )
                }
            </form>
        </Container>
    );
}