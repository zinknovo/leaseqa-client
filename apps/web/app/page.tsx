"use client";

import {useEffect, useState} from "react";
import {Button, Card, CardBody, Col, Row, Stack} from "react-bootstrap";
import {Stat} from "./qa/types";
import * as client from "./qa/client";

export default function LandingPage() {
    const [stats, setStats] = useState<Stat[]>([]);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await client.fetchStats();
            if (response.data) {
                setStats([
                    {label: "Unread items", value: response.data.unreadPosts || 0},
                    {label: "Open questions", value: response.data.unansweredPosts || 0},
                    {label: "Attorney replies", value: response.data.lawyerResponses || 0},
                    {label: "AI reviews this week", value: response.data.totalPosts || 0},
                ]);
            }
        } catch (error) {
            console.error("Failed to load stats:", error);
        }
    };

    return (
        <div className="mb-4">
            <Card
                className="mb-4 border-0 text-white"
                style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    borderRadius: "1.5rem",
                    overflow: "hidden"
                }}
            >
                <CardBody className="p-5">
                    <Row className="align-items-center">
                        <Col lg={7}>
                            <div
                                className="pill mb-3"
                                style={{
                                    background: "rgba(255,255,255,0.15)",
                                    color: "#fff",
                                    display: "inline-block"
                                }}
                            >
                                🏠 Boston Renter Protection
                            </div>
                            <h1 className="display-4 fw-bold mb-3">
                                Where laws can&apos;t reach,<br/>
                                <span style={{color: "#e94560"}}>we help you understand</span>
                            </h1>
                            <p className="lead mb-4 opacity-75">
                                LeaseQA pairs AI lease review with a Piazza-style community so
                                Boston renters get clarity on edge cases and rubric-ready answers.
                            </p>
                            <Stack direction="horizontal" gap={3} className="flex-wrap">
                                <Button
                                    variant="danger"
                                    size="lg"
                                    href="/ai-review"
                                    style={{borderRadius: "2rem", padding: "0.75rem 2rem"}}
                                >
                                    🤖 Start AI Review
                                </Button>
                                <Button
                                    variant="outline-light"
                                    size="lg"
                                    href="/qa"
                                    style={{borderRadius: "2rem", padding: "0.75rem 2rem"}}
                                >
                                    💬 Explore Q&A
                                </Button>
                            </Stack>
                        </Col>
                        <Col lg={5} className="mt-4 mt-lg-0 text-center">
                            <div
                                className="p-4 rounded-4"
                                style={{
                                    background: "rgba(255,255,255,0.1)",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid rgba(255,255,255,0.2)"
                                }}
                            >
                                <div className="display-1 mb-3">⚖️</div>
                                <div className="h4 fw-bold mb-2">NEU · LeaseQA</div>
                                <div className="small opacity-75">
                                    Piazza-inspired | React-Bootstrap<br/>
                                    MongoDB + Express + Next.js
                                </div>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <Row className="g-4 mb-4">
                <Col lg={6}>
                    <Card
                        className="h-100 border-0 shadow"
                        style={{
                            borderRadius: "1.25rem",
                            overflow: "hidden",
                            borderTop: "4px solid #764ba2"
                        }}
                    >
                        <CardBody className="p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                    }}
                                >
                                    <span style={{fontSize: "1.5rem"}}>🤖</span>
                                </div>
                                <div>
                                    <div className="fw-bold">AI Review</div>
                                    <div className="text-secondary small">Gemini powered</div>
                                </div>
                            </div>
                            <h3 className="h4 fw-bold mb-3">Drag & drop to generate a review</h3>
                            <p className="text-secondary mb-4">
                                Upload a PDF or paste lease text. We return rubric-aligned risks
                                and a summary you can reuse in Q&A.
                            </p>
                            <div
                                className="p-4 rounded-3 mb-4 text-center"
                                style={{background: "#f8f9fa", border: "2px dashed #dee2e6"}}
                            >
                                <div style={{fontSize: "2rem"}}>📄</div>
                                <div className="text-secondary small mt-2">
                                    Drop your lease PDF here
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <Button
                                    href="/ai-review"
                                    variant="dark"
                                    style={{borderRadius: "2rem"}}
                                >
                                    Go to AI Review →
                                </Button>
                                <Button
                                    href="/qa/new"
                                    variant="outline-secondary"
                                    style={{borderRadius: "2rem"}}
                                >
                                    Post to Q&A
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card
                        className="h-100 border-0 shadow"
                        style={{
                            borderRadius: "1.25rem",
                            overflow: "hidden",
                            borderTop: "4px solid #11998e"
                        }}
                    >
                        <CardBody className="p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                                    }}
                                >
                                    <span style={{fontSize: "1.5rem"}}>💬</span>
                                </div>
                                <div>
                                    <div className="fw-bold">QA Community</div>
                                    <div className="text-secondary small">Piazza-style forum</div>
                                </div>
                            </div>
                            <h3 className="h4 fw-bold mb-3">Solve with tenants & attorneys</h3>
                            <p className="text-secondary mb-4">
                                Post questions, search answers, and filter by case type.
                                Linked to AI review results with history and resources.
                            </p>
                            <div className="mb-4">
                                <div className="d-flex flex-wrap gap-2">
                                    {["Lease Review", "Security Deposit", "Maintenance", "Eviction"].map(tag => (
                                        <span
                                            key={tag}
                                            className="badge"
                                            style={{
                                                background: "#e9ecef",
                                                color: "#495057",
                                                fontWeight: "normal",
                                                padding: "0.5rem 0.75rem",
                                                borderRadius: "2rem"
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <Button
                                    href="/qa"
                                    variant="primary"
                                    style={{borderRadius: "2rem"}}
                                >
                                    Open Q&A →
                                </Button>
                                <Button
                                    href="/qa/resources"
                                    variant="outline-primary"
                                    style={{borderRadius: "2rem"}}
                                >
                                    View Resources
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Card
                className="border-0 shadow"
                style={{
                    borderRadius: "1.25rem",
                    overflow: "hidden",
                    borderTop: "4px solid #4facfe"
                }}
            >
                <CardBody className="p-4">
                    <div className="text-center mb-4">
                        <div className="pill d-inline-block mb-2">📊 Live Stats</div>
                        <h2 className="h4 fw-bold mb-0">Community Activity</h2>
                    </div>
                    <Row className="g-3">
                        {stats.map((stat, index) => {
                            const colors = [
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                                "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                            ];
                            const icons = ["📬", "❓", "⚖️", "🤖"];

                            return (
                                <Col key={stat.label} md={3} sm={6} xs={12}>
                                    <div
                                        className="p-4 rounded-4 text-white h-100"
                                        style={{background: colors[index % colors.length]}}
                                    >
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <span style={{fontSize: "1.5rem"}}>{icons[index]}</span>
                                        </div>
                                        <div className="display-5 fw-bold mb-1">{stat.value}</div>
                                        <div className="small opacity-75 text-uppercase">
                                            {stat.label}
                                        </div>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                </CardBody>
            </Card>
        </div>
    );
}