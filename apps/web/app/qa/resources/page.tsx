"use client";

import { Card, CardBody, Col, Row } from "react-bootstrap";
import { FaBalanceScale, FaBook, FaFileAlt, FaGavel, FaHandsHelping, FaHome } from "react-icons/fa";
import NavTabs from "@/app/qa/components/NavTabs";
import CardHeader from "@/components/ui/CardHeader";
import ResourceItem from "@/components/ui/ResourceItem";
import TemplateItem from "@/components/ui/TemplateItem";

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
            <NavTabs active="resources" />

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="card-base card-accent-green">
                        <CardBody className="p-4">
                            <CardHeader
                                icon={<FaBook className="text-white" size={20} />}
                                iconVariant="green"
                                title="Legal Guides & Assistance"
                                subtitle="Official resources for MA renters"
                            />

                            <div className="d-grid gap-2">
                                {resources.map((item) => (
                                    <ResourceItem
                                        key={item.title}
                                        icon={item.icon}
                                        title={item.title}
                                        summary={item.summary}
                                        link={item.link}
                                    />
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="card-base card-accent-purple">
                        <CardBody className="p-4">
                            <CardHeader
                                icon={<FaFileAlt className="text-white" size={16} />}
                                iconVariant="purple"
                                title="Templates"
                                subtitle="Ready-to-use documents"
                            />

                            <div className="d-grid gap-3">
                                {templates.map((tpl) => (
                                    <TemplateItem
                                        key={tpl.label}
                                        label={tpl.label}
                                        description={tpl.description}
                                    />
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}