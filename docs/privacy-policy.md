# Privacy Policy — PocketNotes Browser Extension

**Last updated**: 24 March 2026

## Overview

PocketNotes is an open-source browser extension that saves article URLs to your personal GitHub repository. Your privacy is important — the extension is designed to collect the absolute minimum data needed to function.

## What Data is Collected

### Data the extension accesses:
- **Current tab URL and title** — only when you click the "Save" button in the extension popup. This is sent to the GitHub API to trigger your article-saving workflow.
- **Optional personal note** — only if you type one before saving. This is sent alongside the URL.

### Data the extension stores locally:
- **GitHub Personal Access Token** — stored in your browser's local extension storage (`chrome.storage.local`). This never leaves your device except when making authenticated requests to the GitHub API.
- **Repository owner and name** — stored locally to know which repo to send articles to.

## What Data is NOT Collected

- ❌ No browsing history
- ❌ No analytics or telemetry
- ❌ No cookies or tracking
- ❌ No personal information beyond what you explicitly configure
- ❌ No data sent to any third party (only GitHub's API)
- ❌ No background data collection — the extension only activates when you click its icon

## Where Data is Sent

Data is sent to **one destination only**: the GitHub REST API (`api.github.com`), specifically to trigger a GitHub Actions workflow dispatch on your own repository. No other servers, services, or third parties receive any data.

## Data Storage

All settings (token, repo details) are stored locally in your browser using `chrome.storage.local`. This data is:
- Encrypted by the browser
- Not synced across devices
- Deleted when you uninstall the extension

## Permissions Explained

| Permission | Why It's Needed |
|------------|----------------|
| `activeTab` | To read the URL and title of the current tab when you click "Save" |
| `storage` | To save your GitHub token and repo settings locally |

The extension requests **no other permissions** — no access to browsing history, all tabs, downloads, or any other browser data.

## Open Source

PocketNotes is fully open source. You can inspect every line of code to verify these claims:
- [Extension source code](https://github.com/YOUR_USERNAME/PocketNotes/tree/main/extension)

## Changes to This Policy

Any changes to this privacy policy will be reflected in this document with an updated date. As an open-source project, all changes are visible in the git history.

## Contact

If you have questions about this privacy policy, please [open an issue](https://github.com/YOUR_USERNAME/PocketNotes/issues) on the GitHub repository.
