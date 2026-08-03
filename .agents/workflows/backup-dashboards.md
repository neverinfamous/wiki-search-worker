---
name: backup-dashboards
description: |
  Automated workflow to backup Datadog dashboards from Datadog to the local filesystem using the pup CLI.
  Downloads and sanitizes dashboards, syncing them to the adamic and mysql-mcp ecosystems.
---

# Backup Datadog Dashboards

This workflow executes the `backup-dashboards.mjs` script to securely download Datadog dashboards via the `pup` CLI, sanitize them by removing API-specific metadata, and copy them across the unified database ecosystem target directories (`adamic` and `mysql-mcp`).

## 1. Prerequisites

- The `/datadog` skill must be loaded or understood by the agent.
- You must be authenticated with the Datadog API (`pup auth status`).

## 2. Execution

Run the backup script via Node.js:

```bash
node C:\Users\chris\Desktop\adamic\docs\unified-database-ecosystem\scripts\backup-dashboards.mjs
```

## 3. Validation

- Verify that the target `.json` files (e.g. `datadog-ai-dashboard.json`, `datadog-mysql.json`) have been modified locally.
- Run `git status` in the affected repositories (`adamic` and `mysql-mcp`) to identify the changes.
- If changes look correct, commit the updated dashboard configurations using the standard `.agents/scripts/commit.ts` wrapper.
