import { createContext, useContext, useState, useMemo, useEffect } from "react";
import api from "../api/axios";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // 💡 Cookies are sent automatically by axios via withCredentials.
                // Just check if the current session cookie is valid by calling the user profile.
                const response = await api.get("/api/user");
                setUser(response.data);
            } catch (error) {
                console.error("Auth initialization failed:", error);
                setUser(null);
            } finally {
                setIsLoading(false); // 💡 This tells ProtectedRoute it's safe to check the user state now
            }
        };

        initializeAuth();
    }, []);

    // Explicit login helper function to call from your Login Page component
    const login = async (credentials) => {
        // 1. Get the CSRF token first for login requests
        await api.get("/sanctum/csrf-cookie");
        
        // 2. Attempt login
        await api.post("api/login", credentials);

        const response = await api.get("/api/user");
        setUser(response.data);
    };

    const logout = async () => {
        try {
            await api.post("api/logout");
        } catch (error) {
            console.error("Logout failed on server", error);
        } finally {
            setUser(null);
        }
    };

    const value = useMemo(() => ({
        user,
        setUser,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
    }), [user, isLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};