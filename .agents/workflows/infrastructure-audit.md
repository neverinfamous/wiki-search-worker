---
name: infrastructure-audit
description: |
  Use when you need to run an exhaustive adversarial infrastructure audit to ensure the unified database ecosystem in adamic is accurate, secure, and compliant. Then automatically synchronizes the derived test server infrastructure down to mysql-mcp.
  Do NOT use for standard code reviews or linting.
  Do NOT use for metrics pipeline, Datadog integration, or Prometheus exporter audits (use /audit-metrics instead).
disable-model-invocation: true
---

# Unified Infrastructure & Ecosystem Audit

> **Prerequisite**: Ensure your Git working directories for both `adamic` and `mysql-mcp` are completely clean before starting.

Run a comprehensive subagent-based infrastructure audit to validate the global database ecosystem in `adamic`, and then derive the `mysql-mcp` test ecosystem from it.

## 1. Audit Initialization
<phase>
<instructions>
1. Set the target audit paths:
   - **Adamic Ecosystem (master)**: `..\adamic\docs\unified-database-ecosystem`
   - **MySQL-MCP Ecosystem (derived)**: `..\mysql-mcp\test-server\infrastructure`
   - **Sync Script**: `.\.agents\scripts\sync-test-infra.ts`
   - **Sync Workflow**: `.\.agents\workflows\sync-test-infra.md`
2. Verify all paths exist.
</instructions>
</phase>

---

## Phase 1: Rigorous Dual-Ecosystem Audit
<phase>
Dispatch **two parallel `research` subagents** — one for `adamic`, one for `mysql-mcp` — to audit both ecosystems exhaustively.

**Target Files** (both ecosystems):
- **Docker Compose**: `docker-compose.yml` (full contents)
- **All scripts** in `scripts/` directory
- **All config files** in `config/` subdirectories (proxysql, prometheus, grafana, datadog-integration-configs, mysql, mysql-router)
- **Documentation**: `README.md`, `AGENT_README.md`
- **Wiki**: `C:\Users\chris\Desktop\mysql-mcp.wiki\Test-Ecosystem.md`, `C:\Users\chris\Desktop\mysql-mcp.wiki\Observability.md`
- **Examples**: `C:\Users\chris\Desktop\mysql-mcp\examples` (docker-compose and configs for standalone/cluster setups)
- **Environment**: `.env` file
- **Legacy files**: Any `.yml` or `.cnf` files at the root level (potential stale artifacts)

<instructions>
**Crucial Audit Dimensions for Subagents**:

### Docker Compose Hardening
- **Healthchecks**: Every database-tier service (MySQL, Redis, ProxySQL, cluster-healer) MUST have a healthcheck. Monitoring services (Prometheus, Grafana) SHOULD have healthchecks. UI tools (Dozzle, Adminer) are optional.
- **Dependency chain**: The startup dependency chain MUST be: `mysql-node1/2/3 (healthy)` → `cluster-healer (healthy)` → `mysql-router (healthy)` → `proxysql`.
- **Restart policies**: All services must have `restart: unless-stopped`.
- **Resource limits**: All services must have `mem_limit`. Verify MySQL nodes have sufficient headroom above `innodb_buffer_pool_size` (currently 256M pool → 1536m container limit).
- **Logging**: All services must have `json-file` driver with rotation (`max-size`, `max-file`).
- **Stop grace period**: Database services, proxies (e.g. proxysql, mysql-router), and telemetry agents (e.g. datadog-unified) MUST have `stop_grace_period: 30s` for resilience; ephemeral UI utility services (e.g. Dozzle, Adminer) SHOULD have `15s`.
- **Version pinning**: All images must use explicit version tags, not `latest` or `lts`.

### Script Consistency
- **Platform detection**: Scripts that are always executed inside WSL via `wsl bash -c` MUST NOT have `process.platform === 'win32'` checks. However, orchestration scripts executed natively on Windows (e.g., `utils.mjs`, `check-status.mjs`, `recreate-ecosystem.mjs`) **MUST RETAIN** their `win32` fallbacks to correctly proxy Docker commands to WSL. Do NOT strip them.
- **Dynamic discovery**: Container lists MUST use `docker compose config --services` — never hardcoded arrays.
- **Exit codes**: Scripts MUST `process.exit(1)` on failures, never exit 0 silently.
- **Docker exec pattern**: All MySQL Shell and MySQL Client calls MUST use `docker exec <container>` — never local host binaries.
- **`.env` safety**: Any script that writes to `.env` must use read-filter-write (not append `>>`) to prevent duplicate accumulation.

### Configuration Integrity
- **ProxySQL**: `default_hostgroup` in `mysql_users` must match the `hostgroup` in `mysql_servers`.
- **Relay log**: MySQL nodes should have explicit `--relay-log=mysql-nodeX-relay-bin` flags.

> [!NOTE]
> Datadog integration configs, reported_hostname, cgroup mode, and `extra_performance_metrics` checks are handled by `/audit-metrics`.

### MySQL-MCP Contamination Check
- The `mysql-mcp` ecosystem MUST NOT contain any references to PostgreSQL or MongoDB (services, configs, files, volumes, tags).
- Run `grep -ri "postgres\|mongo\|postgresql"` across the entire mysql-mcp infrastructure directory.
- Check for stale legacy files (e.g., `innodb-cluster.yml`, standalone `.yml` files, `cluster-config/` directories with deprecated `.cnf` files).

