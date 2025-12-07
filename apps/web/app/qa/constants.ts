export const SCENARIO_KEYWORDS: Record<string, string[]> = {
    all: [],
    deposit: ["deposit", "escrow", "security deposit", "return deposit"],
    eviction: ["eviction", "notice", "nonpayment", "14-day", "quit"],
    repairs: ["repair", "maintenance", "mold", "leak", "habitability"],
    utilities: ["utility", "heat", "electric", "water", "gas"],
    leasebreak: ["break lease", "terminate", "early termination"],
    sublease: ["sublease", "roommate", "assign", "co-tenant"],
    fees: ["late fee", "rent", "payment plan", "fee"],
    harassment: ["harass", "retaliation", "lockout", "privacy"],
};

export const SECTION_OPTIONS = [
    {value: "deposit", label: "Security Deposit"},
    {value: "eviction", label: "Eviction / Notice"},
    {value: "repairs", label: "Repairs & Habitability"},
    {value: "utilities", label: "Utilities / Heat"},
    {value: "leasebreak", label: "Breaking a Lease"},
    {value: "sublease", label: "Sublease / Roommates"},
    {value: "fees", label: "Late Fees / Rent"},
    {value: "harassment", label: "Landlord Harassment"},
];

export type ComposeState = {
    summary: string;
    details: string;
    folders: string[];
    postType: "question" | "note";
    audience: "everyone" | "admin";
    files: File[];
};

export const INITIAL_COMPOSE_STATE: ComposeState = {
    summary: "",
    details: "",
    folders: [],
    postType: "question",
    audience: "everyone",
    files: [],
};
