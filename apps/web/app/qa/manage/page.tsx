"use client";

import {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import {Alert, Badge, Button, Card, CardBody, Col, Form, Row, Stack, Table} from "react-bootstrap";
import {createFolder, deleteFolder, fetchFoldersApi, updateFolder} from "@/app/lib/api";
import {RootState} from "@/app/store";
import {Folder} from "../types";

type FolderDraft = {
    name: string;
    displayName: string;
    description?: string;
    color?: string;
};

export default function ManageSectionsPage() {
    const router = useRouter();
    const session = useSelector((state: RootState) => state.session);
    const isAdmin = session.user?.role === "admin";

    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [drafts, setDrafts] = useState<Record<string, FolderDraft>>({});
    const [newFolder, setNewFolder] = useState<FolderDraft>({
        name: "",
        displayName: "",
        description: "",
        color: "",
    });

    const sortedFolders = useMemo(
        () => [...folders].sort((a, b) => a.displayName.localeCompare(b.displayName)),
        [folders]
    );

    const loadFolders = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await fetchFoldersApi();
            const data = (res as any)?.data || res || [];
            setFolders(data);
        } catch (err: any) {
            setError(err.message || "Failed to load sections");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            loadFolders();
        }
    }, [isAdmin]);

    if (!isAdmin) {
        return (
            <Card className="card-base">
                <CardBody className="p-4">
                    <div className="h5 mb-2">Admin only</div>
                    <div className="text-secondary mb-3">You need admin permissions to manage sections.</div>
                    <Button variant="primary" onClick={() => router.push("/qa")}>Back to Q&amp;A</Button>
                </CardBody>
            </Card>
        );
    }

    const handleDraftChange = (id: string, field: keyof FolderDraft, value: string) => {
        setDrafts((prev) => ({
            ...prev,
            [id]: {
                ...(prev[id] || {}),
                name: prev[id]?.name || folders.find((f) => f._id === id)?.name || "",
                displayName: prev[id]?.displayName || folders.find((f) => f._id === id)?.displayName || "",
                description: prev[id]?.description ?? folders.find((f) => f._id === id)?.description ?? "",
        color: prev[id]?.color ?? folders.find((f) => f._id === id)?.color,
        [field]: value,
    },
}));
    };

    const handleSaveNew = async () => {
        setError("");
        setSuccess("");
        if (!newFolder.name.trim() || !newFolder.displayName.trim()) {
            setError("Name and Display Name are required.");
            return;
        }
        try {
            await createFolder({
                name: newFolder.name.trim(),
                displayName: newFolder.displayName.trim(),
                description: newFolder.description?.trim() || "",
        color: newFolder.color || undefined,
            });
            setNewFolder({name: "", displayName: "", description: "", color: "#5c6ac4"});
            setSuccess("Section created.");
            loadFolders();
        } catch (err: any) {
            setError(err.message || "Failed to create section");
        }
    };

    const handleSaveEdit = async (id: string) => {
        setError("");
        setSuccess("");
        const draft = drafts[id];
        if (!draft || !draft.displayName?.trim()) {
            setError("Display Name is required.");
            return;
        }
        try {
            await updateFolder(id, {
                displayName: draft.displayName.trim(),
                description: draft.description?.trim() || "",
                color: draft.color,
            });
            setEditingId(null);
            setDrafts((prev) => {
                const next = {...prev};
                delete next[id];
                return next;
            });
            setSuccess("Section updated.");
            loadFolders();
        } catch (err: any) {
            setError(err.message || "Failed to update section");
        }
    };

    const handleDelete = async (id: string) => {
        setError("");
        setSuccess("");
        const target = folders.find((f) => f._id === id);
        const ok = window.confirm(`Delete section "${target?.displayName || ""}"?`);
        if (!ok) return;
        try {
            await deleteFolder(id);
            setSuccess("Section deleted.");
            loadFolders();
        } catch (err: any) {
            setError(err.message || "Failed to delete section");
        }
    };

    return (
        <div className="d-grid gap-2">
            <Card className="card-base">
                <CardBody className="p-3">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                        <div>
                            <div className="h5 mb-1">Manage sections</div>
                            <div className="text-secondary small">
                                Control the scenario buckets used across Q&amp;A. Deleting a section moves its posts into "Uncategorized".
                            </div>
                        </div>
                        <Button variant="outline-secondary" size="sm" onClick={loadFolders} disabled={loading}>
                            Refresh
                        </Button>
                    </div>

                    {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                    {success && <Alert variant="success" className="py-2">{success}</Alert>}

                    <Row className="g-2">
                        <Col lg={6}>
                            <Card className="h-100 card-base">
                                <CardBody className="p-3">
                                    <div className="fw-semibold mb-2">Create section</div>
                                    <Stack gap={2}>
                                        <Form.Group>
                                            <Form.Label className="small fw-semibold">Name (slug)</Form.Label>
                                            <Form.Control
                                                placeholder="e.g. repairs"
                                                value={newFolder.name}
                                                onChange={(e) => setNewFolder((prev) => ({...prev, name: e.target.value.trim()}))}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="small fw-semibold">Display name</Form.Label>
                                            <Form.Control
                                                placeholder="Repairs & Habitability"
                                                value={newFolder.displayName}
                                                onChange={(e) => setNewFolder((prev) => ({...prev, displayName: e.target.value}))}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="small fw-semibold">Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                placeholder="Optional helper text"
                                                value={newFolder.description}
                                                onChange={(e) => setNewFolder((prev) => ({...prev, description: e.target.value}))}
                                            />
                                        </Form.Group>
                                        <div className="d-flex gap-2">
                                            <Button size="sm" onClick={handleSaveNew} disabled={loading}>
                                                Save
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={() => {
                                                    setNewFolder({name: "", displayName: "", description: "", color: "#5c6ac4"});
                                                    setError("");
                                                }}
                                                disabled={loading}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </Stack>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card className="h-100 card-base">
                                <CardBody className="p-3">
                                    <div className="fw-semibold mb-2">Existing sections</div>
                                    {!sortedFolders.length ? (
                                        <div className="text-secondary small">No sections found.</div>
                                    ) : (
                                        <Table hover responsive bordered size="sm" className="align-middle mb-0">
                                            <thead>
                                            <tr>
                                                <th>Display name</th>
                                                <th>Slug</th>
                                                <th>Description</th>
                                                <th className="table-actions-col">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {sortedFolders.map((folder) => {
                                                const editing = editingId === folder._id;
                                                const draft = drafts[folder._id] || {
                                                    name: folder.name,
                                                    displayName: folder.displayName,
                                                    description: folder.description,
                                                    color: folder.color,
                                                };
                                                const locked = folder.name === "uncategorized";
                                                return (
                                                    <tr key={folder._id}>
                                                        <td>
                                                            {editing ? (
                                                                <Form.Control
                                                                    size="sm"
                                                                    value={draft.displayName}
                                                                    onChange={(e) => handleDraftChange(folder._id, "displayName", e.target.value)}
                                                                />
                                                            ) : (
                                                                <span className="fw-semibold">{folder.displayName}</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <Badge bg="light" text="dark">{folder.name}</Badge>
                                                        </td>
                                                        <td className="table-description-col">
                                                            {editing ? (
                                                                <Form.Control
                                                                    size="sm"
                                                                    as="textarea"
                                                                    rows={2}
                                                                    value={draft.description}
                                                                    onChange={(e) => handleDraftChange(folder._id, "description", e.target.value)}
                                                                />
                                                            ) : (
                                                                <span className="text-secondary small">{folder.description || "—"}</span>
                                                            )}
                                                        </td>
                                                        <td className="text-end">
                                                            <Stack direction="horizontal" gap={1} className="justify-content-end">
                                                                {editing ? (
                                                                    <>
                                                                        <Button size="sm" onClick={() => handleSaveEdit(folder._id)} disabled={loading}>
                                                                            Save
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline-secondary"
                                                                            onClick={() => {
                                                                                setEditingId(null);
                                                                                setDrafts((prev) => {
                                                                                    const next = {...prev};
                                                                                    delete next[folder._id];
                                                                                    return next;
                                                                                });
                                                                            }}
                                                                            disabled={loading}
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Button size="sm" variant="outline-secondary" onClick={() => setEditingId(folder._id)}>
                                                                            Edit
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline-danger"
                                                                            onClick={() => handleDelete(folder._id)}
                                                                            disabled={loading || locked}
                                                                            title={locked ? "Default section cannot be deleted" : undefined}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </Stack>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </Table>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </div>
    );
}
