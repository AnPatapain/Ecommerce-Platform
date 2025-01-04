import {User} from "@app/shared-models/src/user.model.ts";
import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {apiClient} from "./api-client.ts";

const API_KEY_LOCALSTORAGE_KEY = 'x-api-key';

interface AuthContextType {
    currentUser: User | null;
    token: string | null;
    signin: (email: string, password: string) => Promise<void>;
    signout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children } : {children: any}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem(API_KEY_LOCALSTORAGE_KEY));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (token) {
                try {
                    const user = await apiClient.user.getCurrent(token);
                    setCurrentUser(user);
                } catch (error) {
                    console.error("Invalid token. Redirecting to signin.");
                    signout();
                }
            } else {
                signout();
            }
        }
        fetchCurrentUser();
    }, [token]);

    const signin = async (email: string, password: string) => {
        try {
            const response = await apiClient.auth.signin({ email, password });
            localStorage.setItem(API_KEY_LOCALSTORAGE_KEY, response.apiAccessToken);
            setToken(response.apiAccessToken);

            const user = await apiClient.user.getCurrent(response.apiAccessToken);
            setCurrentUser(user);

            navigate("/"); // Redirect to home or any other page
        } catch (error) {
            throw error;
        }
    };

    const signout = () => {
        localStorage.removeItem(API_KEY_LOCALSTORAGE_KEY);
        setToken(null);
        setCurrentUser(null);
        navigate("/signin");
    };

    return <AuthContext.Provider value={{currentUser, token, signin, signout}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};