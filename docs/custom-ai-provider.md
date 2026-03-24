# 🤖 Using a Custom AI Provider

By default, PocketNotes uses **GitHub Models** (free tier) for AI summarisation. You can switch to OpenAI or Azure OpenAI if you prefer.

## Default: GitHub Models (Free)

GitHub Models is included with GitHub Actions — no API key needed. It uses the `GITHUB_TOKEN` that's automatically available in every workflow run.

**Configuration** (default, no changes needed):
```yaml
# config.yml
ai:
  provider: "github-models"
  model: "gpt-4o-mini"
```

### Available GitHub Models

| Model | Speed | Quality | Cost |
|-------|-------|---------|------|
| `gpt-4o-mini` | ⚡ Fast | Good | Free tier |
| `gpt-4o` | 🐢 Slower | Better | Free tier (lower limits) |

> **Note**: GitHub Models has rate limits on the free tier. For heavy usage, consider switching to OpenAI or Azure OpenAI.

## Option 2: OpenAI

Use your own OpenAI API key for higher rate limits or access to different models.

### Setup

1. Get an API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. In your PocketNotes repo, go to **Settings → Secrets and variables → Actions**
3. Add a **Repository secret** named `OPENAI_API_KEY` with your API key
4. Add a **Repository variable** named `AI_PROVIDER` with value `openai`
5. (Optional) Add a variable `AI_MODEL` to override the model (default: `gpt-4o-mini`)

### Or Edit config.yml

```yaml
# config.yml
ai:
  provider: "openai"
  model: "gpt-4o-mini"  # or "gpt-4o", "gpt-3.5-turbo"
```

> Using repository variables (`AI_PROVIDER`, `AI_MODEL`) takes precedence over `config.yml`.

## Option 3: Azure OpenAI

Use your Azure OpenAI deployment for enterprise-grade security and compliance.

### Setup

1. Deploy a model in your [Azure OpenAI resource](https://portal.azure.com/)
2. In your PocketNotes repo, go to **Settings → Secrets and variables → Actions**
3. Add these **Repository secrets**:
   - `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint (e.g., `https://my-resource.openai.azure.com`)
   - `AZURE_OPENAI_KEY`: Your Azure OpenAI API key
4. Add a **Repository variable** named `AI_PROVIDER` with value `azure-openai`
5. Add a variable `AI_MODEL` with your deployment name

### Or Edit config.yml

```yaml
# config.yml
ai:
  provider: "azure-openai"
  model: "my-gpt4o-deployment"  # Your Azure deployment name
```

## Comparison

| Provider | Cost | Setup | Rate Limits | Best For |
|----------|------|-------|-------------|----------|
| GitHub Models | Free | None | ~150 req/day | Most users |
| OpenAI | Pay-as-you-go | API key | High | Heavy users |
| Azure OpenAI | Pay-as-you-go | Azure subscription | Very high | Enterprise |

## Adding a New Provider

Want to add support for another AI provider (Anthropic, Google, etc.)? Edit `.github/scripts/process-article.js`:

1. Add a new `async function callYourProvider(prompt, model)` 
2. Add a case in the `switch (provider)` block in `summariseWithAI()`
3. Update `config.yml` with any required configuration
4. Submit a PR!
