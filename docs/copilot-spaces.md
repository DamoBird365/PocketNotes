# 🔍 Copilot Spaces — Conversational Search for Your Articles

**Turn your PocketNotes into a searchable knowledge assistant.** Copilot Spaces lets you ask natural-language questions over your saved articles and get grounded, contextual answers.

## What is Copilot Spaces?

[GitHub Copilot Spaces](https://github.com/copilot/spaces) is a feature that lets you create a conversational AI layer over any collection of files. Point a Space at your PocketNotes `articles/` folder and you can ask things like:

- *"What have I saved about Power Automate?"*
- *"Which articles are tagged with copilot-studio?"*
- *"Summarise the Microsoft Learn docs I've bookmarked this week"*
- *"Find me that YouTube video about AI agents"*
- *"What blog posts has Valentin written?"*
- *"Compare the approaches described in my saved AI articles"*

Copilot reads the markdown files — including the YAML frontmatter (title, tags, summary, author, content_type) — and grounds every answer in **your actual saved content**.

## Requirements

- A GitHub account with **Copilot Free, Pro, Pro+, Business, or Enterprise**
- Your PocketNotes repo (public or private — both work)

## Setup (2 minutes)

### 1. Create a Space

1. Go to [github.com/copilot/spaces](https://github.com/copilot/spaces)
2. Click **"Create space"**
3. Name it something like `My PocketNotes` or `Knowledge Base`
4. Set the owner to **yourself** (personal space) or your **organisation** if you want to share it

### 2. Add Your Articles as a Source

1. In your new Space, click **"Add sources"**
2. Choose **"Add files and repositories"**
3. Select your PocketNotes repo (e.g. `YourUsername/PocketNotes`)
4. **Scope it to the `articles/` folder** — this keeps the Space focused on your saved content rather than the extension code

> 💡 **Tip**: The Space always reads the latest version of your files from the `main` branch. Every time you save a new article, it's immediately available in your Space — no manual refresh needed.

### 3. Add Custom Instructions

Click **"Add instructions"** and paste something like:

```
You are a knowledge assistant for my PocketNotes — a personal collection of saved articles, blog posts, videos, and documentation.

Each markdown file has YAML frontmatter with:
- title: the article title
- url: the original source URL
- date_saved: when I saved it
- content_type: article, blog-post, video, social-post, documentation, tutorial, etc.
- source_platform: where it came from (linkedin, youtube, microsoft-learn, etc.)
- author: who wrote it (when available)
- summary: an AI-generated summary
- tags: topic tags in kebab-case
- read: whether I've read it (true/false)

Use this metadata to answer questions precisely. When listing articles, include the title and URL. When I ask about topics, check both tags and summary content. If I ask what I haven't read yet, check the "read" field.
```

### 4. Start Asking Questions

Your Space is ready! Click into the chat and try:

| Question | What it does |
|---|---|
| *"What articles do I have about Copilot Studio?"* | Searches tags and summaries |
| *"List everything I haven't read yet"* | Filters by `read: false` |
| *"What did I save from Microsoft Learn?"* | Filters by `source_platform` |
| *"Show me articles by Valentin Mazhar"* | Searches the `author` field |
| *"What YouTube videos have I bookmarked?"* | Filters by `content_type: video` |
| *"Summarise the key themes across my AI articles"* | Cross-article synthesis |
| *"Which articles mention Power Automate flows?"* | Full-text search across summaries |

## Sharing Your Space

- **Personal Space**: Only you can access it — perfect for private repos
- **Organisation Space**: Share with team members via GitHub permissions
- **Public repo + shared Space**: Others who fork your PocketNotes template can create their own Space over their own articles

> ⚠️ A Copilot Space is tied to your account — it can't be pre-created by a template. Each PocketNotes user creates their own Space.

## Tips

- **Scope matters**: Point the Space at `articles/` not the whole repo. This stops Copilot from confusing your saved articles with the extension source code.
- **Instructions help**: The custom instructions above tell Copilot about the frontmatter schema, which dramatically improves answer quality.
- **Combine with GitHub Search**: For quick keyword lookups, GitHub's built-in search is faster. Use Copilot Spaces when you want conversational answers, comparisons, or synthesis across multiple articles.
- **Works on mobile**: Access your Space from the GitHub mobile app or github.com on your phone.

## How It Fits Together

```
Save article → GitHub Action → markdown in articles/
                                        │
                                        ├── GitHub Search (keyword)
                                        ├── Copilot Spaces (conversational AI)
                                        └── Future: RSS feed, static site, API
```

Copilot Spaces turns PocketNotes from a *save and forget* tool into a **searchable, conversational knowledge base**.
