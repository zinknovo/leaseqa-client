"use client";

import { Card, CardBody, Col, Row } from "react-bootstrap";

const stats = [
    { label: "Unread posts", value: 4 },
    { label: "Unanswered", value: 6 },
    { label: "Attorney replies", value: 32 },
    { label: "Tenant replies", value: 256 },
    { label: "Registered users", value: 512 },
    { label: "AI reviews linked", value: 14 },
];

export default function StatsCard() {
    return (
        <Card>
            <CardBody>
                <div className="pill mb-2">Board stats</div>
                <Row className="g-2">
                    {stats.map(item => (
                        <Col xs={6} key={item.label}>
                            <div className="border rounded-3 p-2 h-100">
                                <div className="small text-secondary">{item.label}</div>
                                <div className="fw-bold">{item.value}</div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </CardBody>
        </Card>
    );
}