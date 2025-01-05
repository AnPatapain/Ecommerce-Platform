import {useState} from "react";
import {useAuth} from "../../auth.context.tsx";
import {useForm} from "@mantine/form";
import {Alert, Anchor, Button, Container, Group, PasswordInput, TextInput} from "@mantine/core";
import {MailVerificationResponse} from "@app/shared-models/src/api.type.ts";
import {toast} from "react-toastify";
import {getEmailValidator} from "@app/shared-utils/src/email-validator.ts";

export default function Signup() {
    const [error, setError] = useState<string | null>(null);
    const [verificationNoti, setVerificationNoti] = useState<{message: string, mailBox: string} | null>(null);
    const [signupDone, setSignupDone] = useState<boolean>(false);
    const { signup } = useAuth();

    // Initialize Mantine form
    const form = useForm({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validate: {
            email: (value) => (getEmailValidator().test(value) ? null : "Invalid email"),
            password: (value) =>
                value.length >= 6 ? null : "Password must be at least 6 characters",
        },
    });

    const handleSubmit = async (values: { name: string, email: string; password: string }) => {
        setError(null);

        try {
            const response: MailVerificationResponse = await signup(values.name, values.email, values.password);
            setSignupDone(true);
            toast.info('Account verification email successfully sent to fake SMTP mailbox');
            setVerificationNoti({
                message: `Please verify your email ${response.createdUser.email} at this pre-configured fake SMTP mailbox:`,
                mailBox: response.mailPreviewUrl
            });
        } catch (err: any) {
            console.log(err);
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

                {error && (
                    <Alert color="red" mt="md">
                        {error}
                    </Alert>
                )}

                <Group justify="" mt="md">
                    <Button type="submit" variant='filled' disabled={signupDone}>Sign Up</Button>
                    <Anchor underline='always' href={'/signin'}>Back to sign in</Anchor>
                </Group>
                {
                    verificationNoti && (
                        <Alert variant="light" color="blue" title="Notification">
                            {verificationNoti.message}
                            <br/>
                            <Anchor underline='always' href={verificationNoti.mailBox} target='_blank'>{verificationNoti.mailBox}</Anchor>
                        </Alert>
                    )
                }
            </form>
        </Container>
    );
}