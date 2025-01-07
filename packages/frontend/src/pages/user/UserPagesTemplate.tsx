import HorizontalNav from "../../components/HorizontalNav.tsx";
import {Outlet} from "react-router-dom";

export default function UserPagesTemplate() {
    return (
        <>
            <HorizontalNav/>
            <Outlet/>
        </>
    );
};
