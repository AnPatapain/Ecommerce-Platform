import {Outlet} from "react-router-dom";
import VerticalNav from "../../components/VerticalNav.tsx";
import {Grid} from "@mantine/core";

export default function AdminPagesTemplate() {
    return (
        <Grid>
            <Grid.Col span={3}>
                <VerticalNav/>
            </Grid.Col>

            <Grid.Col span={8}>
                <Outlet/>
            </Grid.Col>
        </Grid>
    );
};
