import api from "../api/axios";

export const login = async (data) => {
    return await api.post("/login", data);
};

export const logout = async () => {
    return await api.post("/logout");
};

export const getUser = async () => {
    return await api.get("/user");
};