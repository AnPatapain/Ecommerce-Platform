import '@mantine/core/styles.css'
import {createTheme, MantineProvider} from "@mantine/core";
import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import {Home} from "./pages/user/Home.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import UserPagesTemplate from "./pages/user/UserPagesTemplate.tsx";
import Draft from "./pages/Draft.tsx";
import HorizontalNav from "./components/HorizontalNav.tsx";
import Signin from "./pages/auth/Signin.tsx";
import {AuthProvider} from "./auth.context.tsx";
import Signup from "./pages/auth/Signup.tsx";
import SendVerifyAccountEmail from "./pages/auth/SendVerifyAccountEmail.tsx";
import {ToastContainer} from "react-toastify";
import VerifyAccountEmailDone from "./pages/auth/VerifyAccountEmailDone.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword.tsx";
import ResetPassword from "./pages/auth/ResetPassword.tsx";
import SecuredRoute from "./pages/SecuredRoute.tsx";
import PublicRoute from "./pages/PublicRoute.tsx";
import MyCart from "./pages/user/MyCart.tsx";
import AdminPagesTemplate from "./pages/admin/AdminPagesTemplate.tsx";
import AdminManageShopItems from "./pages/admin/AdminManageShopItems.tsx";
import AdminManageSellers from "./pages/admin/AdminManageSellers.tsx";
import SellerPagesTemplate from "./pages/seller/SellerPagesTemplate.tsx";
import SellerManageOrders from "./pages/seller/SellerManageOrders.tsx";
import MyOrders from "./pages/user/MyOrders.tsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <AuthProvider>
                <Outlet/>
            </AuthProvider>
        ),
        errorElement: <ErrorPage/>,
        children: [
            /////////////////
            // Public route
            {
                path: '/signin',
                element: <PublicRoute><Signin/></PublicRoute>,
            },
            {
                path: '/signup',
                element: <PublicRoute><Signup/></PublicRoute>
            },
            {
                path: '/send-verify-account-email',
                element: <PublicRoute><SendVerifyAccountEmail/></PublicRoute>
            },
            {
                path: '/verify-account-email',
                element: <PublicRoute><VerifyAccountEmailDone/></PublicRoute>
            },
            {
                path: '/forgot-password',
                element: <PublicRoute><ForgotPassword/></PublicRoute>
            },
            {
                path: '/reset-password',
                element: <PublicRoute><ResetPassword/></PublicRoute>
            },
            /////////////////
            // User route
            {
                path: "/",
                element: (
                    <UserPagesTemplate />
                ),
                children: [
                    {
                        path: "",
                        element: <Home />,
                    },
                    {
                        path: "my-cart",
                        element: <MyCart/>
                    },
                    {
                        path: "my-orders",
                        element: <MyOrders/>
                    }
                ],
            },
            /////////////////
            // Admin route
            {
                path: "/admin",
                element: (
                    <SecuredRoute requiredRoles={['admin']}>
                        <AdminPagesTemplate/>
                    </SecuredRoute>
                ),
                children: [
                    {
                        path: "",
                        element: <AdminManageSellers/>
                    },
                    {
                        path: "shop-items",
                        element: <AdminManageShopItems/>
                    },
                    {
                        path: "sellers",
                        element: <AdminManageSellers/>
                    }
                ]
            },
            /////////////////
            // Seller route
            {
                path: "/seller",
                element: (
                    <SecuredRoute requiredRoles={['seller']}>
                        <SellerPagesTemplate/>
                    </SecuredRoute>
                ),
                children: [
                    {
                        path: "",
                        element: <SellerManageOrders/>
                    },
                    {
                        path: "orders",
                        element: <SellerManageOrders/>
                    },
                ]
            },
            {
                path: '/draft',
                element: <Draft/>,
                children: [
                    {
                        path: 'header',
                        element: <HorizontalNav/>,
                    },
                ]
            },
        ]
    }
]);

const theme = createTheme({
    colors: {
        // Define your own color palette
        primary: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000'],
        danger: ['#FFE5E5', '#FFC2C2', '#FF9999', '#FF6666', '#FF3333', '#FF0000', '#E60000', '#CC0000', '#B30000', '#990000'],
    },
    primaryColor: 'primary',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MantineProvider
            theme={ theme }
        >
            <RouterProvider router={router}/>
            <ToastContainer />
        </MantineProvider>
    </React.StrictMode>,
)
