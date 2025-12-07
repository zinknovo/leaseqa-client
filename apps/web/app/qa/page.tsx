"use client";

import {useEffect, useMemo, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Col, Row} from "react-bootstrap";
import {FaPlus, FaSearch} from "react-icons/fa";

import {Folder, Post} from "./types";
import {ComposeState, INITIAL_COMPOSE_STATE} from "./constants";
import * as client from "./client";

import ScenarioFilter from "./components/ScenarioFilter";
import PostSidebar from "./components/PostSidebar";
import FeedHeader from "./components/FeedHeader";
import ComposeForm from "./components/ComposeForm";
import PostDetail from "./components/PostDetail";

export default function QAPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const scenario = searchParams.get("scenario") || "all";
    const currentRouteId = pathname?.startsWith("/qa/") ? pathname.split("/").pop() || null : null;

    const [folders, setFolders] = useState<Folder[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [sidebarOpen] = useState(true);
    const [showCompose, setShowCompose] = useState(false);
    const [posting, setPosting] = useState(false);
    const [postError, setPostError] = useState("");
    const [composeState, setComposeState] = useState<ComposeState>(INITIAL_COMPOSE_STATE);
    const [bucketOpen, setBucketOpen] = useState<Record<string, boolean>>({
        thisWeek: true,
        lastWeek: false,
        thisMonth: false,
        earlier: false,
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        setShowCompose(false);
    }, [scenario]);

    const loadData = async () => {
        try {
            setLoading(true);
            const foldersResponse = await client.fetchFolders();
            setFolders(foldersResponse.data || []);
            const postsResponse = await client.fetchPosts({});
            setPosts(postsResponse.data || []);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
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
    }, [posts, search, scenario]);

    const groupedPosts = useMemo(() => {
        const now = new Date();
        const buckets: Record<string, {label: string; items: Post[]}> = {
            thisWeek: {label: "This week", items: []},
            lastWeek: {label: "Last week", items: []},
            thisMonth: {label: "Earlier this month", items: []},
            earlier: {label: "Earlier", items: []},
        };
        const sorted = [...filteredPosts].sort((a, b) => {
            const da = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const db = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return db - da;
        });
        sorted.forEach((post) => {
            const created = new Date(post.createdAt || post.updatedAt || 0);
            const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays <= 6) buckets.thisWeek.items.push(post);
            else if (diffDays <= 13) buckets.lastWeek.items.push(post);
            else if (diffDays <= 30) buckets.thisMonth.items.push(post);
            else buckets.earlier.items.push(post);
        });
        return buckets;
    }, [filteredPosts]);

    const handleSelectPost = (post: Post) => {
        setSelectedId(post._id);
        router.push(`/qa/${post._id}`);
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
                visibility: "class",
            });
            const newPost = (resp as any)?.data || resp;
            if (newPost?._id && composeState.files.length) {
                await client.uploadPostAttachments(newPost._id, composeState.files).catch(console.error);
            }
            await loadData();
            if (newPost?._id) setSelectedId(newPost._id);
            resetCompose();
        } catch (err: any) {
            setPostError(err.message || "Failed to create post");
        } finally {
            setPosting(false);
        }
    };

    const selectedPost = posts.find(p => p._id === selectedId) || null;

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

    return (
        <>
            <ScenarioFilter/>

            <div className="qa-toolbar">
                <div className="qa-toolbar-search">
                    <FaSearch size={14} className="qa-toolbar-search-icon"/>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="qa-toolbar-btn primary" onClick={() => {
                    setShowCompose(true);
                    setSelectedId(null);
                }}>
                    <FaPlus size={12}/>
                    <span>New Post</span>
                </button>
            </div>

            <Row className="g-3 mx-0">
                {sidebarOpen && (
                    <Col lg={3} className="px-1">
                        <PostSidebar
                            groupedPosts={groupedPosts}
                            bucketOpen={bucketOpen}
                            selectedId={selectedId}
                            currentRouteId={currentRouteId}
                            onToggleBucket={(key) => setBucketOpen(prev => ({...prev, [key]: !prev[key]}))}
                            onSelectPost={handleSelectPost}
                        />
                    </Col>
                )}

                <Col lg={sidebarOpen ? 9 : 12} className="px-1">
                    {!showCompose && (
                        <FeedHeader
                            folders={folders}
                            posts={posts}
                            activeFolder={scenario === "all" ? null : scenario}
                            onSelectFolderAction={() => {}}
                        />
                    )}

                    {showCompose ? (
                        <ComposeForm
                            composeState={composeState}
                            posting={posting}
                            postError={postError}
                            onUpdate={(updates) => setComposeState(prev => ({...prev, ...updates}))}
                            onSubmit={handleSubmitPost}
                            onCancel={resetCompose}
                        />
                    ) : (
                        <PostDetail post={selectedPost} folders={folders}/>
                    )}
                </Col>
            </Row>
        </>
    );
}
