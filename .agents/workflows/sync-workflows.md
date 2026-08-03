---
description: Synchronize the .agents ecosystem out to all target repositories
---

# Sync Agent Ecosystem

This workflow propagates any updates made in the core `adamic` repository's `.agents` directory out to all of the satellite repositories. 

## 1. Execution

Run the `sync-workflows.ts` script to push the `.agents` ecosystem outwards.

```pwsh
bun .\.agents\scripts\sync-workflows.ts
```

## 2. Performance & Validation

The `sync-workflows.ts` script uses an in-memory single-pass differential sync engine. It pre-loads source `.agents` files once into memory, transforms path strings in memory, and writes only files whose content has changed.

- **Initial Sync**: ~4s across 14 ecosystem repositories (1,350+ files).
- **No-Op Sync (Unchanged)**: < 1s execution time.

Review the script's output to verify that all directories synchronized successfully. The script automatically checks for the existence of target directories before syncing and will gracefully skip repositories that aren't cloned on this machine.

If there are any errors, or if the user requests syncing to a repository that isn't on the list, you may need to first update the `TARGET_REPOS` array inside the `.\.agents\scripts\sync-workflows.ts` script.
