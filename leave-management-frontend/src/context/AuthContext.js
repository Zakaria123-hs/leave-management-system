import { createContext, useContext, useState, useMemo,   } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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