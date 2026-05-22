import api from "../api/axios";

export const pendingRequest = async () => {
    return await api.get('api/leave-requests/pending')
}

export const approveRequest = async (id) => {
    return await api.post(`api//leave/approve/${id}`)
}

export const rejectRequest = async (id) => {
    return await api.post(`api//leave/reject/${id}`)
} 