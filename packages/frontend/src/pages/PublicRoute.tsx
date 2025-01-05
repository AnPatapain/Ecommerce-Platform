import {useAuth} from "../auth.context.tsx";
import {Navigate} from "react-router-dom";
import {ReactNode} from "react";
import HorizontalNav from "../components/HorizontalNav.tsx";

export default function PublicRoute({ children } : { children: ReactNode }) {
    const {currentUser} = useAuth();
    return currentUser ? <Navigate to='/'/> : <>
        <HorizontalNav/>
        {children}
    </>;
}