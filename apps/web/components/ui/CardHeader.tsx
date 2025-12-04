"use client";

import {ReactNode} from "react";
import IconCircle from "./IconCircle";

type CardHeaderProps = {
    icon: ReactNode;
    iconVariant?: "purple" | "green" | "red" | "blue" | "muted";
    title: string;
    subtitle?: string;
};

export default function CardHeader({
                                       icon,
                                       iconVariant = "purple",
                                       title,
                                       subtitle
                                   }: CardHeaderProps) {
    return (
        <div className="d-flex align-items-center gap-3 mb-4">
            <IconCircle size="lg" variant={iconVariant}>
                {icon}
            </IconCircle>
            <div>
                <div className="fw-bold">{title}</div>
                {subtitle && <div className="text-secondary small">{subtitle}</div>}
            </div>
        </div>
    );
}