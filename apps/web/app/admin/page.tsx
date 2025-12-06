"use client";

import {useState} from "react";
import {Badge, Button, Card, Col, Form, ListGroup, Row, Stack,} from "react-bootstrap";

type Folder = {
    id: string;
    name: string;
    displayName: string;
};

const defaultFolders: Folder[] = [
    {id: "lease_review", name: "lease_review", displayName: "Lease Review"},
    {id: "security_deposit", name: "security_deposit", displayName: "Security Deposits"},
    {id: "maintenance", name: "maintenance", displayName: "Maintenance Duties"},
    {id: "eviction", name: "eviction", displayName: "Evictions & Terminations"},
    {id: "utilities", name: "utilities", displayName: "Utilities"},
    {id: "roommate_disputes", name: "roommate_disputes", displayName: "Roommate Disputes"},
    {id: "lease_termination", name: "lease_termination", displayName: "Early Termination"},
    {id: "rent_increase", name: "rent_increase", displayName: "Rent Increases"},
    {id: "other", name: "other", displayName: "Other"},
];

export default function AdminPage() {
    const [folders, setFolders] = useState<Folder[]>(defaultFolders);
    const [newFolder, setNewFolder] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState("");

    const handleAddFolder = () => {
        if (!newFolder.trim()) return;
        setFolders((prev) => [
            ...prev,
            {id: crypto.randomUUID(), name: newFolder.trim(), displayName: newFolder.trim()},
        ]);
        setNewFolder("");
    };

    const handleDelete = (id: string) => {
        setFolders((prev) => prev.filter((folder) => folder.id !== id));
    };

    const handleStartEdit = (folder: Folder) => {
        setEditingId(folder.id);
        setEditingValue(folder.displayName);
    };

    const handleSaveEdit = () => {
        if (!editingId) return;
        setFolders((prev) =>
            prev.map((folder) =>
                folder.id === editingId
                    ? {...folder, displayName: editingValue.trim() || folder.displayName}
                    : folder,
            ),
        );
        setEditingId(null);
        setEditingValue("");
    };

    return (
        <div className="mb-4">
            <Card className="mb-3 card-base">
                <Card.Body>
                    <div className="pill mb-2">Operations</div>
                    <h1 className="h4 fw-bold">Admin console</h1>
                    <p className="text-secondary mb-0">
                        Maintain folders/topics to keep the Piazza-style board tidy.
                    </p>
                </Card.Body>
            </Card>

            <Row className="g-3 mb-3">
                <Col md={4}>
                    <AdminStat label="Posts pending review" value="6"/>
                </Col>
                <Col md={4}>
                    <AdminStat label="Reports to triage" value="2"/>
                </Col>
                <Col md={4}>
                    <AdminStat label="New users (7d)" value="38"/>
                </Col>
            </Row>

            <Card className="card-base">
                <Card.Body>
                    <Stack
                        direction="horizontal"
                        className="justify-content-between flex-wrap gap-2"
                    >
                        <div>
                            <div className="pill mb-1">Manage Folders</div>
                            <div className="text-secondary small">
                                Nine defaults cover rental topics. Add, rename, remove as needed.
                            </div>
                        </div>
                        <Button size="sm" variant="outline-secondary">
                            Sync to database
                        </Button>
                    </Stack>

                    <Stack direction="horizontal" gap={2} className="mt-3 flex-wrap">
                        <Form.Control
                            placeholder="New folder name, e.g., Lease Extension"
                            value={newFolder}
                            onChange={(event) => setNewFolder(event.target.value)}
                        />
                        <Button onClick={handleAddFolder} variant="danger">
                            Add
                        </Button>
                    </Stack>

                    <ListGroup className="mt-3" variant="flush">
                        {folders.map((folder) => {
                            const editing = editingId === folder.id;
                            return (
                                <ListGroup.Item key={folder.id} className="d-flex gap-3 align-items-center">
                                    <Badge bg="secondary">{folder.displayName.slice(0, 2)}</Badge>
                                    <div className="flex-grow-1">
                                        {editing ? (
                                            <Form.Control
                                                value={editingValue}
                                                onChange={(event) => setEditingValue(event.target.value)}
                                                size="sm"
                                            />
                                        ) : (
                                            <div className="fw-semibold">{folder.displayName}</div>
                                        )}
                                        <div className="text-secondary small">{folder.name}</div>
                                    </div>
                                    <Stack direction="horizontal" gap={2}>
                                        {editing ? (
                                            <>
                                                <Button size="sm" variant="primary" onClick={handleSaveEdit}>
                                                    Save
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    onClick={() => setEditingId(null)}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    onClick={() => handleStartEdit(folder)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => handleDelete(folder.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </Stack>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    );
}

function AdminStat({label, value}: { label: string; value: string }) {
    return (
        <Card className="card-base">
            <Card.Body>
                <div className="text-secondary small text-uppercase">{label}</div>
                <div className="fs-3 fw-bold">{value}</div>
            </Card.Body>
        </Card>
    );
}
