import {Outlet, useNavigate} from "react-router-dom";
import VerticalNav from "../../components/VerticalNav.tsx";
import {useAuth} from "../../auth.context.tsx";
import {Flex} from "@mantine/core";

export default function AdminPagesTemplate() {
    const {currentUser} = useAuth();
    const navigate = useNavigate();

    if (!currentUser || currentUser.role !== 'admin') {
        navigate('/');
    }

    return (
        <Flex align={'flex-start'} gap={'xl'}>
            <VerticalNav/>
            <Outlet/>
        </Flex>
    );
};
