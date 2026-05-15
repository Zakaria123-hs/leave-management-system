import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const LogoutButton = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/api/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            navigate("/login");
        }
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;