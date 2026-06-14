# Samuel Branham — Professional Profile

Senior Software Engineer & Technical Lead. 13 years building production enterprise, government, and retail systems. Full-stack architect across C#/.NET, React, and Angular on Azure and AWS. Based in Knightdale, NC.

Contact: sbranham314@gmail.com · samuelbranham.com · linkedin.com/in/samuelbranham · github.com/sbranham314

## Summary
Led the AWS modernization of DC's unemployment insurance platform during the COVID-19 surge. Currently drives engineering for a commission and performance platform serving 6,600+ employees at a national-scale retailer. Established team-wide AI-assisted development patterns using Claude. Azure certified (AZ-104); AZ-305 Solutions Architect Expert in progress.

## Skills
- Languages/Frameworks: C#/.NET 8–10, TypeScript, JavaScript, React, Angular, SQL, Visual Basic
- Cloud/Infra: Azure (Functions, API Management, App Service, Storage, DevOps), AWS (EC2, Lambda), Docker
- Architecture: REST/OpenAPI, microservices, event-driven, domain-driven design, 3-tier, CI/CD
- Data: SQL Server, PostgreSQL, Entity Framework Core, relational design, federal compliance integrations
- AI-assisted dev: Claude, GitHub Copilot; building an agentic AI pipeline for SaaS
- Leadership: Scrum Master, led a 10-person support team, mentorship, technical interviews, code-review governance

## Experience

### Victra (Verizon Authorized Retailer) — Software Engineer III & Scrum Master — Jun 2025–Present — Raleigh, NC (Hybrid)
- Lead engineer and Scrum Master for a team of 8 (6 devs, 1 QA, 1 PO); shipped 5+ major features and a flagship platform launch in year one, supporting 1,500+ Verizon stores nationwide.
- Lead engineer on Contribution Matrix — platform calculating performance contributions that drive commission payouts for 6,600+ employees.
- Architects and ships Metric Management Center (MMC), handling millions of sales transactions: commission/coupon overrides, sales adjustments, inventory sync via REST APIs.
- Drove POS-agnostic architecture, decoupling apps from any specific point-of-sale platform and preserving optionality on a multi-million-dollar vendor decision.
- Led a .NET 8→10 Azure Function App migration with zero downtime.
- Championed team-wide AI-assisted development using Claude, yielding 3–5x productivity gains on boilerplate, refactors, and test scaffolding.

### DC Department of Employment Services — Senior Software Engineer — Apr 2018–Apr 2025 — Washington, D.C./Remote (promoted to Senior, Mar 2020)
- Core engineer on the AWS modernization of DC's unemployment insurance platform: Angular frontend, .NET middle tier, and AWS Lambda backend processing hundreds of thousands of claims. Stack: Angular, AWS EC2/Lambda, SQL Server, REST APIs with queue-based messaging.
- Owned end-to-end delivery during the COVID-19 surge when daily claim volume jumped 10x overnight; enabled tens of millions in benefit payments to DC residents.
- Integrated multiple federal systems (IRS, SSA, US DOL) via REST APIs for compliance data exchange, validation, and eligibility verification.
- Led a 10-person support team handling production incidents and on-call for both the legacy .NET platform and the AWS modernization in parallel; kept critical incidents to single digits/month at full population scale.
- Mentored 3 junior engineers into mid/senior promotions; set code-review and engineering standards still in use after departure.

### Clear Info, LLC — Software Engineer — Jul 2016–Mar 2018 — Annapolis, MD
- Built backend services and REST API integrations in .NET/C#/SQL Server for enterprise clients; designed relational data models supporting multi-system integrations.

### Rockwell Collins — Junior Software Engineer — Jul 2014–Jun 2016 — Annapolis, MD
- Built C#/.NET applications and backend services for avionics and defense systems in a regulated, high-reliability environment; full-stack work with relational databases, REST services, and integration testing.

### Agnik LLC — Software Engineer (Intern) — Sep 2013–Jun 2014 — Columbia, MD
- Built data-processing components in C#/.NET for a distributed analytics platform.

## Education & Certifications
- BS, Computer Science — University of Maryland, College Park, 2014
- Microsoft Azure: AZ-104 Administrator Associate (earned 2026), AZ-900 Fundamentals, AZ-204 Developer Associate (earned Jun 2026), AZ-305 Solutions Architect Expert (in progress)
- 15 active certifications, including CompTIA Security+ (CE), AWS Cloud Solutions Architect Specialization, DevOps on AWS, and Architecting Solutions on AWS

