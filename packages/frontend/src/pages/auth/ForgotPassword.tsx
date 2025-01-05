import { useState } from "react";
import {useAuth} from "../../auth.context.tsx";
import {toast} from "react-toastify";
import {useForm} from "@mantine/form";
import {getEmailValidator} from "@app/shared-utils/src/email-validator.ts";
import {MailVerificationResponse} from "@app/shared-models/src/api.type.ts";
import {APIError} from "@app/shared-models/src/error.type.ts";
import {Alert, Button, Container, Group, TextInput} from "@mantine/core";
import AppLink from "../../components/AppLink.tsx";

export default function ForgotPassword() {
    const [error, setError] = useState<string | null>(null);
    const [verificationNoti, setVerificationNoti] = useState<{message: string, mailBox: string} | null>(null);
    const [verificationRequested, setVerificationRequested] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const { sendResetPasswordEmail } = useAuth();

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
            const response: MailVerificationResponse = await sendResetPasswordEmail(values.email);
            setIsProcessing(false);
            toast.info('Reset password link were successfully sent to fake SMTP mailbox');
            setVerificationRequested(true);
            setVerificationNoti({
                message: `Please use the reset password link that were sent to ${values.email} at this pre-configured fake SMTP mailbox:`,
                mailBox: response.mailPreviewUrl
            });
        } catch (err: any) {
            setIsProcessing(false);
            if(err instanceof APIError && err.code === 'ERR_USER_NOT_FOUND') {
                setVerificationNoti({
                    message: `Please use the reset password link that were sent to your mailbox`,
                    mailBox: ''
                });
                return;
            }
            setError("Unexpected error occurred");
        }
    };

    return (
        <Container size="xs">
            <h1>Forgot your password?</h1>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Please type your email to get reset password link"
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
                        <Alert variant="light" color="blue" title="Notification">
                            {verificationNoti.message}
                            <br/>
                            <AppLink href={verificationNoti.mailBox}
                                    openInNewTab={true}>{verificationNoti.mailBox}</AppLink>
                            <br/>
                            <br/>
                            Notice: For this school project, we use a shared fake SMTP mailbox to avoid spamming real
                            inboxes. Please be aware that this is not secure, as anyone can guess another user's email and
                            reset password for them.
                        </Alert>
                    )
                }
            </form>
        </Container>
    )
}