"use client";

import Link from "next/link";
import {IconType} from "react-icons";
import {FaExternalLinkAlt} from "react-icons/fa";

type ResourceItemProps = {
    icon: IconType;
    title: string;
    summary: string;
    link: string;
};

export default function ResourceItem({icon: Icon, title, summary, link}: ResourceItemProps) {
    return (
        <div className="resource-item">
            <div className="d-flex justify-content-between align-items-start gap-3">
                <div className="d-flex gap-3">
                    <div className="resource-icon">
                        <Icon className="text-secondary" size={16}/>
                    </div>
                    <div>
                        <div className="fw-semibold mb-1">{title}</div>
                        <div className="text-secondary small">{summary}</div>
                    </div>
                </div>
                <Link href={link} target="_blank" className="resource-link">
                    <span>Open</span>
                    <FaExternalLinkAlt size={12}/>
                </Link>
            </div>
        </div>
    );
}