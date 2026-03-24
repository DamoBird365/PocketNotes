// ── PocketNotes Extension — Options/Settings Script ─────────────────────────

const GITHUB_API = "https://api.github.com";

document.addEventListener("DOMContentLoaded", async () => {
  const tokenEl = document.getElementById("githubToken");
  const ownerEl = document.getElementById("repoOwner");
  const nameEl = document.getElementById("repoName");
  const spaceUrlEl = document.getElementById("copilotSpaceUrl");
  const saveBtn = document.getElementById("saveBtn");
  const testBtn = document.getElementById("testBtn");
  const statusEl = document.getElementById("status");

  // Load saved settings
  const settings = await chrome.storage.local.get([
    "githubToken",
    "repoOwner",
    "repoName",
    "copilotSpaceUrl",
  ]);

  if (settings.githubToken) tokenEl.value = settings.githubToken;
  if (settings.repoOwner) ownerEl.value = settings.repoOwner;
  if (settings.repoName) nameEl.value = settings.repoName;
  if (settings.copilotSpaceUrl) spaceUrlEl.value = settings.copilotSpaceUrl;

  // Save settings
  saveBtn.addEventListener("click", async () => {
    const token = tokenEl.value.trim();
    const owner = ownerEl.value.trim();
    const name = nameEl.value.trim();

    if (!token || !owner || !name) {
      showStatus("error", "❌ All fields are required.");
      return;
    }

    await chrome.storage.local.set({
      githubToken: token,
      repoOwner: owner,
      repoName: name,
      copilotSpaceUrl: spaceUrlEl.value.trim(),
    });

    showStatus("success", "✅ Settings saved!");
  });

  // Test connection
  testBtn.addEventListener("click", async () => {
    const token = tokenEl.value.trim();
    const owner = ownerEl.value.trim();
    const name = nameEl.value.trim();

    if (!token || !owner || !name) {
      showStatus("error", "❌ Fill in all fields first.");
      return;
    }

    testBtn.disabled = true;
    testBtn.textContent = "🔍 Testing...";

    try {
      // Test 1: Check token validity
      const userRes = await fetch(`${GITHUB_API}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) {
        showStatus("error", "❌ Invalid token. Check your GitHub PAT.");
        return;
      }

      const user = await userRes.json();

      // Test 2: Check repo access
      const repoRes = await fetch(`${GITHUB_API}/repos/${owner}/${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!repoRes.ok) {
        showStatus(
          "error",
          `❌ Cannot access repo ${owner}/${name}. Check the repo exists and your token has access.`
        );
        return;
      }

      // Test 3: Check workflow exists
      const workflowRes = await fetch(
        `${GITHUB_API}/repos/${owner}/${name}/actions/workflows/process-article.yml`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!workflowRes.ok) {
        showStatus(
          "error",
          `⚠️ Connected as ${user.login}, but the process-article.yml workflow was not found. Push the workflow file first.`
        );
        return;
      }

      showStatus(
        "success",
        `✅ Connected as ${user.login}. Repo and workflow found!`
      );
    } catch (error) {
      showStatus("error", `❌ Network error: ${error.message}`);
    } finally {
      testBtn.disabled = false;
      testBtn.textContent = "🔍 Test Connection";
    }
  });

  function showStatus(type, message) {
    statusEl.className = `status ${type}`;
    statusEl.textContent = message;
  }
});
