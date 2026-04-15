import { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
    loginRequest,
    logoutRequest,
    verifyRequest
} from "../api/auth/auth_routes";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await verifyRequest();
                setUser(res.data.user);
                setIsAuthenticated(true);
            } catch {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const signin = async (email, password) => {
        try {
            const response = await loginRequest(email, password);
            setUser(response.data.user);
            setIsAuthenticated(true);
            return response.data;
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutRequest();
        } catch (error) {
            console.error("Error al contactar /auth/logout:", error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    
    const refreshUser = async () => {
        try {
            const res = await verifyRequest();
            setUser(res.data.user);
        } catch {
            //
        }
    };

    const value = useMemo(() => ({
        user,
        isAuthenticated,
        loading,
        signin,
        logout,
        refreshUser
    }), [user, isAuthenticated, loading]);


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
