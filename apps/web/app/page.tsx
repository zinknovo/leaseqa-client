 "use client";

import Link from "next/link";
import { Button, Card, Col, Row, Stack } from "react-bootstrap";

const stats = [
  { label: "Unread items", value: "151" },
  { label: "Open questions", value: "18" },
  { label: "Attorney replies", value: "32" },
  { label: "AI reviews this week", value: "12" },
];

export default function LandingPage() {
  return (
    <div className="mb-4">
      <Card className="hero-card mb-4">
        <Card.Body>
          <div className="d-flex flex-column flex-lg-row align-items-lg-center">
            <div className="flex-grow-1">
              <div className="pill mb-3">Mission</div>
              <h1 className="display-5 fw-bold">
                where laws can&apos;t reach
              </h1>
              <p className="lead mb-4">
                LeaseQA pairs AI lease review with a Piazza-style community so
                Boston renters get clarity on edge cases and rubric-ready
                answers.
              </p>
              <Stack direction="horizontal" gap={3} className="flex-wrap">
                <Button variant="danger" as={Link} href="/ai-review">
                  Start AI review
                </Button>
                <Button variant="outline-light" as={Link} href="/qa">
                  Explore Q&A
                </Button>
              </Stack>
            </div>
            <div className="mt-4 mt-lg-0 ms-lg-5 text-center">
              <div className="bg-white text-dark rounded-4 p-3 shadow-lg">
                <div className="fw-semibold">NEU · LeaseQA</div>
                <div className="small text-secondary">
                  Piazza-inspired | React-Bootstrap | Mongo + Express + Next.js
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
              <div className="pill">AI Review</div>
              <div className="ms-auto text-secondary small">
                Claude / GPT fallback
              </div>
            </div>
            <h3 className="fw-semibold">Drag & drop to generate a review</h3>
            <p className="text-secondary">
              Upload a PDF or paste lease text; we return rubric-aligned risks
              and a summary you can reuse in QA.
            </p>
            <div className="mt-auto d-flex gap-2">
              <Button as={Link} href="/ai-review" variant="dark">
                Go to AI Review
              </Button>
              <Button as={Link} href="/qa/new" variant="outline-secondary">
                Post to Q&A
              </Button>
            </div>
          </Card.Body>
            <Card.Img
              src="https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=900&q=80"
              alt="AI Review"
              style={{ borderBottomLeftRadius: "1rem", borderBottomRightRadius: "1rem" }}
            />
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
              <div className="pill">QA Community</div>
              <div className="ms-auto text-secondary small">
                Piazza style · Case filters
              </div>
            </div>
            <h3 className="fw-semibold">Solve with tenants and attorneys</h3>
            <p className="text-secondary">
              New post, search, and filter by case type. Linked to AI review
              results with history, resources, and stats.
            </p>
            <div className="mt-auto d-flex gap-2">
              <Button as={Link} href="/qa" variant="primary">
                Open Q&A
              </Button>
              <Button as={Link} href="/qa/resources" variant="outline-primary">
                View resources
              </Button>
            </div>
          </Card.Body>
            <Card.Img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
              alt="QA Community"
              style={{ borderBottomLeftRadius: "1rem", borderBottomRightRadius: "1rem" }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Card.Body>
          <Row className="g-3">
            {stats.map((stat) => (
              <Col key={stat.label} md={3} sm={6} xs={12}>
                <div className="p-3 bg-light rounded-3 border h-100">
                  <div className="text-secondary small text-uppercase">
                    {stat.label}
                  </div>
                  <div className="fs-3 fw-bold text-dark">{stat.value}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
