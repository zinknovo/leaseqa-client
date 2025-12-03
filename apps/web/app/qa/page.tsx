"use client";

import {useEffect, useMemo, useState} from "react";
import {Badge, Button, Card, CardBody, Col, FormControl, ListGroup, ListGroupItem, Row, Stack} from "react-bootstrap";
import {Folder, Post} from "./types";
import * as client from "./client";
import StatsCard from "./components/StatsCard";
import FeedHeader from "./components/FeedHeader";

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

    const getFolderDisplayName = (folderName: string) => {
        const folder = folders.find(f => f.name === folderName);
        return folder?.displayName || folderName;
    };

    const getPostCount = (folderName: string) => {
        return posts.filter(post => post.folders.includes(folderName)).length;
    };

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
                                    key={folder._id}
                                    action
                                    active={folder.name === activeFolder}
                                    onClick={() => setActiveFolder(folder.name)}
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>{folder.displayName}</span>
                                        <Badge bg="light" text="dark">
                                            {getPostCount(folder.name)}
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
                                            .map(f => getFolderDisplayName(f)).join(" · ")}
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
                <StatsCard/>
            </Col>

            <Col lg={8}>
                <Card className="mb-3">
                    <CardBody className="py-2">
                        <Stack
                            direction="horizontal"
                            className="justify-content-start flex-wrap gap-2"
                        >
                            <Button href="/qa" size="sm" variant="link">
                                QA
                            </Button>
                            <Button href="/qa/resources" size="sm" variant="link">
                                Resources
                            </Button>
                            <Button href="/qa/stats" size="sm" variant="link">
                                Stats
                            </Button>
                        </Stack>
                    </CardBody>
                </Card>
                <FeedHeader
                    folders={folders}
                    posts={posts}
                    activeFolder={activeFolder}
                    onSelectFolder={setActiveFolder}
                />
                <Card>
                    <CardBody>
                        {selectedPost ? (
                            <>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <Badge bg={selectedPost.urgency === "high" ? "danger" : "secondary"}>
                                        {selectedPost.urgency}
                                    </Badge>
                                    <span className="text-secondary small">
                                        {selectedPost.folders
                                            .map(f => getFolderDisplayName(f))
                                            .join(" · ")} · {new Date(selectedPost.createdAt)
                                        .toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="h5 fw-semibold">{selectedPost.summary}</h3>
                                <p className="text-secondary">{selectedPost.details}</p>

                                <Stack direction="horizontal" gap={2} className="flex-wrap mt-3">
                                    <Button size="sm" variant="primary">
                                        Open thread
                                    </Button>
                                    <Button href="/qa/new" size="sm" variant="outline-secondary">
                                        Reply
                                    </Button>
                                </Stack>
                            </>
                        ) : (
                            <div className="text-secondary">Select a post to view details.</div>
                        )}
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}