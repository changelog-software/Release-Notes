export type ReleaseCategory = 'new' | 'improved' | 'fixed' | 'breaking' | 'security';

export interface ReleaseItem {
  id: string;
  category: ReleaseCategory;
  title: string;
  description: string;
  ticketOrPr?: string;
}

export interface ReleaseNotesDocument {
  productName: string;
  version: string;
  releaseDate: string;
  audience: string;
  summary: string;
  highlights: string[];
  items: ReleaseItem[];
  upgradeNotes?: string;
  knownIssues?: string;
  contactOrFeedback?: string;
}

export interface ReleaseTemplateMeta {
  slug: string;
  name: string;
  shortName: string;
  audience: string;
  bestFor: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  templateDoc: ReleaseNotesDocument;
  exampleDoc: ReleaseNotesDocument;
}

export const CATEGORY_LABELS: Record<ReleaseCategory, string> = {
  new: 'New Features',
  improved: 'Improvements',
  fixed: 'Bug Fixes',
  breaking: 'Breaking Changes',
  security: 'Security Updates',
};

export const RELEASE_TEMPLATES: ReleaseTemplateMeta[] = [
  {
    slug: 'saas-release-notes',
    name: 'SaaS Product Release Notes Template',
    shortName: 'SaaS Product',
    audience: 'End users, product teams, customer success',
    bestFor: 'Web apps, B2B SaaS dashboards, customer-facing product updates',
    seoTitle: 'SaaS Release Notes Template (Free Word & Markdown) | Release Notes',
    seoDescription:
      'Free SaaS release notes template with real filled-in examples. Copy Markdown, download a formatted Word (.docx) file, or generate your own release notes.',
    h1: 'SaaS Release Notes Template',
    intro:
      'Built for customer-facing web applications. Leads with user value, groups changes into New Features, Improvements, and Bug Fixes, and avoids internal engineering jargon.',
    templateDoc: {
      productName: '[Product Name]',
      version: 'v[X.Y.Z]',
      releaseDate: '[YYYY-MM-DD]',
      audience: 'All [Product Name] users',
      summary:
        '[One-sentence summary of the main user benefit in this release, e.g., Faster reporting and two new integrations.]',
      highlights: [
        '[Headline feature #1 and why it matters to the customer]',
        '[Headline improvement #2 with measurable impact]',
      ],
      items: [
        {
          id: 'saas-t-1',
          category: 'new',
          title: '[Feature Name]',
          description: '[Describe what users can now do and where to find it in the UI.]',
        },
        {
          id: 'saas-t-2',
          category: 'improved',
          title: '[Workflow or Performance Improvement]',
          description: '[Explain how an existing workflow is faster, clearer, or easier.]',
        },
        {
          id: 'saas-t-3',
          category: 'fixed',
          title: '[Bug Fix Summary]',
          description: '[Describe the issue that was resolved from the user perspective.]',
        },
      ],
      upgradeNotes: 'No action required. All changes are live in your workspace.',
      contactOrFeedback: 'Questions or feedback? Reach us at [support@company.com].',
    },
    exampleDoc: {
      productName: 'Acme Analytics',
      version: 'v2.4.0',
      releaseDate: '2026-11-12',
      audience: 'All Acme Analytics workspaces',
      summary:
        'Scheduled PDF board reports, faster funnel queries, and improved CSV export reliability.',
      highlights: [
        'Schedule weekly or monthly PDF reports straight to Slack or email.',
        'Funnel conversion queries now load up to 3x faster on 90-day date ranges.',
      ],
      items: [
        {
          id: 'saas-e-1',
          category: 'new',
          title: 'Scheduled PDF & Slack Reports',
          description:
            'Open any dashboard, click Share -> Schedule, and choose a daily, weekly, or monthly delivery cadence.',
        },
        {
          id: 'saas-e-2',
          category: 'new',
          title: 'Workspace Role Templates',
          description:
            'Admins can now assign Analyst, Editor, or Billing-Only presets when inviting teammates.',
        },
        {
          id: 'saas-e-3',
          category: 'improved',
          title: '3x Faster 90-Day Funnel Queries',
          description:
            'Pre-aggregated daily rollups reduce load times on multi-step funnels with more than 1M events.',
        },
        {
          id: 'saas-e-4',
          category: 'fixed',
          title: 'UTF-8 Characters in CSV Exports',
          description:
            'Fixed an issue where accented characters and CJK text displayed incorrectly when opening exported CSVs in Excel.',
        },
        {
          id: 'saas-e-5',
          category: 'fixed',
          title: 'Timezone Offset in Retention Charts',
          description:
            'Cohort retention tables now consistently align with your workspace timezone instead of UTC.',
        },
      ],
      upgradeNotes: 'Rollout is complete for all workspaces. Refresh your browser tab to load v2.4.0.',
      contactOrFeedback: 'Need help setting up scheduled reports? Email support@acmeanalytics.example.',
    },
  },
  {
    slug: 'software-release-notes',
    name: 'Software Release Notes Template (Standard)',
    shortName: 'Software Standard',
    audience: 'Users, IT admins, support teams',
    bestFor: 'Desktop software, self-hosted tools, on-prem applications',
    seoTitle: 'Software Release Notes Template (Word .docx & Markdown)',
    seoDescription:
      'Download a clean software release notes template in Word (.docx) or Markdown. Includes system requirements, upgrade instructions, and known issues.',
    h1: 'Software Release Notes Template',
    intro:
      'A structured release notes document template for desktop, CLI, or self-hosted software. Covers version metadata, new capabilities, bug fixes, known issues, and upgrade steps.',
    templateDoc: {
      productName: '[Software Name]',
      version: 'v[X.Y.Z]',
      releaseDate: '[YYYY-MM-DD]',
      audience: 'End users & system administrators',
      summary: '[Brief overview of what this release delivers and whether an upgrade is recommended.]',
      highlights: [
        '[Key capability added in this version]',
        '[Important stability or security update]',
      ],
      items: [
        {
          id: 'sw-t-1',
          category: 'new',
          title: '[New Capability]',
          description: '[Clear description of the feature and supported platforms.]',
          ticketOrPr: 'ISSUE-101',
        },
        {
          id: 'sw-t-2',
          category: 'improved',
          title: '[Performance / UX Improvement]',
          description: '[What changed and measurable benefit.]',
          ticketOrPr: 'ISSUE-114',
        },
        {
          id: 'sw-t-3',
          category: 'fixed',
          title: '[Resolved Defect]',
          description: '[Root symptom fixed and affected OS or module.]',
          ticketOrPr: 'ISSUE-129',
        },
        {
          id: 'sw-t-4',
          category: 'security',
          title: '[Dependency / Security Patch]',
          description: '[Updated component or CVE addressed without exposing exploit details.]',
        },
      ],
      upgradeNotes: '[Step-by-step installation or migration command, e.g., Run installer or `brew upgrade`.]',
      knownIssues: '[List any known limitations or workarounds in this version.]',
      contactOrFeedback: 'Report issues at [https://github.com/org/repo/issues].',
    },
    exampleDoc: {
      productName: 'SyncDesk Desktop',
      version: 'v4.2.1',
      releaseDate: '2026-11-10',
      audience: 'macOS, Windows, and Linux desktop users',
      summary:
        'Adds offline conflict resolution, reduces idle memory usage by 35%, and patches a file-watcher crash on macOS.',
      highlights: [
        'Side-by-side offline conflict resolver keeps both versions before syncing.',
        'Idle RAM footprint dropped from 420 MB to 270 MB on large workspaces.',
      ],
      items: [
        {
          id: 'sw-e-1',
          category: 'new',
          title: 'Interactive Conflict Resolver',
          description:
            'When two offline edits touch the same file, SyncDesk now shows a side-by-side diff instead of creating duplicate "(conflicted copy)" files.',
          ticketOrPr: 'SD-842',
        },
        {
          id: 'sw-e-2',
          category: 'improved',
          title: 'Lower Idle Memory Usage',
          description:
            'Replaced polling file watchers with native OS event streams, cutting background RAM usage by 35%.',
          ticketOrPr: 'SD-851',
        },
        {
          id: 'sw-e-3',
          category: 'fixed',
          title: 'Crash When Renaming Nested Folders on macOS',
          description:
            'Resolved a race condition in FSEvents handling when moving folders containing more than 500 files.',
          ticketOrPr: 'SD-864',
        },
        {
          id: 'sw-e-4',
          category: 'security',
          title: 'OpenSSL Updated to 3.3.2',
          description: 'Bundled TLS runtime updated to address upstream security advisories.',
        },
      ],
      upgradeNotes:
        'Auto-updates apply on next restart. Enterprise MSI and DMG installers are available on the Releases page.',
      knownIssues:
        'Windows ARM64 users on Insider builds may see a 2-second delay on first launch after updating.',
      contactOrFeedback: 'Support: support@syncdesk.example | Issue tracker: github.com/example/syncdesk/issues',
    },
  },
  {
    slug: 'mobile-app-release-notes',
    name: 'Mobile App Release Notes Template (iOS & Android)',
    shortName: 'Mobile App',
    audience: 'App Store & Google Play users',
    bestFor: 'iOS App Store "What\'s New", Google Play release notes, mobile releases',
    seoTitle: 'Mobile App Release Notes Template (iOS & Android)',
    seoDescription:
      'Copy-ready mobile app release notes template for App Store and Google Play. Short, scannable, user-friendly format with real examples.',
    h1: 'Mobile App Release Notes Template',
    intro:
      'Designed for App Store and Google Play character limits and mobile scanning. Short, friendly, and focused on what changed for someone holding their phone.',
    templateDoc: {
      productName: '[App Name]',
      version: 'v[X.Y.Z] (Build [NNN])',
      releaseDate: '[YYYY-MM-DD]',
      audience: 'iOS & Android users',
      summary: '[One short sentence describing the biggest win in this app update.]',
      highlights: [
        '[New feature users will notice immediately]',
        '[Speed or battery improvement]',
      ],
      items: [
        {
          id: 'mob-t-1',
          category: 'new',
          title: '[New Mobile Feature]',
          description: '[Short, plain-English explanation of where to tap and what it does.]',
        },
        {
          id: 'mob-t-2',
          category: 'improved',
          title: '[Speed / UI Polish]',
          description: '[Faster launch, smoother scrolling, or dark mode refinement.]',
        },
        {
          id: 'mob-t-3',
          category: 'fixed',
          title: '[Crash or Sync Fix]',
          description: '[Fixed an issue where X happened on iOS/Android.]',
        },
      ],
      upgradeNotes: 'Update via the App Store or Google Play Store.',
      contactOrFeedback: 'Tap Settings -> Send Feedback inside the app anytime.',
    },
    exampleDoc: {
      productName: 'TrailPulse',
      version: 'v3.1.2 (Build 418)',
      releaseDate: '2026-11-14',
      audience: 'iOS 17+ and Android 13+ users',
      summary:
        'Offline topo map downloads are now 2x faster, plus Apple Watch elevation alerts.',
      highlights: [
        'Download full regional trail maps in half the time before heading off-grid.',
        'Apple Watch companion now alerts you when approaching steep elevation gain.',
      ],
      items: [
        {
          id: 'mob-e-1',
          category: 'new',
          title: 'Apple Watch Elevation Alerts',
          description:
            'Get a gentle wrist tap when you are 100 meters from a major climb or trail junction.',
        },
        {
          id: 'mob-e-2',
          category: 'improved',
          title: '2x Faster Offline Map Downloads',
          description:
            'Compressed vector tiles cut download size by 40% and resume automatically if you lose signal.',
        },
        {
          id: 'mob-e-3',
          category: 'fixed',
          title: 'Background GPS Pause on Android 15',
          description:
            'Fixed an issue where hike tracking could pause when battery saver turned on mid-route.',
        },
      ],
      upgradeNotes: 'Available now on the App Store and Google Play.',
      contactOrFeedback: 'Love the update? Leave a review or message us in Settings -> Help.',
    },
  },
  {
    slug: 'internal-release-notes',
    name: 'Internal / Engineering Release Notes Template',
    shortName: 'Internal / Sprint',
    audience: 'Engineering, QA, DevOps, internal stakeholders',
    bestFor: 'Sprint demos, internal deployments, microservices, release sign-off',
    seoTitle: 'Internal Release Notes Template for Engineering & QA Teams',
    seoDescription:
      'Structured internal release notes template for engineering, QA, and DevOps teams. Includes PR references, migrations, feature flags, and rollback notes.',
    h1: 'Internal Release Notes Template',
    intro:
      'Built for engineering, QA, and support teams. Tracks pull requests, database migrations, feature flags, environment config changes, and rollback steps.',
    templateDoc: {
      productName: '[Service / Platform Name]',
      version: 'release-[YYYY.MM.DD] / v[X.Y.Z]',
      releaseDate: '[YYYY-MM-DD]',
      audience: 'Engineering, QA, DevOps, Support',
      summary: '[Scope of deployment, target environment (staging/prod), and release owner.]',
      highlights: [
        '[Feature flag or migration status]',
        '[Key service dependency or config change]',
      ],
      items: [
        {
          id: 'int-t-1',
          category: 'new',
          title: '[Endpoint / Job / Internal Tooling]',
          description: '[Behavior, feature flag name, and owner.]',
          ticketOrPr: 'PR #412',
        },
        {
          id: 'int-t-2',
          category: 'improved',
          title: '[Query / Latency / Observability Change]',
          description: '[Metrics expected to change post-deploy.]',
          ticketOrPr: 'PR #415',
        },
        {
          id: 'int-t-3',
          category: 'fixed',
          title: '[Production Bug / Alert Fix]',
          description: '[Root cause and verification steps in staging.]',
          ticketOrPr: 'PR #419',
        },
        {
          id: 'int-t-4',
          category: 'breaking',
          title: '[Schema Migration / Env Var Change]',
          description: '[Backward-compatibility notes and deploy order.]',
          ticketOrPr: 'PR #421',
        },
      ],
      upgradeNotes:
        'Deploy order: 1) Run DB migration `20261114_add_idx`, 2) Deploy worker, 3) Enable flag `new_billing_sync` at 10%.',
      knownIssues: 'Rollback requires reverting worker image only; migration is additive and backward-compatible.',
      contactOrFeedback: 'Release captain: @[handle] | #deployments Slack channel',
    },
    exampleDoc: {
      productName: 'Billing Core Service',
      version: 'v2026.11.14-rc2',
      releaseDate: '2026-11-14',
      audience: 'Backend Engineering, SRE, Support Escalations',
      summary:
        'Idempotent webhook retries for Stripe v2026 events, plus read-replica routing for invoice PDFs.',
      highlights: [
        'Feature flag `stripe_idempotency_v2` defaults to 25% traffic in production.',
        'Additive index migration `20261114_idx_invoices_org` runs online with zero table lock.',
      ],
      items: [
        {
          id: 'int-e-1',
          category: 'new',
          title: 'Dead-Letter Replay CLI for Failed Webhooks',
          description:
            'Added `bin/replay-dlq --since 24h` so on-call engineers can safely re-drive failed billing events.',
          ticketOrPr: 'PR #1284',
        },
        {
          id: 'int-e-2',
          category: 'improved',
          title: 'Route Invoice History Queries to Read Replica',
          description:
            'Reduces primary Postgres CPU by ~18% during end-of-month billing runs.',
          ticketOrPr: 'PR #1289',
        },
        {
          id: 'int-e-3',
          category: 'fixed',
          title: 'Duplicate Tax Line on Prorated Upgrades',
          description:
            'Fixed rounding drift when seats were added and removed within the same 1-hour window.',
          ticketOrPr: 'PR #1292',
        },
      ],
      upgradeNotes:
        'Run `npm run db:migrate` before rolling pods. New env var `DLQ_MAX_RETRIES=5` has a safe default.',
      knownIssues: 'None blocking. Monitor `billing_webhook_latency_p99` for 30 minutes post-deploy.',
      contactOrFeedback: 'On-call owner: @a.kim | Runbook: internal-docs/billing-deploy',
    },
  },
  {
    slug: 'enterprise-release-notes',
    name: 'Enterprise / B2B Release Notes Template',
    shortName: 'Enterprise B2B',
    audience: 'Enterprise IT admins, security teams, account managers',
    bestFor: 'Enterprise SaaS, compliance-heavy software, quarterly customer briefings',
    seoTitle: 'Enterprise Release Notes Template for B2B & IT Admins',
    seoDescription:
      'Formal enterprise release notes template covering security compliance, SSO/SCIM updates, audit logs, and admin action items.',
    h1: 'Enterprise Release Notes Template',
    intro:
      'Tailored for enterprise customers, IT administrators, and security reviewers. Highlights governance, SSO/SCIM changes, auditability, and required admin actions.',
    templateDoc: {
      productName: '[Enterprise Platform]',
      version: 'v[X.Y.Z] (Q[N] Release)',
      releaseDate: '[YYYY-MM-DD]',
      audience: 'Organization Administrators, Security & Compliance Teams',
      summary: '[Executive summary of governance, security, and productivity updates.]',
      highlights: [
        '[Compliance or identity capability]',
        '[Admin control or reporting enhancement]',
      ],
      items: [
        {
          id: 'ent-t-1',
          category: 'new',
          title: '[Admin / Governance Feature]',
          description: '[Details, role requirements, and audit log events emitted.]',
        },
        {
          id: 'ent-t-2',
          category: 'security',
          title: '[Authentication / Encryption / Compliance Update]',
          description: '[Impact on SAML/OIDC, SCIM, or data residency.]',
        },
        {
          id: 'ent-t-3',
          category: 'improved',
          title: '[Enterprise Scale / Performance Improvement]',
          description: '[Throughput, SLA, or bulk management improvement.]',
        },
        {
          id: 'ent-t-4',
          category: 'fixed',
          title: '[Admin Console / Policy Fix]',
          description: '[Resolved edge case and affected plans.]',
        },
      ],
      upgradeNotes: '[Admin action required, e.g., Re-sync SCIM attributes or review new permission scope.]',
      contactOrFeedback: 'Contact your Technical Account Manager or [enterprise-support@company.com].',
    },
    exampleDoc: {
      productName: 'VaultGrid Enterprise',
      version: 'v7.0.0 (2026 Q4)',
      releaseDate: '2026-11-08',
      audience: 'Org Admins, Security Officers, Enterprise Plan Customers',
      summary:
        'Introduces Okta/Entra SCIM group-to-role mapping, immutable SIEM streaming, and EU data residency controls.',
      highlights: [
        'SCIM 2.0 group push now maps directly to custom workspace roles.',
        'Audit logs stream in real time to Datadog, Splunk, and AWS S3.',
      ],
      items: [
        {
          id: 'ent-e-1',
          category: 'new',
          title: 'Real-Time SIEM Log Streaming',
          description:
            'Configure webhook or S3 log delivery in Admin -> Security -> Audit Streaming with configurable retention.',
        },
        {
          id: 'ent-e-2',
          category: 'security',
          title: 'Enforce Hardware MFA for Billing & Owner Roles',
          description:
            'Org Owners can now require FIDO2/WebAuthn security keys for privileged account actions.',
        },
        {
          id: 'ent-e-3',
          category: 'improved',
          title: 'Bulk User Provisioning via CSV & SCIM',
          description:
            'Supports up to 10,000 directory sync operations per batch without rate-limit throttling.',
        },
        {
          id: 'ent-e-4',
          category: 'fixed',
          title: 'SAML RelayState Redirect on Deep Links',
          description:
            'Users clicking shared report links before authenticating now land directly on the target report after SSO.',
        },
      ],
      upgradeNotes:
        'Existing SAML configurations continue working without changes. To enable SCIM group mapping, regenerate your SCIM bearer token.',
      contactOrFeedback: 'Enterprise Support: enterprise@vaultgrid.example',
    },
  },
  {
    slug: 'api-release-notes',
    name: 'API & SDK Release Notes Template',
    shortName: 'API & SDK',
    audience: 'External developers, integrators, API consumers',
    bestFor: 'REST/GraphQL APIs, client SDKs, developer platforms',
    seoTitle: 'API & SDK Release Notes Template (with Breaking Changes)',
    seoDescription:
      'Developer-focused API and SDK release notes template with endpoints, deprecation timelines, breaking changes, and migration snippets.',
    h1: 'API & SDK Release Notes Template',
    intro:
      'Built for external developers consuming your API or SDK. Clearly separates additive endpoints from breaking changes, deprecations, and migration timelines.',
    templateDoc: {
      productName: '[API / SDK Name]',
      version: 'v[X.Y.Z] (API Version [YYYY-MM-DD])',
      releaseDate: '[YYYY-MM-DD]',
      audience: 'API integrators & SDK developers',
      summary: '[Summary of new endpoints, SDK releases, and any deprecation notices.]',
      highlights: [
        '[New endpoint or webhook event]',
        '[Deprecation or breaking change notice with sunset date]',
      ],
      items: [
        {
          id: 'api-t-1',
          category: 'new',
          title: '[GET/POST /v1/resource]',
          description: '[Parameters, response fields, and rate-limit tier.]',
        },
        {
          id: 'api-t-2',
          category: 'breaking',
          title: '[Field Removal or Behavior Change]',
          description: '[Old behavior -> New behavior and migration deadline.]',
        },
        {
          id: 'api-t-3',
          category: 'improved',
          title: '[Pagination / Latency / Error Payload Improvement]',
          description: '[What improved for integrators.]',
        },
        {
          id: 'api-t-4',
          category: 'fixed',
          title: '[Webhook / Serialization Fix]',
          description: '[Edge case fixed in API response or SDK types.]',
        },
      ],
      upgradeNotes: '[SDK upgrade command, e.g., `npm install @acme/sdk@latest`]',
      contactOrFeedback: 'API Status & Docs: [https://developers.company.com]',
    },
    exampleDoc: {
      productName: 'PayFlow Developer API',
      version: 'v3.2.0 (API 2026-11-01)',
      releaseDate: '2026-11-11',
      audience: 'Backend & SDK integrators',
      summary:
        'Adds cursor-based pagination to `/v3/payouts`, idempotency key headers on refunds, and TypeScript v5.6 strict types.',
      highlights: [
        'Cursor pagination (`starting_after`) replaces offset pagination on high-volume payout lists.',
        'Legacy `offset` parameter is deprecated and will sunset on 2027-05-01.',
      ],
      items: [
        {
          id: 'api-e-1',
          category: 'new',
          title: 'POST /v3/refunds Supports Idempotency-Key',
          description:
            'Pass a UUID in the `Idempotency-Key` header to safely retry refund requests for up to 24 hours.',
        },
        {
          id: 'api-e-2',
          category: 'breaking',
          title: 'Deprecation of `offset` on GET /v3/payouts',
          description:
            'Switch to `starting_after` cursor pagination. Existing `offset` requests return a `Deprecation` header until May 1, 2027.',
        },
        {
          id: 'api-e-3',
          category: 'improved',
          title: 'Structured Validation Error Codes',
          description:
            '422 responses now include `field` and `code` properties for programmatic form error mapping.',
        },
        {
          id: 'api-e-4',
          category: 'fixed',
          title: 'Nullability Types in @payflow/node v3.2.0',
          description:
            'Marked `payout.failure_reason` as `string | null` to match live JSON responses.',
        },
      ],
      upgradeNotes: 'Upgrade Node SDK: `npm install @payflow/node@^3.2.0`',
      contactOrFeedback: 'Developer Discord & Changelog: developers.payflow.example',
    },
  },
];
