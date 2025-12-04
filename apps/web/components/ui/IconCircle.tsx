"use client";

import {ReactNode} from "react";

type IconCircleProps = {
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    variant?: "purple" | "green" | "red" | "blue" | "muted" | "glass";
    children: ReactNode;
    className?: string;
};

export default function IconCircle({
                                       size = "md",
                                       variant = "purple",
                                       children,
                                       className = ""
                                   }: IconCircleProps) {
    const sizeClass = `icon-circle-${size}`;
    const variantClass = `icon-bg-${variant}`;

    return (
        <div className={`icon-circle ${sizeClass} ${variantClass} ${className}`}>
            {children}
        </div>
    );
}