## Selected Projects
Production-grade SaaS Samuel builds and operates on his own time. The throughline: real multi-tenant products (billing, multi-tenancy, email, observability) built largely by an AI-agent pipeline he engineered, with LLM output kept trustworthy and cost-controlled.

### StayRecap (AI SaaS; MVP complete)
A multi-tenant SaaS that turns messy short-term-rental data (property-management exports, expense CSVs, guest reviews) into polished, owner-ready quarterly PDF reports in under two minutes. The figures are computed deterministically in code and the language model is given only verified numbers to narrate, so a report is fast and trustworthy and cannot hallucinate a revenue figure. Report generation is held under $0.25 per report. MVP is feature-complete: auth, CSV ingestion, AI report generation, Stripe billing, transactional email, invite codes, and operator metrics. Stack: React/TypeScript on Azure Static Web Apps, .NET 9 Azure Functions, PostgreSQL with row-level multi-tenancy (a per-connection session variable so a query can never cross tenant boundaries even if app code has a bug), Blob Storage, Claude, Azure Communication Services, Stripe, traced through Application Insights.

### Autonomous multi-agent build pipeline
The engineering system that builds and operates both StayRecap and RetroStoreManager. Instead of hand-coding story by story, an orchestrator reads the product spec, generates an epic and story backlog as issues, and dispatches AI coding agents across four coordinated repositories. Each story runs through a closed, self-healing loop: develop (an agent writes the code and opens a PR), review (an agent reviews and rebases), deploy (live environment plus database migration), test (an agent calls the real endpoints), then merge to main. Failed tests file bugs that re-enter the backlog and conflicts route to a rebase agent. It handles real operations: per-model spend caps, expiring agent tokens, a "done does not equal merged" guard so a story only closes when its code is actually in main, and an idempotent deploy remediation layer that repairs schema and migration drift before it reaches users. Samuel also operates it in production, for example recovering from a migration cascade that took an API down by pausing the pipeline, reconciling the schema in one shot, redeploying, and documenting the root cause.

### RetroStoreManager (multi-tenant SaaS; in development)
A multi-tenant SaaS for retro game and trading-card-game store owners. The standout piece: Claude vision auto-identifies games from customer trade-in photos (title, platform, condition) and pre-populates inventory, collapsing the highest-friction workflow into seconds. Tenant isolation is enforced via a JWT-extracted company_id and a custom [RequirePermission] role-based-access attribute checked on every Azure Function, with webhook-driven Stripe billing and a trial-to-paid state machine. Built and operated by the same autonomous multi-agent pipeline across four coordinated repos. Stack: React, TypeScript, Material UI, .NET 8, Azure Functions, PostgreSQL, Claude (vision), Stripe, GitHub Actions.

### AI Résumé Assistant (this site; live)
The "Ask AI about me" assistant on this site (the one answering now). Answers are grounded strictly in Samuel's professional profile, and it declines off-topic or out-of-scope questions. Built as a serverless Azure Function that proxies Claude Haiku 4.5 so the API key stays server-side, with a prompt hardened against injection and topic drift, input caps, per-IP and global daily rate limits, and a hard monthly spend ceiling. It deploys alongside the site through the same GitHub Actions pipeline.

## Writing
Samuel writes about software engineering, focused on building real products with AI.
- "What I Learned Building Software with Autonomous AI Agents" (June 2026): notes from building two SaaS products almost entirely through a pipeline of AI agents that write, review, test, and deploy code, covering what works, what does not, and what it changes about the job.

## Frequently Asked

**What does Samuel specialize in?**
Full-stack engineering and architecture on C#/.NET and React/Angular over Azure and AWS, with deep experience in multi-tenant SaaS, REST/OpenAPI integrations, and AI-assisted and AI-agent-driven development. He also leads as a Scrum Master and technical lead.

**What is his most significant professional impact?**
Owning end-to-end delivery of the DC unemployment insurance modernization during the COVID-19 surge, when daily claim volume jumped 10x overnight, which enabled tens of millions in benefit payments. At Victra he is lead engineer on systems that drive commission payouts for 6,600+ employees and process millions of sales transactions.

**What is he building with AI?**
Two SaaS products, StayRecap and RetroStoreManager, built and operated by an autonomous multi-agent CI/CD pipeline he designed, plus the AI assistant on this site. At work he established team-wide AI-assisted development patterns using Claude, reporting 3–5x productivity gains on boilerplate, refactors, and test scaffolding.

**How does he approach AI in real engineering?**
He grounds model output in verified data (for example, StayRecap computes figures in code and lets the model only narrate them, so it cannot hallucinate numbers) and builds guardrails: spend caps, prompt-injection hardening, rate limits, and operational self-healing. The emphasis is on shipping trustworthy, cost-controlled systems rather than demos.

