import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { writeFileSync, readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { stringify as yamlStringify } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const ARTICLES_DIR = join(REPO_ROOT, "articles");
const CONFIG_PATH = join(REPO_ROOT, "config.yml");

// ── Configuration ──────────────────────────────────────────────────────────

async function loadConfig() {
  const defaults = {
    ai: { provider: "github-models", model: "gpt-4o-mini" },
    article: {
      include_key_points: true,
      include_full_summary: true,
      filename_format: "{date}-{slug}",
    },
    security: {
      max_daily_saves: 50,
      require_https: false,
      blocked_patterns: [],
    },
  };

  if (!existsSync(CONFIG_PATH)) return defaults;

  try {
    const { parse } = await import("yaml");
    const raw = readFileSync(CONFIG_PATH, "utf-8");
    const parsed = parse(raw);
    return {
      ai: { ...defaults.ai, ...parsed?.ai },
      article: { ...defaults.article, ...parsed?.article },
      security: { ...defaults.security, ...parsed?.security },
    };
  } catch {
    console.warn("⚠️  Could not parse config.yml, using defaults.");
    return defaults;
  }
}

// ── Security Checks ────────────────────────────────────────────────────────

function validateUrl(url, config) {
  if (!url || typeof url !== "string") {
    throw new Error("No URL provided.");
  }

  const trimmed = url.trim();

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    throw new Error(`Invalid URL scheme: ${trimmed}`);
  }

  if (config.security.require_https && !trimmed.startsWith("https://")) {
    throw new Error("HTTPS is required. Set security.require_https to false to allow HTTP.");
  }

  for (const pattern of config.security.blocked_patterns) {
    if (new RegExp(pattern, "i").test(trimmed)) {
      throw new Error(`URL matches blocked pattern: ${pattern}`);
    }
  }

  return trimmed;
}

function checkRateLimit(config) {
  const today = new Date().toISOString().split("T")[0];
  const existing = readdirSync(ARTICLES_DIR).filter(
    (f) => f.startsWith(today) && f.endsWith(".md")
  );

  if (existing.length >= config.security.max_daily_saves) {
    throw new Error(
      `Daily save limit reached (${config.security.max_daily_saves}). Try again tomorrow or increase the limit in config.yml.`
    );
  }
}

// ── Article Fetching ───────────────────────────────────────────────────────

