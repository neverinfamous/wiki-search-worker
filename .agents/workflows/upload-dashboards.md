---
name: upload-dashboards
description: |
  Automated workflow to upload local Datadog dashboard JSON files to Datadog via the pup CLI.
  Use when local dashboard configurations have been manually modified and need to be synced to the remote observability platform.
---

# Upload Datadog Dashboards

This workflow executes the `upload-dashboards.mjs` script to securely upload local Datadog dashboard JSON files via the `pup` CLI up to the remote Datadog platform.

## 1. Prerequisites

- The `/datadog` skill must be loaded or understood by the agent.
- You must be authenticated with the Datadog API (`pup auth status`).
- You should ensure that any local changes to the dashboard files have been validated or tested.

## 2. Execution

Run the upload script via Node.js:

```bash
node C:\Users\chris\Desktop\adamic\docs\unified-database-ecosystem\scripts\upload-dashboards.mjs
```

## 3. Validation

- The script will output `-> Successfully uploaded.` for each dashboard.
- Verify that the target dashboards on Datadog now reflect the local changes.
- Consider committing any local changes made to the JSON files using the standard `.agents/scripts/commit.ts` wrapper.
