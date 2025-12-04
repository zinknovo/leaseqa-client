"use client";

import { RiskCardProps } from "./types";

export default function RiskCard({ tone, title, items }: RiskCardProps) {
    const styles = {
        danger: {
            bg: "#fef2f2",
            border: "#ef4444",
            text: "#dc2626",
            icon: "🔴"
        },
        warning: {
            bg: "#fffbeb",
            border: "#f59e0b",
            text: "#d97706",
            icon: "🟡"
        },
        success: {
            bg: "#f0fdf4",
            border: "#22c55e",
            text: "#16a34a",
            icon: "🟢"
        }
    };

    const style = styles[tone];

    return (
        <div
            className="rounded-3 p-3 h-100"
            style={{
                background: style.bg,
                borderLeft: `4px solid ${style.border}`
            }}
        >
            <div
                className="fw-semibold d-flex align-items-center gap-2 mb-2"
                style={{ color: style.text }}
            >
                <span>{style.icon}</span>
                <span>{title}</span>
                <span
                    className="ms-auto badge rounded-pill"
                    style={{
                        background: style.border,
                        color: "#fff",
                        fontSize: "0.7rem"
                    }}
                >
                    {items.length}
                </span>
            </div>
            {items.length > 0 ? (
                <ul className="ps-3 mb-0 small">
                    {items.map((item, index) => (
                        <li key={index} className="text-secondary mb-1">
                            {item}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-secondary small">No issues found</div>
            )}
        </div>
    );
}