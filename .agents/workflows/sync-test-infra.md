---
name: sync-test-infra
description: |
  Use this workflow to automatically synchronize the lightweight mysql-mcp test infrastructure from the master adamic unified database ecosystem.
disable-model-invocation: true
---

# Sync Test Infrastructure

This workflow synchronizes the configuration files and `docker-compose.yml` from the master `adamic` ecosystem down to the `mysql-mcp` test server environment. The script:
- Copies infrastructure directories (excluding Postgres/Mongo Datadog integration configs, dockerfiles, and root-level docs)
- Programmatically filters the docker-compose.yml YAML to strip non-MySQL services and volumes
- Patches the Datadog agent `env_file` path for the target repository
- Adjusts relative log mount paths (`../../../mysql-mcp/logs` → `../../logs`)
- Syncs `test-seed.sql` for E2E test database seeding

## Execution

<phase>
<instructions>
1. Ask the user for confirmation to begin the synchronization.
2. If confirmed, execute the native synchronization script:
   ```powershell
   bun .\.agents\scripts\sync-test-infra.ts
   ```
3. Once the script completes successfully, verify the generated `mysql-mcp` `docker-compose.yml`:
   ```powershell
   wsl bash -c "cd /mnt/c/Users/chris/Desktop/mysql-mcp/test-server/infrastructure; docker compose config --quiet"
   ```
4. Verify no Postgres/Mongo contamination:
   ```powershell
   wsl bash -c "grep -ri 'postgres|mongo|postgresql' /mnt/c/Users/chris/Desktop/mysql-mcp/test-server/infrastructure/ || echo 'CLEAN'"
   ```
5. Notify the user that the synchronization is complete.
</instructions>
</phase>
