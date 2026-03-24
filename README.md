# 📌 PocketNotes

**Save articles from anywhere. AI summarises and tags them. Your personal knowledge base — powered by GitHub.**

PocketNotes lets you save articles, blog posts, and links from any device with a single click. A GitHub Action automatically fetches the content, generates an AI summary, and adds smart tags. Everything is stored as clean markdown files in your own GitHub repo.

## ✨ Features

- **One-click save** from Edge, Chrome, or any iOS app
- **AI-powered summaries** — automatically extracts key points
- **Smart tagging** — auto-detects topics in kebab-case (`power-platform`, `ai`, `career`)
- **Cross-device** — Chromium extension for desktop, iOS Shortcut for mobile
- **Zero servers** — runs entirely on GitHub Actions (free tier)
- **Searchable** — markdown files with YAML frontmatter, works with GitHub search, Copilot, and Copilot Spaces
- **Shareable** — template repo that anyone can fork for their own knowledge base

## 🚀 Quick Start

### 1. Create Your Own PocketNotes

Click **"Use this template"** above to create your own repo (public or private — your choice).

### 2. Create a GitHub Personal Access Token

1. Go to [github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta) (fine-grained tokens)
2. Click **"Generate new token"**
3. Set the token name to `PocketNotes`
4. Under **Repository access**, select **"Only select repositories"** and choose your PocketNotes repo
5. Under **Permissions → Repository permissions**, set:
   - **Actions**: Read and write
   - **Contents**: Read and write
6. Click **"Generate token"** and copy it — you'll need it for the extension and/or iOS Shortcut

### 3. Install the Browser Extension (Edge / Chrome)

1. Download or clone this repo
2. Open your browser's extension management page:
   - **Edge**: `edge://extensions`
   - **Chrome**: `chrome://extensions`
3. Enable **Developer mode**
4. Click **"Load unpacked"** and select the `extension/` folder
5. Click the PocketNotes icon in your toolbar → **Settings** → paste your GitHub PAT and set your repo details

See [docs/setup-extension.md](docs/setup-extension.md) for detailed instructions.

### 4. Install the iOS Shortcut (iPhone / iPad)

1. Open the [PocketNotes Shortcut setup guide](ios-shortcut/README.md)
2. Follow the step-by-step instructions to create the Shortcut
3. The Shortcut appears in your **Share Sheet** — use it from Chrome, Safari, Twitter, LinkedIn, or any app

See [docs/setup-ios-shortcut.md](docs/setup-ios-shortcut.md) for detailed instructions.

## 📁 How It Works

```
You see an article → Click extension button or iOS Share Sheet
                           │
                           ▼
                  GitHub API (workflow_dispatch)
                           │
                           ▼
                  GitHub Action fires:
                  1. Fetches article content
                  2. AI generates summary + tags
                  3. Creates markdown file
                  4. Commits to your repo
                           │
                           ▼
              /articles/2026-03-24-article-title.md
```

### Saved Article Format

Each article is saved as a markdown file with YAML frontmatter:

```markdown
---
title: "Building Copilot Agents with Power Platform"
url: "https://example.com/article"
date_saved: "2026-03-24T15:30:00Z"
source_platform: "linkedin"
summary: "A deep dive into creating custom Copilot agents..."
tags:
  - power-platform
  - copilot-studio
  - ai
read: false
---

## Summary

A detailed AI-generated summary of the article...

## Key Points

- Point 1
- Point 2
- Point 3
```

## ⚙️ Configuration

Edit `config.yml` to customise PocketNotes:

```yaml
ai:
  provider: "github-models"    # Options: github-models, openai, azure-openai
  model: "gpt-4o-mini"

article:
  include_key_points: true
  include_full_summary: true
```

See [docs/custom-ai-provider.md](docs/custom-ai-provider.md) for using your own AI provider.

## 🔒 Security

- Your GitHub PAT is stored **locally on your device** (browser extension storage / iOS Shortcut)
- The PAT is scoped to **a single repo** with minimal permissions
- `workflow_dispatch` requires authentication — nobody can trigger it without your token
- The shared template ships with **zero credentials**
- URL validation in the Action rejects suspicious inputs

## 🔍 Searching Your Knowledge Base

- **GitHub Search**: Use the repo's search bar to find articles by title, tag, or content
- **GitHub Copilot**: Ask Copilot about your saved articles directly in the repo
- **Copilot Spaces**: Create a Space pointing at your PocketNotes repo for conversational search
- **Future**: Designed for easy integration with RAG pipelines and vector search

## 📚 Documentation

- [Setting up the browser extension](docs/setup-extension.md)
- [Setting up the iOS Shortcut](docs/setup-ios-shortcut.md)
- [Using a custom AI provider](docs/custom-ai-provider.md)
- [Publishing to extension stores](docs/publishing-extension.md)
- [Privacy policy](docs/privacy-policy.md)
- [Contributing](docs/contributing.md)

## 🤝 Contributing

Contributions are welcome! See [docs/contributing.md](docs/contributing.md) for guidelines.

## 📄 Licence

MIT — use it, fork it, share it.
