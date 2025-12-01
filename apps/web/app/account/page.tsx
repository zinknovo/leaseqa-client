"use client";

import { useSelector } from "react-redux";
import { Card, Col, Row, Stack, Button, Badge } from "react-bootstrap";
import { RootState } from "../store";
import Link from "next/link";

export default function AccountPage() {
  const user = useSelector((state: RootState) => state.session.user);

  return (
    <div className="mb-4">
      <Card className="mb-3">
        <Card.Body className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle bg-danger d-flex align-items-center justify-content-center text-white fw-bold"
            style={{ width: 56, height: 56 }}
          >
            {user?.name?.slice(0, 2).toUpperCase() || "NA"}
          </div>
          <div>
            <div className="fw-semibold">{user?.name || "Guest user"}</div>
            <div className="text-secondary small">{user?.email || "Not signed in"}</div>
            {user && (
              <Badge bg="secondary" className="mt-1">
                {user.role}
              </Badge>
            )}
          </div>
          <div className="ms-auto">
            <Button as={Link} href="/ai-review" size="sm" variant="danger">
              Use AI Review
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Row className="g-3">
        <Col lg={6}>
          <Card>
            <Card.Body>
              <div className="pill mb-2">Access control</div>
              <div className="text-secondary small">
                AI review, posting, and replies require sign-in.
              </div>
              <Stack gap={2} className="mt-3">
                <Button size="sm" variant="outline-secondary">
                  Sign in (placeholder)
                </Button>
                <Button size="sm" variant="outline-secondary">
                  Create account (placeholder)
                </Button>
              </Stack>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <Card.Body>
              <div className="pill mb-2">Recent actions</div>
              <ul className="mb-0 text-secondary small">
                <li>Linked AI review to QA post.</li>
                <li>Saved draft under Maintenance folder.</li>
                <li>Followed 2 attorney answers.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
