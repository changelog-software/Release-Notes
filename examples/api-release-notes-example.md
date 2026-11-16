# PayFlow Developer API v3.2.0 (API 2026-11-01)

**Release Date:** 2026-11-11 | **Audience:** Backend & SDK integrators

Adds cursor-based pagination to `/v3/payouts`, idempotency key headers on refunds, and TypeScript v5.6 strict types.

## Highlights

- Cursor pagination (`starting_after`) replaces offset pagination on high-volume payout lists.
- Legacy `offset` parameter is deprecated and will sunset on 2027-05-01.

## New Features

- **POST /v3/refunds Supports Idempotency-Key**: Pass a UUID in the `Idempotency-Key` header to safely retry refund requests for up to 24 hours.

## Improvements

- **Structured Validation Error Codes**: 422 responses now include `field` and `code` properties for programmatic form error mapping.

## Bug Fixes

- **Nullability Types in @payflow/node v3.2.0**: Marked `payout.failure_reason` as `string | null` to match live JSON responses.

## Breaking Changes

- **Deprecation of `offset` on GET /v3/payouts**: Switch to `starting_after` cursor pagination. Existing `offset` requests return a `Deprecation` header until May 1, 2027.

## Upgrade & Deployment Notes

Upgrade Node SDK: `npm install @payflow/node@^3.2.0`

---

Developer Discord & Changelog: developers.payflow.example
