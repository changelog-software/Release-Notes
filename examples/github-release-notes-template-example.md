# changelog-software/cli v1.6.0

**Release Date:** 2026-11-16 | **Audience:** CLI users and CI/CD pipelines

Adds `--format docx` export flag and drops Node 18 support in favor of Node 20+.

## Highlights

- Generate Word (.docx) release notes directly in GitHub Actions.

## New Features

- **Word (.docx) CLI Export Flag** (#84): Run `relnotes generate --format docx --out release.docx`.

## Bug Fixes

- **Escaped Backticks in PR Titles** (#91): Prevented double-escaping when rendering Markdown headings.

## Breaking Changes

- **Minimum Node.js Version Raised to 20** (#89): Node 18 reached EOL; update CI runners to `node-version: 20` or `22`.

## Upgrade & Deployment Notes

Upgrade: `npm install -g @changelog-software/cli@^1.6.0`

---

Compare changes: v1.5.2...v1.6.0
