"use client";

import Link from "next/link";
import { Card, CardBody, Stack } from "react-bootstrap";
import { FaComments, FaBook, FaChartBar } from "react-icons/fa";
import { NavTabsProps } from "@/app/qa/types";

const tabs = [
    { key: "qa", label: "Q&A", href: "/qa", icon: FaComments },
    { key: "resources", label: "Resources", href: "/qa/resources", icon: FaBook },
    { key: "stats", label: "Stats", href: "/qa/stats", icon: FaChartBar },
];

export default function NavTabs({ active = "qa" }: NavTabsProps) {
    return (
        <Card
            className="mb-4 border-0 shadow-sm"
            style={{ borderRadius: "1rem", overflow: "hidden" }}
        >
            <CardBody className="py-2 px-3">
                <Stack
                    direction="horizontal"
                    className="justify-content-start gap-1"
                >
                    {tabs.map(tab => {
                        const isActive = active === tab.key;
                        return (
                            <Link
                                key={tab.key}
                                href={tab.href}
                                className="text-decoration-none"
                            >
                                <div
                                    className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill"
                                    style={{
                                        background: isActive
                                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                            : "transparent",
                                        color: isActive ? "#fff" : "#6c757d",
                                        fontWeight: isActive ? 600 : 400,
                                        transition: "all 0.2s ease",
                                        cursor: "pointer"
                                    }}
                                >
                                    <tab.icon size={14} />
                                    <span>{tab.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </Stack>
            </CardBody>
        </Card>
    );
}