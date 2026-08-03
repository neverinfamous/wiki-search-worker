---
description: Exhaustive adversarial audit of MCP dynamic context (test generation engine, testing prompts, code-map, server instructions, readmes, and workflow files) via subagents to ensure accuracy, completeness, and context safety.
---

# Dynamic Context Audit

> **Prerequisite**: Ensure your Git working directory is completely clean before starting. Stash or commit any unrelated changes.

Run an exhaustive subagent-based documentation and coverage audit of the test generation engine, testing prompts, readmes, and workflows in an MCP server repository.

## 1. Audit Initialization

1. Ask the user for the absolute path to the target MCP repository, if they have not provided it (e.g. `C:\Users\chris\Desktop\mysql-mcp`). Do not guess; use the Briefing's registered workspaces to resolve the exact path.
2. Verify that the repository has a `test-server/scripts` folder containing the test generation engine (`test-manifest.ts`).

---

## Phase 1: Source of Truth (SoT) Research

As the primary agent, you must first establish the ground truth for what tools exist, how they are grouped, and how they function. Do not guess; rely strictly on file contents.

### Gather the SSoT
1. Read the architectural logic flows in `test-server/code-map.md` and `test-server/scripts/AGENT_README.md`.
2. Read the tool documentation and schema requirements in `test-server/tool-reference.md`.
3. Locate and read the tool grouping definitions (typically `src/filtering/tool-constants.ts` or `src/filtering/tool-filter.ts`).
4. Read the central test generation manifest: `test-server/scripts/test-manifest.ts`.
5. Compile a master mapping of all active tools categorized by their testing grouping (e.g., Code Mode, Advanced, standard/direct tool groups, usability) and their assigned test files.
6. **SSoT Parity Pre-Check**: Before dispatching subagents, mathematically verify the parity between `test-manifest.ts` and the SSoT. Run `bun test-server/scripts/verify-ssot.ts <appDataDir>\\brain\\<conversation-id>\\scratch\\ssot-mapping.md`. This script programmatically parses `TOOL_GROUPS` in `src/filtering/tool-constants.ts` and `TEST_FILES` in `test-manifest.ts`, identifying any missing, extra, or duplicated tools mathematically and saves the output to the designated scratch path.
7. **CRITICAL**: Do not pass massive SSoT strings directly into the subagents' prompts; pass the scratch file path instead.

---

## Phase 2: Parallel Subagent Test Engine Audit

> [!CAUTION]
> **Data-Driven Template Architecture**: Do NOT allow subagents to edit ANY of the generated `.md` test prompt files directly (e.g. `test-codemode-*.md`, `test-advanced-*.md`). They are fully auto-generated and any direct edits will be overwritten. Follow this strict architecture:
> - **Tool Coverage Overlaps/Gaps**: Must be fixed in `test-server/scripts/test-manifest.ts`.
> - **Boilerplate/Structural Bugs**: Must be fixed in `test-server/scripts/lib/render-template.ts`.
> - **Custom Test Logic Flaws (Hallucinations/Parameter Drift)**: Must be fixed in the respective Markdown partials inside `test-server/scripts/content/*.content.md`. 
> - **Enforcement**: Run `bun test-server/scripts/generate-tests.ts` after making updates to regenerate the files and guarantee structural integrity.

You must exhaustively audit the test generation engine and the resulting testing prompts. Because this requires deeply analyzing dozens of files and comparing them to the SSoT, doing this sequentially will cause context exhaustion. You MUST delegate this to a large team of subagents. **Two subagents are totally inadequate for the massive scale of this repository.** You should spin up a robust swarm (e.g., 15-20 subagents minimum) to handle the workload efficiently without context degradation.

1. **Enumerate Files**: List the test manifest, all `content/*.content.md` partials, and the `coordinator-workflow.md` sequence queues.
2. **Define Subagents**: Use the built-in `self` subagent (by specifying `TypeName: "self"`), passing the auditing instructions directly in the `Prompt`. Do not attempt to define custom subagent types (e.g., `prompt_auditor`) using `define_subagent` as this can lead to invocation failures or scoping issues.
3. **Dispatch Subagents**:
   - Divide the `test-manifest.ts` sections or `content/` partials logically among the large swarm of subagents (e.g., chunking the groups into 10-15 independent batches).
   - Provide the SSoT mapping to each subagent so they know exactly what tools *must* be present in their assigned grouping.
   - **Crucial Instructions for Subagents**:
     - "Cross-reference your assigned sections of `test-manifest.ts` and the `.content.md` partials against the SSoT mapping. Are all tools fully and rigorously tested?"
     - "Ensure the tests align with the logic flows in `code-map.md` and the schemas in `tool-reference.md`."
     - "**Context Exhaustion Prevention**: If any test manifest entry covers too many tools or represents too much work for a single test pass, aggressively split it into smaller logical files in `test-manifest.ts` (e.g., `part1`, `part2`). Enforce a safe threshold limit (e.g., maximum 2 tools per test for deep fuzzing)."
     - "**Queue Alignment**: Subagents MUST double-check that the sequence queues in ALL `coordinator-workflow*.md` phase files perfectly match the files defined in `test-manifest.ts`. If tests are split, you MUST update the corresponding queue."
     - "**Hallucination Drift Prevention**: Verify that no boilerplate entries exist in `test-manifest.ts` that lack a `contentPartial` but test the exact same tools as basic code-mode tests. Ensure all entries testing complex partials have accurately populated `tools` arrays."
     - "**Template Architecture Boundary**: Do NOT use write tools to correct gaps directly in the markdown test files in `test-codemode/`, `test-tool-groups/`, etc. You MUST apply your fixes to `test-manifest.ts`, `lib/render-template.ts`, or the `content/*.content.md` partials."
     - "**Scratch File Discipline**: If you need to write temporary scripts (e.g. to parse files or clean orphaned tests), you MUST write them to the designated scratch directory (`<appDataDir>\\brain\\<conversation-id>\\scratch\\`). NEVER write temporary scripts to the project workspace. If you accidentally write them to the workspace, you must delete them immediately after execution."
     - "**Validation Boundary**: Subagents running this audit must strictly run lint and typecheck only, and explicitly NOT run build or tests. Only run `pnpm run lint; pnpm run typecheck`."
     - "Report back with a detailed summary of your changes."

