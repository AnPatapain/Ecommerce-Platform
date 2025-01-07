import {useEffect, useState} from 'react';

import { CiLogout } from "react-icons/ci";
import { AiOutlineProduct } from "react-icons/ai";
import { LuShoppingBag } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { Group } from '@mantine/core';
import classes from './VerticalNav.module.css';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../auth.context.tsx";
import {toast} from "react-toastify";
import {User, UserRole} from "@app/shared-models/src/user.model.ts";

const getDefaultActiveElement = (role: UserRole): string => {
    if (role === 'admin') {
        return 'Manage shop items';
    }
    else if (role === 'seller') {
        return 'Manage orders';
    } else {
        return 'Con cac'; // Should never happen on prod.
    }
}

const getNavElementsBasedOnRole = (role: UserRole)=> {
    if (role === 'admin') {
        return [
            { link: '/admin/shop-items', label: 'Manage shop items', icon: AiOutlineProduct },
            { link: '/admin/sellers', label: 'Manage sellers', icon: FiUsers },
        ];
    }
    else if (role === 'seller') {
        return [
            { link: '/seller/orders', label: 'Manage orders', icon: LuShoppingBag },
        ];
    } else {
        return [];
    }
}

export default function VerticalNav() {
    const [active, setActive] = useState('Manage shop items');
    const navigate = useNavigate();
    const {signout} = useAuth();
    const {currentUser} = useAuth();

    useEffect(() => {
        setActive(getDefaultActiveElement((currentUser as User).role));
    }, [currentUser]);

    const links = getNavElementsBasedOnRole((currentUser as User).role).map((item) => (
        <a
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label);
                navigate(item.link);
            }}
        >
            <item.icon className={classes.linkIcon} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify="space-between">
                    <h3>ECM</h3>
                </Group>
                {links}
            </div>

            <div className={classes.footer}>
                <a href="#" className={classes.link} onClick={(event) => {
                    event.preventDefault();
                    signout();
                    toast.success('Logout successfully!')
                }}>
                    <CiLogout className={classes.linkIcon} />
                    <span>Logout</span>
                </a>
            </div>
        </nav>
    );
}