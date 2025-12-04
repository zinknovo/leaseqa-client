import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

export const AI_REVIEWS_API = `${HTTP_SERVER}/api/ai-reviews`;

export const fetchReviews = async () => {
    const response = await axiosWithCredentials.get(AI_REVIEWS_API);
    return response.data;
};

export const fetchReviewById = async (reviewId: string) => {
    const response = await axiosWithCredentials.get(`${AI_REVIEWS_API}/${reviewId}`);
    return response.data;
};

export const createReview = async (formData: FormData) => {
    const response = await axiosWithCredentials.post(AI_REVIEWS_API, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};