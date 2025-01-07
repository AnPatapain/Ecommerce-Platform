import {useRouteError} from "react-router-dom";
import {Container} from "@mantine/core";
import AppLink from "../components/AppLink.tsx";

export default function ErrorPage() {
    const error = useRouteError() as any;

    if (error.status === 401) {
        return <Container size={'xs'}>
            <h1>Page access denied</h1>
            <AppLink href={'/'}>Back to home</AppLink>
        </Container>
    }
    if (error.status === 404) {
        return <Container>
            <h1>Oops! Page not found</h1>
            <AppLink href={'/'}>Back to home</AppLink>
        </Container>
    }

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText as string || error.message as string}</i>
            </p>
        </div>
    );
}