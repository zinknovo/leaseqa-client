"use client";

import {useEffect, useMemo, useState} from "react";
import {useSearchParams, usePathname, useRouter} from "next/navigation";
import {
    Button,
    Card,
    CardBody,
    Col,
    FormControl,
    Form,
    ListGroup,
    Row,
    Stack,
} from "react-bootstrap";
import dynamic from "next/dynamic";
import {format} from "date-fns";
import {FaChevronDown, FaChevronRight} from "react-icons/fa";
import {Folder, Post} from "./types";
import * as client from "./client";
import {createPost} from "../lib/api";
import FeedHeader from "./components/FeedHeader";
import PostDetail from "./components/PostDetail";
const ReactQuill = dynamic(() => import("react-quill-new"), {ssr: false});
import "react-quill-new/dist/quill.snow.css";

const SCENARIO_KEYWORDS: Record<string, string[]> = {
    all: [],
    deposit: ["deposit", "escrow", "security deposit", "return deposit"],
    eviction: ["eviction", "notice", "nonpayment", "14-day", "quit"],
    repairs: ["repair", "maintenance", "mold", "leak", "habitability"],
    utilities: ["utility", "heat", "electric", "water", "gas"],
    leasebreak: ["break lease", "terminate", "early termination"],
    sublease: ["sublease", "roommate", "assign", "co-tenant"],
    fees: ["late fee", "rent", "payment plan", "fee"],
    harassment: ["harass", "retaliation", "lockout", "privacy"],
};
const SECTION_OPTIONS = [
    {value: "deposit", label: "Security Deposit"},
    {value: "eviction", label: "Eviction / Notice"},
    {value: "repairs", label: "Repairs & Habitability"},
    {value: "utilities", label: "Utilities / Heat"},
    {value: "leasebreak", label: "Breaking a Lease"},
    {value: "sublease", label: "Sublease / Roommates"},
    {value: "fees", label: "Late Fees / Rent"},
    {value: "harassment", label: "Landlord Harassment"},
];

