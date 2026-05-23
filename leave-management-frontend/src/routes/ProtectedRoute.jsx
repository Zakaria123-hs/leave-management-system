// import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({children, role}) => {

    const {user} = useAuth()

    // i need to implementv loading speener
    // if (isLoading) {
    //     return <LoadingSpinner/>
    // }
    
    if (!user) {
        console.log(user)
        console.log('from not user')
        return <Navigate to="/login" />;
    }
    if (!role.includes(user.role)) {
        console.log(user)
        console.log('from not user role')
        return <Navigate to="/login" />;
    }

    return children;
}
export default ProtectedRoute;