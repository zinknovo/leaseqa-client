"use client";

import { Card, Col, Row } from "react-bootstrap";

const team = [
  { name: "Casey Tenant", role: "Product", focus: "Tenant experience & rubric alignment" },
  { name: "Alex Counsel", role: "Legal Ops", focus: "Policy review, attorney replies" },
  { name: "Jamie Engineer", role: "Full-stack", focus: "Next.js + Express + Mongo" },
];

export default function InfoPage() {
  return (
    <div className="mb-4">
      <Card className="mb-3">
        <Card.Body>
          <div className="pill mb-2">INFO</div>
          <h1 className="h4 fw-bold">LeaseQA team & credits</h1>
          <p className="text-secondary mb-0">
            Built for NEU CS5610 — AI lease review + Piazza-inspired Q&A. Stack: Next.js,
            React-Bootstrap, Express, Mongo.
          </p>
        </Card.Body>
      </Card>

      <Row className="g-3">
        {team.map((member) => (
          <Col md={4} key={member.name}>
            <Card className="h-100">
              <Card.Body>
                <div className="fw-semibold">{member.name}</div>
                <div className="text-secondary small">{member.role}</div>
                <div className="mt-2">{member.focus}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