### Documentation Accuracy
- Quick start instructions must reference the correct primary script (`recreate-ecosystem.mjs`). There should be NO references to deleted scripts (`create-cluster.mjs`, `reboot-cluster.mjs`, `recreate-test-ecosystem.mjs`).
- Architecture diagrams must use correct Docker network names (derived from directory name).
- Connection details, port mappings, and container names must match `docker-compose.yml`.
- Script descriptions must accurately reflect current behavior (dynamic discovery, self-contained lifecycle, etc.).
- **Wiki page (`Test-Ecosystem.md`)**: must use correct directory paths, port numbers, network names, and container names consistent with the main documentation.
- **Wiki page (`Observability.md`)**: audited separately by `/audit-metrics`.
- Dozzle references in documentation MUST be version-agnostic (e.g. do not specify `dozzle:vX.X.X` in diagrams or descriptions) to prevent drift.

### Sync Workflow
- Read `sync-test-infra.ts` and verify it correctly strips Postgres/Mongo services and volumes from the YAML.
- Verify it strips `config/datadog-integration-configs/postgres.d/` and `config/datadog-integration-configs/mongo.d/`.
- Verify it patches the Datadog `env_file` path from `../../secrets.env` to `.env`.
- Confirm the sync workflow docs reference the correct script names.

**Reporting**: Do NOT make any changes. Compile a detailed list of every discrepancy, specifying exactly what is wrong, the file path, line numbers, and proposed fix.
</instructions>
</phase>

---

## Phase 2: Truth-Finding & Planning
<phase>
<instructions>
Once both subagents report back:

1. **Cross-reference**: Compare findings between the two subagents. Verify flagged issues using `grep_search` or `view_file` where uncertain.
2. **Triage**: Categorize findings as:
   - 🔴 **Critical**: Broken functionality, routing failures, missing healthchecks on database services, contamination
   - 🟡 **Medium**: Stale files, documentation drift, exit code issues
   - 🔵 **Skipped**: Items acceptable for a test environment (hardcoded passwords, CPU limits, `read_only` filesystem, `no-new-privileges`)
3. **Create implementation plan**: Write `implementation_plan.md` artifact with:
   - Summary of all findings by severity
   - Detailed file-by-file fix list
   - Explicit note that `/sync-test-infra` will be run after adamic fixes to derive mysql-mcp
   - Verification plan (commands to validate fixes)

Set `RequestFeedback: true`. **STOP and wait for explicit user approval.**
</instructions>
</phase>

---

## Phase 3: Master Execution & Derivation Sync
<phase>
<instructions>
Once the user explicitly approves:

1. **Apply fixes to adamic** (master ecosystem):
   - Use `replace_file_content` / `multi_replace_file_content` for all edits.
   - For docker-compose.yml changes, validate with `wsl bash -c "cd <path>; docker compose config --quiet"`.

2. **Apply mysql-mcp-only fixes** (files not covered by sync):
    - `AGENT_README.md` files (excluded from sync, maintained independently)
    - Delete any stale legacy files

3. **Sync to mysql-mcp**: Run `bun .\.agents\scripts\sync-test-infra.ts` to derive configs.

4. **Validate no contamination**: Run `grep -ri "postgres\|mongo" ..\mysql-mcp\test-server\infrastructure\` to confirm clean.

> [!CAUTION]
> **Never make edits via script.** All edits must exclusively use the native file editing tools (`replace_file_content` / `multi_replace_file_content`).

> [!IMPORTANT]
> **NO VALIDATION REQUIRED FOR DOCS (OVERRIDES GLOBAL RULES)**: Strictly run lint and typecheck only (`pnpm run lint; pnpm run typecheck`), and explicitly NOT run build or tests. Do this only for code changes, skip for purely documentation changes. For Docker compose or script changes, validate with `docker compose config`.
</instructions>
</phase>

---

## Phase 4: Ecosystem Restart & Verification
<phase>
<instructions>
After all edits are applied and synced:

1. **Recreate the ecosystem**: Run `node docs/unified-database-ecosystem/scripts/recreate-ecosystem.mjs` natively on the Windows host to fully rebuild.
2. **Verify health**: Run `node scripts/check-status.mjs` — all containers must be healthy, cluster ONLINE with 3 nodes.
3. **Verify healthchecks**: Confirm new healthchecks are active:
   ```bash
   docker inspect --format='{{.State.Health.Status}}' redis-server proxysql prometheus grafana
   ```
4. **Verify Datadog tags**: Spot-check that stale `docker-desktop` hostname references are gone.
</instructions>
</phase>

---

## Phase 5: Committing
<phase>
<instructions>
> [!CAUTION]
> **STOP for HITL Approval**: Do NOT commit until the user explicitly approves the applied changes and verification results.

Once approved:

1. Commit `adamic` changes using the enforced commit wrapper with targeted paths.
2. Commit `mysql-mcp` changes using the enforced commit wrapper with targeted paths.
3. Kill all subagents to free resources.
4. Present final walkthrough artifact summarizing all changes.
</instructions>
</phase>
