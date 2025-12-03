"use client";

import {useEffect, useState} from "react";
import {Card, Col, Row} from "react-bootstrap";
import {Stat} from "../types";
import * as client from "../client";
import NavTabs from "../components/NavTabs";

export default function StatsPage() {
    const [stats, setStats] = useState<Stat[]>([]);
    const [breakdown, setBreakdown] = useState<Stat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await client.fetchStats();
            if (response.data) {
                setStats([
                    {label: "Total posts", value: response.data.totalPosts || 0},
                    {label: "Open questions", value: response.data.unreadPosts || 0},
                    {label: "Attorney replies", value: response.data.lawyerResponses || 0},
                    {label: "Tenant replies", value: response.data.tenantResponses || 0},
                    {label: "Registered users", value: response.data.enrolledUsers || 0},
                    {label: "Unanswered", value: response.data.unansweredPosts || 0},
                ]);
                setBreakdown(response.data.breakdown || []);
            }
        } catch (error) {
            console.error("Failed to load stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mb-4">
            <NavTabs active="stats"/>
            <Row className="g-4">
                <Col lg={8}>
                    <Card>
                        <Card.Body>
                            <div className="pill mb-2">STATS</div>
                            <h1 className="h4 fw-bold">Board health</h1>
                            <Row className="g-3 mt-2">
                                {stats.map((item) => (
                                    <Col sm={6} key={item.label}>
                                        <div className="border rounded-3 p-3 h-100">
                                            <div className="text-secondary small">{item.label}</div>
                                            <div className="fs-4 fw-bold">{item.value}</div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card>
                        <Card.Body>
                            <div className="pill mb-2">By case type</div>
                            <div className="text-secondary small mb-2">
                                Posts per folder
                            </div>
                            <div className="d-grid gap-2">
                                {breakdown.map((item) => (
                                    <div
                                        key={item.label}
                                        className="border rounded-3 p-2 d-flex justify-content-between align-items-center"
                                    >
                                        <span>{item.label}</span>
                                        <span className="fw-semibold">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}