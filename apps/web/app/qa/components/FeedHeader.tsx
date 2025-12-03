"use client";
import {Button, Card, CardBody, Col, ListGroup, ListGroupItem, Row, Stack} from "react-bootstrap";
import {FeedHeaderProps} from "../types";

export default function FeedHeader({folders, posts, activeFolder, onSelectFolder}: FeedHeaderProps) {
    const getFolderDisplayName = (folderName: string) => {
        const folder = folders.find(f => f.name === folderName);
        return folder?.displayName || folderName;
    };

    return (
        <Card className="mb-3">
            <CardBody>
                <Stack
                    direction="horizontal"
                    className="justify-content-between align-items-center flex-wrap gap-3"
                >
                    <div>
                        <div className="pill mb-1">QA · Piazza style</div>
                        <h2 className="h5 mb-0">Feed & hot posts</h2>
                    </div>
                    <Stack direction="horizontal" gap={2}>
                        <Button href="/qa/new" size="sm" variant="danger">
                            New Post
                        </Button>
                        <Button href="/ai-review" size="sm" variant="outline-secondary">
                            Attach AI review
                        </Button>
                    </Stack>
                </Stack>

                <Row className="g-3 mt-3">
                    <Col md={6}>
                        <div className="small text-secondary mb-2">Filter by case type</div>
                        <ListGroup>
                            {folders.map(folder => (
                                <ListGroupItem
                                    key={folder.name}
                                    action
                                    active={folder.name === activeFolder}
                                    onClick={() => onSelectFolder(folder.name)}
                                >
                                    {folder.displayName}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={6}>
                        <div className="small text-secondary mb-2">Hot posts</div>
                        <ListGroup>
                            {posts.slice(0, 3).map(post => (
                                <ListGroupItem key={post._id}>
                                    <div className="fw-semibold">{post.summary}</div>
                                    <div className="text-secondary small">
                                        {getFolderDisplayName(post.folders[0])}
                                    </div>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}