export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4050/api";

const defaultOptions: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

export async function fetchJson<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function submitAiReview(form: FormData) {
  const response = await fetch(`${API_BASE}/ai-review`, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || "AI review failed");
  }
  return response.json();
}

export async function fetchPosts(params: {
  folder?: string;
  search?: string;
  role?: string;
}) {
  const query = new URLSearchParams();
  if (params.folder) query.set("folder", params.folder);
  if (params.search) query.set("search", params.search);
  if (params.role) query.set("role", params.role);
  return fetchJson(`/posts?${query.toString()}`);
}

export async function createPost(payload: {
  summary: string;
  details: string;
  folders: string[];
  postType?: string;
  visibility?: string;
}) {
  return fetchJson("/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
