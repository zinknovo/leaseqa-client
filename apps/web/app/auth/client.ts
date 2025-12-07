import axios from "axios";

const axiosWithCredentials = axios.create({withCredentials: true});
export const API_BASE = `${process.env.NEXT_PUBLIC_HTTP_SERVER}/api`;

export async function fetchSession() {
    const response = await axiosWithCredentials.get(`${API_BASE}/auth/session`);
    return response.data;
}

export async function login(credentials: {email: string; password: string}) {
    const response = await axiosWithCredentials.post(`${API_BASE}/auth/login`, credentials);
    return response.data;
}

export async function register(data: {email: string; password: string; username?: string; role?: string}) {
    const response = await axiosWithCredentials.post(`${API_BASE}/auth/register`, data);
    return response.data;
}

export async function logout() {
    const response = await axiosWithCredentials.post(`${API_BASE}/auth/logout`);
    return response.data;
}
