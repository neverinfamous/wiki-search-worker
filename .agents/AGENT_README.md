# 🤖 Agent README: Workspace Guidelines (`.agents`)

> **[System Instruction]** You are reading the operational index for the `.agents` directory. This is your primary instruction manual for workflows and scripts within the `neverinfamous` ecosystem. Read strictly and adhere to all listed constraints.

## Architecture
- `workflows/`: Reusable markdown-based instructional plans invoked via slash commands (e.g., `/update-deps`).
- `scripts/`: Standalone Node/Bun/Shell scripts (e.g., `commit.ts`, `agent-exec.ts`, `get-git-history-json.ts`, `sync-workflows.ts`, `sync-env.ts`, `sync-test-infra.ts`) used to automate exact logic.

## Workflow Execution Rules
When the USER invokes a slash command, you **MUST**:
1. Open the corresponding `workflows/<workflow-name>.md` file using `view_file`.
2. Follow its instructions exactly, step-by-step.
3. Obey global rules (`<RULE[user_global]>`) over local workflow rules if a conflict occurs.

## 🧹 Scratch Workspace Protocol

> [!CAUTION]
> **STRICT SCRATCH FILE POLICY**: Agents often mistakenly create temporary files, scripts, or payloads in `.agents/scratch`, `.agents/scripts/scratch-repo`, or the root workspace. This is **STRICTLY FORBIDDEN**.
> 
> **ALWAYS** write your payloads, test scripts, and temporary files exclusively to the isolated conversation directory:
> `C:\Users\chris\.gemini\antigravity-ide\brain\<conversation-id>\scratch\`
> 
> NEVER leave payload JSONs, test artifacts, or scratch files in the active project workspace.

## Canonical Workflows and Scripts List

To prevent sync drift, exhaustive lists of workflows and scripts are no longer maintained in this README. 
- See the `workflows/` directory for available slash command workflows.
- See the `scripts/` directory for available scripts.

For test manifest and generation, use `.agents/scripts/usability/scripts/test-manifest.ts` and `.agents/scripts/usability/scripts/generate-tests.ts` respectively. Do not refer to legacy scripts such as `standardize-prompts.js` or `prompt-template.md`.

## Workflow Authoring Standards
If requested to create a new workflow, you MUST:
1. **Naming**: Use `kebab-case.md` matching the slash command.
2. **Path**: Save to `C:\Users\chris\Desktop\wiki-search-worker\.agents\workflows\`.
3. **Format**: Use concise markdown with actionable steps. Omit standard prose.
4. **Execution**: If running commands, write exact PowerShell or Bun CLI strings. Remember that pipeline chain operators (`&&`, `||`) are forbidden in PowerShell natively (use WSL2 payload with `"target": "wsl2"` via `agent-exec` if Unix pipeline chaining is required).

