"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Row,
  Stack,
} from "react-bootstrap";
import { fetchPosts } from "../lib/api";

type FolderKey =
  | "lease_review"
  | "security_deposit"
  | "maintenance"
  | "eviction"
  | "utilities"
  | "roommate_disputes"
  | "lease_termination"
  | "rent_increase"
  | "other";

const folders: Record<FolderKey, string> = {
  lease_review: "Lease Review",
  security_deposit: "Security Deposits",
  maintenance: "Maintenance Duties",
  eviction: "Evictions & Terminations",
  utilities: "Utilities",
  roommate_disputes: "Roommate Disputes",
  lease_termination: "Early Termination",
  rent_increase: "Rent Increases",
  other: "Other",
};

type PostSummary = {
  id: string;
  title: string;
  author: string;
  role: "tenant" | "lawyer";
  folder: FolderKey;
  createdAt: string;
  excerpt: string;
};

const fallbackPosts: PostSummary[] = [
  {
    id: "1",
    title: "Is it legal for a landlord to collect three months of rent upfront?",
    author: "Ava Chen",
    role: "tenant",
    folder: "lease_review",
    createdAt: "2024-10-25T08:00:00Z",
    excerpt:
      "Lease asks for three months of rent plus a deposit before move-in. Feels excessive…",
  },
  {
    id: "2",
    title: "Who pays for the leaking pipe repair?",
    author: "Attorney Lin",
    role: "lawyer",
    folder: "maintenance",
    createdAt: "2024-10-24T15:12:00Z",
    excerpt:
      "Tenant should notify immediately and keep receipts. Massachusetts rules below…",
  },
];

const boardStats = [
  { label: "Unread posts", value: 4 },
  { label: "Unanswered", value: 6 },
  { label: "Attorney replies", value: 32 },
  { label: "Tenant replies", value: 256 },
  { label: "Registered users", value: 512 },
  { label: "AI reviews linked", value: 14 },
];

