import {Grid} from "@mantine/core";
import VerticalNav from "../../components/VerticalNav.tsx";
import {Outlet} from "react-router-dom";

export default function SellerPagesTemplate() {
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
