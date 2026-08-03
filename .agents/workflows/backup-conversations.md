---
name: backup-conversations
description: Nightly automated workflow to backup the Antigravity configuration and conversation history into a local Git repository and sync to private remote neverinfamous/antigravity-backup.
---

# Backup Conversations Workflow

This workflow executes the `backup-conversations.ts` script to track the state of the `~/.gemini` directory in a local Git repository and automatically push snapshots to the private GitHub remote (`neverinfamous/antigravity-backup`). This acts as a robust differential recovery mechanism for conversation history and configuration files.

## Usage

This script is typically invoked via an automated scheduled task, but can also be run manually.

### Manual Backup
To trigger a backup snapshot manually, run:
```powershell
bun .\agents\scripts\backup-conversations.ts
```
This will run `git add -A` and `git commit` inside the `~/.gemini` folder, creating a new snapshot, and automatically push new commits to `origin HEAD` (`neverinfamous/antigravity-backup`).

### Restoration
If your conversation history breaks or you lose a configuration file and need to roll back to a known-good state, use standard Git commands inside the `~/.gemini` folder:

```powershell
cd ~/.gemini
git log
git checkout <commit-hash> -- antigravity/brain/
# Or to do a hard reset of the entire state:
# git reset --hard <commit-hash>
```

> **Warning:** Performing a hard reset will overwrite your current configuration and conversation state with the state from that commit.

## Scheduled Task Integration
To configure this to run automatically, go to the **Scheduled Tasks** panel in Antigravity 2.0 and set it to run on a daily cron expression (`0 0 * * *`), pointing to this script.
