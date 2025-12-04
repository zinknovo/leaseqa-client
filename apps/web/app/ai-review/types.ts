export type ChatMessage = {
    author: "system" | "user" | "assistant";
    body: string;
};

export type ReviewState =
    | { status: "idle" }
    | { status: "uploading" }
    | { status: "error"; message: string }
    | {
    status: "success";
    summary: string;
    highRisk: string[];
    mediumRisk: string[];
    lowRisk: string[];
    chat: ChatMessage[];
};

export type RiskCardProps = {
    tone: "danger" | "warning" | "success";
    title: string;
    items: string[];
};

export type AIReview = {
    _id: string;
    userId: string | null;
    contractType: string;
    contractTextPreview?: string;
    contractText?: string;
    relatedPostId: string | null;
    aiResponse: {
        summary: string;
        highRisk: string[];
        mediumRisk: string[];
        lowRisk: string[];
        recommendations: string[];
    };
    createdAt: string;
    updatedAt?: string;
};