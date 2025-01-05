import {useAuth} from "../auth.context.tsx";
import {Navigate, useLocation} from "react-router-dom";
import {ReactNode} from "react";

export default function PrivateRoute({ children } : { children: ReactNode }) {
    const {token} = useAuth();
    const location = useLocation();

    return token ? children : <Navigate to={'/signin'} state={ {from: location} }/>;
}