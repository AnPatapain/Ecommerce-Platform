import {User} from "@app/shared-models/src/user.model.ts";
import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {apiClient} from "./api-client.ts";
import { MailVerificationResponse} from "@app/shared-models/src/api.type.ts";

const API_KEY_LOCALSTORAGE_KEY = 'x-api-key';

interface AuthContextType {
    currentUser: User | null;
    token: string | null;
    signup: (email: string, name: string, password: string) => Promise<MailVerificationResponse>;
    signin: (email: string, password: string) => Promise<void>;
    signout: () => void;
    sendVerifyAccountEmail: (email: string) => Promise<MailVerificationResponse>;
    verifyAccountEmail: (token: string) => Promise<void>;
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
            }
        }
        fetchCurrentUser();
    }, [token]);

    const signup = async (name: string, email: string, password: string): Promise<MailVerificationResponse> => {
        try {
            return await apiClient.auth.signup({name, email, password});
        } catch (error) {
            throw error;
        }
    }

    const signin = async (email: string, password: string): Promise<void> => {
        try {
            const response = await apiClient.auth.signin({ email, password });
            localStorage.setItem(API_KEY_LOCALSTORAGE_KEY, response.apiAccessToken);
            setToken(response.apiAccessToken);

            const user = await apiClient.user.getCurrent(response.apiAccessToken);
            setCurrentUser(user);

            navigate("/");
        } catch (error) {
            throw error;
        }
    };

    const signout = (): void => {
        localStorage.removeItem(API_KEY_LOCALSTORAGE_KEY);
        setToken(null);
        setCurrentUser(null);
        navigate("/signin");
    };

    const sendVerifyAccountEmail = async (email: string): Promise<MailVerificationResponse> => {
        try {
            return await apiClient.auth.sendVerifyAccountEmail(email);
        } catch(error) {
            throw error;
        }
    }

    const verifyAccountEmail = async (token: string): Promise<void> => {
        try {
            const verifyResponse = await apiClient.auth.verifyAccount(token);
            const apiAccessToken = verifyResponse.apiAccessToken;
            localStorage.setItem(API_KEY_LOCALSTORAGE_KEY, apiAccessToken);
            setToken(apiAccessToken);

            const user = await apiClient.user.getCurrent(apiAccessToken);
            setCurrentUser(user);

            navigate("/");
        } catch(error) {
            throw error;
        }
    }

    return <AuthContext.Provider value={{currentUser, token, signup, signin, signout, sendVerifyAccountEmail, verifyAccountEmail}}>
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