**What is his leadership experience?**
Scrum Master and lead engineer for an 8-person team at Victra, and previously lead of a 10-person support team at DES handling production incidents and on-call across legacy and modernized platforms. He has mentored several engineers into mid and senior promotions and set code-review and engineering standards.

**Azure or AWS?**
Both. He delivered the DES modernization on AWS (EC2, Lambda) and now works primarily on Azure (Functions, API Management, App Service, Storage, DevOps). He is AZ-104 certified with AZ-305 Solutions Architect Expert in progress.

**What stands out about his side projects?**
They are real, multi-tenant, production-grade SaaS with billing, multi-tenancy, email, and observability, and they are largely built by an AI-agent pipeline he engineered and operates rather than hand-coded. They show both product sense and the ability to run autonomous systems in production.

**What is his experience with multi-tenant SaaS and tenant isolation?**
Deep and recent. StayRecap enforces isolation at the database layer with PostgreSQL row-level security: every authenticated connection sets a session variable (app.current_tenant_id) so a query cannot cross tenant boundaries even if application code has a bug. RetroStoreManager enforces it at the application layer with a JWT-extracted company_id and a custom [RequirePermission] role-based-access attribute checked on every Azure Function. Both handle the full SaaS surface as well: Stripe billing with trial-to-paid state machines, transactional email, and per-tenant operator metrics.

**Has he worked in regulated or high-reliability environments?**
Yes. At Rockwell Collins he built C#/.NET applications for avionics and defense systems, a regulated, high-reliability domain with strict integration testing. At DC DES he integrated federal systems (IRS, SSA, US DOL) for compliance data exchange and eligibility verification, and he holds CompTIA Security+ (CE) among his certifications.

**What is his database experience?**
SQL Server and PostgreSQL in production, with Entity Framework Core and Dapper, relational data modeling, and row-level security for multi-tenancy. He has also built tooling that automatically repairs schema and migration drift (missing column, missing table, duplicate table, and model/snapshot drift) before it reaches users.

**Can he operate systems in production, not just build them?**
Yes, and he treats it as core to the job. At DES he led a 10-person support team handling production incidents and on-call across a legacy platform and its AWS modernization in parallel, keeping critical incidents to single digits per month at full population scale. On StayRecap he recovered from a multi-layer migration cascade that took the API down by pausing the build pipeline so its self-heal stopped competing, reconciling the schema in one shot, redeploying, and documenting the root cause so it could not recur unseen.

**How does the autonomous build pipeline work, step by step?**
An orchestrator reads the product spec, generates a backlog of epics and stories as issues, and dispatches AI agents across four repositories. Each story runs a closed loop: an agent develops the code and opens a pull request, another reviews and rebases it, the change deploys to a live environment with a database migration, an agent tests against the real endpoints, and the story merges to main. Failed tests file bugs back into the backlog, merge conflicts route to a rebase agent, and the orchestrator enforces operational guardrails: per-model spend caps, expiring-token handling, and a "done does not equal merged" guard so a story only closes when its code is actually in main.

**What is his experience with cloud cost control?**
He builds cost ceilings in by design. StayRecap holds report generation under $0.25 each by computing figures in code and letting the model only narrate them; the build pipeline enforces per-model spend caps; and the assistant on this site runs on a low-cost model behind rate limits and a hard monthly spend cap. He instruments token usage so cost and cache behavior are observable rather than guessed.

**What kinds of integrations has he built?**
REST and OpenAPI integrations across many systems: federal compliance systems (IRS, SSA, US DOL) at DES, point-of-sale and inventory systems at Victra via a deliberately POS-agnostic architecture, and third-party services such as Stripe (billing webhooks) and Azure Communication Services (email) in his SaaS products.

**What is his educational background?**
A BS in Computer Science from the University of Maryland, College Park (2014), plus 15 active certifications spanning Azure (AZ-104, AZ-900, AZ-204, with AZ-305 Solutions Architect Expert in progress), AWS architecture and DevOps specializations, and CompTIA Security+.

## How Samuel Works
Samuel favors systems that are trustworthy and cheap to run rather than flashy demos. With AI that means grounding model output in verified data, then wrapping it in guardrails: spend caps, prompt-injection hardening, rate limits, and self-healing so failures recover automatically. He designs for clean boundaries (the POS-agnostic decoupling at Victra, domain-driven design, row-level tenant isolation) and he operates what he builds, owning on-call, incident recovery, and root-cause documentation rather than handing it off. He is pragmatic about tooling: heavy use of Claude and agentic pipelines where they pay off, and plain hand-written code where they do not.
