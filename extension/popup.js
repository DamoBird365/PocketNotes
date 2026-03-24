// ── PocketNotes Extension — Popup Script ────────────────────────────────────

const GITHUB_API = "https://api.github.com";

document.addEventListener("DOMContentLoaded", async () => {
  const titleEl = document.getElementById("pageTitle");
  const urlEl = document.getElementById("pageUrl");
  const noteEl = document.getElementById("note");
  const saveBtn = document.getElementById("saveBtn");
  const saveBtnText = document.getElementById("saveBtnText");
  const statusEl = document.getElementById("status");
  const setupWarning = document.getElementById("setupWarning");
  const openSettingsLink = document.getElementById("openSettings");
  const settingsLink = document.getElementById("settingsLink");

  // Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  titleEl.value = tab.title || "Untitled";
  urlEl.textContent = tab.url || "";

  // Check settings
  const settings = await chrome.storage.local.get([
    "githubToken",
    "repoOwner",
    "repoName",
  ]);

  const isConfigured =
    settings.githubToken && settings.repoOwner && settings.repoName;

  if (!isConfigured) {
    setupWarning.style.display = "block";
    saveBtn.disabled = true;
  } else {
    saveBtn.disabled = false;
  }

  // Open settings
  openSettingsLink?.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  settingsLink?.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // Save article
  saveBtn.addEventListener("click", async () => {
    if (!isConfigured) return;

    saveBtn.disabled = true;
    saveBtnText.textContent = "⏳ Saving...";
    showStatus("loading", "Triggering GitHub Action...");

    try {
      const response = await fetch(
        `${GITHUB_API}/repos/${settings.repoOwner}/${settings.repoName}/actions/workflows/process-article.yml/dispatches`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${settings.githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ref: "main",
            inputs: {
              url: tab.url,
              note: noteEl.value.trim(),
            },
          }),
        }
      );

      if (response.status === 204) {
        showStatus("success", "✅ Saved! The article is being processed.");
        saveBtnText.textContent = "✅ Saved!";
        setTimeout(() => window.close(), 2000);
      } else if (response.status === 404) {
        showStatus(
          "error",
          "❌ Workflow not found. Check your repo has the process-article.yml workflow."
        );
        resetButton();
      } else if (response.status === 401 || response.status === 403) {
        showStatus(
          "error",
          "❌ Authentication failed. Check your GitHub token in Settings."
        );
        resetButton();
      } else {
        const errorText = await response.text();
        showStatus("error", `❌ Error (${response.status}): ${errorText}`);
        resetButton();
      }
    } catch (error) {
      showStatus("error", `❌ Network error: ${error.message}`);
      resetButton();
    }
  });

  function showStatus(type, message) {
    statusEl.className = `status ${type}`;
    statusEl.textContent = message;
  }

  function resetButton() {
    saveBtn.disabled = false;
    saveBtnText.textContent = "📌 Save to PocketNotes";
  }
});
