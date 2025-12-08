"use client";

import {Suspense, useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useSelector} from "react-redux";
import {Col, Row} from "react-bootstrap";

import {RootState} from "@/app/store";
import {Folder, Post} from "./types";
import {ComposeState, INITIAL_COMPOSE_STATE} from "./constants";
import * as client from "./client";

import ScenarioFilter from "./components/ScenarioFilter";
import QAToolbar from "./components/QAToolbar";
import RecencySidebar from "./components/RecencySidebar";
import FeedHeader from "./components/FeedHeader";
import AnnouncementSection from "./components/AnnouncementSection";
import ComposeForm from "./components/ComposeForm";
import PinPostsSection from "./components/PinPostsSection";
import PostDetailSection from "./components/PostDetailSection";

function QAPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session = useSelector((state: RootState) => state.session);

    const scenario = searchParams.get("scenario") || "all";
    const searchParam = searchParams.get("search") || "";
    const composeParam = searchParams.get("compose") === "1";
    const postIdParam = searchParams.get("post");

    const [folders, setFolders] = useState<Folder[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [postError, setPostError] = useState("");
    const [composeState, setComposeState] = useState<ComposeState>(INITIAL_COMPOSE_STATE);
    const [showResolved, setShowResolved] = useState(false);
    const [bucketOpen, setBucketOpen] = useState<Record<string, boolean>>({
        thisWeek: true,
        lastWeek: false,
        thisMonth: false,
        earlier: false,
    });

    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.replace("/auth/login");
        } else if (session.status === "authenticated" || session.status === "guest") {
            loadData();
        }
    }, [session.status, router]);

    useEffect(() => {
        setSearch(searchParam);
    }, [searchParam, scenario]);

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
            // Resolved toggle now means "show resolved only" when on; otherwise show unresolved
            if (showResolved && !post.isResolved) return false;
            if (!showResolved && post.isResolved) return false;

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

    const handleSelectPost = (id: string) => {
        router.push(`/qa?post=${id}`);
    };

    const handleClosePost = () => {
        router.push("/qa");
    };

    const resetCompose = () => {
        setComposeState(INITIAL_COMPOSE_STATE);
        setPostError("");
        router.push("/qa");
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
                isAnonymous: composeState.isAnonymous,
                            });
            const newPost = (resp as any)?.data || resp;
            if (newPost?._id && composeState.files.length) {
                await client.uploadPostAttachments(newPost._id, composeState.files).catch(console.error);
            }
            await loadData();
            resetCompose();
            if (newPost?._id) {
                router.push(`/qa?post=${newPost._id}`);
            }
        } catch (err: any) {
            setPostError(err.message || "Failed to create post");
        } finally {
            setPosting(false);
        }
    };

    const folderDisplayMap = useMemo(() => {
        return folders.reduce<Record<string, string>>((acc, f) => {
            acc[f.name] = f.displayName || f.name;
            return acc;
        }, {});
    }, [folders]);

    if (session.status === "loading" || session.status === "unauthenticated") {
        return (
            <div className="d-flex justify-content-center align-items-center loading-min-height">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status"/>
                    <div className="text-secondary">
                        {session.status === "loading" ? "Loading..." : "Redirecting to login..."}
                    </div>
                </div>
            </div>
        );
    }

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

    const showFeed = !composeParam && !postIdParam;

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
                <Col lg={3} className="px-1">
                    <RecencySidebar
                        posts={filteredPosts}
                        currentPostId={postIdParam}
                        onSelectPost={handleSelectPost}
                        folderDisplayMap={folderDisplayMap}
                        bucketOpen={bucketOpen}
                        onToggleBucket={(key) => setBucketOpen(prev => ({...prev, [key]: !prev[key]}))}
                    />
                </Col>

                <Col lg={9} className="px-1">
                    {showFeed && (
                        <>
                            <PinPostsSection posts={filteredPosts} folders={folders}/>
                            <AnnouncementSection posts={filteredPosts} folders={folders}/>
                            <FeedHeader folders={folders} posts={filteredPosts}/>
                        </>
                    )}

                    {composeParam && (
                        <ComposeForm
                            composeState={composeState}
                            folders={folders}
                            posting={posting}
                            postError={postError}
                            onUpdate={(updates) => setComposeState(prev => ({...prev, ...updates}))}
                            onSubmit={handleSubmitPost}
                            onCancel={resetCompose}
                        />
                    )}

                    {postIdParam && (
                        <PostDetailSection
                            postId={postIdParam}
                            folders={folders}
                            onClose={handleClosePost}
                        />
                    )}
                </Col>
            </Row>
        </>
    );
}

export default function QAPage() {
    return (
        <Suspense
            fallback={
                <div className="d-flex justify-content-center align-items-center loading-min-height">
                    <div className="text-center text-secondary small">Loading Q&A…</div>
                </div>
            }
        >
            <QAPageInner/>
        </Suspense>
    );
}
