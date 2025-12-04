"use client";

type TemplateItemProps = {
    label: string;
    description: string;
    onClick?: () => void;
};

export default function TemplateItem({label, description, onClick}: TemplateItemProps) {
    return (
        <div className="template-item" onClick={onClick}>
            <div className="fw-semibold">{label}</div>
            <div className="text-secondary small">{description}</div>
        </div>
    );
}