"use client";

import { useRef, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Row,
  Spinner,
  Stack,
} from "react-bootstrap";
import Link from "next/link";
import { submitAiReview } from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { addReview, RootState } from "../store";

type ChatMessage = {
  author: "system" | "user" | "assistant";
  body: string;
};

type ReviewState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "error"; message: string }
  | {
      status: "success";
      summary: string;
      highRisk: string[];
      mediumRisk: string[];
      lowRisk: string[];
      chat: ChatMessage[];
    };

export default function AIReviewPage() {
  const [state, setState] = useState<ReviewState>({ status: "idle" });
  const [fileName, setFileName] = useState<string>("");
  const contractTextRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();
  const history = useSelector((s: RootState) => s.aiHistory.items);
  const user = useSelector((s: RootState) => s.session.user);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: "uploading" });
    const formData = new FormData(event.currentTarget);
    const contractText = contractTextRef.current?.value || "";
    if (contractText) {
      formData.set("contractText", contractText);
    }
    formData.set("contractType", "residential");

    try {
      const result = await submitAiReview(formData);
      const aiResponse = result.data?.aiResponse || result.aiResponse;
      const summary =
        aiResponse?.summary ||
        "Lease reviewed. See below for rubric-aligned risk notes.";
      const risks = aiResponse?.risks || {
        high: ["Missing data"],
        medium: [],
        low: [],
      };
      setState({
        status: "success",
        summary,
        highRisk: risks.high || [],
        mediumRisk: risks.medium || [],
        lowRisk: risks.low || [],
        chat: [
          {
            author: "assistant",
            body:
              aiResponse?.chatMessage ||
              "Here is the rubric-scored summary. Ask follow-ups in the chat or post to QA.",
          },
        ],
      });
      dispatch(
        addReview({
          title: fileName || "Lease review",
          createdAt: new Date().toISOString(),
          status: "success",
        })
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to process review";
      setState({ status: "error", message });
    }
  };

  return (
    <Row className="g-4">
      <Col lg={8}>
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <div className="pill">AI Review</div>
              <div className="ms-2 text-secondary small">
                Sign in to keep your history
              </div>
            </div>
            <h1 className="h3 fw-bold">AI lease review</h1>
            <p className="text-secondary">
              Drag in a PDF or paste text. Express + Mongo will log history and
              you can push the result to Q&A.
            </p>

            <Form onSubmit={handleSubmit} className="mt-4">
              <Form.Group controlId="fileUpload" className="mb-3">
                <Form.Label className="fw-semibold">
                  Upload PDF (max 8MB)
                </Form.Label>
                <Form.Control
                  type="file"
                  name="file"
                  accept="application/pdf"
                  onChange={(e) => setFileName(e.target.value.split("\\").pop() || "")}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Or paste lease text
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="contractText"
                  ref={contractTextRef}
                  rows={6}
                  placeholder="Paste clauses for review..."
                />
              </Form.Group>

              <Stack
                direction="horizontal"
                className="justify-content-between align-items-center"
              >
                <span className="text-secondary small">
                  Uploading confirms this is for risk analysis only and not
                  stored long term.
                </span>
                <Button
                  type="submit"
                  variant="danger"
                  disabled={state.status === "uploading"}
                >
                  {state.status === "uploading" && (
                    <Spinner size="sm" className="me-2" />
                  )}
                  Start review
                </Button>
              </Stack>
            </Form>
          </Card.Body>
        </Card>

        {state.status === "error" && (
          <Alert variant="danger" className="mt-3">
            {state.message}
          </Alert>
        )}

        {state.status === "success" && (
          <Card className="mt-3">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                <Badge bg="danger" className="me-2">
                  Review ready
                </Badge>
                <div className="text-secondary small">
                  Send to Q&A · Mongo/Express synced
                </div>
              </div>
              <h4 className="fw-semibold">Summary</h4>
              <p className="text-secondary">{state.summary}</p>

              <Row className="g-3 mt-2">
                <Col md={4}>
                  <RiskCard tone="danger" title="High risk" items={state.highRisk} />
                </Col>
                <Col md={4}>
                  <RiskCard
                    tone="warning"
                    title="Medium risk"
                    items={state.mediumRisk}
                  />
                </Col>
                <Col md={4}>
                  <RiskCard tone="success" title="Low risk" items={state.lowRisk} />
                </Col>
              </Row>

              <div className="mt-4">
                <h6 className="fw-semibold">Chat transcript</h6>
                <div className="border rounded-3 p-3 bg-light">
                  {state.chat.map((msg, idx) => (
                    <div key={idx} className="mb-2">
                      <span className="fw-semibold text-capitalize">
                        {msg.author}:
                      </span>{" "}
                      <span>{msg.body}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Stack direction="horizontal" gap={2} className="mt-4 flex-wrap">
                <Button variant="outline-secondary">Download report</Button>
                <Button as={Link} href="/qa/new" variant="primary">
                  Bring result to QA · New Post
                </Button>
              </Stack>
            </Card.Body>
          </Card>
        )}
      </Col>

      <Col lg={4}>
        <Card className="h-100">
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <div className="pill">History</div>
              <div className="ms-auto small text-secondary">
                {user ? "Signed in" : "Sign in required"}
              </div>
            </div>
            <p className="text-secondary">
              Signed-in users can revisit and reuse prior reviews; click to
              reopen the chat.
            </p>
            <ListGroup variant="flush">
              {history.map((item) => (
                <ListGroup.Item key={item.id} className="border-0 border-bottom">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{item.title}</div>
                      <div className="text-secondary small">
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <Badge bg={item.status === "success" ? "success" : "secondary"}>
                      {item.status}
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            {!history.length && (
              <div className="text-secondary small mt-3">
                Uploads will appear here once completed.
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

function RiskCard({
  tone,
  title,
  items,
}: {
  tone: "danger" | "warning" | "success";
  title: string;
  items: string[];
}) {
  const variant =
    tone === "danger"
      ? "bg-danger-subtle border-danger"
      : tone === "warning"
        ? "bg-warning-subtle border-warning"
        : "bg-success-subtle border-success";
  const text =
    tone === "danger"
      ? "text-danger"
      : tone === "warning"
        ? "text-warning"
        : "text-success";
  return (
    <div className={`border rounded-3 p-3 ${variant}`}>
      <div className={`fw-semibold ${text}`}>{title}</div>
      <ul className="mt-2 ps-3 mb-0">
        {items.map((item) => (
          <li key={item} className="text-secondary">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
