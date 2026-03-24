# 🌐 Setting Up the Browser Extension

PocketNotes works in **both Microsoft Edge and Google Chrome** using the same extension.

## Prerequisites

- A GitHub account
- Your PocketNotes repo (created from the template)
- A fine-grained GitHub Personal Access Token ([create one here](https://github.com/settings/tokens?type=beta))

## Creating Your GitHub Token

1. Go to **[github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta)**
2. Click **"Generate new token"**
3. Fill in:
   - **Token name**: `PocketNotes`
   - **Expiration**: Choose your preference (90 days, 1 year, or no expiration)
   - **Repository access**: Select **"Only select repositories"** → choose your PocketNotes repo
4. Under **Permissions → Repository permissions**:
   - **Actions**: Read and write ✅
   - **Contents**: Read and write ✅
5. Click **"Generate token"**
6. **Copy the token** — you won't be able to see it again!

> 🔒 **Security note**: This token can ONLY access your PocketNotes repo and can ONLY trigger Actions and read/write content. It cannot access any other repos.

## Installing the Extension

### Microsoft Edge

1. Navigate to `edge://extensions/` in Edge
2. Enable **"Developer mode"** (toggle in the bottom-left)
3. Click **"Load unpacked"**
4. Select the `extension/` folder from your cloned PocketNotes repo
5. The 📌 PocketNotes icon should appear in your toolbar

### Google Chrome

1. Navigate to `chrome://extensions/` in Chrome
2. Enable **"Developer mode"** (toggle in the top-right)
3. Click **"Load unpacked"**
4. Select the `extension/` folder from your cloned PocketNotes repo
5. The 📌 PocketNotes icon should appear in your toolbar
6. (Optional) Click the puzzle icon in the toolbar and pin PocketNotes

## Configuring the Extension

1. Click the 📌 PocketNotes icon in your toolbar
2. Click **"⚙️ Settings"** (or right-click the icon → "Options")
3. Enter:
   - **GitHub Personal Access Token**: Paste the token you created
   - **Repository Owner**: Your GitHub username
   - **Repository Name**: `PocketNotes` (or whatever you named your repo)
4. Click **"💾 Save Settings"**
5. Click **"🔍 Test Connection"** to verify everything works

### Optional: Copilot Spaces Integration

If you've set up a [Copilot Space](copilot-spaces.md) for your articles:

1. Open extension **Settings**
2. Scroll to the **Copilot Spaces** section
3. Paste your Space URL (e.g. `https://github.com/copilot/spaces/your-space-id`)
4. Click **Save Settings**

This adds a **"🔍 Search your knowledge base"** button to the extension popup, so you can either save a new article OR jump straight to conversational search over your saved articles.

## Using the Extension

1. Navigate to any article or blog post
2. Click the 📌 PocketNotes icon
3. (Optional) Add a personal note
4. Click **"📌 Save to PocketNotes"**
5. Done! The GitHub Action will process the article in the background

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Extension icon missing | Check `edge://extensions` or `chrome://extensions` — is it enabled? |
| "Not configured" warning | Open Settings and add your GitHub token and repo details |
| "Authentication failed" | Regenerate your GitHub token — it may have expired |
| "Workflow not found" | Make sure the `process-article.yml` file is in your repo's `.github/workflows/` folder |
| Save button stays disabled | Open Settings and ensure all three fields are filled in |

## Updating the Extension

When you pull new changes from the template repo:

1. Go to `edge://extensions` or `chrome://extensions`
2. Click the **refresh/reload** button on the PocketNotes extension card
3. Your settings are preserved — no need to reconfigure
