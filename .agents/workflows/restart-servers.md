---
description: Restart a Model Context Protocol (MCP) server daemon gracefully while optionally building the latest JavaScript.
---

# Restart MCP Servers

This workflow uses the `restart-mcp.ts` automation to dynamically build the requested MCP server's JavaScript and then safely force the IDE to reboot the daemon, unblocking fast iterative development.

## 1. Execution

Invoke the `restart-mcp.ts` script with the target server name as an argument.

```pwsh
bun .\.agents\scripts\restart-mcp.ts <server-name>
```

For example, to restart the Memory Journal MCP:

```pwsh
bun .\.agents\scripts\restart-mcp.ts memory-journal-mcp
```

## 2. Validation & Flow

The script automates the following pipeline:
1. Dynamically detects the server's workspace using `mcp_config.json`.
2. Resolves the package manager (`bun` or `pnpm`).
3. Executes the target's `build:js` or `build` script (running the full, authoritative build to ensure all types and aliases are properly processed). If the build encounters hard syntax errors, the pipeline halts immediately.
4. Safely updates `mcp_config.json`'s timestamp, which forces the IDE to gracefully reboot the server daemon without closing the editor.
