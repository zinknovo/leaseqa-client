export type Folder = {
    _id: string;
    name: string;
    displayName: string;
    description: string;
    color: string;
};

export type Post = {
    _id: string;
    summary: string;
    details: string;
    postType: "question" | "announcement";
    visibility: "class" | "private";
    folders: string[];
    authorId: string;
    lawyerOnly: boolean;
    fromAIReviewId: string | null;
    urgency: "low" | "medium" | "high";
    viewCount: number;
    isResolved: boolean;
    createdAt: string;
    updatedAt: string;
    lastActivityAt: string;
};

export type Stat = {
    label: string;
    value: number;
};