async function fetchArticle(url) {
  console.log(`📥 Fetching: ${url}`);

  const sourcePlatform = detectPlatform(url);

  // Use a browser-like UA for sites that block bots (YouTube, Twitter, etc.)
  const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      "Accept-Language": "en-US,en;q=0.9",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch article: HTTP ${response.status}`);
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url });

  // Platform-specific extraction for JS-heavy sites
  if (sourcePlatform === "youtube") {
    return extractYouTube(dom, url, html);
  }
  if (sourcePlatform === "twitter") {
    return extractFromMetaTags(dom, url, sourcePlatform);
  }

  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  const title =
    article?.title ||
    getMetaContent(dom, "og:title") ||
    dom.window.document.querySelector("title")?.textContent ||
    "Untitled";

  let textContent = article?.textContent?.trim() || "";
  const excerpt = article?.excerpt || getMetaContent(dom, "og:description") || "";

  // If Readability got very little content, fall back to meta tags
  if (textContent.length < 100) {
    const metaDesc = getMetaContent(dom, "og:description") || getMetaContent(dom, "description") || "";
    if (metaDesc.length > textContent.length) {
      textContent = metaDesc;
    }
  }

  return { title, textContent, excerpt, sourcePlatform, url };
}

function getMetaContent(dom, name) {
  const doc = dom.window.document;
  return (
    doc.querySelector(`meta[property="${name}"]`)?.getAttribute("content") ||
    doc.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ||
    ""
  );
}

function extractYouTube(dom, url, html) {
  let title = getMetaContent(dom, "og:title") || getMetaContent(dom, "title") || "";
  let description = getMetaContent(dom, "og:description") || getMetaContent(dom, "description") || "";
  let channelName = "";

  // Try ytInitialPlayerResponse first (richest data)
  try {
    const playerMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});\s*(?:var|<\/script)/s);
    if (playerMatch) {
      const playerData = JSON.parse(playerMatch[1]);
      const videoDetails = playerData?.videoDetails;
      if (videoDetails?.title) {
        title = videoDetails.title;
        description = videoDetails.shortDescription || description;
        channelName = videoDetails.author || "";
        console.log(`🎬 ytPlayerResponse: "${title}" by ${channelName}`);
      }
    }
  } catch (e) {
    console.warn(`⚠️  ytInitialPlayerResponse parse failed: ${e.message}`);
  }

  // If we still don't have a real title, fall back to oEmbed API (always works)
  if (!title || title === "YouTube" || title.endsWith("- YouTube")) {
    console.log("🎬 Meta tags empty — trying oEmbed API...");
    return fetchYouTubeOEmbed(url, description);
  }

  const keywords = getMetaContent(dom, "keywords") || "";
  const textContent = [
    `Video Title: ${title}`,
    channelName ? `Channel: ${channelName}` : "",
    `Description: ${description}`,
    keywords ? `Keywords: ${keywords}` : "",
  ].filter(Boolean).join("\n\n");

  console.log(`🎬 YouTube: "${title}" by ${channelName || "unknown"}`);

  return {
    title,
    textContent,
    excerpt: description.slice(0, 300),
    sourcePlatform: "youtube",
    url,
  };
}

async function fetchYouTubeOEmbed(url, fallbackDescription) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`oEmbed HTTP ${res.status}`);
    const data = await res.json();

    const title = data.title || "YouTube Video";
    const channelName = data.author_name || "";

    console.log(`🎬 oEmbed: "${title}" by ${channelName}`);

    const textContent = [
      `Video Title: ${title}`,
      channelName ? `Channel: ${channelName}` : "",
      fallbackDescription ? `Description: ${fallbackDescription}` : "",
    ].filter(Boolean).join("\n\n");

    return {
      title,
      textContent,
      excerpt: fallbackDescription?.slice(0, 300) || `YouTube video: ${title}`,
      sourcePlatform: "youtube",
      url,
    };
  } catch (e) {
    console.warn(`⚠️  oEmbed failed: ${e.message}`);
    return {
      title: "YouTube Video",
      textContent: `YouTube video at ${url}`,
      excerpt: "",
      sourcePlatform: "youtube",
      url,
    };
  }
}

function extractFromMetaTags(dom, url, sourcePlatform) {
  const title = getMetaContent(dom, "og:title") ||
    dom.window.document.querySelector("title")?.textContent || "Untitled";
  const description = getMetaContent(dom, "og:description") || getMetaContent(dom, "description") || "";

  return {
    title,
    textContent: `${title}\n\n${description}`,
    excerpt: description.slice(0, 300),
    sourcePlatform,
    url,
  };
}

function detectPlatform(url) {
  const hostname = new URL(url).hostname.toLowerCase();
  const platformMap = {
    "linkedin.com": "linkedin",
    "www.linkedin.com": "linkedin",
    "twitter.com": "twitter",
    "x.com": "twitter",
    "medium.com": "medium",
    "dev.to": "dev-to",
    "hashnode.com": "hashnode",
    "reddit.com": "reddit",
    "www.reddit.com": "reddit",
    "youtube.com": "youtube",
    "www.youtube.com": "youtube",
    "github.com": "github",
    "stackoverflow.com": "stack-overflow",
    "learn.microsoft.com": "microsoft-learn",
    "techcommunity.microsoft.com": "microsoft-tech-community",
    "powerautomate.microsoft.com": "power-automate",
    "powerapps.microsoft.com": "power-apps",
  };

  for (const [domain, platform] of Object.entries(platformMap)) {
    if (hostname === domain || hostname.endsWith(`.${domain}`)) {
      return platform;
    }
  }

  return "web";
}

function detectContentType(url, sourcePlatform) {
  const urlLower = url.toLowerCase();
  const pathname = new URL(url).pathname.toLowerCase();

  // Platform-specific content types
  const platformTypes = {
    "youtube": "video",
    "twitter": "social-post",
    "linkedin": pathname.includes("/pulse/") || pathname.includes("/article/")
      ? "article" : pathname.includes("/posts/") ? "social-post" : "social-post",
    "reddit": "discussion",
    "stack-overflow": "q-and-a",
    "github": pathname.includes("/issues/") ? "issue"
      : pathname.includes("/pull/") ? "pull-request"
      : pathname.includes("/discussions/") ? "discussion"
      : "repository",
    "medium": "article",
    "dev-to": "article",
    "hashnode": "article",
    "microsoft-learn": "documentation",
    "microsoft-tech-community": "article",
    "power-automate": "documentation",
    "power-apps": "documentation",
  };

  if (platformTypes[sourcePlatform]) {
    return platformTypes[sourcePlatform];
  }

  // URL pattern heuristics for generic sites
  if (urlLower.includes("/blog/") || urlLower.includes("/post/")) return "blog-post";
  if (urlLower.includes("/docs/") || urlLower.includes("/documentation/")) return "documentation";
  if (urlLower.includes("/tutorial") || urlLower.includes("/how-to")) return "tutorial";
  if (urlLower.includes("/podcast") || urlLower.includes("/episode")) return "podcast";
  if (urlLower.includes("/video") || urlLower.includes("/watch")) return "video";
  if (urlLower.includes("/news/") || urlLower.includes("/press/")) return "news";
  if (urlLower.includes("/wiki/")) return "wiki";

  return "article";
}

// ── AI Summarisation ───────────────────────────────────────────────────────

async function summariseWithAI(article, config) {
  const provider = (process.env.AI_PROVIDER || config.ai.provider).toLowerCase();
  const model = process.env.AI_MODEL || config.ai.model;

  console.log(`🤖 Summarising with ${provider} (${model})...`);

  // Truncate content to avoid token limits (roughly 12k words)
  const maxChars = 50_000;
  const content = article.textContent.slice(0, maxChars);

  const prompt = `You are a helpful assistant that summarises articles for a personal knowledge base.

Given the following article, provide:
1. A concise one-paragraph summary (2-3 sentences max)
2. 3-7 key points as bullet points
3. A list of relevant tags in kebab-case format (e.g., "power-platform", "artificial-intelligence", "career-advice")

Tags should reflect:
- The main technologies or platforms discussed
- The topic category (e.g., "tutorial", "opinion", "news", "case-study")
- Whether it's personal/career related or technical

Respond in this exact JSON format:
{
  "summary": "One paragraph summary here",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "tags": ["tag-one", "tag-two", "tag-three"]
}

Article title: ${article.title}
Article content:
${content}`;

  try {
    let result;
    switch (provider) {
      case "github-models":
        result = await callGitHubModels(prompt, model);
        break;
      case "openai":
        result = await callOpenAI(prompt, model);
        break;
      case "azure-openai":
        result = await callAzureOpenAI(prompt, model);
        break;
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }
    return result;
  } catch (error) {
    console.warn(`⚠️  AI summarisation failed: ${error.message}`);
    return {
      summary: article.excerpt || "Summary could not be generated.",
      key_points: [],
      tags: [],
    };
  }
}

async function callGitHubModels(prompt, model) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not available");

  const response = await fetch(
    "https://models.github.ai/inference/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub Models API error: ${response.status} — ${error}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function callOpenAI(prompt, model) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY secret not set");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} — ${error}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function callAzureOpenAI(prompt, model) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_KEY;
  if (!endpoint || !apiKey) {
    throw new Error(
      "AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY secrets must be set"
    );
  }

  const url = `${endpoint}/openai/deployments/${model}/chat/completions?api-version=2024-10-21`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Azure OpenAI API error: ${response.status} — ${error}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// ── Markdown Generation ────────────────────────────────────────────────────

function generateMarkdown(article, aiResult, config, note) {
  const now = new Date().toISOString();
  const contentType = detectContentType(article.url, article.sourcePlatform);
  const frontmatter = {
    title: article.title,
    url: article.url,
    date_saved: now,
    content_type: contentType,
    source_platform: article.sourcePlatform,
    summary: aiResult.summary,
    tags: aiResult.tags,
    read: false,
  };

  if (note) {
    frontmatter.note = note;
  }

  let md = `---\n${yamlStringify(frontmatter).trim()}\n---\n`;

  if (config.article.include_full_summary) {
    md += `\n## Summary\n\n${aiResult.summary}\n`;
  }

  if (config.article.include_key_points && aiResult.key_points?.length > 0) {
    md += `\n## Key Points\n\n`;
    for (const point of aiResult.key_points) {
      md += `- ${point}\n`;
    }
  }

  if (note) {
    md += `\n## Personal Note\n\n${note}\n`;
  }

  return md;
}

