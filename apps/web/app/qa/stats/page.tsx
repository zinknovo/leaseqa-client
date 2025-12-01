 "use client";

import Link from "next/link";
import { Card, Col, Row, Stack } from "react-bootstrap";

const stats = [
  { label: "Total posts", value: 182 },
  { label: "Open questions", value: 27 },
  { label: "Attorney replies", value: 64 },
  { label: "Tenant replies", value: 512 },
  { label: "AI reviews linked", value: 38 },
  { label: "Active users (7d)", value: 143 },
];

const breakdown = [
  { label: "Lease Review", value: 52 },
  { label: "Security Deposits", value: 24 },
  { label: "Maintenance", value: 31 },
  { label: "Evictions", value: 18 },
  { label: "Utilities", value: 12 },
  { label: "Other", value: 45 },
];

export default function StatsPage() {
  return (
    <div className="mb-4">
      <Card className="mb-3">
        <Card.Body className="py-2">
          <Stack direction="horizontal" className="gap-3 flex-wrap">
            <Link href="/qa" className="text-decoration-none">
              QA
            </Link>
            <Link href="/qa/resources" className="text-decoration-none">
              Resources
            </Link>
            <Link href="/qa/stats" className="text-decoration-none fw-semibold">
              Stats
            </Link>
          </Stack>
        </Card.Body>
      </Card>

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
                Posts per folder (sample data)
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
