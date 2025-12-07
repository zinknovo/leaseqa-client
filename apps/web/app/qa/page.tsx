"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Col, Row} from "react-bootstrap";

import {Folder, Post} from "./types";
import {ComposeState, INITIAL_COMPOSE_STATE} from "./constants";
import * as client from "./client";

import ScenarioFilter from "./components/ScenarioFilter";
import QAToolbar from "./components/QAToolbar";
import RecencySidebar from "./components/RecencySidebar";
import FeedHeader from "./components/FeedHeader";
import ComposeForm from "./components/ComposeForm";
import PostDetail from "./components/PostDetail";

export default function QAPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const scenario = searchParams.get("scenario") || "all";
    const searchParam = searchParams.get("search") || "";
    const composeParam = searchParams.get("compose") === "1";

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
        setShowCompose(composeParam);
        setSearch(searchParam);
    }, [composeParam, searchParam, scenario]);

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

    const handleSelectPost = (id: string) => {
        setSelectedId(id);
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
            if (newPost?._id) setSelectedId(newPost._id);
            resetCompose();
        } catch (err: any) {
            setPostError(err.message || "Failed to create post");
        } finally {
            setPosting(false);
        }
    };

    const selectedPost = posts.find(p => p._id === selectedId) || null;
    const folderDisplayMap = useMemo(() => {
        return folders.reduce<Record<string, string>>((acc, f) => {
            acc[f.name] = f.displayName || f.name;
            return acc;
        }, {});
    }, [folders]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center loading-min-height">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status"/>
                    <div className="text-secondary">Loading Posts...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <ScenarioFilter/>
            <QAToolbar initialSearch={searchParam} onSearchChange={setSearch}/>

            <Row className="g-3 mx-0">
                {sidebarOpen && (
                    <Col lg={3} className="px-1">
                        <RecencySidebar
                            posts={filteredPosts}
                            currentPostId={selectedId}
                            onSelectPost={handleSelectPost}
                            folderDisplayMap={folderDisplayMap}
                            bucketOpen={bucketOpen}
                            onToggleBucket={(key) => setBucketOpen(prev => ({...prev, [key]: !prev[key]}))}
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
                            folders={folders}
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
