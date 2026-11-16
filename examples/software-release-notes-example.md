# SyncDesk Desktop v4.2.1

**Release Date:** 2026-11-10 | **Audience:** macOS, Windows, and Linux desktop users

Adds offline conflict resolution, reduces idle memory usage by 35%, and patches a file-watcher crash on macOS.

## Highlights

- Side-by-side offline conflict resolver keeps both versions before syncing.
- Idle RAM footprint dropped from 420 MB to 270 MB on large workspaces.

## New Features

- **Interactive Conflict Resolver** (SD-842): When two offline edits touch the same file, SyncDesk now shows a side-by-side diff instead of creating duplicate "(conflicted copy)" files.

## Improvements

- **Lower Idle Memory Usage** (SD-851): Replaced polling file watchers with native OS event streams, cutting background RAM usage by 35%.

## Bug Fixes

- **Crash When Renaming Nested Folders on macOS** (SD-864): Resolved a race condition in FSEvents handling when moving folders containing more than 500 files.

## Security Updates

- **OpenSSL Updated to 3.3.2**: Bundled TLS runtime updated to address upstream security advisories.

## Upgrade & Deployment Notes

Auto-updates apply on next restart. Enterprise MSI and DMG installers are available on the Releases page.

## Known Issues

Windows ARM64 users on Insider builds may see a 2-second delay on first launch after updating.

---

Support: support@syncdesk.example | Issue tracker: github.com/example/syncdesk/issues
