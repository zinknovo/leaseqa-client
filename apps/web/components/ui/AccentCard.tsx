"use client";

import {ReactNode} from "react";
import {Card, CardBody} from "react-bootstrap";

type AccentCardProps = {
    accent?: "purple" | "green" | "blue" | "red" | "none";
    children: ReactNode;
    className?: string;
    padding?: string;
};

export default function AccentCard({
                                       accent = "none",
                                       children,
                                       className = "",
                                       padding = "p-4"
                                   }: AccentCardProps) {
    const accentClass = accent !== "none" ? `card-accent-${accent}` : "";

    return (
        <Card className={`card-base ${accentClass} ${className}`}>
            <CardBody className={padding}>
                {children}
            </CardBody>
        </Card>
    );
}