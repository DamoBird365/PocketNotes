# 📱 PocketNotes on Mobile

Save articles from **any app** on your iPhone, iPad, or Android device.

## Option 1: Web App (Recommended — works everywhere)

PocketNotes has a lightweight web app you can add to your Home Screen. It works like a native app.

### Install

1. Open **[https://damobird365.github.io/PocketNotes/](https://damobird365.github.io/PocketNotes/)** on your phone
2. **iPhone**: Tap Share (📤) → **"Add to Home Screen"**
3. **Android**: Tap the menu (⋮) → **"Add to Home Screen"** or **"Install App"**
4. Open the app → enter your GitHub PAT and repo details → **Save & Continue**

### Usage

**Method A — Paste (fastest)**:
1. Copy the article URL from any app
2. Open PocketNotes from your Home Screen
3. Tap the clipboard area → URL is pasted automatically
4. Tap **"📌 Save to PocketNotes"**

**Method B — iOS Share Sheet** (optional, needs a 2-action Shortcut):

Create this tiny Shortcut to add PocketNotes to your Share Sheet:

1. Open the **Shortcuts** app → tap **+**
2. Name it **"PocketNotes"**
3. Tap the **ⓘ** (or dropdown) → enable **"Show in Share Sheet"** → Receive: **URLs**
4. Add action: **"Open URLs"**
5. For the URL, tap the blue **"URL"** placeholder and change it to:
   ```
   https://damobird365.github.io/PocketNotes/?url=
   ```
   then tap **+** and insert **"Shortcut Input"** at the end
6. Done! Now when you share from any app, tap "PocketNotes" and it opens the web app with the URL pre-filled

## Option 2: Direct API Shortcut (No web app needed)

If you prefer a fully offline Shortcut that calls GitHub directly:

1. Open the **Shortcuts** app → tap **+**
2. Name it **"PocketNotes"**
3. Tap **ⓘ** → enable **"Show in Share Sheet"** → Receive: **URLs**
4. Add these actions:

**Action 1**: Search for **"Get Contents of URL"** and add it:
   - Tap the URL field → tap **"Shortcut Input"** to use the shared URL... wait, we need to build the API call. This is simpler:

**The simpler way**:

| Step | Action | Details |
|------|--------|---------|
| 1 | **Text** | Type your GitHub PAT (e.g., `github_pat_xxxxx`) |
| 2 | **Set Variable** | Name: `Token` |
| 3 | **Get URLs from** | Select: Shortcut Input |
| 4 | **Set Variable** | Name: `URL` |
| 5 | **Get Contents of URL** | See below |
| 6 | **Show Notification** | Title: PocketNotes, Body: 📌 Saved! |

**For Step 5 — Get Contents of URL**:
- URL: `https://api.github.com/repos/YOUR_USERNAME/PocketNotes/actions/workflows/process-article.yml/dispatches`
- Method: **POST**
- Headers:
  - `Authorization` → `Bearer ` then insert the **Token** variable
  - `Accept` → `application/vnd.github.v3+json`
- Request Body: **JSON**
  - Key `ref` → Value `main`
  - Key `inputs` → Value (Dictionary) with key `url` → Value: the **URL** variable

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Web app doesn't auto-paste | Grant clipboard permission when prompted, or paste manually |
| Share Sheet doesn't show PocketNotes | Open the Shortcut → ⓘ → enable "Show in Share Sheet" |
| Auth error | Check your PAT hasn't expired; re-enter it in Settings |
| Action doesn't trigger | Verify the repo path and branch name (`main`) are correct |
