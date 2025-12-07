"use client";

const team = [
    {name: "Xintao Hu", role: "Product", focus: "Tenant experience & rubric alignment", emoji: "📋"},
    {name: "Dan Jackson", role: "Legal support", focus: "Policy review, attorney replies", emoji: "⚖️"},
    {name: "Eric Lai", role: "Full-stack", focus: "Next.js + Express + Mongo", emoji: "🛠️"},
];

const accentColors = ["purple", "green", "red", "blue"];

export default function InfoPage() {
    return (
        <div className="mb-4">
            <div className="card card-hero mb-4">
                <div className="card-body p-5">
                    <span className="pill pill-glass mb-3">ℹ️ About</span>
                    <h1 className="display-6 fw-bold mb-3">LeaseQA Team & Credits</h1>
                    <p className="lead mb-0 opacity-75">
                        Built for NEU CS5610.18616.202610 — AI lease review + Piazza-inspired Q&A.<br/>
                        Helping Boston renters understand their rights.
                    </p>
                </div>
            </div>

            <div className="small text-secondary mb-3 fw-semibold">TEAM</div>
            <div className="row g-4 mb-4">
                {team.map((member, index) => (
                    <div className="col-md-6 col-lg-4" key={member.name}>
                        <div className={`card card-base card-accent-${accentColors[index % accentColors.length]} h-100`}>
                            <div className="card-body p-4">
                                <div className={`icon-circle icon-circle-lg icon-bg-${accentColors[index % accentColors.length]} mb-3`}>
                                    <span className="emoji-icon-lg">{member.emoji}</span>
                                </div>
                                <div className="fw-bold mb-1">{member.name}</div>
                                <span className="pill mb-2">{member.role}</span>
                                <div className="text-muted-light small mt-2">{member.focus}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="small text-secondary mb-3 fw-semibold">GITHUB</div>
            <div className="card card-base">
                <div className="card-body p-4">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="list-item-muted p-3 h-100">
                                <div className="fw-bold mb-1">Frontend (Next.js)</div>
                                <div className="text-muted-light small mb-2">LeaseQA client app</div>
                                <a
                                    href="https://github.com/zinknovo/leaseqa-client"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="resource-link"
                                >
                                    github.com/zinknovo/leaseqa-client →
                                </a>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="list-item-muted p-3 h-100">
                                <div className="fw-bold mb-1">Backend (Express)</div>
                                <div className="text-muted-light small mb-2">LeaseQA API server</div>
                                <a
                                    href="https://github.com/zinknovo/leaseqa-server"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="resource-link"
                                >
                                    github.com/zinknovo/leaseqa-server →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
