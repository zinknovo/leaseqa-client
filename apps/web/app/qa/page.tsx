"use client";

import {useEffect, useMemo, useState} from "react";
import {Badge, Button, Card, CardBody, Col, FormControl, ListGroup, ListGroupItem, Row, Stack} from "react-bootstrap";
import {Folder, Post} from "./types";
import * as client from "./client";
import {getFolderDisplayName, getPostCount} from "./utils";
import StatsCard from "./components/StatsCard";
import NavTabs from "./components/NavTabs";
import FeedHeader from "./components/FeedHeader";
import PostDetail from "./components/PostDetail";

export default function QAPage() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [activeFolder, setActiveFolder] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

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

            if (postsData.length > 0) {
                setSelectedId(postsData[0]._id);
            }
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
            return true;
        });
    }, [posts, activeFolder, search]);

    const selectedPost = posts.find(p => p._id === selectedId) || null;

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Row className="g-4">
            <Col lg={4}>
                <Card className="mb-3">
                    <CardBody>
                        <Stack direction="horizontal" className="mb-3">
                            <div className="pill">New</div>
                            <div className="ms-auto">
                                <Button href="/qa/new" size="sm" variant="danger">
                                    New Post
                                </Button>
                            </div>
                        </Stack>

                        <FormControl
                            placeholder="Search posts"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mb-3"
                        />

                        <div className="small text-secondary mb-2">Folders</div>
                        <ListGroup className="mb-3">
                            {folders.map(folder => (
                                <ListGroupItem
                                    key={folder.name}
                                    action
                                    active={folder.name === activeFolder}
                                    onClick={() => setActiveFolder(folder.name)}
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>{folder.displayName}</span>
                                        <Badge bg="light" text="dark">
                                            {getPostCount(posts, folder.name)}
                                        </Badge>
                                    </div>
                                </ListGroupItem>
                            ))}
                        </ListGroup>

                        <div className="small text-secondary mb-2">Recent</div>
                        <ListGroup>
                            {filteredPosts.length > 0 ? (
                                filteredPosts.slice(0, 3).map(post => (
                                    <ListGroupItem
                                        key={post._id}
                                        action
                                        active={post._id === selectedId}
                                        onClick={() => setSelectedId(post._id)}
                                    >
                                        <div className="fw-semibold">{post.summary}</div>
                                        <div className="text-secondary small">
                                            {new Date(post.createdAt).toLocaleDateString()} · {post.folders
                                            .map(f => getFolderDisplayName(folders, f))
                                            .join(" · ")}
                                        </div>
                                    </ListGroupItem>
                                ))
                            ) : (
                                <ListGroupItem className="text-secondary">
                                    No posts in this folder.
                                </ListGroupItem>
                            )}
                        </ListGroup>
                    </CardBody>
                </Card>
                {/*TODO: change to admin only*/}
                <StatsCard/>
            </Col>

            <Col lg={8}>
                <NavTabs active="qa" />
                <FeedHeader
                    folders={folders}
                    posts={posts}
                    activeFolder={activeFolder}
                    onSelectFolderAction={setActiveFolder}
                />
                <PostDetail
                    post={selectedPost}
                    folders={folders}
                />
            </Col>
        </Row>
    );
}