---
title: Agent 365 notifications
url: https://nullpointer.se/agent-365-notifications.html
date_saved: 2026-04-02T19:45:11.441Z
content_type: article
source_platform: web
author: Andreas Adner
summary: This article provides a guide on building a custom agent using the
  Agent 365 SDK, focusing on implementing notification functionalities that
  allow the agent to respond to messages from Microsoft Teams, comments in Word
  documents, and emails. It details the necessary SDK packages, the agent's
  architecture, and specific code implementations for handling notifications
  effectively.
tags:
  - agent-365
  - sdk
  - tutorial
  - technical
  - development
read: false
---

## Summary

This article provides a guide on building a custom agent using the Agent 365 SDK, focusing on implementing notification functionalities that allow the agent to respond to messages from Microsoft Teams, comments in Word documents, and emails. It details the necessary SDK packages, the agent's architecture, and specific code implementations for handling notifications effectively.

## Key Points

- The article builds on a previous post about setting up infrastructure for Agent 365 using the CLI.
- Key SDK packages discussed include Microsoft.Agents.A365.Notifications for managing notifications and Microsoft.Agents.A365.Tooling for development tools.
- The agent listens on a specific endpoint and processes messages from various channels, including Word and email.
