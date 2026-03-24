# 📱 PocketNotes iOS Shortcut

Save articles from **any app** on your iPhone or iPad using the iOS Share Sheet.

## How It Works

The Shortcut appears in your Share Sheet when you tap the share button in any app (Chrome, Safari, Twitter, LinkedIn, etc.). It sends the URL to your GitHub repo, which triggers the same GitHub Action that processes articles from the browser extension.

## Setup Instructions

### Step 1: Open the Shortcuts App

Open the **Shortcuts** app on your iPhone or iPad (it's built into iOS).

### Step 2: Create a New Shortcut

1. Tap the **+** button in the top right to create a new shortcut
2. Tap the shortcut name at the top and rename it to **"PocketNotes"**
3. Tap the **ⓘ** icon (or the dropdown arrow next to the name) and enable **"Show in Share Sheet"**
4. For **"Receive"** types, select **"URLs"**

### Step 3: Add the Actions

Add the following actions in order:

---

#### Action 1: Set Variable — GitHub Token

1. Search for **"Text"** and add it
2. Enter your GitHub Personal Access Token (the same one from the extension setup)
3. Add **"Set Variable"** and name it `GitHubToken`

#### Action 2: Set Variable — Repo Details

1. Add another **"Text"** action
2. Enter your repo in the format: `your-username/PocketNotes`
3. Add **"Set Variable"** and name it `RepoPath`

#### Action 3: Get URL from Share Sheet

1. Add **"Get URLs from Input"** — this extracts the URL from whatever you're sharing

#### Action 4: Send the API Request

1. Search for **"Get Contents of URL"** and add it
2. Set the URL to:
   ```
   https://api.github.com/repos/[RepoPath]/actions/workflows/process-article.yml/dispatches
   ```
   (Use the `RepoPath` variable from Step 2)
3. Set **Method** to **POST**
4. Add these **Headers**:
   - `Authorization`: `Bearer [GitHubToken]` (use the variable)
   - `Accept`: `application/vnd.github.v3+json`
   - `Content-Type`: `application/json`
5. Set **Request Body** to **JSON** with this structure:
   ```json
   {
     "ref": "main",
     "inputs": {
       "url": "[URLs from Step 3]"
     }
   }
   ```

#### Action 5: Show Confirmation

1. Add **"Show Notification"**
2. Set the message to: `📌 Saved to PocketNotes!`

---

### Step 4: Test It

1. Open Chrome or Safari on your iPhone
2. Navigate to any article
3. Tap the **Share** button
4. Scroll down and tap **"PocketNotes"**
5. You should see the notification "📌 Saved to PocketNotes!"
6. Check your GitHub repo — the Action should be running

## Quick Reference — Complete Shortcut Flow

```
┌─────────────────────────────────────┐
│  Receive [URLs] from Share Sheet    │
├─────────────────────────────────────┤
│  Text: "github_pat_xxxxx"          │
│  Set variable: GitHubToken          │
├─────────────────────────────────────┤
│  Text: "username/PocketNotes"       │
│  Set variable: RepoPath             │
├─────────────────────────────────────┤
│  Get URLs from Shortcut Input       │
│  Set variable: ArticleURL           │
├─────────────────────────────────────┤
│  Get Contents of URL:               │
│  POST https://api.github.com/repos/ │
│    {RepoPath}/actions/workflows/    │
│    process-article.yml/dispatches   │
│  Headers:                           │
│    Authorization: Bearer {Token}    │
│    Accept: application/vnd.github+  │
│    Content-Type: application/json   │
│  Body (JSON):                       │
│    ref: "main"                      │
│    inputs.url: {ArticleURL}         │
├─────────────────────────────────────┤
│  Show Notification:                 │
│  "📌 Saved to PocketNotes!"         │
└─────────────────────────────────────┘
```

## Sharing This Shortcut

Once you've created the Shortcut, you can share it with others:

1. Open the Shortcuts app
2. Long-press on the PocketNotes shortcut
3. Tap **"Share"**
4. Choose **"Copy iCloud Link"**
5. Share the link — anyone can install it with one tap

> **Important**: Before sharing, clear your GitHub token from the shortcut! The recipient will need to enter their own token.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Shortcut doesn't appear in Share Sheet | Open Shortcut settings → ensure "Show in Share Sheet" is enabled |
| "Could not connect" error | Check your GitHub token is correct and has Actions write permission |
| Action doesn't trigger | Ensure the `ref` matches your default branch (usually `main`) |
| No notification | Check iOS notification settings for the Shortcuts app |

## Alternative: Optional Note Input

To add a personal note before saving, insert this action before the API request:

1. Add **"Ask for Input"** with prompt: "Add a note (optional)"
2. Set variable: `ArticleNote`
3. In the API request body, add: `"note": "[ArticleNote]"` to the `inputs` object
