import '@mantine/core/styles.css'
import { MantineProvider} from "@mantine/core";
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
import PrivateRoute from "./pages/PrivateRoute.tsx";
import PublicRoute from "./pages/PublicRoute.tsx";
import OrderProduct from "./pages/user/OrderProduct.tsx";
import AdminPagesTemplate from "./pages/admin/AdminPagesTemplate.tsx";
import ShopItems from "./pages/admin/ShopItems.tsx";
import Orders from "./pages/admin/Oders.tsx";


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
            {
                path: "admin",
                element: (
                    <AdminPagesTemplate/>
                ),
                children: [
                    {
                        path: "",
                        element: <ShopItems/>
                    },
                    {
                        path: "shop-items",
                        element: <ShopItems/>
                    },
                    {
                        path: "orders",
                        element: <Orders/>
                    }
                ]
            },
            {
                path: "",
                element: (
                    <UserPagesTemplate />
                ),
                children: [
                    {
                        path: "",
                        element: <Home />,
                    },
                    {
                        path: "order-product",
                        element: <PrivateRoute><OrderProduct/></PrivateRoute>
                    }
                ],
            },
            {
                path: 'signin',
                element: <PublicRoute><Signin/></PublicRoute>,
            },
            {
                path: 'signup',
                element: <PublicRoute><Signup/></PublicRoute>
            },
            {
                path: 'send-verify-account-email',
                element: <PublicRoute><SendVerifyAccountEmail/></PublicRoute>
            },
            {
                path: 'verify-account-email',
                element: <PublicRoute><VerifyAccountEmailDone/></PublicRoute>
            },
            {
                path: 'forgot-password',
                element: <PublicRoute><ForgotPassword/></PublicRoute>
            },
            {
                path: 'reset-password',
                element: <PublicRoute><ResetPassword/></PublicRoute>
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

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MantineProvider
            theme={{
                colors: {
                    // Define your own color palette
                    primary: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000'],
                },
                primaryColor: 'primary',
            }}
        >
            <RouterProvider router={router}/>
            <ToastContainer />
        </MantineProvider>
    </React.StrictMode>,
)
