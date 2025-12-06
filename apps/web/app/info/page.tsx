"use client";

import {Card, CardBody, Col, Row} from "react-bootstrap";

const team = [
    {name: "Casey Tenant", role: "Product", focus: "Tenant experience & rubric alignment", emoji: "📋"},
    {name: "Alex Counsel", role: "Legal Ops", focus: "Policy review, attorney replies", emoji: "⚖️"},
    {name: "Jamie Engineer", role: "Full-stack", focus: "Next.js + Express + Mongo", emoji: "💻"},
    {name: "Eric Engineer", role: "Full-stack", focus: "Next.js + Express + Mongo", emoji: "🛠️"},
];

const techStack = [
    {name: "Next.js", description: "React framework", colorClass: "tech-dot-dark"},
    {name: "React-Bootstrap", description: "UI components", colorClass: "tech-dot-bootstrap"},
    {name: "Express", description: "Backend API", colorClass: "tech-dot-dark"},
    {name: "MongoDB", description: "Database", colorClass: "tech-dot-mongo"},
];

export default function InfoPage() {
    return (
        <div className="mb-4">
            <Card className="card-hero mb-4">
                <CardBody className="p-5">
                    <div className="pill mb-3 about-pill">
                        ℹ️ About
                    </div>
                    <h1 className="display-6 fw-bold mb-3">LeaseQA Team & Credits</h1>
                    <p className="lead mb-0 opacity-75">
                        Built for NEU CS5610 — AI lease review + Piazza-inspired Q&A.<br/>
                        Helping Boston renters understand their rights.
                    </p>
                </CardBody>
            </Card>

            <div className="small text-secondary mb-3 fw-semibold">TEAM</div>
            <Row className="g-4 mb-4">
                {team.map((member, index) => (
                    <Col md={6} lg={3} key={member.name}>
                        <Card className="card-base">
                            <CardBody className="p-4">
                                <div className={`d-flex align-items-center justify-content-center rounded-circle mb-3 team-avatar team-avatar-${index % 4}`}>
                                    {member.emoji}
                                </div>
                                <div className="fw-bold mb-1">{member.name}</div>
                                <div className="small mb-2 px-2 py-1 rounded-pill d-inline-block role-tag">
                                    {member.role}
                                </div>
                                <div className="text-secondary small mt-2">{member.focus}</div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="small text-secondary mb-3 fw-semibold">TECH STACK</div>
            <Card className="card-base">
                <CardBody className="p-4">
                    <Row className="g-3">
                        {techStack.map((tech) => (
                            <Col md={3} sm={6} key={tech.name}>
                                <div className="p-3 rounded-3 h-100 bg-light-gray">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div
                                            className={`rounded-circle tech-dot ${tech.colorClass}`}
                                        />
                                        <span className="fw-bold">{tech.name}</span>
                                    </div>
                                    <div className="text-secondary small">{tech.description}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </CardBody>
            </Card>
        </div>
    );
}