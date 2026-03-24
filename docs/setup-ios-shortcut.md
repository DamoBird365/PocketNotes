# 📱 Setting Up the iOS Shortcut

Save articles from **any app** on your iPhone or iPad using the Share Sheet.

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
