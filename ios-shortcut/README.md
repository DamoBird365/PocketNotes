# 📱 PocketNotes iOS Shortcut

Save articles from **any app** on your iPhone or iPad using the iOS Share Sheet.

## How It Works

The Shortcut appears in your Share Sheet when you tap the share button in any app (Chrome, Safari, Twitter, LinkedIn, etc.). It sends the URL to your GitHub repo, which triggers the same GitHub Action that processes articles from the browser extension.

## Quick Install (Download the Shortcut File)

The easiest way to install is to download the pre-built Shortcut file:

1. **On your iPhone**, open this page in Safari or Chrome
2. Tap the **[PocketNotes.shortcut](PocketNotes.shortcut)** file link
3. iOS will ask to open it in the **Shortcuts** app — tap **"Open"**
4. During import, you'll be prompted for two things:
   - **GitHub Personal Access Token** — paste the same PAT you use for the browser extension
   - **GitHub repo path** — enter `your-username/PocketNotes` (e.g. `DamoBird365/PocketNotes`)
5. Tap **"Add Shortcut"**
6. That's it! PocketNotes now appears in your Share Sheet 🎉

> **Note**: If you see a message about "Untrusted Shortcuts", go to **Settings → Shortcuts** and enable **"Allow Untrusted Shortcuts"**. You need to have run at least one shortcut before this option appears.

## Using the Shortcut

1. Open any app (Chrome, Safari, Twitter, LinkedIn, etc.)
2. Find an article you want to save
3. Tap the **Share** button (📤)
4. Scroll down and tap **"PocketNotes"**
5. You'll see a notification: "📌 Saved to PocketNotes!"

### Tip: Move PocketNotes Higher in the Share Sheet

1. Open the Share Sheet from any app
2. Scroll to the bottom of the actions list
3. Tap **"Edit Actions..."**
4. Find PocketNotes and tap the **green +** button to add it to Favourites

## What the Shortcut Does (Under the Hood)

```
┌─────────────────────────────────────┐
│  Receive URL from Share Sheet       │
├─────────────────────────────────────┤
│  Load saved Token + Repo path       │
├─────────────────────────────────────┤
│  Extract URL from shared content    │
├─────────────────────────────────────┤
│  POST to GitHub API:                │
│  /repos/{Repo}/actions/workflows/   │
│  process-article.yml/dispatches     │
│  with Authorization: Bearer {Token} │
│  Body: {"ref":"main",              │
│         "inputs":{"url":"..."}}     │
├─────────────────────────────────────┤
│  Show: "📌 Saved to PocketNotes!"   │
└─────────────────────────────────────┘
```

## Manual Setup (Alternative)

If the Shortcut file doesn't work on your iOS version, you can build it manually:

1. Open the **Shortcuts** app
2. Tap **+** to create a new shortcut → name it **"PocketNotes"**
3. Tap the **ⓘ** → enable **"Show in Share Sheet"** → set Receive to **"URLs"**
4. Add these actions in order:
   - **Text** → paste your GitHub PAT → **Set Variable**: `Token`
   - **Text** → type `your-username/PocketNotes` → **Set Variable**: `Repo`
   - **Get URLs from** Shortcut Input → **Set Variable**: `ArticleURL`
   - **Get Contents of URL**:
     - URL: `https://api.github.com/repos/[Repo]/actions/workflows/process-article.yml/dispatches`
     - Method: **POST**
     - Headers: `Authorization: Bearer [Token]`, `Accept: application/vnd.github.v3+json`
     - Body (JSON): `{"ref": "main", "inputs": {"url": "[ArticleURL]"}}`
   - **Show Notification**: "📌 Saved to PocketNotes!"

## Sharing This Shortcut

The `PocketNotes.shortcut` file in this folder can be shared with anyone. When they import it, iOS prompts them for their own GitHub token and repo path — your credentials are never included.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Untrusted Shortcut" warning | Settings → Shortcuts → Allow Untrusted Shortcuts |
| Shortcut doesn't appear in Share Sheet | Open Shortcuts → tap PocketNotes → ⓘ → enable "Show in Share Sheet" |
| "Could not connect" error | Check your GitHub token is correct and hasn't expired |
| Action doesn't trigger on GitHub | Verify the repo path is correct (username/RepoName format) |
| No notification | Check Settings → Notifications → Shortcuts is enabled |
