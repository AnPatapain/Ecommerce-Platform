import {useAuth} from "../auth.context.tsx";
import {Navigate} from "react-router-dom";
import {ReactNode} from "react";
import HorizontalNav from "../components/HorizontalNav.tsx";

export default function PublicRoute({ children } : { children: ReactNode }) {
    const {token} = useAuth();
    return token ? <Navigate to='/'/> : <>
        <HorizontalNav/>
        {children}
    </>;
}