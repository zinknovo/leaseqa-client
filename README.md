# LeaseQA

LeaseQA is an AI-powered lease review and legal Q&A platform for Boston renters. The goal is to deliver a full-stack Next.js application that combines AI-assisted contract analysis, a rubric-compliant Q&A experience, and lightweight admin tooling.

## Core Features

- **AI Lease Review** – Upload a PDF or paste text and receive a Claude-generated risk report with export options and shortcuts to the Q&A flow.
- **Housing Q&A Community** – Browse or filter questions by topic, post with rich text, and view multi-role answers (lawyers vs tenants) plus threaded discussions.
- **Operations Dashboard** – Manage folders/categories, monitor platform stats, and moderate problematic content.
- **Rubric Coverage** – Matches the Pazza rubric areas: Q&A Screen, Posts Sidebar, Posting Flow, Viewing & Replying, Manage Class/Folders, General Requirements, and Deployment.

## Tech Stack

- **Frontend / Full-stack**: Next.js (App Router + Server Actions), React 18, Tailwind CSS, React Query / SWR.
- **Authentication**: NextAuth.js with tenant, verified lawyer, and admin roles.
- **Backend & Database**: Next.js API Routes backed by MongoDB Atlas via Mongoose.
- **AI Integration**: Gemini API for contract parsing and summarization.
- **Rich Text**: React-Quill loaded dynamically to avoid SSR issues.
- **Deployment Targets**: Vercel (web + API) and MongoDB Atlas, with optional Render workers for long-running tasks.

## Repository Layout

```
.
├── README.md
├── docs
│   ├── requirements.md
│   ├── architecture.md
│   ├── api-design.md
│   ├── rubric-checklist.md
│   └── project-plan.md
├── apps
│   └── web              # Next.js application
├── packages
│   ├── config           # Shared Tailwind/ESLint configs
│   └── ui               # Reusable UI library
└── .env.example         # Environment variable template
```

> **Note:** Install dependencies before running any scripts. Ensure Node.js 18.17+ (or preferably v25 via `.nvmrc`) is available together with npm.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your `.env.local` based on `.env.example`.
3. Start the development server:
   ```bash
   npm run dev
   ```

## Collaboration Notes

- Product & frontend ownership: you.
- Backend & DevOps: teammate(s).
- Weekly cadence: plan on Monday, review & merge on Friday.

See the `docs/` directory for deeper specs, architecture notes, and rubric checklists.
