# VaultGrid Enterprise v7.0.0 (2026 Q4)

**Release Date:** 2026-11-08 | **Audience:** Org Admins, Security Officers, Enterprise Plan Customers

Introduces Okta/Entra SCIM group-to-role mapping, immutable SIEM streaming, and EU data residency controls.

## Highlights

- SCIM 2.0 group push now maps directly to custom workspace roles.
- Audit logs stream in real time to Datadog, Splunk, and AWS S3.

## New Features

- **Real-Time SIEM Log Streaming**: Configure webhook or S3 log delivery in Admin -> Security -> Audit Streaming with configurable retention.

## Improvements

- **Bulk User Provisioning via CSV & SCIM**: Supports up to 10,000 directory sync operations per batch without rate-limit throttling.

## Bug Fixes

- **SAML RelayState Redirect on Deep Links**: Users clicking shared report links before authenticating now land directly on the target report after SSO.

## Security Updates

- **Enforce Hardware MFA for Billing & Owner Roles**: Org Owners can now require FIDO2/WebAuthn security keys for privileged account actions.

## Upgrade & Deployment Notes

Existing SAML configurations continue working without changes. To enable SCIM group mapping, regenerate your SCIM bearer token.

---

Enterprise Support: enterprise@vaultgrid.example
