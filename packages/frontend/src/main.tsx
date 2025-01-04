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
import Signin from "./pages/Signin.tsx";
import {AuthProvider} from "./auth.context.tsx";


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
        <MantineProvider>
            <RouterProvider router={router}/>
        </MantineProvider>
    </React.StrictMode>,
)
