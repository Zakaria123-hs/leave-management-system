import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({children, role}) => {

    const {user, isLoading} = useAuth()

    // i need to implementv loading speener
    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

        if (user.role !== role) {
        return <Navigate to="/login" />;
    }

    return children;
}
export default ProtectedRoute;