"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Card, CardBody, Stack, Button} from "react-bootstrap";
import {FaComments, FaBook, FaChartBar, FaTools} from "react-icons/fa";
import {NavTabsProps} from "@/app/qa/types";
import {useSearchParams, useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store";

const baseTabs = [
    {key: "qa", label: "Q&A", href: "/qa", icon: FaComments},
    {key: "resources", label: "Resources", href: "/qa/resources", icon: FaBook},
    {key: "stats", label: "Stats", href: "/qa/stats", icon: FaChartBar},
];

const scenarioChips = [
    {key: "all", label: "All"},
    {key: "deposit", label: "Security Deposit"},
    {key: "eviction", label: "Eviction / Notice"},
    {key: "repairs", label: "Repairs & Habitability"},
    {key: "utilities", label: "Utilities / Heat"},
    {key: "leasebreak", label: "Breaking a Lease"},
    {key: "sublease", label: "Sublease / Roommates"},
    {key: "fees", label: "Late Fees / Rent"},
    {key: "harassment", label: "Landlord Harassment"},
];

export default function NavTabs({ active }: NavTabsProps) {
    const pathname = usePathname();
    const session = useSelector((state: RootState) => state.session);
    const searchParams = useSearchParams();
    const router = useRouter();
    const scenario = searchParams.get("scenario") || "all";
    const isAdmin = session.user?.role === "admin";
    const tabs = isAdmin
        ? [...baseTabs, {key: "manage", label: "Manage Sections", href: "/qa/manage", icon: FaTools}]
        : baseTabs;
    const derivedActive =
        pathname?.startsWith("/qa/resources")
            ? "resources"
            : pathname?.startsWith("/qa/stats")
                ? "stats"
                : pathname?.startsWith("/qa/manage")
                    ? "manage"
                    : "qa";
    const current = active ?? derivedActive;

    const setScenarioParam = (value: string) => {
        if (value === "all") {
            router.push("/qa");
            return;
        }
        const params = new URLSearchParams(searchParams?.toString());
        params.set("scenario", value);
        router.push(`/qa?${params.toString()}`);
    };

    return (
        <Card className="card-nav mb-4">
            <CardBody className="py-1 px-2">
                <Stack
                    direction="horizontal"
                    className="justify-content-start gap-1"
                >
                    {tabs.map(tab => {
                        const isActive = current === tab.key;
                        return (
                            <Link
                                key={tab.key}
                                href={tab.href}
                                className="text-decoration-none"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (tab.key === "qa") {
                                        router.push("/qa");
                                    } else {
                                        router.push(tab.href);
                                    }
                                }}
                            >
                                <div className={`nav-tab-item ${isActive ? "active" : ""}`}>
                                    <tab.icon size={14} />
                                    <span>{tab.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </Stack>

                {current === "qa" && (
                    <Stack direction="horizontal" gap={1} className="flex-wrap mt-1">
                        {scenarioChips.map(chip => (
                            <Button
                                key={chip.key}
                                size="sm"
                                variant={scenario === chip.key ? "primary" : "outline-secondary"}
                                className="rounded-pill scenario-chip"
                                data-scenario={chip.key}
                                onClick={() => setScenarioParam(chip.key)}
                            >
                                {chip.label}
                            </Button>
                        ))}
                    </Stack>
                )}
            </CardBody>
        </Card>
    );
}
