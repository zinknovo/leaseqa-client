import axios from "axios";

const axiosWithCredentials = axios.create({withCredentials: true});
const HOST = (process.env.NEXT_PUBLIC_HTTP_SERVER || "").replace(/\/$/, "");
export const API_BASE = HOST ? `${HOST}/api` : "/api";

export async function fetchFolders() {
    const response = await axiosWithCredentials.get(`${API_BASE}/folders`);
    return response.data;
}

export async function createFolder(payload: {
    name: string;
    displayName: string;
    description?: string;
    color?: string
}) {
    const response = await axiosWithCredentials.post(`${API_BASE}/folders`, payload);
    return response.data;
}

export async function updateFolder(folderId: string, payload: {
    name?: string;
    displayName?: string;
    description?: string;
    color?: string
}) {
    const response = await axiosWithCredentials.put(`${API_BASE}/folders/${folderId}`, payload);
    return response.data;
}

export async function deleteFolder(folderId: string) {
    const response = await axiosWithCredentials.delete(`${API_BASE}/folders/${folderId}`);
    return response.data;
}

export async function fetchPosts(params: { folder?: string; search?: string }) {
    const response = await axiosWithCredentials.get(`${API_BASE}/posts`, {params});
    return response.data;
}

export async function fetchPostById(postId: string) {
    const response = await axiosWithCredentials.get(`${API_BASE}/posts/${postId}`);
    return response.data;
}

export async function createPost(payload: {
    summary: string;
    details: string;
    folders: string[];
    postType?: string;
    visibility?: string;
    audience?: string;
    urgency?: string;
}) {
    const response = await axiosWithCredentials.post(`${API_BASE}/posts`, payload);
    return response.data;
}

export async function updatePost(postId: string, payload: any) {
    const response = await axiosWithCredentials.put(`${API_BASE}/posts/${postId}`, payload);
    return response.data;
}

export async function deletePost(postId: string) {
    const response = await axiosWithCredentials.delete(`${API_BASE}/posts/${postId}`);
    return response.data;
}

export async function uploadPostAttachments(postId: string, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const response = await axiosWithCredentials.post(`${API_BASE}/posts/${postId}/attachments`, formData, {
        headers: {"Content-Type": "multipart/form-data"},
    });
    return response.data;
}

export async function createAnswer(payload: { postId: string; content: string; answerType: string }) {
    const response = await axiosWithCredentials.post(`${API_BASE}/answers`, payload);
    return response.data;
}

export async function updateAnswer(answerId: string, payload: any) {
    const response = await axiosWithCredentials.put(`${API_BASE}/answers/${answerId}`, payload);
    return response.data;
}

export async function deleteAnswer(answerId: string) {
    const response = await axiosWithCredentials.delete(`${API_BASE}/answers/${answerId}`);
    return response.data;
}

export async function createDiscussion(payload: { postId: string; parentId?: string | null; content: string }) {
    const response = await axiosWithCredentials.post(`${API_BASE}/discussions`, payload);
    return response.data;
}

export async function updateDiscussion(discussionId: string, payload: any) {
    const response = await axiosWithCredentials.patch(`${API_BASE}/discussions/${discussionId}`, payload);
    return response.data;
}

export async function deleteDiscussion(discussionId: string) {
    const response = await axiosWithCredentials.delete(`${API_BASE}/discussions/${discussionId}`);
    return response.data;
}

export async function fetchStats() {
    const response = await axiosWithCredentials.get(`${API_BASE}/stats/overview`);
    return response.data;
}

export async function fetchAllUsers() {
    const response = await axiosWithCredentials.get(`${API_BASE}/users`);
    return response.data;
}

export async function updateUserRole(userId: string, role: string) {
    const response = await axiosWithCredentials.patch(`${API_BASE}/users/${userId}/role`, {role});
    return response.data;
}

export async function verifyLawyer(userId: string) {
    const response = await axiosWithCredentials.patch(`${API_BASE}/users/${userId}/verify-lawyer`);
    return response.data;
}

export async function banUser(userId: string, banned: boolean) {
    const response = await axiosWithCredentials.patch(`${API_BASE}/users/${userId}/ban`, {banned});
    return response.data;
}

export async function deleteUser(userId: string) {
    const response = await axiosWithCredentials.delete(`${API_BASE}/users/${userId}`);
    return response.data;
}
