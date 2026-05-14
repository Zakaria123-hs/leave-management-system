import { createContext, useContext, useState, useMemo, useEffect  } from "react";
import axios from "axios";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

                const response = await axios.get("http://127.0.0.1:8000/api/user");
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

// 3. Pro Hook: Add an error check to ensure hook is used inside a Provider
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};