import axios from "axios";

const axiosWithCredentials = axios.create({withCredentials: true});

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER || "";
export const AUTH_API = `${HTTP_SERVER}/api/auth`;

export const loginUser = async (credentials: { email: string; password: string }) => {
    const response = await axiosWithCredentials.post(`${AUTH_API}/login`, credentials);
    return response.data;
};

export const registerUser = async (userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
}) => {
    const response = await axiosWithCredentials.post(`${AUTH_API}/register`, userData);
    return response.data;
};

export const logoutUser = async () => {
    const response = await axiosWithCredentials.post(`${AUTH_API}/logout`);
    return response.data;
};

export const updateUser = async (userData: { username?: string; email?: string; role?: string }) => {
    const response = await axiosWithCredentials.put(`${AUTH_API}/user`, userData);
}

export const fetchSession = async () => {
    const response = await axiosWithCredentials.get(`${AUTH_API}/session`);
    return response.data;
};