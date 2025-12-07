"use client";

import {useParams, useRouter} from "next/navigation";
import {Button, Col, Row} from "react-bootstrap";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store";
import * as client from "../client";
import "react-quill-new/dist/quill.snow.css";

import {AnswersSection, DiscussionsSection, PostContent, RecencySidebar} from "./components";
import {usePostDetail, usePostEdit, useAnswers, useDiscussions} from "./hooks";

export default function PostDetailPage() {
    const params = useParams();
    const postId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
    const router = useRouter();
    const session = useSelector((state: RootState) => state.session);
    const currentUserId = session.user?.id || (session.user as any)?._id;
    const currentRole = session.user?.role;

    const {post, allPosts, loading, error, setError, answers, discussions, resolvedStatus, setResolvedStatus, refetch} = usePostDetail(postId);
    const postEdit = usePostEdit(post);
    const answerState = useAnswers();
    const discussionState = useDiscussions();

    const isAuthor = post && currentUserId && post.authorId?.toString() === currentUserId;
    const canEditPost = isAuthor || currentRole === "admin";

    const handleDeletePost = async () => {
        await client.deletePost(postId);
        router.push("/qa");
    };

    const handleSavePost = async () => {
        await client.updatePost(postId, {summary: postEdit.editSummary, details: postEdit.editDetails});
        postEdit.setIsEditing(false);
        refetch();
    };

    const handleStatusChange = async (status: "open" | "resolved") => {
        setResolvedStatus(status);
        await client.updatePost(postId, {status});
        refetch();
    };

    const handleSubmitAnswer = async () => {
        setError("");
        if (!answerState.answerContent.trim()) {
            setError("Answer content is required");
            return;
        }
        try {
            const resp = await client.createAnswer({
                postId,
                content: answerState.answerContent,
                answerType: currentRole === "lawyer" ? "lawyer_opinion" : "community_answer",
            });
            const newAnswer = (resp as any)?.data || resp;
            if (newAnswer?._id && answerState.answerFiles.length) {
                await client.uploadPostAttachments(postId, answerState.answerFiles).catch(console.error);
            }
            answerState.clearAnswer();
            refetch();
        } catch (err: any) {
            setError(err.message || "Failed to submit answer");
        }
    };

    const handleSaveAnswerEdit = async (id: string) => {
        if (!answerState.answerEditContent.trim()) return;
        await client.updateAnswer(id, {content: answerState.answerEditContent});
        answerState.cancelEditAnswer();
        refetch();
    };

    const handleDeleteAnswer = async (id: string) => {
        await client.deleteAnswer(id);
        refetch();
    };

    const handleSubmitDiscussion = async (parentId: string | null) => {
        const key = parentId ? `reply_${parentId}` : "root";
        const content = discussionState.discussionDrafts[key] || "";
        if (!content.trim()) return;
        await client.createDiscussion({postId, parentId, content});
        discussionState.clearDraft(key);
        discussionState.setDiscussionReplying(null);
        discussionState.setShowFollowBox(false);
        discussionState.setFollowFocused(false);
        refetch();
    };

    const handleUpdateDiscussion = async (id: string) => {
        const content = discussionState.discussionDrafts[id] || "";
        if (!content.trim()) return;
        await client.updateDiscussion(id, {content});
        discussionState.clearDraft(id);
        discussionState.setDiscussionEditing(null);
        refetch();
    };

    const handleDeleteDiscussion = async (id: string) => {
        await client.deleteDiscussion(id);
        refetch();
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center loading-min-height">
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
                <Button variant="link" onClick={() => router.push("/qa")}>Back to QA</Button>
            </div>
        );
    }

    return (
        <Row className="g-2 mx-0">
            <Col lg={3} className="px-1">
                <RecencySidebar
                    posts={allPosts}
                    currentPostId={postId}
                    onSelectPost={(id) => router.push(`/qa/${id}`)}
                />
            </Col>

            <Col lg={9} className="px-1">
                <PostContent
                    post={post}
                    canEdit={canEditPost || false}
                    isEditing={postEdit.isEditing}
                    editSummary={postEdit.editSummary}
                    editDetails={postEdit.editDetails}
                    onEdit={postEdit.startEdit}
                    onDelete={handleDeletePost}
                    onSave={handleSavePost}
                    onCancel={postEdit.cancelEdit}
                    onSummaryChange={postEdit.setEditSummary}
                    onDetailsChange={postEdit.setEditDetails}
                />

                <AnswersSection
                    answers={answers}
                    canEditPost={canEditPost || false}
                    currentUserId={currentUserId}
                    currentRole={currentRole || null}
                    resolvedStatus={resolvedStatus}
                    showAnswerBox={answerState.showAnswerBox}
                    answerContent={answerState.answerContent}
                    answerFocused={answerState.answerFocused}
                    answerFiles={answerState.answerFiles}
                    answerEditing={answerState.answerEditing}
                    answerEditContent={answerState.answerEditContent}
                    error={error}
                    onStatusChange={handleStatusChange}
                    onShowAnswerBox={() => answerState.setShowAnswerBox(true)}
                    onAnswerContentChange={answerState.setAnswerContent}
                    onAnswerFocus={() => answerState.setAnswerFocused(true)}
                    onAnswerFilesChange={answerState.setAnswerFiles}
                    onSubmitAnswer={handleSubmitAnswer}
                    onClearAnswer={answerState.clearAnswer}
                    onEditAnswer={answerState.startEditAnswer}
                    onEditContentChange={answerState.setAnswerEditContent}
                    onSaveEdit={handleSaveAnswerEdit}
                    onCancelEdit={answerState.cancelEditAnswer}
                    onDeleteAnswer={handleDeleteAnswer}
                />

                <DiscussionsSection
                    discussions={discussions}
                    currentUserId={currentUserId}
                    currentRole={currentRole || null}
                    showFollowBox={discussionState.showFollowBox}
                    followFocused={discussionState.followFocused}
                    discussionDrafts={discussionState.discussionDrafts}
                    discussionReplying={discussionState.discussionReplying}
                    discussionEditing={discussionState.discussionEditing}
                    onShowFollowBox={() => discussionState.setShowFollowBox(true)}
                    onFollowFocus={() => discussionState.setFollowFocused(true)}
                    onDraftChange={discussionState.updateDraft}
                    onSubmit={handleSubmitDiscussion}
                    onUpdate={handleUpdateDiscussion}
                    onDelete={handleDeleteDiscussion}
                    onReply={discussionState.startReply}
                    onEdit={discussionState.startEdit}
                    onCancelReply={discussionState.cancelReply}
                    onCancelEdit={discussionState.cancelEdit}
                    onClearFollow={discussionState.clearFollow}
                />
            </Col>
        </Row>
    );
}
