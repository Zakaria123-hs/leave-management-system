import api from "../api/axios";

export const login = async (data) => {
    return await api.post("/api/login", data);  // ← add /api
};

export const logout = async () => {
    return await api.post("/api/logout");  // ← add /api
};

export const getUser = async () => {
    return await api.get("/api/user");  // ← add /api
};