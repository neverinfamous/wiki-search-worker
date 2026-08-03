# 🤖 Agent README: Workflows (`.agents/workflows`)

> **[System Instruction]** You are reading the operational index for the `.agents/workflows` directory.

## Overview
This directory contains reusable markdown-based instructional plans (workflows). These are invoked via slash commands by the user (e.g., `/update-deps`).

## Execution Rules
When a user invokes a workflow via a slash command (e.g., `/workflow-name`):
1. **Locate**: Find the corresponding `workflows/<workflow-name>.md` file.
2. **Read**: Open and read the file using the `view_file` tool.
3. **Execute**: Follow its instructions exactly, step-by-step.
4. **Precedence**: Obey global rules (`<RULE[user_global]>`) over local workflow rules if a conflict occurs.

## Authoring Standards
When instructed to create or modify a workflow:
1. **Naming**: Use `kebab-case.md` matching the intended slash command.
2. **Format**: Use concise markdown with actionable steps. Omit standard prose. Use checkboxes `[ ]` or `[x]` for tasks if appropriate.
3. **Shell Commands**: If the workflow involves running commands, specify exact PowerShell or Bun CLI strings. Remember that pipeline chain operators (`&&`, `||`) are forbidden in PowerShell. Use `;` instead.
4. **No Exhaustive Lists**: Do not maintain exhaustive lists of workflows here to prevent sync drift.
5. **Frontmatter**: All workflows MUST include YAML frontmatter with a `description` field. This description is automatically parsed by the host system and injected into the agent's system prompt as a slash command definition.
