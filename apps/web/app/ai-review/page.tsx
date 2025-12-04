"use client";

import { useEffect, useRef, useState } from "react";
import { Badge, Button, Card, CardBody, Col, Form, ListGroup, ListGroupItem, Row, Spinner, Stack } from "react-bootstrap";
import { FaCloudUploadAlt, FaHistory, FaRobot } from "react-icons/fa";
import { AIReview, ReviewState } from "./types";
import RiskCard from "./RiskCard";
import ToastNotification, { ToastData } from "./ToastNotification";
import * as client from "./client";

export default function AIReviewPage() {
    const [state, setState] = useState<ReviewState>({ status: "idle" });
    const [fileName, setFileName] = useState<string>("");
    const [reviews, setReviews] = useState<AIReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<ToastData>({
        show: false,
        message: "",
        type: "error"
    });
    const contractTextRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const response = await client.fetchReviews();
            setReviews(response.data || response || []);
        } catch (error) {
            console.error("Failed to load reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ show: true, message, type });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setState({ status: "uploading" });

        const formData = new FormData(event.currentTarget);
        const contractText = contractTextRef.current?.value || "";

        if (contractText) {
            formData.set("contractText", contractText);
        }
        formData.set("contractType", "residential");

        try {
            const response = await client.createReview(formData);
            const review = response.data || response;
            const aiResponse = review?.aiResponse;

            setState({
                status: "success",
                summary: aiResponse?.summary || "Lease reviewed. See below for rubric-aligned risk notes.",
                highRisk: aiResponse?.highRisk || [],
                mediumRisk: aiResponse?.mediumRisk || [],
                lowRisk: aiResponse?.lowRisk || [],
                chat: [
                    {
                        author: "assistant",
                        body: aiResponse?.recommendations?.join(" ") || "Review complete. Check the risk cards for details.",
                    },
                ],
            });

            showToast("Review completed successfully!", "success");
            loadReviews();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unable to process review";
            setState({ status: "idle" });
            showToast(message, "error");
        }
    };

    return (
        <>
            <ToastNotification
                toast={toast}
                onClose={() => setToast({ ...toast, show: false })}
            />

            <Row className="g-4">
                <Col lg={8}>
                    <Card
                        className="border-0 shadow-sm"
                        style={{ borderRadius: "1rem", overflow: "hidden" }}
                    >
                        <CardBody className="p-4">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle"
                                    style={{
                                        width: 48,
                                        height: 48,
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                    }}
                                >
                                    <FaRobot className="text-white" size={20} />
                                </div>
                                <div>
                                    <h1 className="h4 fw-bold mb-0">AI Lease Review</h1>
                                    <div className="text-secondary small">Upload or paste your lease for analysis</div>
                                </div>
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <div
                                    className="p-4 rounded-3 mb-4 text-center"
                                    style={{
                                        background: "#f8f9fa",
                                        border: "2px dashed #dee2e6",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => document.getElementById("fileUpload")?.click()}
                                >
                                    <FaCloudUploadAlt size={36} className="text-secondary mb-2" />
                                    <div className="fw-semibold">
                                        {fileName || "Drop your lease PDF here"}
                                    </div>
                                    <div className="text-secondary small">or click to browse (max 8MB)</div>
                                    <Form.Control
                                        type="file"
                                        name="file"
                                        id="fileUpload"
                                        accept="application/pdf"
                                        onChange={(e) => setFileName((e.target as HTMLInputElement).files?.[0]?.name || "")}
                                        className="d-none"
                                    />
                                </div>

                                <div className="d-flex align-items-center mb-3">
                                    <div style={{ flex: 1, height: 1, background: "#dee2e6" }} />
                                    <span className="px-3 text-secondary small">OR</span>
                                    <div style={{ flex: 1, height: 1, background: "#dee2e6" }} />
                                </div>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Paste lease text</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="contractText"
                                        ref={contractTextRef}
                                        rows={5}
                                        placeholder="Paste clauses for review..."
                                        style={{ borderRadius: "0.75rem" }}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <span className="text-secondary small">
                                        For risk analysis only. Not stored long term.
                                    </span>
                                    <Button
                                        type="submit"
                                        variant="danger"
                                        disabled={state.status === "uploading"}
                                        style={{ borderRadius: "2rem", padding: "0.5rem 1.5rem" }}
                                    >
                                        {state.status === "uploading" ? (
                                            <>
                                                <Spinner size="sm" className="me-2" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            "Start Review"
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>

                    {state.status === "success" && (
                        <Card
                            className="mt-4 border-0 shadow-sm"
                            style={{ borderRadius: "1rem", overflow: "hidden" }}
                        >
                            <CardBody className="p-4">
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <Badge bg="success" className="px-3 py-2" style={{ borderRadius: "2rem" }}>
                                        ✓ Review Complete
                                    </Badge>
                                </div>

                                <h5 className="fw-bold mb-2">Summary</h5>
                                <p
                                    className="text-secondary p-3 rounded-3 mb-4"
                                    style={{ background: "#f8f9fa" }}
                                >
                                    {state.summary}
                                </p>

                                <Row className="g-3 mb-4">
                                    <Col md={4}>
                                        <RiskCard tone="danger" title="High Risk" items={state.highRisk} />
                                    </Col>
                                    <Col md={4}>
                                        <RiskCard tone="warning" title="Medium Risk" items={state.mediumRisk} />
                                    </Col>
                                    <Col md={4}>
                                        <RiskCard tone="success" title="Low Risk" items={state.lowRisk} />
                                    </Col>
                                </Row>

                                <h6 className="fw-bold mb-2">Recommendations</h6>
                                <div
                                    className="rounded-3 p-3 mb-4"
                                    style={{ background: "#f8f9fa" }}
                                >
                                    {state.chat.map((msg, idx) => (
                                        <div key={idx} className="d-flex gap-3">
                                            <div
                                                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                                }}
                                            >
                                                <FaRobot className="text-white" size={14} />
                                            </div>
                                            <div className="text-secondary small">{msg.body}</div>
                                        </div>
                                    ))}
                                </div>

                                <Stack direction="horizontal" gap={2} className="flex-wrap">
                                    <Button variant="outline-secondary" style={{ borderRadius: "2rem" }}>
                                        Download Report
                                    </Button>
                                    <Button href="/qa/new" variant="primary" style={{ borderRadius: "2rem" }}>
                                        Post to Q&A
                                    </Button>
                                </Stack>
                            </CardBody>
                        </Card>
                    )}
                </Col>

                <Col lg={4}>
                    <Card
                        className="border-0 shadow-sm"
                        style={{ borderRadius: "1rem", overflow: "hidden" }}
                    >
                        <CardBody className="p-4">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle"
                                    style={{
                                        width: 40,
                                        height: 40,
                                        background: "#f8f9fa"
                                    }}
                                >
                                    <FaHistory className="text-secondary" size={16} />
                                </div>
                                <div>
                                    <div className="fw-bold">History</div>
                                    <div className="text-secondary small">Your past reviews</div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-4">
                                    <Spinner size="sm" className="me-2" />
                                    <span className="text-secondary small">Loading...</span>
                                </div>
                            ) : reviews.length > 0 ? (
                                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                                    <ListGroup className="border-0">
                                        {reviews.map((review) => (
                                            <ListGroupItem
                                                key={review._id}
                                                className="border-0 rounded-3 mb-2 px-3 py-3"
                                                style={{ background: "#f8f9fa", cursor: "pointer" }}
                                            >
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div className="fw-semibold small">
                                                            {review.contractType || "Lease review"}
                                                        </div>
                                                        <div className="text-secondary small">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <Badge bg="success" style={{ borderRadius: "2rem" }}>
                                                        ✓
                                                    </Badge>
                                                </div>
                                            </ListGroupItem>
                                        ))}
                                    </ListGroup>
                                </div>
                            ) : (
                                <div
                                    className="text-center py-4 rounded-3"
                                    style={{ background: "#f8f9fa" }}
                                >
                                    <FaCloudUploadAlt size={30} className="text-secondary mb-2" />
                                    <div className="text-secondary small">
                                        No reviews yet. Submit one above!
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
}