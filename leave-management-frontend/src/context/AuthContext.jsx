import { createContext, useContext, useState, useMemo, useEffect  } from "react";
import axios from "axios";
import api from "../api/axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {

                await api.get("/sanctum/csrf-cookie");

                const response = await api.get("/api/user");
                setUser(response.data);

            } catch(error){
                console.error("Auth initialization failed:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // This ensures components only re-render if the 'user' object actually changes
    const value = useMemo(() => ({
        user,
        setUser,
        isAuthenticated: !!user,
        isLoading,
        setIsLoading
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