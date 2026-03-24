# 📱 Setting Up Mobile Access (iOS)

Save articles from **any app** on your iPhone or iPad.

There are two ways to save on iOS — the **PWA web app** (recommended) and the **iOS Shortcut**.

## Option 1: PWA Web App (Recommended)

The easiest way to save on mobile is the PocketNotes web app, hosted on GitHub Pages.

1. Open your PocketNotes web app URL in Safari (e.g. `https://your-username.github.io/PocketNotes/`)
2. Tap the **Share** button (📤) → **"Add to Home Screen"**
3. Open the app from your Home Screen and configure your GitHub token + repo details
4. To save an article: copy its URL → open PocketNotes → it auto-reads from clipboard → tap Save

### Optional: iOS Shortcut for Share Sheet

Create a simple Shortcut that opens the PWA with a URL pre-filled:

1. Open the **Shortcuts** app
2. Create a new Shortcut
3. Add one action: **"Open URLs"**
4. Set the URL to: `https://your-username.github.io/PocketNotes/#` and toggle **"Show More"** to accept input from Share Sheet
5. Name it **"PocketNotes"** and enable **"Show in Share Sheet"**

Now you can share from any app → PocketNotes → it opens the PWA with the URL ready to save.

### Copilot Spaces Search

If you configure a Copilot Space URL in the PWA settings, a **"🔍 Search your knowledge base"** button appears alongside the save button — so you can save OR search from the same app.

## Option 2: Direct API Shortcut

## Prerequisites

- An iPhone or iPad running iOS 15 or later
- The **Shortcuts** app (built into iOS)
- Your PocketNotes repo (created from the template)
- A fine-grained GitHub Personal Access Token

## Creating Your GitHub Token

Follow the same steps as the [browser extension setup](setup-extension.md#creating-your-github-token). You can use the same token for both the extension and the shortcut.

## Creating the Shortcut

See the detailed step-by-step guide in [ios-shortcut/README.md](../ios-shortcut/README.md).

**Summary of what the Shortcut does:**

1. Receives a URL from the Share Sheet
2. Sends it to the GitHub API (`workflow_dispatch`)
3. Shows a confirmation notification

The entire Shortcut is about 5 actions and takes ~2 minutes to set up.

## Using the Shortcut

1. Open any app (Chrome, Safari, Twitter, LinkedIn, etc.)
2. Find an article you want to save
3. Tap the **Share** button (📤)
4. Scroll down in the Share Sheet and tap **"PocketNotes"**
5. You'll see a notification: "📌 Saved to PocketNotes!"
6. The article will be processed by the GitHub Action in the background

### Tip: Move PocketNotes Higher in the Share Sheet

1. Open the Share Sheet from any app
2. Scroll to the bottom of the actions list
3. Tap **"Edit Actions..."**
4. Find PocketNotes and tap the **green +** button to add it to Favourites
5. Now it will appear near the top of your Share Sheet

## Sharing the Shortcut with Others

1. Open the **Shortcuts** app
2. Long-press the PocketNotes shortcut
3. Tap **"Share"** → **"Copy iCloud Link"**
4. Share the link with anyone

> ⚠️ **Important**: Remove your personal GitHub token from the Shortcut before sharing! Recipients will need to add their own token.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Shortcut not in Share Sheet | Open Shortcuts → tap PocketNotes → tap ⓘ → enable "Show in Share Sheet" |
| "Could not connect" | Check your GitHub token is correct and hasn't expired |
| "URL not found" | Make sure "Receive URLs" is selected in the Shortcut's Share Sheet settings |
| Action doesn't run on GitHub | Verify the `ref` is set to `main` (or your default branch name) |
| No confirmation notification | Check Settings → Notifications → Shortcuts is enabled |
