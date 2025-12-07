export type PostDetailData = {
    _id: string;
    summary: string;
    details: string;
    folders: string[];
    authorId: string;
    viewCount?: number;
    createdAt?: string;
    urgency?: string;
    status?: string;
    attachments?: {filename: string; url: string; size?: number}[];
    answers?: Answer[];
    discussions?: Discussion[];
    author?: any;
};

export type Answer = {
    _id: string;
    postId: string;
    authorId: string;
    answerType: string;
    content: string;
    createdAt: string;
    isAccepted?: boolean;
    author?: any;
};

export type Discussion = {
    _id: string;
    postId: string;
    parentId?: string | null;
    authorId: string;
    content: string;
    isResolved?: boolean;
    createdAt: string;
    replies?: Discussion[];
    author?: any;
};
