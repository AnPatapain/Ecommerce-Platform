import HorizontalNav from "../../components/HorizontalNav.tsx";
import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../auth.context.tsx";
import {Container} from "@mantine/core";

export default function UserPagesTemplate() {
    const { finishLoadingAuthContext, currentUser} = useAuth();

    if (!finishLoadingAuthContext) {
        return <Container>Role verification...</Container>;
    }

    if (currentUser?.role === 'admin') {
        return <Navigate to={'/admin/sellers'} />;
    } else if (currentUser?.role === 'seller') {
        return <Navigate to={'/seller/orders'} />;
    }

    return (
        <>
            <HorizontalNav/>
            <Outlet/>
        </>
    );
};
