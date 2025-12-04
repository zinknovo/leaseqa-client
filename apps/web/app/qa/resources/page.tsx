"use client";

import Link from "next/link";
import {Card, CardBody, Col, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import {FaBalanceScale, FaBook, FaExternalLinkAlt, FaFileAlt, FaGavel, FaHandsHelping, FaHome} from "react-icons/fa";
import NavTabs from "@/app/qa/components/NavTabs";

const resources = [
    {
        title: "Massachusetts Security Deposit Law (MGL c.186 §15B)",
        link: "https://www.mass.gov/info-details/security-deposits",
        summary: "Rules on deposits, receipts, escrow, and return timelines.",
        icon: FaBalanceScale,
    },
    {
        title: "Right to a Habitable Home",
        link: "https://www.mass.gov/info-details/tenants-rights",
        summary: "What landlords must provide: heat, hot water, repairs, safety.",
        icon: FaHome,
    },
    {
        title: "Civil Legal Aid Finder",
        link: "https://www.masslegalservices.org/findlegalaid",
        summary: "Locate free/low-cost legal help by county and issue.",
        icon: FaHandsHelping,
    },
    {
        title: "Eviction Diversion Initiative",
        link: "https://www.mass.gov/info-details/eviction-diversion-initiative",
        summary: "Programs to prevent evictions; mediation and rental assistance.",
        icon: FaGavel,
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
            <NavTabs active="resources"/>

            <Row className="g-4">
                <Col lg={8}>
                    <Card
                        className="border-0 shadow-sm"
                        style={{
                            borderRadius: "1rem",
                            overflow: "hidden",
                            borderTop: "4px solid #11998e"
                        }}
                    >
                        <CardBody className="p-4">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle"
                                    style={{
                                        width: 48,
                                        height: 48,
                                        background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                                    }}
                                >
                                    <FaBook className="text-white" size={20}/>
                                </div>
                                <div>
                                    <h1 className="h4 fw-bold mb-0">Legal Guides & Assistance</h1>
                                    <div className="text-secondary small">Official resources for MA renters</div>
                                </div>
                            </div>

                            <ListGroup className="border-0">
                                {resources.map((item, index) => (
                                    <ListGroupItem
                                        key={item.title}
                                        className="border-0 rounded-3 mb-2 p-0"
                                        style={{background: "transparent"}}
                                    >
                                        <div
                                            className="p-3 rounded-3"
                                            style={{background: "#f8f9fa"}}
                                        >
                                            <div className="d-flex justify-content-between align-items-start gap-3">
                                                <div className="d-flex gap-3">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            background: "#e9ecef"
                                                        }}
                                                    >
                                                        <item.icon className="text-secondary" size={16}/>
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold mb-1">{item.title}</div>
                                                        <div className="text-secondary small">{item.summary}</div>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={item.link}
                                                    target="_blank"
                                                    className="text-decoration-none d-flex align-items-center gap-2 flex-shrink-0"
                                                    style={{color: "#11998e"}}
                                                >
                                                    <span>Open</span>
                                                    <FaExternalLinkAlt size={12}/>
                                                </Link>
                                            </div>
                                        </div>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card
                        className="border-0 shadow-sm"
                        style={{
                            borderRadius: "1rem",
                            overflow: "hidden",
                            borderTop: "4px solid #764ba2"
                        }}
                    >
                        <CardBody className="p-4">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle"
                                    style={{
                                        width: 40,
                                        height: 40,
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                    }}
                                >
                                    <FaFileAlt className="text-white" size={16}/>
                                </div>
                                <div>
                                    <div className="fw-bold">Templates</div>
                                    <div className="text-secondary small">Ready-to-use documents</div>
                                </div>
                            </div>

                            <div className="d-grid gap-3">
                                {templates.map((tpl) => (
                                    <div
                                        key={tpl.label}
                                        className="p-3 rounded-3"
                                        style={{
                                            background: "#f8f9fa",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        <div className="d-flex align-items-start gap-3">
                                            <div>
                                                <div className="fw-semibold">{tpl.label}</div>
                                                <div className="text-secondary small">{tpl.description}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}