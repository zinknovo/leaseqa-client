"use client";

import {useEffect, useState} from "react";
import {Button, Col, Row, Stack} from "react-bootstrap";
import {Stat} from "./qa/types";
import * as client from "./qa/client";
import HeroCard from "@/components/ui/HeroCard";
import AccentCard from "@/components/ui/AccentCard";
import IconCircle from "@/components/ui/IconCircle";

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
                    {label: "Admin Posts", value: response.data.adminPosts || 0},
                    {label: "Open questions", value: response.data.unansweredPosts || 0},
                    {label: "Attorney replies", value: response.data.lawyerResponses || 0},
                    {label: "AI reviews this week", value: response.data.totalPosts || 0},
                ]);
            }
        } catch (error) {
            console.error("Failed to load stats:", error);
        }
    };

    const statConfig = [
        {icon: "📬", gradient: "bg-gradient-purple"},
        {icon: "❓", gradient: "bg-gradient-red"},
        {icon: "⚖️", gradient: "bg-gradient-blue"},
        {icon: "🤖", gradient: "bg-gradient-green"},
    ];

    return (
        <div className="mb-4">
            <HeroCard className="mb-4">
                <Row className="align-items-center">
                    <Col lg={12}>
                        <span className="pill pill-glass mb-3">🏠 Boston Renter Protection</span>
                        <h1 className="display-4 fw-bold mb-3">
                            <span className="text-accent-red">We help you understand</span>
                        </h1>
                        <p className="lead mb-4">
                            LeaseQA pairs AI lease review with a Piazza-style community so
                            Boston renters get clarity on edge cases and rubric-ready answers.
                        </p>
                        <Stack direction="horizontal" gap={3} className="flex-wrap">
                            <Button href="/ai-review" variant="danger" className="btn-pill-lg">
                                Start AI Review
                            </Button>
                            <Button href="/qa" variant="outline-light" className="btn-pill-lg">
                                Explore Q&A
                            </Button>
                        </Stack>
                    </Col>
                </Row>
            </HeroCard>

            <Row className="g-4 mb-4">
                <Col lg={6}>
                    <AccentCard accent="purple" className="h-100 shadow">
                        <div className="d-flex align-items-center mb-3">
                            <IconCircle size="lg" variant="purple" className="me-3">
                                <span className="emoji-icon-lg">🤖</span>
                            </IconCircle>
                            <div>
                                <div className="fw-bold">AI Review</div>
                                <div className="text-muted-light small">Gemini powered</div>
                            </div>
                        </div>
                        <h3 className="h4 fw-bold mb-3">Drag & drop to generate a review</h3>
                        <p className="text-muted-light mb-4">
                            Upload a PDF or paste lease text. We return rubric-aligned risks
                            and a summary you can reuse in Q&A.
                        </p>
                        <div className="d-flex gap-2">
                            <Button href="/ai-review" variant="dark" className="btn-pill">Go to AI Review →</Button>
                        </div>
                    </AccentCard>
                </Col>

                <Col lg={6}>
                    <AccentCard accent="green" className="h-100 shadow">
                        <div className="d-flex align-items-center mb-3">
                            <IconCircle size="lg" variant="green" className="me-3">
                                <span className="emoji-icon-lg">💬</span>
                            </IconCircle>
                            <div>
                                <div className="fw-bold">QA Community</div>
                                <div className="text-muted-light small">Piazza-style forum</div>
                            </div>
                        </div>
                        <h3 className="h4 fw-bold mb-3">Solve with tenants & attorneys</h3>
                        <p className="text-muted-light mb-4">
                            Post questions, search answers, and filter by case type.
                            Linked to AI review results with history and resources.
                        </p>
                        <div className="d-flex gap-2">
                            <Button href="/qa" variant="primary" className="btn-pill">Open Q&A →</Button>
                        </div>
                    </AccentCard>
                </Col>
            </Row>

            <AccentCard accent="blue" className="shadow">
                <div className="text-center mb-4">
                    <span className="pill mb-2">📊 Live Stats</span>
                    <h2 className="h4 fw-bold mb-0">Community Activity</h2>
                </div>
                <Row className="g-3">
                    {stats.map((stat, index) => (
                        <Col key={stat.label} md={3} sm={6} xs={12}>
                            <div className={`p-4 rounded-4 text-white h-100 ${statConfig[index].gradient}`}>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <span className="emoji-icon-lg">{statConfig[index].icon}</span>
                                </div>
                                <div className="display-5 fw-bold mb-1">{stat.value}</div>
                                <div className="small opacity-75 text-uppercase">{stat.label}</div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </AccentCard>
        </div>
    );
}