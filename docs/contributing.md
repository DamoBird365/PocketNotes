# 🤝 Contributing to PocketNotes

Thanks for your interest in contributing! PocketNotes is an open-source project and welcomes contributions of all kinds.

## Ways to Contribute

- 🐛 **Report bugs** — open an issue describing the problem
- 💡 **Suggest features** — open an issue with your idea
- 📝 **Improve documentation** — fix typos, add examples, clarify instructions
- 🔧 **Submit code** — fix bugs, add features, improve the AI processing
- 🌍 **Share** — tell others about PocketNotes!

## Development Setup

1. **Fork** the repo and clone it locally
2. Make your changes
3. Test locally where possible (see below)
4. Submit a **Pull Request**

### Testing the GitHub Action Locally

You can test the article processing script locally:

```bash
cd .github/scripts
npm install

# Set environment variables
export ARTICLE_URL="https://example.com/some-article"
export GITHUB_TOKEN="your-token"

# Run the script
node process-article.js
```

### Testing the Browser Extension

1. Make your changes in the `extension/` folder
2. Load/reload the unpacked extension in your browser
3. Test saving an article

## Code Style

- **JavaScript**: Modern ES modules, async/await, descriptive variable names
- **YAML**: 2-space indentation
- **Markdown**: ATX headings (`#`), fenced code blocks

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Update documentation if your change affects user-facing behaviour
- Test your changes before submitting
- Write a clear PR description explaining what and why

## Project Structure

```
PocketNotes/
├── .github/
│   ├── workflows/
│   │   └── process-article.yml    # Main GitHub Action
│   └── scripts/
│       ├── package.json           # Node.js dependencies
│       └── process-article.js     # Article processing logic
├── articles/                      # Saved articles (markdown)
├── extension/                     # Browser extension (Edge/Chrome)
│   ├── manifest.json
│   ├── popup.html / popup.js      # Extension popup
│   ├── options.html / options.js  # Settings page
│   └── icons/                     # Extension icons
├── ios-shortcut/                  # iOS Shortcut setup guide
├── docs/                          # Documentation
├── config.yml                     # User configuration
├── README.md                      # Project overview
└── LICENCE                        # MIT Licence
```

## Licence

By contributing, you agree that your contributions will be licensed under the MIT Licence.
