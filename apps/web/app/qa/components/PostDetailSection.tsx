"use client";

import {useCallback, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store";
import * as client from "../client";
import {AnswersSection, DiscussionsSection, PostContent} from "../[id]/components/index";
import {Folder} from "../types";
import {Answer, Discussion, PostDetailData} from "../[id]/types";

type PostDetailSectionProps = {
    postId: string;
    folders: Folder[];
    onCloseAction: () => void;
    onPostUpdatedAction?: () => void;
};

export default function PostDetailSection({postId, folders, onCloseAction, onPostUpdatedAction}: PostDetailSectionProps) {
    const session = useSelector((state: RootState) => state.session);
    const currentUserId = session.user?.id || (session.user as any)?._id;
    const currentRole = session.user?.role;
    const isGuest = session.status === "guest";

    const [post, setPost] = useState<PostDetailData | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [resolvedStatus, setResolvedStatus] = useState<"open" | "resolved">("open");

    const [isEditing, setIsEditing] = useState(false);
    const [editSummary, setEditSummary] = useState("");
    const [editDetails, setEditDetails] = useState("");
    const [editUrgency, setEditUrgency] = useState<"low" | "medium" | "high">("low");
    const [editFolders, setEditFolders] = useState<string[]>([]);

    const [showAnswerBox, setShowAnswerBox] = useState(false);
    const [answerContent, setAnswerContent] = useState("");
    const [answerFocused, setAnswerFocused] = useState(false);
    const [answerFiles, setAnswerFiles] = useState<File[]>([]);
    const [answerEditing, setAnswerEditing] = useState<string | null>(null);
    const [answerEditContent, setAnswerEditContent] = useState("");

    const [showFollowBox, setShowFollowBox] = useState(false);
    const [followFocused, setFollowFocused] = useState(false);
    const [discussionDrafts, setDiscussionDrafts] = useState<Record<string, string>>({});
    const [discussionReplying, setDiscussionReplying] = useState<string | null>(null);
    const [discussionEditing, setDiscussionEditing] = useState<string | null>(null);

    const fetchPost = useCallback(async () => {
        try {
            setLoading(true);
            const res = await client.fetchPostById(postId);
            const data = (res as any)?.data || res;
            setPost(data);
            setAnswers(data.answers || []);
            setDiscussions(data.discussions || []);
            setResolvedStatus(data.isResolved ? "resolved" : "open");
            setEditSummary(data.summary || "");
            setEditDetails(data.details || "");
            setEditUrgency(data.urgency || "low");
            setEditFolders(data.folders || []);
        } catch (err: any) {
            setError(err.message || "Failed to load post");
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        if (postId) fetchPost();
    }, [postId, fetchPost]);

    const isAuthor = post && currentUserId && post.authorId?.toString() === currentUserId;
    const canEditPost = !isGuest && (isAuthor || currentRole === "admin");
    const isAdmin = currentRole === "admin";

    const handleDeletePost = async () => {
        await client.deletePost(postId);
        onCloseAction();
    };

    //TODO: whether need to add other elements
    const handleSavePost = async () => {
        await client.updatePost(postId, {
            summary: editSummary,
            details: editDetails,
            urgency: editUrgency,
            folders: editFolders,
        });
        setIsEditing(false);
        await fetchPost();
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditSummary(post?.summary || "");
        setEditDetails(post?.details || "");
        setEditUrgency(post?.urgency || "low");
        setEditFolders(post?.folders || []);
    };

    const handleStatusChange = async (status: "open" | "resolved") => {
        setResolvedStatus(status);
        await client.updatePost(postId, {isResolved: status === "resolved"});
        await fetchPost();
    };

    const handleTogglePin = async () => {
        if (!post) return;
        try {
            await client.togglePinPost(postId, !post.isPinned);
            await fetchPost();
            onPostUpdatedAction?.();
        } catch (err: any) {
            console.error("Failed to toggle pin:", err);
        }
    };

    //TODO: admin answer?
    const handleSubmitAnswer = async () => {
        setError("");
        if (!answerContent.trim()) {
            setError("Answer content is required");
            return;
        }
        try {
            const resp = await client.createAnswer({
                postId,
                content: answerContent,
                answerType: currentRole === "lawyer" ? "lawyer_opinion" : "community_answer",
            });
            const newAnswer = (resp as any)?.data || resp;
            if (newAnswer?._id && answerFiles.length) {
                await client.uploadPostAttachments(postId, answerFiles).catch(console.error);
            }
            setAnswerContent("");
            setAnswerFiles([]);
            setShowAnswerBox(false);
            setAnswerFocused(false);
            await fetchPost();
        } catch (err: any) {
            setError(err.message || "Failed to submit answer");
        }
    };

    const handleSaveAnswerEdit = async (id: string) => {
        if (!answerEditContent.trim()) return;
        await client.updateAnswer(id, {content: answerEditContent});
        setAnswerEditing(null);
        setAnswerEditContent("");
        await fetchPost();
    };

    const handleDeleteAnswer = async (id: string) => {
        await client.deleteAnswer(id);
        await fetchPost();
    };

    const updateDraft = (key: string, val: string) => {
        setDiscussionDrafts(prev => ({...prev, [key]: val}));
    };

    const clearDraft = (key: string) => {
        setDiscussionDrafts(prev => {
            const next = {...prev};
            delete next[key];
            return next;
        });
    };

    const handleSubmitDiscussion = async (parentId: string | null) => {
        const key = parentId ? `reply_${parentId}` : "root";
        const content = discussionDrafts[key] || "";
        if (!content.trim()) return;
        await client.createDiscussion({postId, parentId, content});
        clearDraft(key);
        setDiscussionReplying(null);
        setShowFollowBox(false);
        setFollowFocused(false);
        await fetchPost();
    };

    const handleUpdateDiscussion = async (id: string) => {
        const content = discussionDrafts[id] || "";
        if (!content.trim()) return;
        await client.updateDiscussion(id, {content});
        clearDraft(id);
        setDiscussionEditing(null);
        await fetchPost();
    };

    const handleDeleteDiscussion = async (id: string) => {
        await client.deleteDiscussion(id);
        await fetchPost();
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-2" role="status"/>
                    <div className="text-secondary">Loading post…</div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-5">
                <p className="text-danger">Post not found.</p>
                <Button variant="link" onClick={onCloseAction}>Back to QA</Button>
            </div>
        );
    }

    return (
        <>
            <PostContent
                post={post}
                folders={folders}
                canEdit={canEditPost || false}
                isEditing={isEditing}
                editSummary={editSummary}
                editDetails={editDetails}
                editUrgency={editUrgency}
                editFolders={editFolders}
                resolvedStatus={resolvedStatus}
                isAdmin={isAdmin}
                onStatusChange={handleStatusChange}
                onEdit={() => setIsEditing(true)}
                onDelete={handleDeletePost}
                onSave={handleSavePost}
                onCancel={handleCancelEdit}
                onSummaryChange={setEditSummary}
                onDetailsChange={setEditDetails}
                onUrgencyChange={setEditUrgency}
                onFoldersChange={setEditFolders}
                onTogglePin={handleTogglePin}
            />

            <AnswersSection
                answers={answers}
                currentUserId={currentUserId}
                currentRole={currentRole || null}
                isGuest={isGuest}
                showAnswerBox={showAnswerBox}
                answerContent={answerContent}
                answerFocused={answerFocused}
                answerFiles={answerFiles}
                answerEditing={answerEditing}
                answerEditContent={answerEditContent}
                error={error}
                onShowAnswerBox={() => setShowAnswerBox(true)}
                onAnswerContentChange={setAnswerContent}
                onAnswerFocus={() => setAnswerFocused(true)}
                onAnswerFilesChange={setAnswerFiles}
                onSubmitAnswer={handleSubmitAnswer}
                onClearAnswer={() => {
                    setAnswerContent("");
                    setAnswerFiles([]);
                    setShowAnswerBox(false);
                    setAnswerFocused(false);
                }}
                onEditAnswer={(id, content) => {
                    setAnswerEditing(id);
                    setAnswerEditContent(content);
                }}
                onEditContentChange={setAnswerEditContent}
                onSaveEdit={handleSaveAnswerEdit}
                onCancelEdit={() => {
                    setAnswerEditing(null);
                    setAnswerEditContent("");
                }}
                onDeleteAnswer={handleDeleteAnswer}
            />

            <DiscussionsSection
                discussions={discussions}
                currentUserId={currentUserId}
                currentRole={currentRole || null}
                isGuest={isGuest}
                showFollowBox={showFollowBox}
                followFocused={followFocused}
                discussionDrafts={discussionDrafts}
                discussionReplying={discussionReplying}
                discussionEditing={discussionEditing}
                onShowFollowBox={() => setShowFollowBox(true)}
                onFollowFocus={() => setFollowFocused(true)}
                onDraftChange={updateDraft}
                onSubmit={handleSubmitDiscussion}
                onUpdate={handleUpdateDiscussion}
                onDelete={handleDeleteDiscussion}
                onReply={(id) => {
                    setDiscussionReplying(id);
                    setDiscussionEditing(null);
                }}
                onEdit={(id, content) => {
                    setDiscussionEditing(id);
                    setDiscussionReplying(null);
                    setDiscussionDrafts(prev => ({...prev, [id]: content}));
                }}
                onCancelReply={() => {
                    if (discussionReplying) clearDraft(`reply_${discussionReplying}`);
                    setDiscussionReplying(null);
                }}
                onCancelEdit={() => {
                    if (discussionEditing) clearDraft(discussionEditing);
                    setDiscussionEditing(null);
                }}
                onClearFollow={() => {
                    clearDraft("root");
                    setShowFollowBox(false);
                    setFollowFocused(false);
                }}
            />
        </>
    );
}
