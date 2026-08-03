---
description: Automatically tear down, launch, and bootstrap the global adamic unified database ecosystem.
---

# Recreate Global Ecosystem

This workflow safely and reliably tears down the current container state of the global unified database ecosystem and brings it back up. It includes an automated wait period and executes the InnoDB cluster bootstrap script to reinitialize MySQL Group Replication if it has lost quorum. 

This ecosystem serves as the master "god-tier" environment, housing everything from the MySQL cluster to Postgres, Mongo, Redis, and full Datadog APM tracing.

*(Note: The background WSL keepalive task is automatically handled by the script's Preflight phase).*

## 1. Execution

Run the `recreate-ecosystem.mjs` master script to automate the entire teardown, startup, image compilation, and bootstrapping process.

```pwsh
node C:\Users\chris\Desktop\adamic\docs\unified-database-ecosystem\scripts\recreate-ecosystem.mjs
```

## 2. Validation

The script will stream its output to the console. You should see:
1. `docker compose down -v` removing old containers and networks.
2. A brief sleep to allow the Windows Docker daemon to flush.
3. `docker compose up -d` creating the fresh containers.
4. The InnoDB cluster bootstrap sequence completing.

Once complete, the cluster will output its `ONLINE` topology status, and you can access Dozzle (http://localhost:8080) and Adminer (http://localhost:8081).
