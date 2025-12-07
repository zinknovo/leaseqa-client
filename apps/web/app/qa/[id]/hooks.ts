import {useCallback, useEffect, useState} from "react";
import {PostDetailData, Answer, Discussion} from "./types";
import * as client from "../client";

export function usePostDetail(postId: string) {
    const [post, setPost] = useState<PostDetailData | null>(null);
    const [allPosts, setAllPosts] = useState<PostDetailData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [resolvedStatus, setResolvedStatus] = useState<"open" | "resolved">("open");

    const fetchPost = useCallback(async () => {
        try {
            setLoading(true);
            const res = await client.fetchPostById(postId);
            const data = (res as any)?.data || (res as any);
            setPost(data);
            setAnswers(data.answers || []);
            setDiscussions(data.discussions || []);
            setResolvedStatus(data.status === "resolved" ? "resolved" : "open");
        } catch (err: any) {
            setError(err.message || "Failed to load post");
        } finally {
            setLoading(false);
        }
    }, [postId]);

    const fetchRecency = useCallback(async () => {
        try {
            const res = await client.fetchPosts({});
            setAllPosts((res as any)?.data || res || []);
        } catch (err) {
            console.error("Failed to load recency posts", err);
        }
    }, []);

    useEffect(() => {
        if (postId) {
            fetchPost();
            fetchRecency();
        }
    }, [postId, fetchPost, fetchRecency]);

    return {
        post,
        allPosts,
        loading,
        error,
        setError,
        answers,
        discussions,
        resolvedStatus,
        setResolvedStatus,
        refetch: fetchPost,
    };
}

export function usePostEdit(post: PostDetailData | null) {
    const [isEditing, setIsEditing] = useState(false);
    const [editSummary, setEditSummary] = useState("");
    const [editDetails, setEditDetails] = useState("");

    useEffect(() => {
        if (post) {
            setEditSummary(post.summary || "");
            setEditDetails(post.details || "");
        }
    }, [post]);

    const startEdit = () => setIsEditing(true);

    const cancelEdit = () => {
        setIsEditing(false);
        setEditSummary(post?.summary || "");
        setEditDetails(post?.details || "");
    };

    return {
        isEditing,
        setIsEditing,
        editSummary,
        setEditSummary,
        editDetails,
        setEditDetails,
        startEdit,
        cancelEdit,
    };
}

export function useAnswers() {
    const [showAnswerBox, setShowAnswerBox] = useState(false);
    const [answerContent, setAnswerContent] = useState("");
    const [answerFocused, setAnswerFocused] = useState(false);
    const [answerFiles, setAnswerFiles] = useState<File[]>([]);
    const [answerEditing, setAnswerEditing] = useState<string | null>(null);
    const [answerEditContent, setAnswerEditContent] = useState("");

    const clearAnswer = () => {
        setAnswerContent("");
        setAnswerFiles([]);
        setShowAnswerBox(false);
        setAnswerFocused(false);
    };

    const startEditAnswer = (id: string, content: string) => {
        setAnswerEditing(id);
        setAnswerEditContent(content);
    };

    const cancelEditAnswer = () => {
        setAnswerEditing(null);
        setAnswerEditContent("");
    };

    return {
        showAnswerBox,
        setShowAnswerBox,
        answerContent,
        setAnswerContent,
        answerFocused,
        setAnswerFocused,
        answerFiles,
        setAnswerFiles,
        answerEditing,
        setAnswerEditing,
        answerEditContent,
        setAnswerEditContent,
        clearAnswer,
        startEditAnswer,
        cancelEditAnswer,
    };
}

export function useDiscussions() {
    const [showFollowBox, setShowFollowBox] = useState(false);
    const [followFocused, setFollowFocused] = useState(false);
    const [discussionDrafts, setDiscussionDrafts] = useState<Record<string, string>>({});
    const [discussionReplying, setDiscussionReplying] = useState<string | null>(null);

    const updateDraft = (key: string, val: string) => {
        setDiscussionDrafts((prev) => ({...prev, [key]: val}));
    };

    const clearFollow = () => {
        setDiscussionDrafts((prev) => ({...prev, root: ""}));
        setShowFollowBox(false);
        setFollowFocused(false);
    };

    const startReply = (id: string) => {
        setDiscussionReplying(id);
    };

    const startEdit = (id: string, content: string) => {
        setDiscussionReplying(id);
        setDiscussionDrafts((prev) => ({...prev, [id]: content}));
    };

    const cancelReply = () => {
        setDiscussionReplying(null);
    };

    return {
        showFollowBox,
        setShowFollowBox,
        followFocused,
        setFollowFocused,
        discussionDrafts,
        setDiscussionDrafts,
        discussionReplying,
        setDiscussionReplying,
        updateDraft,
        clearFollow,
        startReply,
        startEdit,
        cancelReply,
    };
}
