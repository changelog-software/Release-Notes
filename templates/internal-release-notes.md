# [Service / Platform Name] release-[YYYY.MM.DD] / v[X.Y.Z]

**Release Date:** [YYYY-MM-DD] | **Audience:** Engineering, QA, DevOps, Support

[Scope of deployment, target environment (staging/prod), and release owner.]

## Highlights

- [Feature flag or migration status]
- [Key service dependency or config change]

## New Features

- **[Endpoint / Job / Internal Tooling]** (PR #412): [Behavior, feature flag name, and owner.]

## Improvements

- **[Query / Latency / Observability Change]** (PR #415): [Metrics expected to change post-deploy.]

## Bug Fixes

- **[Production Bug / Alert Fix]** (PR #419): [Root cause and verification steps in staging.]

## Breaking Changes

- **[Schema Migration / Env Var Change]** (PR #421): [Backward-compatibility notes and deploy order.]

## Upgrade & Deployment Notes

Deploy order: 1) Run DB migration `20261114_add_idx`, 2) Deploy worker, 3) Enable flag `new_billing_sync` at 10%.

## Known Issues

Rollback requires reverting worker image only; migration is additive and backward-compatible.

---

Release captain: @[handle] | #deployments Slack channel
