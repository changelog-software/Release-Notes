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
    h1: 'SaaS release notes template',
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
      productName: 'Fieldwork Analytics',
      version: 'v2.4.0',
      releaseDate: '2026-11-12',
      audience: 'All Fieldwork Analytics workspaces',
      summary:
        'Scheduled PDF board reports, faster 90-day funnel queries, and improved CSV export reliability.',
      highlights: [
        'Schedule weekly or monthly PDF reports straight to Slack or email.',
        'Pre-aggregated daily rollups keep 90-day funnel queries under 1.2s on 1M+ events.',
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
          title: 'Faster 90-Day Funnel Queries',
          description:
            'Pre-aggregated daily rollups cut query time from 4.8s to 1.2s on multi-step funnels with more than 1M events.',
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
      contactOrFeedback: 'Need help setting up scheduled reports? Email support@fieldwork.example.',
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
    h1: 'Software release notes template',
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
    h1: 'Mobile app release notes template',
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
        'Offline topo map downloads with 40% smaller vector tiles, plus Apple Watch elevation alerts.',
      highlights: [
        'Download full regional trail maps before heading off-grid with automatic resume.',
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
          title: 'Smaller Offline Map Downloads',
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
    h1: 'Internal release notes template',
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
    h1: 'Enterprise release notes template',
    intro:
      'For enterprise customers, IT administrators, and security reviewers. Covers governance, SSO and SCIM changes, audit logs, and required admin actions.',
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
    h1: 'API and SDK release notes template',
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
      upgradeNotes: '[SDK upgrade command, e.g., `npm install @payflow/sdk@latest`]',
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
  {
    slug: 'release-notes-template-word',
    name: 'Release Notes Template Word (.docx)',
    shortName: 'Word (.docx)',
    audience: 'Product managers, technical writers, IT teams',
    bestFor: 'Microsoft Word documents, offline sign-off, formal PDF export',
    seoTitle: 'Release Notes Template Word (.docx): Free Download & Examples',
    seoDescription:
      'Download a clean, formatted release notes template for Microsoft Word (.docx). Includes blank placeholders, filled-in sample, and instant Word export.',
    h1: 'Release notes template for Microsoft Word (.docx)',
    intro:
      'Formatted for Microsoft Word with clean Heading 1/2 hierarchy, metadata border, and scannable bullet lists. Download the .docx directly or customize it in the browser.',
    templateDoc: {
      productName: '[Product or System Name]',
      version: 'v[X.Y.Z]',
      releaseDate: '[YYYY-MM-DD]',
      audience: '[Customer Tier / Department]',
      summary: '[One-paragraph executive summary of what this Word release document covers.]',
      highlights: [
        '[Major capability #1 delivered in this release]',
        '[Key reliability or performance update #2]',
      ],
      items: [
        {
          id: 'word-t-1',
          category: 'new',
          title: '[New Feature Title]',
          description: '[Explain the feature, who has access, and where to find it.]',
        },
        {
          id: 'word-t-2',
          category: 'improved',
          title: '[Workflow Enhancement]',
          description: '[Describe what improved compared to the previous version.]',
        },
        {
          id: 'word-t-3',
          category: 'fixed',
          title: '[Resolved Issue]',
          description: '[Summarize the defect fixed and any affected platforms.]',
        },
      ],
      upgradeNotes: '[Installation, license, or browser-refresh instructions.]',
      knownIssues: '[Any open workarounds documented for support teams.]',
      contactOrFeedback: 'Document owner: [Name / Team] | [support@company.example]',
    },
    exampleDoc: {
      productName: 'LedgerFlow Desktop',
      version: 'v5.3.0',
      releaseDate: '2026-11-15',
      audience: 'Finance & Operations teams',
      summary:
        'Adds multi-currency CSV import templates, faster month-end reconciliation, and updated Windows 11 print margins.',
      highlights: [
        'Import multi-currency bank statements using saved column presets.',
        'Reconciliation batch runs complete in under 4 seconds for 25,000 rows.',
      ],
      items: [
        {
          id: 'word-e-1',
          category: 'new',
          title: 'Saved CSV Import Presets',
          description: 'Map bank columns once and reuse the preset across monthly imports.',
        },
        {
          id: 'word-e-2',
          category: 'improved',
          title: 'Faster Month-End Reconciliation',
          description: 'Indexed ledger matching cuts batch reconciliation time from 14s to 3.8s.',
        },
        {
          id: 'word-e-3',
          category: 'fixed',
          title: 'PDF Print Margin Clipping on Windows 11',
          description: 'Fixed right-edge column clipping when exporting A4 statements to PDF.',
        },
      ],
      upgradeNotes: 'Run the signed v5.3.0 installer. Existing local ledger databases migrate automatically.',
      knownIssues: 'macOS Sequoia users must grant folder access once on first export.',
      contactOrFeedback: 'Support: support@ledgerflow.example',
    },
  },
  {
    slug: 'google-docs-release-notes-template',
    name: 'Google Docs Release Notes Template',
    shortName: 'Google Docs',
    audience: 'Cross-functional product, marketing, and support teams',
    bestFor: 'Collaborative editing, Google Drive sharing, stakeholder review',
    seoTitle: 'Google Docs Release Notes Template (Copy-Paste & .docx Upload)',
    seoDescription:
      'Copy formatted release notes directly into Google Docs with one click, or download a .docx template ready for Google Drive.',
    h1: 'Google Docs release notes template',
    intro:
      'Built for teams collaborating in Google Drive. Use the Copy for Google Docs button to paste real H1/H2 headings and bullet lists without losing formatting.',
    templateDoc: {
      productName: '[Product Name]',
      version: 'v[X.Y.Z]',
      releaseDate: '[YYYY-MM-DD]',
      audience: '[Internal Stakeholders / Customers]',
      summary: '[Brief release overview for reviewers commenting in Google Docs.]',
      highlights: [
        '[Highlight #1 ready for customer comms]',
        '[Highlight #2 for support & sales enablement]',
      ],
      items: [
        {
          id: 'gdoc-t-1',
          category: 'new',
          title: '[Feature Launch]',
          description: '[What it does, plan availability, and link to help article.]',
        },
        {
          id: 'gdoc-t-2',
          category: 'improved',
          title: '[UX or Speed Update]',
          description: '[How the workflow changed for existing users.]',
        },
        {
          id: 'gdoc-t-3',
          category: 'fixed',
          title: '[Customer-Reported Fix]',
          description: '[Issue resolved and ticket reference.]',
        },
      ],
      upgradeNotes: 'Reviewers: leave inline comments by [Day/Time] before publishing.',
      contactOrFeedback: 'Release lead: @[name]',
    },
    exampleDoc: {
      productName: 'ClearDesk Helpdesk',
      version: 'v2.9.0',
      releaseDate: '2026-11-16',
      audience: 'Support, Product Marketing, Customer Success',
      summary:
        'Introduces SLA pause rules for pending customer replies and a redesigned ticket merge modal.',
      highlights: [
        'SLA timers now pause automatically when ticket status is Waiting on Customer.',
        'Ticket merge previews both conversation threads before confirming.',
      ],
      items: [
        {
          id: 'gdoc-e-1',
          category: 'new',
          title: 'Automatic SLA Pause Rules',
          description: 'Configure pause triggers under Settings -> SLAs -> Pause Conditions.',
        },
        {
          id: 'gdoc-e-2',
          category: 'improved',
          title: 'Side-by-Side Ticket Merge Preview',
          description: 'Agents can verify requester, tags, and attachments before merging duplicates.',
        },
        {
          id: 'gdoc-e-3',
          category: 'fixed',
          title: 'Duplicate Email Notifications on Reopen',
          description: 'Resolved a webhook race condition when a closed ticket received two replies.',
        },
      ],
      upgradeNotes: 'Enabled for all Pro and Enterprise workspaces. Help center article linked in internal brief.',
      contactOrFeedback: 'Questions before Thursday announcement? Ping #product-launches.',
    },
  },
  {
    slug: 'ios-app-store-release-notes',
    name: 'iOS App Store Release Notes Template',
    shortName: 'iOS App Store',
    audience: 'iPhone & iPad users on the App Store',
    bestFor: 'App Store Connect "What\'s New in This Version" text',
    seoTitle: 'iOS App Store Release Notes Template ("What\'s New" Examples)',
    seoDescription:
      'Copy-ready iOS App Store release notes templates that fit Apple\'s What\'s New section. Clear, concise, and user-friendly examples.',
    h1: 'iOS App Store release notes template',
    intro:
      'Written for Apple App Store Connect "What\'s New" updates. It stays short, reads easily on a phone screen, and avoids vague "bug fixes and performance improvements" filler.',
    templateDoc: {
      productName: '[iOS App Name]',
      version: 'v[X.Y.Z]',
      releaseDate: '[YYYY-MM-DD]',
      audience: 'iOS & iPadOS users',
      summary: '[One friendly sentence summarizing what is new in this App Store update.]',
      highlights: [
        '[New iOS widget, shortcut, or feature]',
        '[Reliability or battery improvement]',
      ],
      items: [
        {
          id: 'ios-t-1',
          category: 'new',
          title: '[New iOS Feature]',
          description: '[Where to tap and what it helps the user do.]',
        },
        {
          id: 'ios-t-2',
          category: 'improved',
          title: '[iOS Polish / Speed]',
          description: '[Smoother scrolling, Dynamic Type, or VoiceOver update.]',
        },
        {
          id: 'ios-t-3',
          category: 'fixed',
          title: '[iOS Crash / Sync Fix]',
          description: '[Fixed an issue on iOS [version] when doing [action].]',
        },
      ],
      upgradeNotes: 'Update directly from the App Store.',
      contactOrFeedback: 'Need help? Open Settings -> Contact Support inside the app.',
    },
    exampleDoc: {
      productName: 'FocusList iOS',
      version: 'v4.1.0',
      releaseDate: '2026-11-14',
      audience: 'iOS 17+ and iPadOS 17+ users',
      summary: 'Interactive Lock Screen widgets and faster iCloud task sync across iPhone and iPad.',
      highlights: [
        'Check off today\'s tasks directly from your Lock Screen without opening the app.',
        'iCloud background sync now finishes before the first frame renders.',
      ],
      items: [
        {
          id: 'ios-e-1',
          category: 'new',
          title: 'Interactive Lock Screen Widgets',
          description: 'Add the Today widget to complete tasks with a single tap.',
        },
        {
          id: 'ios-e-2',
          category: 'improved',
          title: 'VoiceOver Rotor Actions for Due Dates',
          description: 'Swipe up or down on any task to reschedule by one day or one week.',
        },
        {
          id: 'ios-e-3',
          category: 'fixed',
          title: 'Keyboard Overlap on iPhone SE',
          description: 'Fixed an issue where the Save button hid behind the keyboard in landscape mode.',
        },
      ],
      upgradeNotes: 'Available now on the App Store.',
      contactOrFeedback: 'Feedback is always welcome in Settings -> Send Feedback.',
    },
  },
  {
    slug: 'android-google-play-release-notes',
    name: 'Android Google Play Release Notes Template',
    shortName: 'Android Play',
    audience: 'Android users on Google Play Store',
    bestFor: 'Google Play Console 500-character "What\'s new" release notes',
    seoTitle: 'Android Google Play Release Notes Template (500-Char Ready)',
    seoDescription:
      'Concise Android release notes template formatted for Google Play Console\'s 500-character limit, with real filled-in examples.',
    h1: 'Android Google Play release notes template',
    intro:
      'Sized for Google Play Console\'s 500-character "What\'s new" box while also giving you a full Markdown and Word version for your help center.',
    templateDoc: {
      productName: '[Android App Name]',
      version: 'v[X.Y.Z]',
      releaseDate: '[YYYY-MM-DD]',
      audience: 'Android users',
      summary: '[Short update summary tailored for Google Play Store listings.]',
      highlights: ['[Key Android feature or Material You update]'],
      items: [
        {
          id: 'and-t-1',
          category: 'new',
          title: '[New Feature]',
          description: '[Plain-language summary in under 120 characters.]',
        },
        {
          id: 'and-t-2',
          category: 'improved',
          title: '[Performance / Battery]',
          description: '[Reduced startup time or background battery drain.]',
        },
        {
          id: 'and-t-3',
          category: 'fixed',
          title: '[Device / OS Fix]',
          description: '[Fixed crash or layout bug on Android [version].]',
        },
      ],
      upgradeNotes: 'Update via Google Play Store.',
      contactOrFeedback: 'Questions? Email [android-support@company.example].',
    },
    exampleDoc: {
      productName: 'TransitMap Android',
      version: 'v6.4.2',
      releaseDate: '2026-11-13',
      audience: 'Android 12+ users',
      summary: 'Live platform numbers for rail stations and lower background battery usage during commute alerts.',
      highlights: ['Predictive back gesture support across all route detail screens.'],
      items: [
        {
          id: 'and-e-1',
          category: 'new',
          title: 'Live Rail Platform Indicators',
          description: 'See departure platform numbers directly on station cards.',
        },
        {
          id: 'and-e-2',
          category: 'improved',
          title: 'Lower Location Polling Overhead',
          description: 'Switched geofence alerts to Fused Location batching.',
        },
        {
          id: 'and-e-3',
          category: 'fixed',
          title: 'Notification Shade Action on Android 15',
          description: 'Fixed snooze button responsiveness on locked screens.',
        },
      ],
      upgradeNotes: 'Rolling out to 100% of Google Play users over 48 hours.',
      contactOrFeedback: 'Support: android@transitmap.example',
    },
  },
  {
    slug: 'sprint-release-notes-template',
    name: 'Agile Sprint Release Notes Template',
    shortName: 'Agile Sprint',
    audience: 'Product owners, Scrum teams, internal stakeholders',
    bestFor: 'Two-week sprint reviews, demo days, stakeholder summaries',
    seoTitle: 'Agile Sprint Release Notes Template (Word & Markdown)',
    seoDescription:
      'Download an Agile sprint release notes template for Scrum teams. Summarize completed stories, bug fixes, and next-sprint carryover in minutes.',
    h1: 'Agile sprint release notes template',
    intro:
      'Designed for Scrum and Kanban teams wrapping up a sprint. Summarizes shipped stories, resolved defects, and staging verification for stakeholders.',
    templateDoc: {
      productName: '[Team / Product Squad]',
      version: 'Sprint [NN] (v[X.Y.Z])',
      releaseDate: '[YYYY-MM-DD]',
      audience: 'Product, Engineering, QA, Stakeholders',
      summary: '[Sprint goal achieved and overall deployment status.]',
      highlights: [
        '[Completed epic or user story #1]',
        '[Key tech-debt or reliability milestone]',
      ],
      items: [
        {
          id: 'spr-t-1',
          category: 'new',
          title: '[Shipped User Story]',
          description: '[User-facing outcome and demo link.]',
          ticketOrPr: 'JIRA-201',
        },
        {
          id: 'spr-t-2',
          category: 'improved',
          title: '[UX / Performance Story]',
          description: '[Measurable improvement delivered this sprint.]',
          ticketOrPr: 'JIRA-208',
        },
        {
          id: 'spr-t-3',
          category: 'fixed',
          title: '[Closed Bug Ticket]',
          description: '[Verified in staging by QA.]',
          ticketOrPr: 'JIRA-215',
        },
      ],
      upgradeNotes: 'Deployed to staging on [Date]; production release scheduled for [Date].',
      knownIssues: '[Carryover items moved to Sprint NN+1.]',
      contactOrFeedback: 'Sprint review recording: [link]',
    },
    exampleDoc: {
      productName: 'Checkout Squad',
      version: 'Sprint 48 (v3.11.0)',
      releaseDate: '2026-11-15',
      audience: 'Commerce Product, QA, Support',
      summary: 'Completed Apple Pay Express button on cart drawer and fixed VAT rounding for EU invoices.',
      highlights: [
        'Apple Pay Express passed end-to-end QA on Safari 18 and iOS 18.',
        'Carryover: Gift card partial redemption moves to Sprint 49.',
      ],
      items: [
        {
          id: 'spr-e-1',
          category: 'new',
          title: 'Apple Pay Express in Cart Drawer',
          description: 'Returning shoppers can check out in two taps without leaving the cart.',
          ticketOrPr: 'CHK-904',
        },
        {
          id: 'spr-e-2',
          category: 'fixed',
          title: 'EU VAT Half-Up Rounding',
          description: 'Aligned invoice line-item rounding with Stripe Tax totals.',
          ticketOrPr: 'CHK-912',
        },
      ],
      upgradeNotes: 'Feature flag `express_apple_pay` enabled at 100% in production.',
      knownIssues: 'Gift card partial balance UI scheduled for Sprint 49.',
      contactOrFeedback: 'Product Owner: @m.chen | #squad-checkout',
    },
  },
  {
    slug: 'qa-release-notes-template',
    name: 'QA & Testing Release Notes Template',
    shortName: 'QA & Testing',
    audience: 'QA engineers, release managers, test leads',
    bestFor: 'Build handoffs, regression test sign-off, UAT environments',
    seoTitle: 'QA Release Notes Template (Build Handoff & Test Scope)',
    seoDescription:
      'Structured QA release notes template for build handoffs, test environments, resolved defects, and regression scope.',
    h1: 'QA and testing release notes template',
    intro:
      'Built for developer-to-QA handoffs and UAT sign-off. Documents build numbers, environment URLs, fixed tickets ready for verification, and regression areas.',
    templateDoc: {
      productName: '[Application Name]',
      version: 'Build [NNN] / RC-[N]',
      releaseDate: '[YYYY-MM-DD]',
      audience: 'QA Team, Release Manager, UAT Reviewers',
      summary: '[Target test environment, branch/commit SHA, and regression focus areas.]',
      highlights: [
        '[Primary feature ready for functional testing]',
        '[High-priority regression area to verify]',
      ],
      items: [
        {
          id: 'qa-t-1',
          category: 'new',
          title: '[Feature Under Test]',
          description: '[Test account credentials or feature flag needed to verify.]',
          ticketOrPr: 'QA-301',
        },
        {
          id: 'qa-t-2',
          category: 'fixed',
          title: '[Bug Ready for Retest]',
          description: '[Steps to reproduce and expected passing behavior.]',
          ticketOrPr: 'QA-310',
        },
      ],
      upgradeNotes: 'Staging URL: [https://staging.example.com] | Seed script: `npm run seed:qa`',
      knownIssues: '[Known non-blocking issues excluded from this RC.]',
      contactOrFeedback: 'Build owner: @[engineer]',
    },
    exampleDoc: {
      productName: 'PatientPortal Web',
      version: 'v2.14.0-rc3 (Build 1842)',
      releaseDate: '2026-11-16',
      audience: 'QA & Clinical UAT Reviewers',
      summary: 'Release candidate 3 for appointment rescheduling and lab PDF accessibility fixes.',
      highlights: [
        'Focus regression on calendar timezone switching and screen-reader table headers.',
      ],
      items: [
        {
          id: 'qa-e-1',
          category: 'new',
          title: 'Self-Service Appointment Reschedule',
          description: 'Test with staging patient account `uat-patient-02` (flag `reschedule_v2=true`).',
          ticketOrPr: 'MED-441',
        },
        {
          id: 'qa-e-2',
          category: 'fixed',
          title: 'Lab Result Table ARIA Labels',
          description: 'Verify NVDA and VoiceOver announce column units for every lab row.',
          ticketOrPr: 'MED-455',
        },
      ],
      upgradeNotes: 'Deployed to `staging-eu`. Database snapshot refreshed at 08:00 UTC.',
      knownIssues: 'SMS reminder sandbox is mocked; check Mailhog for email notifications.',
      contactOrFeedback: 'QA Lead: @r.patel | #qa-release-channel',
    },
  },
  {
    slug: 'github-release-notes-template',
    name: 'GitHub Release Notes Template',
    shortName: 'GitHub Releases',
    audience: 'Open-source users, package consumers, contributors',
    bestFor: 'GitHub Releases tab, npm/PyPI packages, CLI tools',
    seoTitle: 'GitHub Release Notes Template (Markdown & Conventional Commits)',
    seoDescription:
      'Markdown release notes template designed for GitHub Releases, open-source packages, and CLI tools with contributor credits and upgrade commands.',
    h1: 'GitHub release notes template',
    intro:
      'Formatted specifically for the GitHub Releases page. Groups changes cleanly, highlights breaking changes first, and gives package upgrade commands.',
    templateDoc: {
      productName: '[owner/repo]',
      version: 'v[X.Y.Z]',
      releaseDate: '[YYYY-MM-DD]',
      audience: 'Contributors & package users',
      summary: '[Short release summary and full diff link.]',
      highlights: ['[Headline feature or breaking change notice]'],
      items: [
        {
          id: 'gh-t-1',
          category: 'new',
          title: '[Added CLI flag or API]',
          description: '[Short usage example.]',
          ticketOrPr: '#102',
        },
        {
          id: 'gh-t-2',
          category: 'fixed',
          title: '[Bug fix summary]',
          description: '[Thanks to @contributor for reporting.]',
          ticketOrPr: '#108',
        },
        {
          id: 'gh-t-3',
          category: 'breaking',
          title: '[Breaking change]',
          description: '[Required config or Node version update.]',
          ticketOrPr: '#110',
        },
      ],
      upgradeNotes: 'Upgrade: `npm install [package]@latest`',
      contactOrFeedback: 'Full changelog: https://github.com/[owner]/[repo]/compare/v[prev]...v[X.Y.Z]',
    },
    exampleDoc: {
      productName: 'changelog-software/cli',
      version: 'v1.6.0',
      releaseDate: '2026-11-16',
      audience: 'CLI users and CI/CD pipelines',
      summary: 'Adds `--format docx` export flag and drops Node 18 support in favor of Node 20+.',
      highlights: ['Generate Word (.docx) release notes directly in GitHub Actions.'],
      items: [
        {
          id: 'gh-e-1',
          category: 'new',
          title: 'Word (.docx) CLI Export Flag',
          description: 'Run `relnotes generate --format docx --out release.docx`.',
          ticketOrPr: '#84',
        },
        {
          id: 'gh-e-2',
          category: 'breaking',
          title: 'Minimum Node.js Version Raised to 20',
          description: 'Node 18 reached EOL; update CI runners to `node-version: 20` or `22`.',
          ticketOrPr: '#89',
        },
        {
          id: 'gh-e-3',
          category: 'fixed',
          title: 'Escaped Backticks in PR Titles',
          description: 'Prevented double-escaping when rendering Markdown headings.',
          ticketOrPr: '#91',
        },
      ],
      upgradeNotes: 'Upgrade: `npm install -g @changelog-software/cli@^1.6.0`',
      contactOrFeedback: 'Compare changes: v1.5.2...v1.6.0',
    },
  },
  {
    slug: 'release-notes-email-template',
    name: 'Customer Release Notes Email Template',
    shortName: 'Email Update',
    audience: 'Subscribed customers, trial users, account owners',
    bestFor: 'Monthly product update emails, customer newsletters, in-app announcements',
    seoTitle: 'Release Notes Email Template (Customer Product Update)',
    seoDescription:
      'Copy-ready customer release notes email template. Short, benefit-driven structure for monthly product update newsletters.',
    h1: 'Customer release notes email template',
    intro:
      'Written for customer inboxes. Focuses on one headline benefit, 2-3 scannable improvements, and a single call-to-action link back to your app.',
    templateDoc: {
      productName: '[Product Name] Monthly Update',
      version: '[Month YYYY]',
      releaseDate: '[YYYY-MM-DD]',
      audience: 'All active customers',
      summary: '[Friendly opening line: Here is what shipped in Product Name this month to save you time.]',
      highlights: [
        '[Main feature announcement with 1-sentence benefit]',
        '[Top customer-requested improvement]',
      ],
      items: [
        {
          id: 'em-t-1',
          category: 'new',
          title: '[Headline Feature]',
          description: '[Short explanation + where to try it.]',
        },
        {
          id: 'em-t-2',
          category: 'improved',
          title: '[Quality-of-Life Improvement]',
          description: '[Brief note on what feels faster or clearer.]',
        },
        {
          id: 'em-t-3',
          category: 'fixed',
          title: '[Notable Bug Fix]',
          description: '[Short reassurance that a reported issue is resolved.]',
        },
      ],
      upgradeNotes: 'Try the new features in your workspace today: [https://app.company.example]',
      contactOrFeedback: 'Reply directly to this email if you have feedback or questions.',
    },
    exampleDoc: {
      productName: 'Fieldwork Monthly Update',
      version: 'November 2026',
      releaseDate: '2026-11-16',
      audience: 'Workspace owners & analysts',
      summary: 'This month: automated PDF board reports, faster 90-day funnels, and cleaner Excel CSV exports.',
      highlights: [
        'Deliver weekly dashboard snapshots straight to Slack or email.',
      ],
      items: [
        {
          id: 'em-e-1',
          category: 'new',
          title: 'Scheduled PDF & Slack Reports',
          description: 'Click Share -> Schedule on any dashboard to automate Monday morning updates.',
        },
        {
          id: 'em-e-2',
          category: 'improved',
          title: 'Faster 90-Day Funnel Queries',
          description: 'Multi-step funnels over 1M+ events now load in around one second.',
        },
        {
          id: 'em-e-3',
          category: 'fixed',
          title: 'Excel UTF-8 Export Encoding',
          description: 'Accented characters now open cleanly in Excel without manual import steps.',
        },
      ],
      upgradeNotes: 'Log in to your workspace to schedule your first report.',
      contactOrFeedback: 'Hit reply anytime. Our product team reads every message.',
    },
  },
];
