---
name: toggle-super-read
description: |
  Use this workflow to toggle the MySQL GLOBAL super_read_only state on the local test database (127.0.0.1:3307). Useful for rapidly testing read-only database states.
disable-model-invocation: true
---

# Toggle Super Read Only

This workflow executes the `toggle-super-read.mjs` script, which queries the current `super_read_only` state on the local database and toggles it to the opposite value (0 to 1, or 1 to 0). It is extremely useful when testing the effects of read-only modes on MySQL database tools and clients.

## Execution

<phase>
<instructions>
1. Ask the user for confirmation to toggle the state.
2. If confirmed, execute the native toggle script using Node.js:
   ```powershell
   node docs\unified-database-ecosystem\scripts\toggle-super-read.mjs
   ```
3. Parse the standard output to determine the new `super_read_only` state.
4. Notify the user of the new state, verifying that the toggle was successful.
</instructions>
</phase>
