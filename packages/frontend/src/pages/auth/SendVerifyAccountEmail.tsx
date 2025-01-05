import {Alert, Anchor, Button, Container, Group, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {useAuth} from "../../auth.context.tsx";
import {useForm} from "@mantine/form";
import {toast} from "react-toastify";
import {MailVerificationResponse} from "@app/shared-models/src/api.type.ts";
import {getEmailValidator} from "@app/shared-utils/src/email-validator.ts";

export default function SendVerifyAccountEmail() {
    const [error, setError] = useState<string | null>(null);
    const [verificationNoti, setVerificationNoti] = useState<{message: string, mailBox: string} | null>(null);
    const [verificationRequested, setVerificationRequested] = useState<boolean>(false);
    const { sendVerifyAccountEmail } = useAuth();

    useEffect(() => {
        toast.warn('Your email is not verified', {
            theme: 'dark'
        });
    }, [])

    // Initialize Mantine form
    const form = useForm({
        initialValues: {
            email: "",
        },
        validate: {
            email: (value) => (getEmailValidator().test(value) ? null : "Invalid email"),
        },
    });

    const handleSubmit = async (values: { email: string; }) => {
        setError(null);

        try {
            const response: MailVerificationResponse = await sendVerifyAccountEmail(values.email);
            toast.info('Account verification email successfully sent to fake SMTP mailbox');
            setVerificationRequested(true);
            setVerificationNoti({
                message: `Please verify your email ${response.createdUser.email} at this pre-configured fake SMTP mailbox:`,
                mailBox: response.mailPreviewUrl
            });
        } catch (err: any) {
            setError(err.toString());
        }
    };
    
    return (
        <Container size="xs">
            <h1>Email Verification</h1>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    withAsterisk
                    label="Please type your email to get verification code"
                    placeholder="your@email.com"
                    {...form.getInputProps("email")}
                />

                {error && (
                    <Alert color="red" mt="md">
                        {error}
                    </Alert>
                )}

                <Group justify="" mt="md">
                    <Button type="submit" variant='filled' disabled={verificationRequested}>Submit</Button>
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
    )
}