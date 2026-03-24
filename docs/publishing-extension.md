# 🏪 Publishing to Browser Extension Stores

This guide covers publishing PocketNotes to the Edge Add-ons and Chrome Web Store.

## Packaging the Extension

Before submitting to either store, create a ZIP of the extension folder:

1. Navigate to the `extension/` directory
2. Select **all files** inside it (manifest.json, popup.html, popup.js, options.html, options.js, icons/)
3. Create a ZIP archive — the files should be at the **root** of the ZIP (not inside a subfolder)

Or use the command line:

```bash
cd extension
zip -r ../pocketnotes-extension.zip . -x "*.crx" "*.pem"
```

On Windows (PowerShell):
```powershell
cd extension
Compress-Archive -Path * -DestinationPath ..\pocketnotes-extension.zip -Force
```

## Microsoft Edge Add-ons (Free)

### Register as a Developer

1. Go to [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview)
2. Sign in with your Microsoft account
3. Complete the developer registration (free)

### Submit the Extension

1. Click **"Create new extension"**
2. Upload your `pocketnotes-extension.zip`
3. Fill in the listing details:

**Extension name**: `PocketNotes`

**Short description** (132 chars max):
```
Save articles with one click. AI summarises and tags them in your GitHub repo. Your personal knowledge base.
```

**Full description**:
```
PocketNotes lets you save articles, blog posts, and links with a single click. A GitHub Action automatically fetches the content, generates an AI-powered summary, and adds smart tags.

✨ Features:
• One-click save from any webpage
• AI-powered summaries and auto-tagging
• Stored as searchable markdown in your own GitHub repo
• Zero servers — runs entirely on GitHub Actions (free tier)
• Works with GitHub Models, OpenAI, or Azure OpenAI
• Open source — inspect every line of code

🔒 Privacy:
• Your GitHub token stays on your device
• No analytics, tracking, or data collection
• Only communicates with GitHub's API
• Minimal permissions (activeTab + storage only)

📦 Setup:
1. Fork the PocketNotes template repo on GitHub
2. Create a fine-grained GitHub PAT
3. Install the extension and add your token in Settings
4. Start saving articles!

PocketNotes is open source: https://github.com/YOUR_USERNAME/PocketNotes
```

4. **Category**: Productivity
5. **Privacy policy URL**: Link to your `docs/privacy-policy.md` on GitHub (or GitHub Pages)
6. Upload **screenshots** (1280×800 or 640×480 recommended)
7. Submit for review (typically 1–3 business days)

## Chrome Web Store ($5 one-time fee)

### Register as a Developer

1. Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay the one-time $5 registration fee
3. Complete your developer profile

### Submit the Extension

1. Click **"New Item"**
2. Upload your `pocketnotes-extension.zip`
3. Fill in the listing details (same content as Edge above)
4. **Category**: Productivity
5. **Privacy practices**:
   - Does not collect user data ✅
   - Single purpose: "Saves article URLs to the user's GitHub repository" 
   - Privacy policy URL: Link to your privacy policy
6. Upload screenshots
7. Submit for review

## Store Screenshots

You'll need 1–3 screenshots showing:

1. **The popup** — showing a page title/URL ready to save
2. **The settings page** — showing the configuration fields
3. **A saved article** — showing the markdown output in your GitHub repo

### Taking Screenshots

1. Open the extension popup on an interesting article
2. Use your OS screenshot tool or browser DevTools (F12 → device toolbar for exact dimensions)
3. Recommended size: **1280×800** pixels
4. PNG format

## After Publishing

Once approved, your extension gets a store URL that you can share:
- Edge: `https://microsoftedge.microsoft.com/addons/detail/pocketnotes/EXTENSION_ID`
- Chrome: `https://chrome.google.com/webstore/detail/pocketnotes/EXTENSION_ID`

Add these links to your README.md for easy installation!

## Updating the Extension

When you push changes:
1. Update the `version` in `manifest.json` (e.g., `"1.0.0"` → `"1.0.1"`)
2. Create a new ZIP
3. Upload the new ZIP in the respective developer dashboard
4. Updates typically review faster than initial submissions
