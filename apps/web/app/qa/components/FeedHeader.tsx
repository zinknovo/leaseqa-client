"use client";

import {Card, CardBody, ListGroup, ListGroupItem, Badge, Stack} from "react-bootstrap";
import {useRouter} from "next/navigation";
import {FeedHeaderProps} from "../types";
import {getFolderDisplayName} from "../utils";

export default function FeedHeader({folders, posts}: FeedHeaderProps) {
    const hotPosts = posts.slice(0, 4);
    const router = useRouter();
    return (
        <Card className="mb-1">
            <CardBody className="p-2">
                <h2 className="h6 mb-1">Hot posts</h2>
                <ListGroup>
                    {hotPosts.length > 0 ? hotPosts.map((post) => (
                        <ListGroupItem
                            key={post._id}
                            className="py-2 post-item-clickable"
                            onClick={() => router.push(`/qa/${post._id}`)}
                        >
                            <Stack direction="horizontal" gap={2} className="align-items-start justify-content-between flex-wrap mb-1">
                                <div className="fw-semibold flex-grow-1">{post.summary}</div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    {post.folders.map(f => getFolderDisplayName(folders, f)).filter(Boolean).slice(0, 2).map(name => (
                                        <Badge key={name} bg="light" text="dark" className="text-capitalize">
                                            {name}
                                        </Badge>
                                    ))}
                                    <Badge bg={post.urgency === "high" ? "danger" : post.urgency === "medium" ? "warning" : "secondary"}>
                                        {post.urgency || "low"}
                                    </Badge>
                                </div>
                            </Stack>
                            <div className="text-secondary small">
                                {(post.details || "").replace(/\s+/g, " ").slice(0, 120)}{(post.details || "").length > 120 ? "…" : ""}
                            </div>
                        </ListGroupItem>
                    )) : (
                        <ListGroupItem className="text-secondary">No posts yet.</ListGroupItem>
                    )}
                </ListGroup>
            </CardBody>
        </Card>
    );
}
