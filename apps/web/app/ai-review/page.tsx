"use client";

import {useEffect, useRef, useState} from "react";
import {Badge, Button, Col, Form, ListGroup, ListGroupItem, Row, Spinner, Stack} from "react-bootstrap";
import {FaCloudUploadAlt, FaHistory, FaRobot} from "react-icons/fa";
import {AIReview, ReviewState} from "./types";
import RiskCard from "../../components/ui/RiskCard";
import ToastNotification, {ToastData} from "@/components/ui/ToastNotification";
import AccentCard from "@/components/ui/AccentCard";
import IconCircle from "@/components/ui/IconCircle";
import * as client from "./client";

export default function AIReviewPage() {
    const [state, setState] = useState<ReviewState>({status: "idle"});
    const [fileName, setFileName] = useState("");
    const [reviews, setReviews] = useState<AIReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<ToastData>({show: false, message: "", type: "error"});
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
        setToast({show: true, message, type});
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setState({status: "uploading"});

        const formData = new FormData(event.currentTarget);
        const contractText = contractTextRef.current?.value || "";
        if (contractText) formData.set("contractText", contractText);
        formData.set("contractType", "residential");

        try {
            const response = await client.createReview(formData);
            const review = response.data || response;
            const aiResponse = review?.aiResponse;

            setState({
                status: "success",
                summary: aiResponse?.summary || "Lease reviewed.",
                highRisk: aiResponse?.highRisk || [],
                mediumRisk: aiResponse?.mediumRisk || [],
                lowRisk: aiResponse?.lowRisk || [],
                chat: [{author: "assistant", body: aiResponse?.recommendations?.join(" ") || "Review complete."}],
            });

            showToast("Review completed successfully!", "success");
            loadReviews();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unable to process review";
            setState({status: "idle"});
            showToast(message, "error");
        }
    };

    return (
        <>
            <ToastNotification toast={toast} onClose={() => setToast({...toast, show: false})}/>

            <Row className="g-4">
                <Col lg={8}>
                    <AccentCard>
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <IconCircle size="lg" variant="purple">
                                <FaRobot size={20}/>
                            </IconCircle>
                            <div>
                                <h1 className="h4 fw-bold mb-0">AI Lease Review</h1>
                                <div className="text-muted-light small">Upload or paste your lease for analysis</div>
                            </div>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <div className="drop-zone mb-4"
                                 onClick={() => document.getElementById("fileUpload")?.click()}>
                                <FaCloudUploadAlt size={36} className="text-muted-light mb-2"/>
                                <div className="fw-semibold">{fileName || "Drop your lease PDF here"}</div>
                                <div className="text-muted-light small">or click to browse (max 8MB)</div>
                                <Form.Control
                                    type="file" name="file" id="fileUpload" accept="application/pdf"
                                    onChange={(e) => setFileName((e.target as HTMLInputElement).files?.[0]?.name || "")}
                                    className="d-none"
                                />
                            </div>

                            <div className="divider-text mb-3">OR</div>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">Paste lease text</Form.Label>
                                <Form.Control
                                    as="textarea" name="contractText" ref={contractTextRef}
                                    rows={5} placeholder="Paste clauses for review..."
                                    className="input-rounded"
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <span
                                    className="text-muted-light small">For risk analysis only. Not stored long term.</span>
                                <Button type="submit" variant="danger" disabled={state.status === "uploading"}
                                        className="btn-pill">
                                    {state.status === "uploading" ? <><Spinner size="sm"
                                                                               className="me-2"/>Analyzing...</> : "Start Review"}
                                </Button>
                            </div>
                        </Form>
                    </AccentCard>

                    {state.status === "success" && (
                        <AccentCard accent="green" className="mt-4">
                            <Badge bg="success" className="mb-4 btn-pill px-3 py-2">✓ Review Complete</Badge>

                            <h5 className="fw-bold mb-2">Summary</h5>
                            <p className="text-muted-light p-3 rounded-3 bg-muted mb-4">{state.summary}</p>

                            <Row className="g-3 mb-4">
                                <Col md={4}><RiskCard tone="danger" title="High Risk" items={state.highRisk}/></Col>
                                <Col md={4}><RiskCard tone="warning" title="Medium Risk"
                                                      items={state.mediumRisk}/></Col>
                                <Col md={4}><RiskCard tone="success" title="Low Risk" items={state.lowRisk}/></Col>
                            </Row>

                            <h6 className="fw-bold mb-2">Recommendations</h6>
                            <div className="rounded-3 p-3 bg-muted mb-4">
                                {state.chat.map((msg, idx) => (
                                    <div key={idx} className="d-flex gap-3">
                                        <IconCircle size="sm" variant="purple"><FaRobot size={14}/></IconCircle>
                                        <div className="text-muted-light small">{msg.body}</div>
                                    </div>
                                ))}
                            </div>

                            <Stack direction="horizontal" gap={2} className="flex-wrap">
                                <Button variant="outline-secondary" className="btn-pill">Download Report</Button>
                                <Button href="/qa/new" variant="primary" className="btn-pill">Post to Q&A</Button>
                            </Stack>
                        </AccentCard>
                    )}
                </Col>

                <Col lg={4}>
                    <AccentCard>
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <IconCircle size="md" variant="muted"><FaHistory size={16}/></IconCircle>
                            <div>
                                <div className="fw-bold">History</div>
                                <div className="text-muted-light small">Your past reviews</div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-4">
                                <Spinner size="sm" className="me-2"/>
                                <span className="text-muted-light small">Loading...</span>
                            </div>
                        ) : reviews.length > 0 ? (
                            <div className="scrollable-md">
                                <ListGroup className="border-0">
                                    {reviews.map((review) => (
                                        <ListGroupItem key={review._id} className="list-item-muted">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <div
                                                        className="fw-semibold small">{review.contractType || "Lease review"}</div>
                                                    <div
                                                        className="text-muted-light small">{new Date(review.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <Badge bg="success" className="rounded-pill">✓</Badge>
                                            </div>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            </div>
                        ) : (
                            <div className="text-center py-4 rounded-3 bg-muted">
                                <FaCloudUploadAlt size={30} className="text-muted-light mb-2"/>
                                <div className="text-muted-light small">No reviews yet. Submit one above!</div>
                            </div>
                        )}
                    </AccentCard>
                </Col>
            </Row>
        </>
    );
}