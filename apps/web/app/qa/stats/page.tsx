"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "react-bootstrap";
import { FaChartBar, FaFolder } from "react-icons/fa";
import { Stat } from "../types";
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
                    { label: "Total posts", value: response.data.totalPosts || 0 },
                    { label: "Open questions", value: response.data.unreadPosts || 0 },
                    { label: "Attorney replies", value: response.data.lawyerResponses || 0 },
                    { label: "Tenant replies", value: response.data.tenantResponses || 0 },
                    { label: "Registered users", value: response.data.enrolledUsers || 0 },
                    { label: "Unanswered", value: response.data.unansweredPosts || 0 },
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
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" />
                    <div className="text-secondary">Loading stats...</div>
                </div>
            </div>
        );
    }

    const maxBreakdown = Math.max(...breakdown.map(b => b.value), 1);

    return (
        <div className="mb-4">
            <NavTabs active="stats" />

            <Row className="g-4">
                <Col lg={8}>
                    <Card
                        className="border-0 shadow-sm"
                        style={{
                            borderRadius: "1rem",
                            overflow: "hidden",
                            borderTop: "4px solid #667eea"
                        }}
                    >
                        <CardBody className="p-4">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle"
                                    style={{
                                        width: 44,
                                        height: 44,
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                    }}
                                >
                                    <FaChartBar className="text-white" size={18} />
                                </div>
                                <div>
                                    <h1 className="h5 fw-bold mb-0">Board Health</h1>
                                    <div className="text-secondary small">Live community metrics</div>
                                </div>
                            </div>

                            <Row className="g-3">
                                {stats.map((item) => (
                                    <Col xs={6} md={4} key={item.label}>
                                        <div
                                            className="rounded-3 p-3 h-100"
                                            style={{ background: "rgba(102, 126, 234, 0.08)" }}
                                        >
                                            <div className="text-secondary small mb-1">{item.label}</div>
                                            <div className="h4 fw-bold mb-0" style={{ color: "#1a1a2e" }}>
                                                {item.value}
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </CardBody>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card
                        className="border-0 shadow-sm"
                        style={{
                            borderRadius: "1rem",
                            overflow: "hidden",
                            borderTop: "4px solid #667eea"
                        }}
                    >
                        <CardBody className="p-4">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle"
                                    style={{
                                        width: 44,
                                        height: 44,
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                    }}
                                >
                                    <FaFolder className="text-white" size={18} />
                                </div>
                                <div>
                                    <div className="fw-bold">By Case Type</div>
                                    <div className="text-secondary small">Posts per folder</div>
                                </div>
                            </div>

                            <div className="d-grid gap-3">
                                {breakdown.slice(0, 6).map((item) => {
                                    const percentage = (item.value / maxBreakdown) * 100;
                                    return (
                                        <div key={item.label}>
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="small">{item.label}</span>
                                                <span className="fw-bold small">{item.value}</span>
                                            </div>
                                            <div
                                                className="rounded-pill"
                                                style={{
                                                    height: 8,
                                                    background: "#e9ecef"
                                                }}
                                            >
                                                <div
                                                    className="h-100 rounded-pill"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        background: "#667eea",
                                                        transition: "width 0.5s ease"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}