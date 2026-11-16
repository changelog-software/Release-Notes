# Billing Core Service v2026.11.14-rc2

**Release Date:** 2026-11-14 | **Audience:** Backend Engineering, SRE, Support Escalations

Idempotent webhook retries for Stripe v2026 events, plus read-replica routing for invoice PDFs.

## Highlights

- Feature flag `stripe_idempotency_v2` defaults to 25% traffic in production.
- Additive index migration `20261114_idx_invoices_org` runs online with zero table lock.

## New Features

- **Dead-Letter Replay CLI for Failed Webhooks** (PR #1284): Added `bin/replay-dlq --since 24h` so on-call engineers can safely re-drive failed billing events.

## Improvements

- **Route Invoice History Queries to Read Replica** (PR #1289): Reduces primary Postgres CPU by ~18% during end-of-month billing runs.

## Bug Fixes

- **Duplicate Tax Line on Prorated Upgrades** (PR #1292): Fixed rounding drift when seats were added and removed within the same 1-hour window.

## Upgrade & Deployment Notes

Run `npm run db:migrate` before rolling pods. New env var `DLQ_MAX_RETRIES=5` has a safe default.

## Known Issues

None blocking. Monitor `billing_webhook_latency_p99` for 30 minutes post-deploy.

---

On-call owner: @a.kim | Runbook: internal-docs/billing-deploy
