"use client";

import {useEffect, useState} from "react";
import {Card, CardBody, Col, Row} from "react-bootstrap";
import {FaChartBar, FaFolder} from "react-icons/fa";
import {Stat} from "../types";
import * as client from "../client";
import CardHeader from "@/components/ui/CardHeader";
import StatBox from "@/components/ui/StatBox";
import ProgressItem from "@/components/ui/ProgressItem";

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
        return (
            <div className="d-flex justify-content-center align-items-center loading-container">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status"/>
                    <div className="text-secondary">Loading stats...</div>
                </div>
            </div>
        );
    }

    const maxBreakdown = Math.max(...breakdown.map(b => b.value), 1);

    return (
        <div className="mb-4">
            <Row className="g-4">
                <Col lg={8}>
                    <Card className="card-base card-accent-purple">
                        <CardBody className="p-4">
                            <CardHeader
                                icon={<FaChartBar className="text-white" size={18}/>}
                                iconVariant="purple"
                                title="Board Health"
                                subtitle="Live community metrics"
                            />

                            <Row className="g-3">
                                {stats.map((item) => (
                                    <Col xs={6} md={4} key={item.label}>
                                        <StatBox label={item.label} value={item.value}/>
                                    </Col>
                                ))}
                            </Row>
                        </CardBody>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="card-base card-accent-purple">
                        <CardBody className="p-4">
                            <CardHeader
                                icon={<FaFolder className="text-white" size={18}/>}
                                iconVariant="purple"
                                title="By Case Type"
                                subtitle="Posts per folder"
                            />

                            <div className="d-grid gap-3">
                                {breakdown.slice(0, 6).map((item) => (
                                    <ProgressItem
                                        key={item.label}
                                        label={item.label}
                                        value={item.value}
                                        maxValue={maxBreakdown}
                                    />
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
