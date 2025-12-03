"use client";

import {Button, Card, CardBody, Stack} from "react-bootstrap";
import {NavTabsProps} from "@/app/qa/types";

export default function NavTabs({active = "qa"}: NavTabsProps) {
    return (
        <Card className="mb-3">
            <CardBody className="py-2">
                <Stack
                    direction="horizontal"
                    className="justify-content-start flex-wrap gap-2"
                >
                    <Button
                        href="/qa"
                        size="sm"
                        variant="link"
                        className={`text-decoration-none ${active === "qa" ? "fw-semibold" : ""}`}
                    >
                        QA
                    </Button>
                    <Button
                        href="/qa/resources"
                        size="sm"
                        variant="link"
                        className={`text-decoration-none ${active === "resources" ? "fw-semibold" : ""}`}
                    >
                        Resources
                    </Button>
                    <Button
                        href="/qa/stats"
                        size="sm"
                        variant="link"
                        className={`text-decoration-none ${active === "stats" ? "fw-semibold" : ""}`}
                    >
                        Stats
                    </Button>
                </Stack>
            </CardBody>
        </Card>
    );
}