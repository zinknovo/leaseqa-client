import axios from "axios";

const axiosWithCredentials = axios.create({withCredentials: true});
const HOST = (process.env.NEXT_PUBLIC_HTTP_SERVER || "").replace(/\/$/, "");
export const API_BASE = HOST ? `${HOST}/api` : "/api";

export async function fetchReviews() {
    const response = await axiosWithCredentials.get(`${API_BASE}/ai-reviews`);
    return response.data;
}

export async function fetchReviewById(reviewId: string) {
    const response = await axiosWithCredentials.get(`${API_BASE}/ai-reviews/${reviewId}`);
    return response.data;
}

export async function submitAiReview(form: FormData) {
    const response = await axiosWithCredentials.post(`${API_BASE}/ai-reviews`, form, {
        headers: {"Content-Type": "multipart/form-data"},
    });
    return response.data;
}
