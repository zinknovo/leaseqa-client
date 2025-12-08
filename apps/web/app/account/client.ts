import axios from "axios";

const axiosWithCredentials = axios.create({withCredentials: true});
const HOST = (process.env.NEXT_PUBLIC_HTTP_SERVER || "").replace(/\/$/, "");
export const API_BASE = HOST ? `${HOST}/api` : "/api";

export async function logout() {
    const response = await axiosWithCredentials.post(`${API_BASE}/auth/logout`);
    return response.data;
}

export async function updateCurrentUser(payload: { username?: string; email?: string }) {
    const response = await axiosWithCredentials.patch(`${API_BASE}/users/me`, payload);
    return response.data;
}
