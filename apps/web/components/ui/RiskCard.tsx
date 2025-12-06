"use client";
import {RiskCardProps} from "@/app/ai-review/types";

const config = {
    danger: {icon: "🔴", textClass: "text-danger"},
    warning: {icon: "🟡", textClass: "text-warning"},
    success: {icon: "🟢", textClass: "text-success"}
};

export default function RiskCard({tone, title, items}: RiskCardProps) {
    const {icon, textClass} = config[tone];

    return (
        <div className={`risk-card risk-card-${tone}`}>
            <div className={`fw-semibold d-flex align-items-center gap-2 mb-2 ${textClass}`}>
                <span>{icon}</span>
                <span>{title}</span>
                <span className={`ms-auto badge rounded-pill bg-${tone}`}>
                    {items.length}
                </span>
            </div>
            {items.length > 0 ? (
                <ul className="ps-3 mb-0 small">
                    {items.map((item, index) => (
                        <li key={index} className="text-muted-light mb-1">
                            {item}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-muted-light small">No issues found</div>
            )}
        </div>
    );
}