---

## Phase 3: Subagent Documentation & Workflow Audit

The readmes, code maps, and server instructions must accurately reflect the new generation engine and the SSoT.

1. **Locate Documentation**: Identify `code-map.md`, `AGENT_README.md`, `test-server/AGENT_README.md`, all subdirectory `README.md` files, and `src/constants/instructions/markdown/*.md` (or equivalent server-instructions folder).
2. **Dispatch Subagents**:
   - Assign the subagents to audit the `.md` documentation files.
   - Provide the same SSoT mapping to the subagents.
   - **Crucial Instructions**:
     - "Cross-reference every single tool and architectural claim mentioned in your assigned `.md` files."
     - "Ensure no documentation refers to legacy scripts like `standardize-prompts.js`, `prompt-template.md`, or `tool-map.json`. Ensure they correctly point to `test-manifest.ts` and the `generate-tests.ts` engine."
     - "**No README Lists**: Exhaustive file lists should ONLY live in `test-manifest.ts` or `coordinator-workflow.md`. The `README.md` files should NOT contain duplicate exhaustive lists of test files to prevent sync drift."
     - "Use your write tools to correct documentation drift immediately."
     - "**Server Instructions Boundary**: If server instructions need updating, ONLY edit the source markdown files (e.g., `src/constants/instructions/markdown/*.md`). Do NOT edit the compiled `.ts` files directly. The parent agent will handle the compilation later."
     - "Report back with a detailed summary of your changes."

---

## Phase 4: Server Instructions Synchronization

Once subagents report back:
1. Verify if the updates to the documentation or prompts necessitate updates to the server instructions generation process.
2. Check `src/constants/instructions/markdown/README.md` (or `src/constants/server-instructions/README.md`).
3. Run the generation script and the filter validation script sequentially to ensure the compiled `src/constants/instructions/*.ts` files reflect any updates and that all filters are honored:
   ```bash
   bun scripts/generate-server-instructions.ts ; node test-server/scripts/test-filter-instructions.mjs
   ```
4. Note: You must strictly run lint and typecheck only, and explicitly NOT run build or tests. Only run `pnpm run lint; pnpm run typecheck`, as these are purely documentation and instruction modifications.

---

## Phase 5: Global Validation & Committing

> [!IMPORTANT]
> **HITL Checkpoint**: STOP HERE. Present the full audit report artifact to the user. Wait for explicit approval before proceeding to commit.

1. **Global Validation**: Run the generation and validation scripts globally to guarantee tree parity (strictly lint and typecheck only, explicitly NOT run build or tests):
   ```bash
   bun test-server/scripts/generate-tests.ts
   pnpm run lint; pnpm run typecheck
   ```
2. **Consolidated Report**: Produce a single structured artifact detailing:
   - **Summary of Audit**
   - **Tools Added/Fixed**: Which missing tools were integrated into the test manifest.
   - **Prompts Split**: Which manifest entries were split to prevent context exhaustion.
   - **Documentation Fixed**: Which readmes or workflows were updated.
3. **Mandatory Review & Cleanup**: 
   - Run `git diff` and thoroughly review all changes. Ensure no destructive edits or hallucinations were introduced.
   - **Kill Subagents**: Use the `manage_subagents` tool to execute a `kill_all` action, terminating all parallel subagents and freeing resources.
   - **CRITICAL**: Search for and forcefully delete ANY scratch scripts (e.g., `*.ts` scripts generated by subagents for cleanup/parsing) that were accidentally written to the project workspace. Do this *before* running `git add .` to prevent polluting the repository. Files properly written to `<appDataDir>\\brain\\<conversation-id>\\scratch\\` are safe and do not need to be deleted.
4. Commit the synchronization changes to the repository:
   > **Note:** Always use the repository's custom commit wrapper (like `commit.ts`) if available, to adhere to global rules.
   ```bash
   git add .
   bun path/to/commit.ts --msg "test(architecture): exhaustive dynamic context and test generation engine audit" --impact 0.8 --confidence 1.0 --validation passed --journal --add .
   ```
