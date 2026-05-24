
// hrService.js
import api from "../api/axios";

export const hrPendingRequests = async () => {
    return await api.get("/api/hr/pending"); // fix URL
};

export const hrValidate = async (id, action) => {
    return await api.post(`/api/hr/validate/${id}`, { action }); // POST not GET, pass action
};