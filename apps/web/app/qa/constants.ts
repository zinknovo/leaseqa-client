export type ComposeState = {
    summary: string;
    details: string;
    folders: string[];
    postType: "question" | "note" | "announcement";
    audience: "everyone" | "admin";
    urgency: "low" | "medium" | "high";
    files: File[];
};

export const INITIAL_COMPOSE_STATE: ComposeState = {
    summary: "",
    details: "",
    folders: [],
    postType: "question",
    audience: "everyone",
    urgency: "low",
    files: [],
};
