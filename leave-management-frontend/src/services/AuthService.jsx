import api from "../api/axios";

export const login = (credentials) => {
    return api.post("/api/login", credentials); // ← /api/login not /login
};

export const logout = async () => {
    return await api.post("/logout");
};

export const getUser = async () => {
    return await api.get("/user");
};