export default function QAPage() {
  const [activeFolder, setActiveFolder] = useState<FolderKey>("lease_review");
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<PostSummary[]>(fallbackPosts);
  const [selectedId, setSelectedId] = useState<string | null>(fallbackPosts[0]?.id || null);

  useEffect(() => {
    fetchPosts({})
      .then((data: any) => {
        if (!Array.isArray(data?.data)) return;
        const mapped = data.data.map((p: any) => ({
          id: p._id,
          title: p.summary,
          author: p.authorId || "Unknown",
          role: "tenant" as const,
          folder: (p.folders?.[0] as FolderKey) || "other",
          createdAt: p.createdAt || new Date().toISOString(),
          excerpt: p.details?.slice(0, 140) || "Read more...",
        }));
        setPosts(mapped.length ? mapped : fallbackPosts);
        setSelectedId(mapped[0]?._id || mapped[0]?.id || null);
      })
      .catch(() => {
        // fall back to mock
      });
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(
      (post) =>
        post.folder === activeFolder &&
        (search
          ? post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(search.toLowerCase())
          : true)
    );
  }, [activeFolder, posts, search]);

  const selectedPost =
    filteredPosts.find((p) => p.id === selectedId) || filteredPosts[0];

  return (
    <Row className="g-4">
      <Col lg={4}>
        <Card className="mb-3">
          <Card.Body>
            <Stack direction="horizontal" className="mb-3">
              <div className="pill">New</div>
              <div className="ms-auto">
                <Button as={Link} href="/qa/new" size="sm" variant="danger">
                  New Post
                </Button>
              </div>
            </Stack>
            <Form.Control
              placeholder="Search posts"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-3"
            />
            <div className="small text-secondary mb-2">Folders</div>
            <ListGroup className="mb-3">
              {(Object.entries(folders) as [FolderKey, string][]).map(
                ([key, label]) => (
                  <ListGroup.Item
                    action
                    key={key}
                    active={key === activeFolder}
                    onClick={() => setActiveFolder(key)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{label}</span>
                      <Badge bg="light" text="dark">
                        {
                          posts.filter(
                            (p) => p.folder === key && filterMatch(p, search)
                          ).length
                        }
                      </Badge>
                    </div>
                  </ListGroup.Item>
                )
              )}
            </ListGroup>
            <div className="small text-secondary mb-2">Recent</div>
            <ListGroup>
              {filteredPosts.map((post) => (
                <ListGroup.Item
                  key={post.id}
                  action
                  active={post.id === selectedId}
                  onClick={() => setSelectedId(post.id)}
                >
                  <div className="fw-semibold">{post.title}</div>
                  <div className="text-secondary small">
                    {new Date(post.createdAt).toLocaleDateString()} ·{" "}
                    {folders[post.folder]}
                  </div>
                </ListGroup.Item>
              ))}
              {!filteredPosts.length && (
                <ListGroup.Item className="text-secondary">
                  No posts yet in this folder.
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Card>
        <StatsCard />
      </Col>

      <Col lg={8}>
        <Card className="mb-3">
          <Card.Body className="py-2">
            <Stack
              direction="horizontal"
              className="justify-content-start flex-wrap gap-2"
            >
              <Button as={Link} href="/qa" size="sm" variant="link">
                QA
              </Button>
              <Button
                as={Link}
                href="/qa/resources"
                size="sm"
                variant="link"
              >
                Resources
              </Button>
              <Button as={Link} href="/qa/stats" size="sm" variant="link">
                Stats
              </Button>
            </Stack>
          </Card.Body>
        </Card>

        <Card className="mb-3">
          <Card.Body>
            <Stack
              direction="horizontal"
              className="justify-content-between align-items-center flex-wrap gap-3"
            >
              <div>
                <div className="pill mb-1">QA · Piazza style</div>
                <h2 className="h5 mb-0">Feed & hot posts</h2>
              </div>
              <Stack direction="horizontal" gap={2}>
                <Button as={Link} href="/qa/new" size="sm" variant="danger">
                  New Post
                </Button>
                <Button as={Link} href="/ai-review" size="sm" variant="outline-secondary">
                  Attach AI review
                </Button>
              </Stack>
            </Stack>

            <Row className="g-3 mt-3">
              <Col md={6}>
                <div className="small text-secondary mb-2">
                  Filter by case type
                </div>
                <ListGroup>
                  {(Object.entries(folders) as [FolderKey, string][]).map(
                    ([key, label]) => (
                      <ListGroup.Item
                        key={key}
                        action
                        active={key === activeFolder}
                        onClick={() => setActiveFolder(key)}
                      >
                        {label}
                      </ListGroup.Item>
                    )
                  )}
                </ListGroup>
              </Col>
              <Col md={6}>
                <div className="small text-secondary mb-2">Hot posts</div>
                <ListGroup>
                  {posts.slice(0, 3).map((post) => (
                    <ListGroup.Item key={post.id}>
                      <div className="fw-semibold">{post.title}</div>
                      <div className="text-secondary small">
                        {folders[post.folder]}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            {selectedPost ? (
              <>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Badge bg="secondary">
                    {selectedPost.role === "lawyer" ? "Attorney" : "Tenant"}
                  </Badge>
                  <span className="text-secondary small">
                    {folders[selectedPost.folder]} ·{" "}
                    {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="h5 fw-semibold">{selectedPost.title}</h3>
                <p className="text-secondary">{selectedPost.excerpt}</p>
                <Stack direction="horizontal" gap={2} className="flex-wrap mt-3">
                  <Button size="sm" variant="primary">
                    Open thread
                  </Button>
                  <Button as={Link} href="/qa/new" size="sm" variant="outline-secondary">
                    Reply / New Post
                  </Button>
                  <Button
                    as={Link}
                    href="/ai-review"
                    size="sm"
                    variant="outline-dark"
                  >
                    Link AI review
                  </Button>
                </Stack>
              </>
            ) : (
              <div className="text-secondary">Select a post to view details.</div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

function filterMatch(post: PostSummary, search: string) {
  if (!search) return true;
  const q = search.toLowerCase();
  return (
    post.title.toLowerCase().includes(q) ||
    post.excerpt.toLowerCase().includes(q)
  );
}

function StatsCard() {
  return (
    <Card>
      <Card.Body>
        <div className="pill mb-2">Board stats</div>
        <Row className="g-2">
          {boardStats.map((item) => (
            <Col xs={6} key={item.label}>
              <div className="border rounded-3 p-2 h-100">
                <div className="small text-secondary">{item.label}</div>
                <div className="fw-bold">{item.value}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
}
