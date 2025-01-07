import {Badge, Burger, Center, Container, Group, Menu, NavLink} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './HorizontalNav.module.css';
import {useAuth} from "../auth.context.tsx";
import {User} from "@app/shared-models/src/user.model.ts";
import AppLink from "./AppLink.tsx";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

function getLinksForNavBar(user: User | null) {
    if(user) {
        return [
            { link: '/my-orders', label: 'My Orders' },
            { link: '/my-carts', label: 'My Carts' },
            {
                link: '#2',
                label: user.name,
                links: [
                    { link: '/my-profile', label: 'My Profile' },
                    { link: '/signout', label: 'Sign out' },
                ],
            },
        ];
    } else {
        return [
            { link: '/signin', label: 'Sign in' },
            { link: '/signup', label: 'Sign up' },
        ];
    }
}

export default function HorizontalNav() {
    const [opened, { toggle }] = useDisclosure(false);
    const {currentUser, signout} = useAuth();

    const links = getLinksForNavBar(currentUser);
    const navigate = useNavigate();

    const items = links.map((link) => {
        const menuItems = link.links?.map((item) => (
            <Menu.Item key={item.link}>
                {
                    item.label === 'Sign out' ? <NavLink
                        href={item.link}
                        label={item.label}
                        onClick={(event) => {
                            event.preventDefault();
                            signout();
                            toast.success('Logout successfully!');
                        }}
                    /> : <NavLink
                        href={item.link}
                        label={item.label}
                    />
                }
            </Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
                    <Menu.Target>
                        <Badge size="lg">
                            <Center>
                                <span className={classes.linkLabel}>{link.label}</span>
                            </Center>
                        </Badge>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <a
                key={link.label}
                href={link.link}
                className={classes.link}
                onClick={(event: any) => {
                    event.preventDefault();
                    navigate(link.link);
                }}
            >
                {link.label}
            </a>
        );
    });

    return (
        <header className={classes.header}>
            <Container size="md">
                <div className={classes.inner}>
                    <AppLink underline={false} href={'/'}>
                        <h3>ECM</h3>
                    </AppLink>
                    <Group gap={5} visibleFrom="sm">
                        {items}
                    </Group>
                    <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                </div>
            </Container>
        </header>
    );
}