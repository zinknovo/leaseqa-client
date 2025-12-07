"use client";

import {useEffect, useMemo, useState} from "react";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {Button, Col, Row} from "react-bootstrap";
import {useSelector} from "react-redux";

import {RootState} from "@/app/store";
import {Folder, Post} from "../types";
import {ComposeState, INITIAL_COMPOSE_STATE} from "../constants";
import * as client from "../client";

import ScenarioFilter from "../components/ScenarioFilter";
import QAToolbar from "../components/QAToolbar";
import RecencySidebar from "../components/RecencySidebar";
import FeedHeader from "../components/FeedHeader";
import AnnouncementSection from "../components/AnnouncementSection";
import ComposeForm from "../components/ComposeForm";
import PinPostsSection from "../components/PinPostsSection";
import {AnswersSection, DiscussionsSection, PostContent} from "../components/post-detail";
import {useAnswers, useDiscussions, usePostEdit} from "../hooks";

export default function QAPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const postId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : null;
    const scenario = searchParams.get("scenario") || "all";
    const searchParam = searchParams.get("search") || "";
    const composeParam = searchParams.get("compose") === "1";

    const session = useSelector((state: RootState) => state.session);
    const currentUserId = session.user?.id || (session.user as any)?._id;
    const currentRole = session.user?.role;

    const [folders, setFolders] = useState<Folder[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen] = useState(true);
    const [showCompose, setShowCompose] = useState(false);
    const [posting, setPosting] = useState(false);
    const [postError, setPostError] = useState("");
    const [composeState, setComposeState] = useState<ComposeState>(INITIAL_COMPOSE_STATE);
    const [showResolved, setShowResolved] = useState(false);
    const [resolvedStatus, setResolvedStatus] = useState<"open" | "resolved">("open");
    const [bucketOpen, setBucketOpen] = useState<Record<string, boolean>>({
        thisWeek: true,
        lastWeek: false,
        thisMonth: false,
        earlier: false,
    });

    const selectedPost = useMemo(() => {
        if (!postId) return null;
        return posts.find(p => p._id === postId) || null;
    }, [posts, postId]);

    const postEdit = usePostEdit(selectedPost);
    const answerState = useAnswers();
    const discussionState = useDiscussions();

    const isAuthor = selectedPost && currentUserId && selectedPost.authorId?.toString() === currentUserId;
    const canEditPost = isAuthor || currentRole === "admin";

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        setShowCompose(composeParam);
        setSearch(searchParam);
    }, [composeParam, searchParam, scenario]);

    useEffect(() => {
        if (selectedPost) {
            setResolvedStatus(selectedPost.isResolved ? "resolved" : "open");
        }
    }, [selectedPost]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [foldersResponse, postsResponse] = await Promise.all([
                client.fetchFolders(),
                client.fetchPosts({}),
            ]);
            setFolders(foldersResponse.data || []);
            setPosts(postsResponse.data || []);
        } catch (err) {
            console.error("Failed to load data:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            if (!showResolved && post.isResolved) {
                return false;
            }
            if (search) {
                const q = search.toLowerCase();
                if (!post.summary.toLowerCase().includes(q) && !post.details.toLowerCase().includes(q)) {
                    return false;
                }
            }
            if (scenario && scenario !== "all") {
                if (!post.folders.includes(scenario)) {
                    return false;
                }
            }
            return true;
        });
    }, [posts, search, scenario, showResolved]);

    const folderDisplayMap = useMemo(() => {
        return folders.reduce<Record<string, string>>((acc, f) => {
            acc[f.name] = f.displayName || f.name;
            return acc;
        }, {});
    }, [folders]);

    const handleSelectPost = (id: string) => {
        router.push(`/qa/${id}`);
    };

    const resetCompose = () => {
        setComposeState(INITIAL_COMPOSE_STATE);
        setShowCompose(false);
        setPostError("");
    };

    const handleSubmitPost = async () => {
        setPostError("");
        if (!composeState.summary.trim()) {
            setPostError("Title is required");
            return;
        }
        if (!composeState.details.trim()) {
            setPostError("Content is required");
            return;
        }
        setPosting(true);
        try {
            const resp = await client.createPost({
                summary: composeState.summary,
                details: composeState.details,
                folders: composeState.folders.length ? composeState.folders : ["uncategorized"],
                postType: composeState.postType,
                audience: composeState.audience,
                urgency: composeState.urgency,
                visibility: "class",
            });
            const newPost = (resp as any)?.data || resp;
            if (newPost?._id && composeState.files.length) {
                await client.uploadPostAttachments(newPost._id, composeState.files).catch(console.error);
            }
            await loadData();
            if (newPost?._id) router.push(`/qa/${newPost._id}`);
            resetCompose();
        } catch (err: any) {
            setPostError(err.message || "Failed to create post");
        } finally {
            setPosting(false);
        }
    };

    const handleDeletePost = async () => {
        if (!postId) return;
        await client.deletePost(postId);
        router.push("/qa");
    };

    const handleSavePost = async () => {
        if (!postId) return;
        await client.updatePost(postId, {summary: postEdit.editSummary, details: postEdit.editDetails});
        postEdit.setIsEditing(false);
        await loadData();
    };

    const handleStatusChange = async (status: "open" | "resolved") => {
        if (!postId) return;
        setResolvedStatus(status);
        await client.updatePost(postId, {isResolved: status === "resolved"});
        await loadData();
    };

    const handleSubmitAnswer = async () => {
        if (!postId) return;
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
            await loadData();
        } catch (err: any) {
            setError(err.message || "Failed to submit answer");
        }
    };

    const handleSaveAnswerEdit = async (id: string) => {
        if (!answerState.answerEditContent.trim()) return;
        await client.updateAnswer(id, {content: answerState.answerEditContent});
        answerState.cancelEditAnswer();
        await loadData();
    };

    const handleDeleteAnswer = async (id: string) => {
        await client.deleteAnswer(id);
        await loadData();
    };

    const handleSubmitDiscussion = async (parentId: string | null) => {
        if (!postId) return;
        const key = parentId ? `reply_${parentId}` : "root";
        const content = discussionState.discussionDrafts[key] || "";
        if (!content.trim()) return;
        await client.createDiscussion({postId, parentId, content});
        discussionState.clearDraft(key);
        discussionState.setDiscussionReplying(null);
        discussionState.setShowFollowBox(false);
        discussionState.setFollowFocused(false);
        await loadData();
    };

    const handleUpdateDiscussion = async (id: string) => {
        const content = discussionState.discussionDrafts[id] || "";
        if (!content.trim()) return;
        await client.updateDiscussion(id, {content});
        discussionState.clearDraft(id);
        discussionState.setDiscussionEditing(null);
        await loadData();
    };

    const handleDeleteDiscussion = async (id: string) => {
        await client.deleteDiscussion(id);
        await loadData();
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center loading-min-height">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status"/>
                    <div className="text-secondary">Loading...</div>
                </div>
            </div>
        );
    }

    if (postId && !selectedPost) {
        return (
            <div className="text-center py-5">
                <p className="text-danger">Post not found.</p>
                <Button variant="link" onClick={() => router.push("/qa")}>Back to QA</Button>
            </div>
        );
    }

    const answers = selectedPost?.answers || [];
    const discussions = selectedPost?.discussions || [];

    return (
        <>
            <ScenarioFilter/>
            <QAToolbar
                initialSearch={searchParam}
                onSearchChange={setSearch}
                showResolved={showResolved}
                onToggleResolved={() => setShowResolved(prev => !prev)}
            />

            <Row className="g-3 mx-0">
                {sidebarOpen && (
                    <Col lg={3} className="px-1">
                        <RecencySidebar
                            posts={filteredPosts}
                            currentPostId={postId}
                            onSelectPost={handleSelectPost}
                            folderDisplayMap={folderDisplayMap}
                            bucketOpen={bucketOpen}
                            onToggleBucket={(key) => setBucketOpen(prev => ({...prev, [key]: !prev[key]}))}
                        />
                    </Col>
                )}

                <Col lg={sidebarOpen ? 9 : 12} className="px-1">
                    {showCompose ? (
                        <ComposeForm
                            composeState={composeState}
                            folders={folders}
                            posting={posting}
                            postError={postError}
                            onUpdate={(updates) => setComposeState(prev => ({...prev, ...updates}))}
                            onSubmit={handleSubmitPost}
                            onCancel={resetCompose}
                        />
                    ) : postId && selectedPost ? (
                        <>
                            <PostContent
                                post={selectedPost}
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
                        </>
                    ) : (
                        <>
                            <PinPostsSection posts={filteredPosts} folders={folders}/>
                            <AnnouncementSection posts={filteredPosts} folders={folders}/>
                            <FeedHeader folders={folders} posts={filteredPosts}/>
                        </>
                    )}
                </Col>
            </Row>
        </>
    );
}
