import {Alert, Container} from "@mantine/core";
import {useEffect, useState} from "react";
import {useAuth} from "../../auth.context.tsx";
import {APIError} from "@app/shared-models/src/error.type.ts";
import AppLink from "../../components/AppLink.tsx";

export default function VerifyAccountEmailDone() {
    const [error, setError] = useState<string | null>(null);
    const params = new URLSearchParams(window.location.search);
    const {verifyAccountEmail} = useAuth();

    useEffect(() => {
        async function verifyAccount() {
            const token: string | null = params.get('token');
            if (token === null) {
                setError('Unexpected error');
                return;
            }
            try {
                await verifyAccountEmail(token);
            } catch(error: any) {
                if (error instanceof APIError) {
                    if (error.code === 'ERR_TOKEN_INVALID') {
                        setError('Verification code invalid or expired!');
                        return;
                    }
                }
                setError("Unexpected error occurred");
            }
        }

        verifyAccount();
    }, [])

    return (
        <Container size={'xs'}>
            {
                error && (
                    <>
                        <h1>Account verification error</h1>
                        <Alert color="red" mt="md" mb={'xl'}>
                            {error}
                        </Alert>
                        <AppLink href={'/send-verify-account-email'}>Get new code</AppLink>
                    </>
                )
            }
        </Container>
    )
}