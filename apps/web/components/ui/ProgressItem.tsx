"use client";

type ProgressItemProps = {
    label: string;
    value: number;
    maxValue: number;
};

export default function ProgressItem({label, value, maxValue}: ProgressItemProps) {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small">{label}</span>
                <span className="fw-bold small">{value}</span>
            </div>
            <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{width: `${percentage}%`}}/>
            </div>
        </div>
    );
}