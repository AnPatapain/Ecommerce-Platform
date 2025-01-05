import '@mantine/core/styles.css'
import { MantineProvider} from "@mantine/core";
import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import {Home} from "./pages/Home.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import Root from "./pages/Root.tsx";
import Design from "./pages/Design.tsx";
import HorizontalNav from "./components/HorizontalNav.tsx";
import Signin from "./pages/auth/Signin.tsx";
import {AuthProvider} from "./auth.context.tsx";
import Signup from "./pages/auth/Signup.tsx";
import SendVerifyAccountEmail from "./pages/auth/SendVerifyAccountEmail.tsx";
import {ToastContainer} from "react-toastify";
import VerifyAccountEmailDone from "./pages/auth/VerifyAccountEmailDone.tsx";


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
                path: '',
                element: <Root/>,
                errorElement: <ErrorPage/>,
                children: [
                    {
                        path: 'home',
                        element: <Home/>,
                    },
                    {
                        path: 'signin',
                        element: <Signin/>,
                    },
                    {
                        path: 'signup',
                        element: <Signup/>
                    },
                    {
                        path: 'send-verify-account-email',
                        element: <SendVerifyAccountEmail/>
                    },
                    {
                        path: 'verify-account-email',
                        element: <VerifyAccountEmailDone/>
                    }
                ]
            },
            {
                path: '/design',
                element: <Design/>,
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
