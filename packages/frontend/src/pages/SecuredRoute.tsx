import {useAuth} from "../auth.context.tsx";
import {Navigate, useLocation} from "react-router-dom";
import {ReactNode} from "react";
import {UserRole} from "@app/shared-models/src/user.model.ts";
import {Container} from "@mantine/core";

export default function SecuredRoute({requiredRoles, children} : { requiredRoles: UserRole[], children: ReactNode }) {
    const { finishLoadingAuthContext, currentUser, token} = useAuth();
    const location = useLocation();

    if (!finishLoadingAuthContext) {
        return <Container>
            Role verification ...
        </Container>
    }
    if (!currentUser || !requiredRoles.includes(currentUser.role)) {
        throw { status: 401, message: "Page access denied" };
    }

    return currentUser && token ? children : <Navigate to={'/signin'} state={{from: location}}/>;
}