# 🤖 Agent README: Wiki Search Worker

**Production URL**: https://search.adamic.tech  
**Worker Name**: `adamic-blog-search`  
**GitHub Repo**: https://github.com/neverinfamous/wiki-search-worker  

> **This README is optimized for AI agent consumption.** It exists so agents can orient themselves quickly without exploratory file reads.

## Repository Purpose

This Cloudflare Worker provides an AI-powered search interface for the Adamic ecosystem documentation (MCP Servers, Cloudflare Managers). It uses Cloudflare AI Search to deliver intelligent, context-aware answers and vector search across the project wikis.

## Stack

- Cloudflare Workers
- Cloudflare R2 (Storage for markdown files)
- Cloudflare AI Search (Workers AI binding)
- TypeScript
- Wrangler CLI

## Development & Deployment

### Local Development

```bash
# Install dependencies
pnpm install

# Run locally
npm run dev
# Worker available at http://localhost:8787
```

### Syncing Content to AI Search

Wikis are synced from GitHub to R2 and then to Cloudflare AI Search. 

```bash
# Set required environment variables first (on Windows PowerShell: $env:CLOUDFLARE_API_TOKEN="...")
export CLOUDFLARE_API_TOKEN="<your-api-token>"
export CLOUDFLARE_ACCOUNT_ID="<your-account-id>"

# Sync all wikis to R2
pnpm run sync:all

# Sync a specific wiki
pnpm run sync r2-manager
```
**Important:** After syncing to R2, the AI Search index must be synced manually via the Cloudflare Dashboard (AI -> AI Search -> `adamic-blog-search` -> "Sync Index") or wait for the automatic 6-hour sync.

### Deployment

Deployment is fully automated via GitHub Actions on push to `main` (`.github/workflows/deploy.yml`).

## Project Structure

```text
wiki-search-worker/
├── .github/workflows/       # CI/CD deployment and dependabot configs
├── src/
│   └── index.ts             # Main Worker code (Search API)
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript config
├── wikis.json               # Central configuration for all synced wikis
├── wrangler.toml            # Cloudflare Worker configuration (routes, bindings)
├── README.md                # Full project documentation
└── AGENT_README.md          # Agent-specific Workspace Guidelines
```

## Key Guidelines

- **File Naming**: `kebab-case` everywhere.
- **Wrangler Variables**: Use `.dev.vars` for local secrets. Production uses GitHub Secrets and Cloudflare Secrets.
- **Rate Limiting**: Cloudflare WAF handles rate limits (Burst & Sustained).