function generateFilename(article, config) {
  const date = new Date().toISOString().split("T")[0];
  const slug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  const format = config.article.filename_format || "{date}-{slug}";
  let filename = format.replace("{date}", date).replace("{slug}", slug);
  let filepath = join(ARTICLES_DIR, `${filename}.md`);

  // Avoid filename collisions — append a short timestamp if file exists
  if (existsSync(filepath)) {
    const ts = Date.now().toString(36);
    filename = `${filename}-${ts}`;
  }

  return `${filename}.md`;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("📌 PocketNotes — Processing article...\n");

  const config = await loadConfig();
  const url = validateUrl(process.env.ARTICLE_URL, config);
  const note = process.env.ARTICLE_NOTE || "";

  checkRateLimit(config);

  const article = await fetchArticle(url);
  console.log(`📄 Title: ${article.title}`);
  console.log(`🌐 Platform: ${article.sourcePlatform}`);

  const aiResult = await summariseWithAI(article, config);
  console.log(`🏷️  Tags: ${aiResult.tags.join(", ")}`);

  const markdown = generateMarkdown(article, aiResult, config, note);
  const filename = generateFilename(article, config);
  const filepath = join(ARTICLES_DIR, filename);

  writeFileSync(filepath, markdown, "utf-8");
  console.log(`\n✅ Saved: articles/${filename}`);
}

main().catch((err) => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
