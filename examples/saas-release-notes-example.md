# Fieldwork Analytics v2.4.0

**Release Date:** 2026-11-12 | **Audience:** All Fieldwork Analytics workspaces

Scheduled PDF board reports, faster 90-day funnel queries, and improved CSV export reliability.

## Highlights

- Schedule weekly or monthly PDF reports straight to Slack or email.
- Pre-aggregated daily rollups keep 90-day funnel queries under 1.2s on 1M+ events.

## New Features

- **Scheduled PDF & Slack Reports**: Open any dashboard, click Share -> Schedule, and choose a daily, weekly, or monthly delivery cadence.
- **Workspace Role Templates**: Admins can now assign Analyst, Editor, or Billing-Only presets when inviting teammates.

## Improvements

- **Faster 90-Day Funnel Queries**: Pre-aggregated daily rollups cut query time from 4.8s to 1.2s on multi-step funnels with more than 1M events.

## Bug Fixes

- **UTF-8 Characters in CSV Exports**: Fixed an issue where accented characters and CJK text displayed incorrectly when opening exported CSVs in Excel.
- **Timezone Offset in Retention Charts**: Cohort retention tables now consistently align with your workspace timezone instead of UTC.

## Upgrade & Deployment Notes

Rollout is complete for all workspaces. Refresh your browser tab to load v2.4.0.

---

Need help setting up scheduled reports? Email support@fieldwork.example.
