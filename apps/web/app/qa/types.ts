export type Folder = {
    _id: string;
    name: string;
    displayName: string;
    description: string;
    color: string;
};

export type FolderDraft = {
    name: string;
    displayName: string;
    description?: string;
    color?: string;
};

export type Post = {
    _id: string;
    summary: string;
    details: string;
    postType: "question" | "note" | "announcement";
    visibility: "class" | "private";
    audience?: "everyone" | "admin";
    folders: string[];
    attachments?: Attachment[];
    authorId: string;
    lawyerOnly: boolean;
    fromAIReviewId: string | null;
    urgency: "low" | "medium" | "high";
    viewCount: number;
    isPinned: boolean;
    isResolved: boolean;
    createdAt: string;
    updatedAt: string;
    lastActivityAt: string;
    author?: UserSummary | null;
    answers?: Answer[];
    discussions?: Discussion[];
};

export type Attachment = {
    filename: string;
    url: string;
    mimetype?: string;
    size?: number;
};

export type Answer = {
    _id: string;
    postId: string;
    authorId: string;
    answerType: "lawyer_opinion" | "community_answer";
    content: string;
    isAccepted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    author?: UserSummary | null;
};

export type Discussion = {
    _id: string;
    postId: string;
    parentId?: string | null;
    authorId: string;
    content: string;
    isResolved?: boolean;
    createdAt?: string;
    updatedAt?: string;
    replies?: Discussion[];
    author?: UserSummary | null;
};

export type UserSummary = {
    _id?: string;
    id?: string;
    username?: string;
    email?: string;
    role?: string;
};

export type User = {
    _id: string;
    username: string;
    email: string;
    role: "tenant" | "lawyer" | "admin";
    lawyerVerified?: boolean;
    banned?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type Stat = {
    label: string;
    value: number;
};

export type FeedHeaderProps = {
    folders: Folder[];
    posts: Post[];
    activeFolder: string | null;
    onSelectFolderAction: (folderName: string) => void;
};

export type PostDetailProps = {
    post: Post | null;
    folders: Folder[];
};

export type RecencySidebarProps = {
    posts: Post[];
    currentPostId: string | null;
    onSelectPost: (id: string) => void;
    folderDisplayMap?: Record<string, string>;
    bucketOpen: Record<string, boolean>;
    onToggleBucket: (key: string) => void;
};

export type PostContentProps = {
    post: Post;
    canEdit: boolean;
    isEditing: boolean;
    editSummary: string;
    editDetails: string;
    onEdit: () => void;
    onDelete: () => void;
    onSave: () => void;
    onCancel: () => void;
    onSummaryChange: (val: string) => void;
    onDetailsChange: (val: string) => void;
};

export type AnswersSectionProps = {
    answers: Answer[];
    canEditPost: boolean;
    currentUserId: string | null;
    currentRole: string | null;
    resolvedStatus: "open" | "resolved";
    showAnswerBox: boolean;
    answerContent: string;
    answerFocused: boolean;
    answerFiles: File[];
    answerEditing: string | null;
    answerEditContent: string;
    error: string;
    onStatusChange: (status: "open" | "resolved") => void;
    onShowAnswerBox: () => void;
    onAnswerContentChange: (val: string) => void;
    onAnswerFocus: () => void;
    onAnswerFilesChange: (files: File[]) => void;
    onSubmitAnswer: () => void;
    onClearAnswer: () => void;
    onEditAnswer: (id: string, content: string) => void;
    onEditContentChange: (val: string) => void;
    onSaveEdit: (id: string) => void;
    onCancelEdit: () => void;
    onDeleteAnswer: (id: string) => void;
};

export type DiscussionsSectionProps = {
    discussions: Discussion[];
    currentUserId: string | null;
    currentRole: string | null;
    showFollowBox: boolean;
    followFocused: boolean;
    discussionDrafts: Record<string, string>;
    discussionReplying: string | null;
    discussionEditing: string | null;
    onShowFollowBox: () => void;
    onFollowFocus: () => void;
    onDraftChange: (key: string, val: string) => void;
    onSubmit: (parentId: string | null) => void;
    onUpdate: (id: string) => void;
    onDelete: (id: string) => void;
    onReply: (id: string) => void;
    onEdit: (id: string, content: string) => void;
    onCancelReply: () => void;
    onCancelEdit: () => void;
    onClearFollow: () => void;
};