export default function QAPage() {
    const router = useRouter();
    const pathname = usePathname();
    const currentRouteId = pathname?.startsWith("/qa/") ? pathname.split("/").pop() || null : null;
    const [folders, setFolders] = useState<Folder[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [activeFolder, setActiveFolder] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showCompose, setShowCompose] = useState(false);
    const [composeState, setComposeState] = useState<{
        summary: string;
        details: string;
        folders: string[];
        postType: "question" | "note";
        audience: "everyone" | "admin";
        files: File[];
    }>({
        summary: "",
        details: "",
        folders: [],
        postType: "question",
        audience: "everyone",
        files: [],
    });
    const [posting, setPosting] = useState(false);
    const [postError, setPostError] = useState("");
    const [bucketOpen, setBucketOpen] = useState<Record<string, boolean>>({
        thisWeek: true,
        lastWeek: true,
        thisMonth: true,
        earlier: true,
    });
    const searchParams = useSearchParams();
    const scenario = searchParams.get("scenario") || "all";

    const matchesScenario = (post: Post, currentScenario: string) => {
        if (currentScenario === "all") return true;
        const needles = SCENARIO_KEYWORDS[currentScenario] || [];
        const haystack = `${post.summary} ${post.details}`.toLowerCase();
        return needles.some((word) => haystack.includes(word.toLowerCase()));
    };

    useEffect(() => {
        loadData();
    }, []);

    // Reset compose when switching scenario/tab (ensures feed is default view)
    useEffect(() => {
        setShowCompose(false);
    }, [scenario]);

    const loadData = async () => {
        try {
            setLoading(true);

            const foldersResponse = await client.fetchFolders();
            const foldersData = foldersResponse.data || [];
            setFolders(foldersData);

            if (foldersData.length > 0) {
                setActiveFolder(foldersData[0].name);
            }

            const postsResponse = await client.fetchPosts({});
            const postsData = postsResponse.data || [];
            setPosts(postsData);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            if (activeFolder && !post.folders.includes(activeFolder)) {
                return false;
            }
            if (search) {
                const q = search.toLowerCase();
                return (
                    post.summary.toLowerCase().includes(q) ||
                    post.details.toLowerCase().includes(q)
                );
            }
            return matchesScenario(post, scenario);
        });
    }, [posts, activeFolder, search, scenario]);

    const scenarioFilteredPosts = useMemo(() => {
        return posts.filter((post) => matchesScenario(post, scenario));
    }, [posts, scenario]);

    const recencyBuckets = useMemo(() => {
        const now = new Date();
        const buckets: Record<string, {label: string; items: Post[]}> = {
            thisWeek: {label: "This week", items: []},
            lastWeek: {label: "Last week", items: []},
            thisMonth: {label: "Earlier this month", items: []},
            earlier: {label: "Earlier", items: []},
        };

        const sorted = [...scenarioFilteredPosts].sort((a, b) => {
            const da = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const db = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return db - da;
        });

        sorted.forEach((post) => {
            const created = new Date(post.createdAt || post.updatedAt || 0);
            const diffDays =
                Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays <= 6) {
                buckets.thisWeek.items.push(post);
            } else if (diffDays <= 13) {
                buckets.lastWeek.items.push(post);
            } else if (diffDays <= 30) {
                buckets.thisMonth.items.push(post);
            } else {
                buckets.earlier.items.push(post);
            }
        });

        return buckets;
    }, [scenarioFilteredPosts]);

    const toggleBucket = (key: string) => {
        setBucketOpen(prev => ({...prev, [key]: !prev[key]}));
    };

    const formatTimestamp = (date: any) => {
        if (!date) return "—";
        try {
            return format(new Date(date), "MMM d");
        } catch {
            return "—";
        }
    };

    const makeSnippet = (text: string) => {
        if (!text) return "";
        const clean = text.replace(/\s+/g, " ").trim();
        if (clean.length <= 140) return clean;
        return `${clean.slice(0, 140)}…`;
    };

    const selectedPost = posts.find(p => p._id === selectedId) || null;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center loading-min-height">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" />
                    <div className="text-secondary">Loading stats...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Stack direction="horizontal" className="mb-2 flex-wrap align-items-center" gap={2}>
                <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => setSidebarOpen((v) => !v)}
                >
                    {sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                </Button>
                <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                        setShowCompose(true);
                        setSelectedId(null);
                    }}
                >
                    New Post
                </Button>
                <FormControl
                    placeholder="Search posts"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input-md"
                />
            </Stack>

            <Row className="g-3 align-items-start">
                {sidebarOpen && (
                    <Col lg={3}>
                        <Card className="mb-3 card-base shadow-sm h-100">
                            <CardBody className="p-3">
                                <div className="small text-secondary mb-2 text-uppercase fw-semibold">By recency</div>
                                <ListGroup>
                                    {Object.entries(recencyBuckets).map(([key, bucket]) => {
                                        if (!bucket.items.length) return null;
                                        const open = bucketOpen[key] ?? true;
                                        return (
                                            <div key={key} className="mb-1">
                                                <button
                                                    type="button"
                                                    className="border-0 bg-transparent p-0 mb-1 d-flex align-items-center gap-2 text-secondary small"
                                                    onClick={() => toggleBucket(key)}
                                                >
                                                    {open ? <FaChevronDown size={12}/> : <FaChevronRight size={12}/>}
                                                    <span className="fw-semibold text-dark">{bucket.label}</span>
                                                </button>
                                                {open && (
                                                    <div className="d-grid gap-2">
                                                        {bucket.items.map((post) => (
                                                            <Card
                                                                key={post._id}
                                                                className={`p-2 shadow-sm border-0 post-item-clickable card-nested ${selectedId === post._id || currentRouteId === post._id ? "border-primary" : ""}`}
                                                                onClick={() => {
                                                                    setSelectedId(post._id);
                                                                    router.push(`/qa/${post._id}`);
                                                                }}
                                                            >
                                                                <div className="d-flex justify-content-between align-items-start gap-2">
                                                                    <div>
                                                                        <div className="fw-semibold">{post.summary}</div>
                                                                        <div className="text-secondary small">
                                                                            {makeSnippet(post.details)}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-muted small post-timestamp">
                                                                        {formatTimestamp(post.createdAt)}
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </ListGroup>
                            </CardBody>
                        </Card>
                    </Col>
                )}

                <Col lg={sidebarOpen ? 9 : 12}>
                    {!showCompose && (
                        <FeedHeader
                            folders={folders}
                            posts={posts}
                            activeFolder={activeFolder}
                            onSelectFolderAction={setActiveFolder}
                        />
                    )}

                    {showCompose ? (
                        <Card className="mb-3 card-base shadow-sm">
                            <CardBody className="p-3">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="fw-semibold">Create a new post</div>
                                    <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        onClick={() => setShowCompose(false)}
                                        disabled={posting}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                                <Stack gap={2}>
                                <Form.Group>
                                    <div className="d-flex align-items-center gap-3 flex-wrap">
                                        <span className="fw-semibold small text-secondary">Post type</span>
                                        {["question", "note"].map((type) => (
                                            <Form.Check
                                                key={type}
                                                type="radio"
                                                inline
                                                name="postType"
                                                id={`postType-${type}`}
                                                label={type === "question" ? "Question" : "Note"}
                                                checked={composeState.postType === type}
                                                onChange={() => setComposeState(prev => ({...prev, postType: type as "question" | "note"}))}
                                            />
                                        ))}
                                    </div>
                                </Form.Group>

                                <Form.Group>
                                    <div className="d-flex align-items-center gap-3 flex-wrap">
                                        <span className="fw-semibold small text-secondary">Post to</span>
                                        {["everyone", "admin"].map((aud) => (
                                            <Form.Check
                                                key={aud}
                                                type="radio"
                                                inline
                                                name="audience"
                                                id={`audience-${aud}`}
                                                label={aud === "everyone" ? "Everyone" : "Admins"}
                                                checked={composeState.audience === aud}
                                                onChange={() => setComposeState(prev => ({...prev, audience: aud as "everyone" | "admin"}))}
                                            />
                                        ))}
                                    </div>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="fw-semibold">Sections</Form.Label>
                                    <div className="d-flex flex-wrap gap-2">
                                        <Form.Select
                                            value=""
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (!val) return;
                                                setComposeState(prev => {
                                                    if (prev.folders.includes(val)) return prev;
                                                    return {...prev, folders: [...prev.folders, val]};
                                                });
                                            }}
                                        >
                                            <option value="">Select section...</option>
                                            {SECTION_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </Form.Select>
                                        <div className="d-flex flex-wrap gap-1">
                                            {composeState.folders.map((f) => {
                                                const label = SECTION_OPTIONS.find(o => o.value === f)?.label || f;
                                                return (
                                                    <Button
                                                        key={f}
                                                        size="sm"
                                                        variant="outline-secondary"
                                                        onClick={() => setComposeState(prev => ({...prev, folders: prev.folders.filter(x => x !== f)}))}
                                                    >
                                                        {label} ✕
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="fw-semibold">Attachments</Form.Label>
                                    <Form.Control
                                      type="file"
                                      multiple
                                      onChange={(e) => {
                                          const files = Array.from(e.target.files || []);
                                          setComposeState((prev) => ({...prev, files}));
                                      }}
                                    />
                                    {composeState.files.length > 0 && (
                                        <div className="text-secondary small mt-1">
                                            {composeState.files.length} file(s) selected
                                        </div>
                                    )}
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Title / Summary ({composeState.summary.length}/100)
                                    </Form.Label>
                                    <Form.Control
                                        placeholder="One-line summary"
                                        value={composeState.summary}
                                        onChange={(e) => setComposeState(prev => ({...prev, summary: e.target.value.slice(0, 100)}))}
                                        maxLength={100}
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="fw-semibold">Content</Form.Label>
                                    <div className="rich-editor">
                                        <ReactQuill
                                            theme="snow"
                                            value={composeState.details}
                                            onChange={(val) => setComposeState(prev => ({...prev, details: val}))}
                                        />
                                    </div>
                                </Form.Group>
                                    {postError && <div className="text-danger small">{postError}</div>}
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="primary"
                                            disabled={posting}
                                            onClick={async () => {
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
                                                    const resp = await createPost({
                                                        summary: composeState.summary,
                                                        details: composeState.details,
                                                        folders: composeState.folders.length ? composeState.folders : (activeFolder ? [activeFolder] : []),
                                                        postType: composeState.postType,
                                                        audience: composeState.audience,
                                                        visibility: "class",
                                                    });
                                                    const newPost = (resp as any)?.data || resp;
                                                    if (newPost?._id && composeState.files.length) {
                                                        try {
                                                            await (await import("../lib/api")).uploadPostAttachments(newPost._id, composeState.files);
                                                        } catch (err) {
                                                            console.error("Upload attachments failed", err);
                                                        }
                                                    }
                                                    await loadData();
                                                    if (newPost?._id) {
                                                        setSelectedId(newPost._id);
                                                    }
                                                    setComposeState({
                                                        summary: "",
                                                        details: "",
                                                        folders: [],
                                                        postType: "question",
                                                        audience: "everyone",
                                                        files: [],
                                                    });
                                                    setShowCompose(false);
                                                } catch (err: any) {
                                                    setPostError(err.message || "Failed to create post");
                                                } finally {
                                                    setPosting(false);
                                                }
                                            }}
                                        >
                                            {posting ? "Posting..." : "Post"}
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => {
                                                setComposeState({
                                                    summary: "",
                                                    details: "",
                                                    folders: [],
                                                    postType: "question",
                                                    audience: "everyone",
                                                    files: [],
                                                });
                                                setShowCompose(false);
                                            }}
                                            disabled={posting}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </Stack>
                            </CardBody>
                        </Card>
                    ) : (
                        <Card className="shadow-sm border-0">
                            <PostDetail
                                post={selectedPost}
                                folders={folders}
                            />
                        </Card>
                    )}
                </Col>
            </Row>
        </>
    );
}
