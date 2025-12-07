import axios from "axios";

const axiosWithCredentials = axios.create({withCredentials: true});
export const API_BASE = `${process.env.NEXT_PUBLIC_HTTP_SERVER}/api`;

export async function fetchStats() {
    const response = await axiosWithCredentials.get(`${API_BASE}/stats/overview`);
    return response.data;
}
