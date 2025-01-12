import {User} from "@app/shared-models/src/user.model.ts";
import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {apiClient} from "./api-client.ts";
import {APISuccessResponse, MailVerificationResponse, SignupSuccessResponse} from "@app/shared-models/src/api.type.ts";
import {Order} from "@app/shared-models/src/order.model.ts";
import {OrderedShopItem} from "@app/shared-models/src/orderedShopItem.model.ts";
import {DisplayOrder} from "./pages/seller/SellerManageOrders.tsx";

const API_KEY_LOCALSTORAGE_KEY = 'x-api-key';

interface AuthContextType {
    finishLoadingAuthContext: boolean;
    currentUser: User | null;
    historicalOrders: DisplayOrder[];
    reloadAuthContext: () => Promise<void>;
    token: string | null;
    signup: (email: string, name: string, password: string) => Promise<SignupSuccessResponse>;
    signin: (email: string, password: string) => Promise<User>;
    signout: () => void;
    sendVerifyAccountEmail: (email: string) => Promise<MailVerificationResponse>;
    verifyAccountEmail: (verifyAccountToken: string) => Promise<void>;
    sendResetPasswordEmail: (email: string) => Promise<MailVerificationResponse>;
    resetPassword: (resetPasswordToken: string, newPassword: string) => Promise<APISuccessResponse>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: { children: any }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem(API_KEY_LOCALSTORAGE_KEY));
    const [historicalOrderedShopItems, setHistoricalOrderedShopItems] = useState<DisplayOrder[]>([]);
    const [finishLoadingAuthContext, setFinishLoadingAuthContext ] = useState<boolean>(false);
    const navigate = useNavigate();

    // Helper function to fetch user and orders
    const fetchUserAndOrders = async (authToken: string) => {
        try {
            const user = await apiClient.user.getCurrent(authToken);
            const myOrders = await apiClient.order.getMyOrders(authToken);

            const groupedOrders: DisplayOrder[] = await Promise.all(
                myOrders.map(async (order: Order) => {
                    const user = await apiClient.user.getCurrent(authToken);
                    const shopItems = await Promise.all(
                        order.orderedShopItems.map(async (orderedShopItem: OrderedShopItem) => {
                            return await apiClient.shopItem.getOneById(
                                orderedShopItem.shopItemId,
                                authToken
                            );
                        })
                    );
                    return {
                        orderId: order.id,
                        userEmail: user?.email || "unknown",
                        valid: order.valid,
                        totalPrice: shopItems.reduce((total, item) => total + item.price, 0),
                        items: shopItems,
                    };
                })
            );

            setCurrentUser(user);
            setHistoricalOrderedShopItems(groupedOrders);
        } catch (error) {
            console.error('AuthContext::', error);
            throw error;
        }
    };

    useEffect(() => {
        const initializeAuthContext = async () => {
            if (token) {
                try {
                    setFinishLoadingAuthContext(false);
                    await fetchUserAndOrders(token);
                } catch (error) {
                    signout();
                } finally {
                    setFinishLoadingAuthContext(true);
                }
            } else {
                setFinishLoadingAuthContext(true);
            }
        };
        initializeAuthContext();
    }, [token]);

    const reloadAuthContext = async () => {
        if (token) {
            try {
                setFinishLoadingAuthContext(false);
                await fetchUserAndOrders(token);
            } catch (error) {
                signout();
            } finally {
                setFinishLoadingAuthContext(true);
            }
        }
    };

    const signup = async (name: string, email: string, password: string): Promise<SignupSuccessResponse> => {
        try {
            return await apiClient.auth.signup({name, email, password});
        } catch (error) {
            throw error;
        }
    }

    const signin = async (email: string, password: string): Promise<User> => {
        try {
            const response = await apiClient.auth.signin({email, password});
            localStorage.setItem(API_KEY_LOCALSTORAGE_KEY, response.apiAccessToken);
            setToken(response.apiAccessToken);

            const user = await apiClient.user.getCurrent(response.apiAccessToken);
            setCurrentUser(user);
            return user;
        } catch (error) {
            throw error;
        }
    };

    const signout = (): void => {
        localStorage.removeItem(API_KEY_LOCALSTORAGE_KEY);
        setToken(null);
        setCurrentUser(null);
        navigate("/");
    };

    const sendVerifyAccountEmail = async (email: string): Promise<MailVerificationResponse> => {
        try {
            return await apiClient.auth.sendVerifyAccountEmail(email);
        } catch (error) {
            throw error;
        }
    }

    const verifyAccountEmail = async (verifyToken: string): Promise<void> => {
        try {
            const verifyResponse = await apiClient.auth.verifyAccount(verifyToken);
            const apiAccessToken = verifyResponse.apiAccessToken;
            localStorage.setItem(API_KEY_LOCALSTORAGE_KEY, apiAccessToken);
            setToken(apiAccessToken);

            const user = await apiClient.user.getCurrent(apiAccessToken);
            setCurrentUser(user);

            navigate("/");
        } catch (error) {
            throw error;
        }
    }

    const sendResetPasswordEmail = async (email: string): Promise<MailVerificationResponse> => {
        try {
            return await apiClient.auth.sendResetPasswordEmail(email);
        } catch (error) {
            throw error;
        }
    }

    const resetPassword = async (
        resetPasswordToken: string,
        newPassword: string
    ): Promise<APISuccessResponse> => {
        try {
            return await apiClient.auth.resetPassword(resetPasswordToken, {newPassword: newPassword});
        } catch (error) {
            throw error;
        }
    }

    return <AuthContext.Provider
        value={{
            finishLoadingAuthContext: finishLoadingAuthContext,
            currentUser,
            reloadAuthContext,
            historicalOrders: historicalOrderedShopItems,
            token,
            signup,
            signin,
            signout,
            sendVerifyAccountEmail,
            verifyAccountEmail,
            sendResetPasswordEmail,
            resetPassword
        }}>
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