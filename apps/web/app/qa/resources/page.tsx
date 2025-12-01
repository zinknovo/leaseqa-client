 "use client";

import Link from "next/link";
import { Card, Col, ListGroup, Row, Stack } from "react-bootstrap";

const resources = [
  {
    title: "Massachusetts Security Deposit Law (MGL c.186 §15B)",
    link: "https://www.mass.gov/info-details/security-deposits",
    summary: "Rules on deposits, receipts, escrow, and return timelines.",
  },
  {
    title: "Right to a Habitable Home",
    link: "https://www.mass.gov/info-details/tenants-rights",
    summary: "What landlords must provide: heat, hot water, repairs, safety.",
  },
  {
    title: "Civil Legal Aid Finder",
    link: "https://www.masslegalservices.org/findlegalaid",
    summary: "Locate free/low-cost legal help by county and issue.",
  },
  {
    title: "Eviction Diversion Initiative",
    link: "https://www.mass.gov/info-details/eviction-diversion-initiative",
    summary: "Programs to prevent evictions; mediation and rental assistance.",
  },
];

const templates = [
  {
    label: "Notice to Repair",
    description: "Document leaks, mold, or heating issues with dates and photos.",
  },
  {
    label: "Security Deposit Demand Letter",
    description: "Cites MA timelines and treble damages for wrongful withholding.",
  },
  {
    label: "Roommate Agreement Addendum",
    description: "Split utilities, chores, subletting, and guest policy.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="mb-4">
      <Card className="mb-3">
        <Card.Body className="py-2">
          <Stack direction="horizontal" className="gap-3 flex-wrap">
            <Link href="/qa" className="text-decoration-none">
              QA
            </Link>
            <Link href="/qa/resources" className="text-decoration-none fw-semibold">
              Resources
            </Link>
            <Link href="/qa/stats" className="text-decoration-none">
              Stats
            </Link>
          </Stack>
        </Card.Body>
      </Card>

      <Row className="g-4">
        <Col lg={8}>
          <Card>
            <Card.Body>
              <div className="pill mb-2">RESOURCES</div>
              <h1 className="h4 fw-bold">Legal guides & assistance</h1>
              <ListGroup className="mt-3" variant="flush">
                {resources.map((item) => (
                  <ListGroup.Item key={item.title} className="py-3">
                    <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                      <div>
                        <div className="fw-semibold">{item.title}</div>
                        <div className="text-secondary small">{item.summary}</div>
                      </div>
                      <Link href={item.link} target="_blank" className="text-decoration-none">
                        Open →
                      </Link>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Body>
              <div className="pill mb-2">Templates</div>
              <ListGroup variant="flush">
                {templates.map((tpl) => (
                  <ListGroup.Item key={tpl.label}>
                    <div className="fw-semibold">{tpl.label}</div>
                    <div className="text-secondary small">{tpl.description}</div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
