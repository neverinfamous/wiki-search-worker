---
description: Exhaustive adversarial audit of the adamic usability test generation engine, testing prompts, and schemas via subagents to ensure accuracy, completeness, and context safety.
---

# Dynamic Context Audit: Usability

> **Prerequisite**: Ensure your Git working directory is completely clean before starting. Stash or commit any unrelated changes.

Run an exhaustive subagent-based documentation and coverage audit of the test generation engine and testing prompts for `lib-agent-exec`, `lib-git-history`, and `commit.ts`.

## Phase 1: Source of Truth (SSoT) Research

As the primary agent, you must first establish the ground truth for what features exist in the CLI schemas and interceptors. Do not guess; rely strictly on file contents.

1. Read the schemas in `.agents/scripts/lib-agent-exec/schema.ts`, `.agents/scripts/lib-git-history/schema.ts`, and `.agents/scripts/commit.ts`.
2. Read the test generation manifest: `.agents/scripts/usability/scripts/test-manifest.ts`.
3. **SSoT Parity Pre-Check**: Before dispatching subagents, mathematically verify the parity between `test-manifest.ts` and the SSoT. Run `bun .agents/scripts/usability/scripts/verify-ssot.ts`. This script parses the CLI schemas and interceptors, comparing them against the features mapped in `test-manifest.ts`, and saves the output to the designated scratch path.
4. **CRITICAL**: Do not pass massive SSoT strings directly into the subagents' prompts; pass the scratch file path (`ssot-parity-report.md`) instead.

## Phase 2: Parallel Subagent Test Engine Audit

> [!CAUTION]
> **Data-Driven Template Architecture**: Do NOT allow subagents to edit ANY of the generated `.md` test prompt files directly (e.g. `usability/*.md`). They are fully auto-generated and any direct edits will be overwritten. Follow this strict architecture:
> - **Feature Coverage Overlaps/Gaps**: Must be fixed in `.agents/scripts/usability/scripts/test-manifest.ts`.
> - **Boilerplate/Structural Bugs**: Must be fixed in `.agents/scripts/usability/scripts/lib/render-template.ts`.
> - **Custom Test Logic Flaws**: Must be fixed in the respective Markdown partials inside `.agents/scripts/usability/scripts/content/*.content.md`. 
> - **Enforcement**: Run `bun .agents/scripts/usability/scripts/generate-tests.ts` after making updates to regenerate the files and guarantee structural integrity.

You must exhaustively audit the test generation engine and the resulting testing prompts. Because this requires deeply analyzing dozens of files and comparing them to the SSoT, doing this sequentially will cause context exhaustion. You MUST delegate this to a team of subagents.

1. **Define Subagents**: Use the built-in `self` subagent (by specifying `TypeName: "self"`), passing the auditing instructions directly in the `Prompt`. Do not attempt to define custom subagent types.
2. **Dispatch Subagents**:
   - Divide the `test-manifest.ts` sections (`commit`, `lib-agent-exec`, `lib-git-history`) logically among the subagents.
   - Provide the SSoT mapping to each subagent so they know exactly what features *must* be present in their assigned grouping.
   - **Crucial Instructions for Subagents**:
     - "Cross-reference your assigned sections of `test-manifest.ts` and the `.content.md` partials against the SSoT parity report. Are all schema properties, CLI flags, and interceptors fully and rigorously tested?"
     - "**Context Exhaustion Prevention**: If any test manifest entry covers too many features or represents too much work for a single test pass, aggressively split it into smaller logical files in `test-manifest.ts`."
     - "**Template Architecture Boundary**: Do NOT use write tools to correct gaps directly in the markdown test files in `usability/`. You MUST apply your fixes to `test-manifest.ts`, `lib/render-template.ts`, or the `content/*.content.md` partials."
     - "**Validation Boundary**: Subagents running this audit must run `pnpm run lint; pnpm run typecheck` (Strictly run lint and typecheck only, and explicitly do not run build or tests)."
     - "Report back with a detailed summary of your changes."

## Phase 3: Global Validation & Committing

> [!NOTE]
> **Automatic Commit**: Once the global validation and cleanup steps are complete, proceed directly to committing the changes without asking for permission.

1. **Global Validation**: Run the generation script globally to guarantee tree parity:
   ```bash
   bun .agents/scripts/usability/scripts/generate-tests.ts
   ```
   *If no changes were made by the subagents and the generator produces no file modifications, do NOT run lint, typecheck, build, tests, or check. Skip validation and committing entirely.* If there are changes, validate them:
   ```bash
   pnpm run lint; pnpm run typecheck
   ```
2. **Consolidated Report**: Produce a single structured artifact detailing:
   - **Summary of Audit**
   - **Features Added/Fixed**: Which missing features were integrated into the test manifest.
   - **Prompts Split**: Which manifest entries were split.
3. **Mandatory Review & Cleanup**: 
   - Run `git diff` and thoroughly review all changes. Ensure no destructive edits or hallucinations were introduced.
   - **Kill Subagents**: Use the `manage_subagents` tool to execute a `kill_all` action, terminating all parallel subagents and freeing resources.
   - **CRITICAL**: Search for and forcefully delete ANY scratch scripts.
4. Commit the synchronization changes to the repository (only if changes exist):
   ```bash
   git add .
   bun .agents/scripts/commit.ts --msg "test(usability): exhaustive dynamic context and test generation engine audit" --impact 0.8 --confidence 1.0 --validation passed --journal --add .
   ```
