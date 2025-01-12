import {Alert, Button, Container, Group, Text, TextInput} from "@mantine/core";
import { useState} from "react";
import {useAuth} from "../../auth.context.tsx";
import {useForm} from "@mantine/form";
import {toast} from "react-toastify";
import {MailVerificationResponse} from "@app/shared-models/src/api.type.ts";
import {getEmailValidator} from "@app/shared-utils/src/email-validator.ts";
import {APIError} from "@app/shared-models/src/error.type.ts";
import AppLink from "../../components/AppLink.tsx";

export default function SendVerifyAccountEmail() {
    const [error, setError] = useState<string | null>(null);
    const [verificationNoti, setVerificationNoti] = useState<{message: string, mailBox: string} | null>(null);
    const [verificationRequested, setVerificationRequested] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const { sendVerifyAccountEmail } = useAuth();

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
            setIsProcessing(true);
            const response: MailVerificationResponse = await sendVerifyAccountEmail(values.email);
            setIsProcessing(false);
            toast.info('Account verification email successfully sent to fake SMTP mailbox');
            setVerificationRequested(true);
            setVerificationNoti({
                message: `Please verify your email ${values.email} at this pre-configured fake SMTP mailbox:`,
                mailBox: response.mailPreviewUrl
            });
        } catch (err: any) {
            setIsProcessing(false);
            if(err instanceof APIError && (err.code === 'ERR_USER_NOT_FOUND' || err.code === 'ERR_USER_ALREADY_VERIFIED')) {
                setVerificationNoti({
                    message: `Please verify your email ${values.email} at your mailbox`,
                    mailBox: ''
                });
                return;
            }
            setError("Unexpected error occurred");
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
                    <Button loading={isProcessing} loaderProps={{type: 'dots'}} type="submit" variant='filled' disabled={verificationRequested}>Submit</Button>
                    <AppLink href={'/signin'}>Back to sign in</AppLink>
                </Group>
                {
                    verificationNoti && (
                        <Alert variant="light" color="blue" title="Notification" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                            {verificationNoti.message}
                            <br/>
                            <AppLink href={verificationNoti.mailBox} openInNewTab={true}>{verificationNoti.mailBox}</AppLink>
                            <br/>
                            <br/>
                            <Text size={'xs'} style={{display: 'block'}}>
                                Notice: For this school project, we use a shared fake SMTP mailbox to avoid spamming your mailbox.
                                Please be aware that this is not secured for real production.
                            </Text>
                        </Alert>
                    )
                }
            </form>
        </Container>
    )
}