"use client";

import {useEffect, useMemo, useState, useRef} from "react";
import {useParams, useRouter} from "next/navigation";
import {Badge, Button, Card, CardBody, Col, Form, Row, Stack, ListGroup} from "react-bootstrap";
import dynamic from "next/dynamic";
import {format} from "date-fns";
import {
    fetchJson,
    uploadPostAttachments,
    fetchPosts,
    updatePost,
    updateAnswer,
    deleteAnswer,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
} from "@/app/lib/api";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store";
import Link from "next/link";

const ReactQuill = dynamic(() => import("react-quill-new"), {ssr: false});
import "react-quill-new/dist/quill.snow.css";

type PostDetailData = {
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
};

type Answer = {
    _id: string;
    postId: string;
    authorId: string;
    answerType: string;
    content: string;
    createdAt: string;
    isAccepted?: boolean;
    author?: any;
};

type Discussion = {
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

export default function PostDetailPage() {
    const params = useParams();
    const postId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
    const router = useRouter();
    const session = useSelector((state: RootState) => state.session);
    const currentUserId = session.user?.id || (session.user as any)?._id;
    const currentRole = session.user?.role;

    const [post, setPost] = useState<PostDetailData | null>(null);
    const [allPosts, setAllPosts] = useState<PostDetailData[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [answerContent, setAnswerContent] = useState("");
    const [answerFiles, setAnswerFiles] = useState<File[]>([]);
    const [showAnswerBox, setShowAnswerBox] = useState(false);
    const [answerFocused, setAnswerFocused] = useState(false);
    const answerFileInputRef = useRef<HTMLInputElement | null>(null);
    const [answerEditing, setAnswerEditing] = useState<string | null>(null);
    const [answerEditContent, setAnswerEditContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [resolvedStatus, setResolvedStatus] = useState<"open" | "resolved">("open");
    const [discussionDrafts, setDiscussionDrafts] = useState<Record<string, string>>({});
    const [discussionReplying, setDiscussionReplying] = useState<string | null>(null);
    const [showFollowBox, setShowFollowBox] = useState(false);
    const [followFocused, setFollowFocused] = useState(false);
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editSummary, setEditSummary] = useState("");
    const [editDetails, setEditDetails] = useState("");

    const isAuthor = post && currentUserId && post.authorId?.toString() === currentUserId;
    const canEditPost = isAuthor || currentRole === "admin";

    const fetchPost = async () => {
        try {
            setLoading(true);
            const res = await fetchJson<{data: PostDetailData}>(`/posts/${postId}`);
            const data = (res as any)?.data || (res as any);
            setPost(data);
            setAnswers(data.answers || []);
            setDiscussions(data.discussions || []);
            if (data.status) {
                setResolvedStatus(data.status === "resolved" ? "resolved" : "open");
            }
            setEditSummary(data.summary || "");
            setEditDetails(data.details || "");
        } catch (err: any) {
            setError(err.message || "Failed to load post");
        } finally {
            setLoading(false);
        }
    };

    const fetchRecency = async () => {
        try {
            const res = await fetchPosts({});
            const data = (res as any)?.data || res;
            setAllPosts(data || []);
        } catch (err) {
            console.error("Failed to load recency posts", err);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchPost();
            fetchRecency();
        }
    }, [postId]);

    const handleAnswer = async () => {
        setError("");
        if (!answerContent.trim()) {
            setError("Answer content is required");
            return;
        }
        try {
            const resp = await fetchJson(`/answers`, {
                method: "POST",
                body: JSON.stringify({
                    postId,
                    content: answerContent,
                    answerType: currentRole === "lawyer" ? "lawyer_opinion" : "community_answer",
                }),
            });
            const newAnswer = (resp as any)?.data || resp;
            if (newAnswer?._id && answerFiles.length) {
                try {
                    await uploadPostAttachments(postId, answerFiles);
                } catch (err) {
                    console.error("Attachment upload failed", err);
                }
            }
            setAnswerContent("");
            setAnswerFiles([]);
            fetchPost();
        } catch (err: any) {
            setError(err.message || "Failed to submit answer");
        }
    };

    const handleAnswerUpdate = async (answerId: string) => {
        if (!answerEditContent.trim()) return;
        await updateAnswer(answerId, {content: answerEditContent});
        setAnswerEditing(null);
        setAnswerEditContent("");
        fetchPost();
    };

    const handleAnswerDelete = async (answerId: string) => {
        await deleteAnswer(answerId);
        fetchPost();
    };

    const handleDiscussionSubmit = async (parentId?: string | null) => {
        const key = parentId || "root";
        const content = discussionDrafts[key] || "";
        if (!content.trim()) return;
        await createDiscussion({postId, parentId, content});
        setDiscussionDrafts((prev) => ({...prev, [key]: ""}));
        setDiscussionReplying(null);
        fetchPost();
    };

    const handleDiscussionUpdate = async (id: string) => {
        const content = discussionDrafts[id] || "";
        if (!content.trim()) return;
        await updateDiscussion(id, {content});
        setDiscussionDrafts((prev) => ({...prev, [id]: ""}));
        setDiscussionReplying(null);
        fetchPost();
    };

    const handleDiscussionDelete = async (id: string) => {
        await deleteDiscussion(id);
        fetchPost();
    };

    const renderDiscussion = (node: Discussion, depth = 0) => {
        const canEdit = currentRole === "admin" || node.authorId === currentUserId;
        const isReplying = discussionReplying === node._id;
        const indentClass = depth > 0 ? `card-nested-indent-${Math.min(depth, 5)}` : "";
        return (
            <Card key={node._id} className={`card-nested ${indentClass}`}>
                <CardBody className="p-2">
                    <div className="d-flex align-items-center gap-2 small text-secondary mb-1">
                        <span>{node.author?.username || node.author?.email || node.authorId}</span>
                        <span>· {node.createdAt ? format(new Date(node.createdAt), "MMM d, yyyy HH:mm") : ""}</span>
                        {canEdit && (
                            <Stack direction="horizontal" gap={2} className="ms-auto">
                                <Button size="sm" variant="outline-secondary" onClick={() => {
                                    setDiscussionReplying(node._id);
                                    setDiscussionDrafts((prev) => ({...prev, [node._id]: node.content}));
                                }}>Edit</Button>
                                <Button size="sm" variant="outline-danger" onClick={() => handleDiscussionDelete(node._id)}>Delete</Button>
                            </Stack>
                        )}
                    </div>
                    <div className="text-secondary" dangerouslySetInnerHTML={{__html: node.content}} />
                    <div className="mt-1 d-flex gap-2">
                        <Button size="sm" variant="outline-secondary" onClick={() => setDiscussionReplying(node._id)}>Reply</Button>
                    </div>
                    {isReplying && (
                        <div className="mt-2">
                            <ReactQuill
                                theme="snow"
                                value={discussionDrafts[node._id] || ""}
                                onChange={(val) => setDiscussionDrafts((prev) => ({...prev, [node._id]: val}))}
                            />
                            <div className="d-flex gap-2 mt-2">
                                <Button size="sm" onClick={() => (discussionDrafts[node._id] ? handleDiscussionUpdate(node._id) : handleDiscussionSubmit(node._id))}>
                                    Save
                                </Button>
                                <Button size="sm" variant="outline-secondary" onClick={() => setDiscussionReplying(null)}>Cancel</Button>
                            </div>
                        </div>
                    )}
                </CardBody>
                {node.replies && node.replies.map((r) => renderDiscussion(r, depth + 1))}
            </Card>
        );
    };

    const flatDiscussions = useMemo(() => discussions || [], [discussions]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center loading-min-height">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-2" role="status" />
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
                <Card className="card-base mb-2">
                    <CardBody className="py-2 px-2">
                        <div className="fw-semibold mb-1">Recency</div>
                        <ListGroup>
                            {allPosts.slice(0, 15).map((p) => (
                                <ListGroup.Item
                                    key={p._id}
                                    action
                                    active={p._id === postId}
                                    onClick={() => router.push(`/qa/${p._id}`)}
                                    className="py-2"
                                >
                                    <div className="fw-semibold small">{p.summary}</div>
                                    <div className="text-secondary small d-flex justify-content-between">
                                        <span>{p.createdAt ? format(new Date(p.createdAt), "MMM d") : ""}</span>
                                        <span className="ms-2 text-end">{p.folders?.slice(0, 2).join(" · ")}</span>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </CardBody>
                </Card>
            </Col>

            <Col lg={9} className="px-1">
                <Card className="card-base mb-2">
                    <CardBody className="p-3">
                        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                            <Badge bg={post.urgency === "high" ? "danger" : post.urgency === "medium" ? "warning" : "secondary"}>
                                {post.urgency || "low"}
                            </Badge>
                            <span className="text-secondary small">
                                {post.folders?.join(" · ")} · {post.createdAt ? format(new Date(post.createdAt), "MMM d, yyyy") : ""}
                            </span>
                            <span className="text-secondary small">Views: {post.viewCount || 0}</span>
                            {post.author && (
                                <span className="text-secondary small">By {post.author.username || post.author.email}</span>
                            )}
                            {canEditPost && (
                                <Stack direction="horizontal" gap={2} className="ms-auto">
                                    {!isEditingPost && <Button size="sm" variant="outline-secondary" onClick={() => setIsEditingPost(true)}>Edit</Button>}
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={async () => {
                                            await deletePost(postId);
                                            router.push("/qa");
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Stack>
                            )}
                        </div>
                        {isEditingPost ? (
                            <Stack gap={2}>
                                <Form.Control
                                    value={editSummary}
                                    onChange={(e) => setEditSummary(e.target.value.slice(0, 100))}
                                />
                                <ReactQuill theme="snow" value={editDetails} onChange={setEditDetails} />
                                <div className="d-flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={async () => {
                                            await updatePost(postId, {summary: editSummary, details: editDetails});
                                            setIsEditingPost(false);
                                            fetchPost();
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        onClick={() => {
                                            setIsEditingPost(false);
                                            setEditSummary(post.summary);
                                            setEditDetails(post.details);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Stack>
                        ) : (
                            <>
                                <h3 className="h5 fw-semibold mb-3">{post.summary}</h3>
                                <div className="text-secondary" dangerouslySetInnerHTML={{__html: post.details}} />
                            </>
                        )}
                        {post.attachments && post.attachments.length > 0 && (
                            <div className="mt-3">
                                <div className="fw-semibold small mb-1">Attachments</div>
                                {post.attachments.map((file) => (
                                    <div key={file.url} className="d-flex justify-content-between align-items-center text-secondary small py-1">
                                        <a href={file.url} target="_blank" rel="noreferrer">{file.filename}</a>
                                        {file.size && <span>{(file.size / 1024).toFixed(1)} KB</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardBody>
                </Card>

                <Card className="card-base mb-2">
                    <CardBody className="p-3">
                        <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                            <div className="fw-semibold">Answers</div>
                            <div className="d-flex align-items-center gap-2 text-secondary small">
                                <span>Status:</span>
                                {canEditPost ? (
                                    <>
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="Open"
                                            checked={resolvedStatus === "open"}
                                            onChange={async () => {
                                                setResolvedStatus("open");
                                                await updatePost(postId, {status: "open"});
                                                fetchPost();
                                            }}
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="Resolved"
                                            checked={resolvedStatus === "resolved"}
                                            onChange={async () => {
                                                setResolvedStatus("resolved");
                                                await updatePost(postId, {status: "resolved"});
                                                fetchPost();
                                            }}
                                        />
                                    </>
                                ) : (
                                    <Badge bg={resolvedStatus === "resolved" ? "success" : "secondary"}>
                                        {resolvedStatus === "resolved" ? "Resolved" : "Open"}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="border rounded p-2 mb-2">
                            {!showAnswerBox ? (
                                <Button size="sm" onClick={() => setShowAnswerBox(true)}>Write an answer</Button>
                            ) : (
                                <>
                                    <ReactQuill
                                        theme="snow"
                                        value={answerContent}
                                        onChange={setAnswerContent}
                                        onFocus={() => setAnswerFocused(true)}
                                    />
                                    <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                                        <input
                                            ref={answerFileInputRef}
                                            type="file"
                                            multiple
                                            hidden
                                            onChange={(e) => setAnswerFiles(Array.from(e.target.files || []))}
                                        />
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            onClick={() => answerFileInputRef.current?.click()}
                                        >
                                            Attach files{answerFiles.length ? ` (${answerFiles.length})` : ""}
                                        </Button>
                                        {(answerFocused || answerContent.trim()) && (
                                            <>
                                                <Button size="sm" onClick={handleAnswer}>Post answer</Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    onClick={() => {
                                                        setAnswerContent("");
                                                        setAnswerFiles([]);
                                                        setShowAnswerBox(false);
                                                        setAnswerFocused(false);
                                                    }}
                                                >
                                                    Clear
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                    {error && <div className="text-danger small mt-2">{error}</div>}
                                </>
                            )}
                        </div>

                        <Stack gap={2}>
                            {answers.map((ans) => (
                                <Card key={ans._id} className="card-nested">
                                    <CardBody className="p-2">
                                        <div className="d-flex align-items-center gap-2 small text-secondary mb-1">
                                            <span>{ans.author?.username || ans.author?.email || ans.authorId}</span>
                                            <span>· {ans.answerType === "lawyer_opinion" ? "⚖️" : "🏠"}</span>
                                            <span>· {ans.createdAt ? format(new Date(ans.createdAt), "MMM d, yyyy HH:mm") : ""}</span>
                                            {(currentRole === "admin" || ans.authorId === currentUserId) && (
                                                <Stack direction="horizontal" gap={2} className="ms-auto">
                                                    <Button size="sm" variant="outline-secondary" onClick={() => {
                                                        setAnswerEditing(ans._id);
                                                        setAnswerEditContent(ans.content);
                                                    }}>Edit</Button>
                                                    <Button size="sm" variant="outline-danger" onClick={() => handleAnswerDelete(ans._id)}>Delete</Button>
                                                </Stack>
                                            )}
                                        </div>
                                        {answerEditing === ans._id ? (
                                            <div>
                                                <ReactQuill theme="snow" value={answerEditContent} onChange={setAnswerEditContent} />
                                                <div className="d-flex gap-2 mt-2">
                                                    <Button size="sm" onClick={() => handleAnswerUpdate(ans._id)}>Save</Button>
                                                    <Button size="sm" variant="outline-secondary" onClick={() => {setAnswerEditing(null); setAnswerEditContent("");}}>Cancel</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-secondary" dangerouslySetInnerHTML={{__html: ans.content}} />
                                        )}
                                    </CardBody>
                                </Card>
                            ))}
                        </Stack>
                    </CardBody>
                </Card>

                <Card className="card-base mb-2">
                    <CardBody className="p-3">
                        <div className="fw-semibold mb-2">Follow-up discussion</div>
                        <div className="border rounded p-2 mb-2">
                            {!showFollowBox ? (
                                <Button size="sm" onClick={() => setShowFollowBox(true)}>Write follow-up</Button>
                            ) : (
                                <>
                                    <ReactQuill
                                        theme="snow"
                                        value={discussionDrafts["root"] || ""}
                                        onFocus={() => setFollowFocused(true)}
                                        onChange={(val) => setDiscussionDrafts((prev) => ({...prev, root: val}))}
                                    />
                                    {(followFocused || (discussionDrafts["root"] || "").trim()) && (
                                        <div className="d-flex gap-2 mt-2">
                                            <Button size="sm" onClick={() => handleDiscussionSubmit(null)}>Post follow-up</Button>
                                            <Button size="sm" variant="outline-secondary" onClick={() => {setDiscussionDrafts((prev) => ({...prev, root: ""})); setShowFollowBox(false); setFollowFocused(false);}}>Clear</Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <Stack gap={1}>
                            {flatDiscussions.map((d) => renderDiscussion(d))}
                        </Stack>
                    </CardBody>
                </Card>

            </Col>
        </Row>
    );
}
