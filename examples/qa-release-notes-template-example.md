# PatientPortal Web v2.14.0-rc3 (Build 1842)

**Release Date:** 2026-11-16 | **Audience:** QA & Clinical UAT Reviewers

Release candidate 3 for appointment rescheduling and lab PDF accessibility fixes.

## Highlights

- Focus regression on calendar timezone switching and screen-reader table headers.

## New Features

- **Self-Service Appointment Reschedule** (MED-441): Test with staging patient account `uat-patient-02` (flag `reschedule_v2=true`).

## Bug Fixes

- **Lab Result Table ARIA Labels** (MED-455): Verify NVDA and VoiceOver announce column units for every lab row.

## Upgrade & Deployment Notes

Deployed to `staging-eu`. Database snapshot refreshed at 08:00 UTC.

## Known Issues

SMS reminder sandbox is mocked; check Mailhog for email notifications.

---

QA Lead: @r.patel | #qa-release-channel
