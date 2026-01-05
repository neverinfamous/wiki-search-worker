# Wiki Search Worker - Complete Documentation

*Last Updated January 4, 2026*

**Production URL**: https://search.adamic.tech  
**Worker Name**: `sqlite-wiki-search`  
**AI Search ID**: `sqlite-mcp-server-wiki`  
**GitHub Repo**: https://github.com/neverinfamous/wiki-search-worker

Public AI-powered search interface for the SQLite MCP Server documentation using Cloudflare Workers + AI Search (formerly AutoRAG).

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Automated Deployment](#automated-deployment)
- [Local Development](#local-development)
- [Configuration](#configuration)
- [AI Search Setup](#ai-search-setup)
- [API Endpoints](#api-endpoints)
- [Maintenance](#maintenance)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Integration Examples](#integration-examples)

---

## 🎯 Overview

This Cloudflare Worker provides an AI-powered search interface for the [SQLite MCP Server Wiki](https://github.com/neverinfamous/sqlite-mcp-server.wiki). It uses Cloudflare's AI Search technology to deliver intelligent, context-aware answers from the complete wiki documentation.

### Features

- 🤖 **AI-Enhanced Search** - Natural language answers with source attribution
- ⚡ **Vector Search** - Fast semantic search across all documentation
- 📚 **Complete Coverage** - Searches documentation across 6 projects (MySQL MCP, SQLite MCP, PostgreSQL MCP, Memory Journal MCP, R2 Bucket Manager, KV Manager)
- 🎯 **Context-Aware** - Understands questions and provides relevant examples
- 🌙 **Dark Mode** - Automatic theme detection
- 📱 **Mobile Responsive** - Works on all devices
- 🔒 **Rate Limited** - DDoS protection via Cloudflare WAF
- 🔄 **Automated CI/CD** - GitHub Actions deployment pipeline

### Performance

- **Search Latency**: < 500ms (AI-enhanced), < 100ms (vector search)
- **Global Edge**: Deployed to 300+ Cloudflare data centers
- **Uptime**: 99.99% SLA via Cloudflare
- **Cost**: ~$5/month (Workers + R2 + AI Search)

---

## 🏗️ Architecture

### Flow Diagram

```
GitHub Wiki → GitHub Actions → R2 Bucket → AI Search Index → Worker → Users
```

### Components

- **Cloudflare Worker** (`wiki-search-worker/`) - Serverless search interface
- **R2 Bucket** (`sqlite-mcp-server-wiki`) - Storage for wiki markdown files
- **AI Search** - Managed search and indexing service (auto-syncs every 6 hours)
- **GitHub Actions** - Automated deployment pipeline

### Technology Stack

- **Runtime**: Cloudflare Workers (Edge compute)
- **Storage**: Cloudflare R2 (19 markdown files)
- **AI Engine**: Cloudflare AI Search with Workers AI binding
- **Search Backend**: Vector database with automatic indexing
- **Language**: TypeScript
- **Build Tool**: Wrangler v4.40.3
- **CI/CD**: GitHub Actions

---

## 🚀 Automated Deployment

Every push to `main` branch automatically:

1. ✅ **Deploys Worker** to Cloudflare Edge
2. ✅ **Clones wiki repository** from GitHub
3. ✅ **Uploads files** to R2 bucket (with `--remote` flag)
4. ⚠️ **Requires manual sync** - Click "Sync Index" in dashboard (or wait 6 hours)

### GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

**Triggers**:
- Push to `main` branch
- Manual workflow dispatch

**Steps**:
1. Checkout repository
2. Setup Node.js 20.x
3. Install dependencies (`npm ci`)
4. Deploy Worker (`wrangler deploy --env=""`)
5. Clone wiki repository
6. Upload markdown files to R2
7. Display sync instructions

### GitHub Secrets Required

| Secret Name | Purpose |
|------------|---------|
| `CLOUDFLARE_API_TOKEN` | API authentication (see [Token Setup](#creating-an-api-token)) |
| `CLOUDFLARE_ACCOUNT_ID` | Account identification (found in Cloudflare dashboard URL) |

**Token Permissions**: Workers Scripts (Edit), R2 (Edit), Account Settings (Read)

#### Creating an API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **Create Token**
3. Use the **Edit Cloudflare Workers** template
4. Add **R2:Edit** permission
5. Scope to your account

### Initial Setup (One-Time)

```bash
# Clone the repository
git clone https://github.com/neverinfamous/wiki-search-worker.git
cd wiki-search-worker

# Install dependencies
npm install

# Add GitHub secrets (via GitHub UI)
# Go to: Settings → Secrets and variables → Actions
# Add: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID

# Push to trigger deployment
git push
```

---

## 💻 Local Development

### Prerequisites

- Node.js 20.x or later
- npm or yarn
- Cloudflare account with Workers access
- Wrangler CLI

### Setup

Navigate to worker directory:
```bash
cd C:\Users\chris\Desktop\wiki-search-worker
```

Install dependencies:
```bash
npm install
```

Run locally:
```bash
npm run dev
# Worker available at http://localhost:8787
```

Deploy to production:
```bash
npm run deploy
```

### Project Structure

```
wiki-search-worker/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml          # GitHub Actions CI/CD
│   └── dependabot.yml          # Dependency updates
├── src/
│   └── index.ts                # Main Worker code
├── wrangler.toml               # Worker configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── DEPLOYMENT.md               # Deployment guide
├── SECURITY.md                 # Security policy
├── README.md                   # Project overview
└── API_TOKEN_SETUP.md          # Token creation guide
```

---

## ⚙️ Configuration

### Wrangler Configuration (`wrangler.toml`)

```toml
name = "sqlite-wiki-search"
main = "src/index.ts"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]
# account_id loaded from CLOUDFLARE_ACCOUNT_ID env var or set here

# AI binding for AutoRAG access
[ai]
binding = "AI"

# Environment variables
[vars]
ALLOWED_ORIGINS = "*"

# Production configuration
[env.production]
vars = { ALLOWED_ORIGINS = "https://adamic.tech" }

# Custom domain route
routes = [
  { pattern = "adamic.tech/wiki-search/*", zone_name = "adamic.tech" }
]
```

### Custom Domain

**Domain**: `search.adamic.tech`  
**DNS Record**: Automatically created by Cloudflare  
**SSL**: Auto-provisioned with Let's Encrypt  
**CDN**: Enabled via Cloudflare proxy

### Rate Limiting (Cloudflare WAF)

**Rule 1: Burst Protection**
- Path: `/api/search`
- Characteristic: IP Address
- Limit: 20 requests per 10 seconds
- Action: Block for 30 seconds

**Rule 2: Sustained Protection**
- Hostname: `search.adamic.tech`
- Characteristic: IP Address
- Limit: 100 requests per 1 minute
- Action: Block for 10 minutes

---

## 🔧 AI Search Configuration

### AI Search Details

- **AI Search ID**: `sqlite-mcp-server-wiki`
- **R2 Source Bucket**: `sqlite-mcp-server-wiki`
- **Wiki Sources**:
  - MySQL MCP: `C:\Users\chris\Desktop\mysql-mcp.wiki` → `mysql-mcp/` folder
  - SQLite MCP: `C:\Users\chris\Desktop\sqlite-mcp-server.wiki` → `sqlite/` folder
  - PostgreSQL MCP: `C:\Users\chris\Desktop\postgres-mcp.wiki` → `postgres/` folder
  - Memory Journal MCP: `C:\Users\chris\Desktop\memory-journal-mcp.wiki` → `memory-journal/` folder
  - R2 Bucket Manager: `C:\Users\chris\Desktop\R2-Manager-Worker.wiki` → `r2-manager/` folder
  - KV Manager: `C:\Users\chris\Desktop\kv-manager.wiki` → `kv-manager/` folder
- **Total Content**: 60+ markdown files across all projects
- **Auto-Sync**: Every 6 hours automatically

### MCP Server Access

**Enable in Cursor/Claude Desktop** (`mcp.json`):
```json
{
  "mcpServers": {
    "cloudflare-autorag": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@latest",
        "https://autorag.mcp.cloudflare.com/sse"
      ],
      "env": {
        "CLOUDFLARE_API_TOKEN": "<your-api-token>",
        "CLOUDFLARE_ACCOUNT_ID": "<your-account-id>"
      }
    }
  }
}
```

**Available MCP Tools**:
```javascript
// List all AI Search instances
mcp_cloudflare-autorag_list_rags()

// Search the index
mcp_cloudflare-autorag_search({
  rag_id: "sqlite-mcp-server-wiki",
  query: "How do I use JSON helper tools?"
})

// AI-enhanced search
mcp_cloudflare-autorag_ai_search({
  rag_id: "sqlite-mcp-server-wiki",
  query: "What statistical analysis tools are available?"
})
```

### Syncing Content

**When to sync**: After wiki updates are pushed to R2

**Auto-Sync**: 
- Happens automatically every 6 hours
- No action required for most updates

**Manual Sync** (for immediate updates):
1. Go to: Cloudflare Dashboard → AI → AI Search → `sqlite-mcp-server-wiki`
2. Click **"Sync Index"** button
3. Wait for completion (~1-2 minutes)
4. Verify with a test query

**Note**: Manual sync API endpoint does not exist. Dashboard-only operation.

### Local Wiki Sync Script

**PowerShell Script**: Use `sync-wikis-to-r2.ps1` for manual syncing from local wikis

```powershell
# Set required environment variables (one-time setup)
$env:CLOUDFLARE_API_TOKEN = "<your-api-token>"
$env:CLOUDFLARE_ACCOUNT_ID = "<your-account-id>"

# Sync all wikis
.\sync-wikis-to-r2.ps1

# Sync specific wiki only
.\sync-wikis-to-r2.ps1 -WikiName r2-manager
.\sync-wikis-to-r2.ps1 -WikiName kv-manager
.\sync-wikis-to-r2.ps1 -WikiName sqlite
.\sync-wikis-to-r2.ps1 -WikiName postgres
.\sync-wikis-to-r2.ps1 -WikiName memory-journal
```

**After running the script**: Go to the Cloudflare dashboard and click "Sync Index" or wait for automatic sync.

---

## 🆕 Adding New Wikis to AI Search

**Follow these steps to add a new project wiki to the AI Search system:**

### 1. Add Wiki to Local Sync Script

Edit `sync-wikis-to-r2.ps1` and add your new wiki to the `$wikis` hash table:

```powershell
$wikis = @{
    # ... existing wikis ...
    'your-project' = @{
        Path = "$BASE_PATH\your-project.wiki"
        Folder = "your-project"
        DisplayName = "Your Project Name"
    }
}
```

### 2. Add Wiki to GitHub Actions Workflow

Edit `.github/workflows/deploy.yml` and add these steps before "Step 6":

```yaml
- name: Clone Your Project wiki repository
  run: |
    git clone https://github.com/yourusername/your-project.wiki.git your-project-wiki-temp
    
- name: Upload Your Project wiki files to R2
  run: |
    cd your-project-wiki-temp
    for file in *.md; do
      echo "Uploading $file to R2 (your-project folder)..."
      npx wrangler r2 object put sqlite-mcp-server-wiki/your-project/"$file" --file="$file" --remote
    done
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Update the deployment summary to include your new wiki.

### 3. Configure R2 Bucket Folder Structure

The R2 bucket uses this structure:
```
sqlite-mcp-server-wiki/
├── sqlite/          # SQLite MCP Server wiki files
├── postgres/        # PostgreSQL MCP Server wiki files
├── memory-journal/  # Memory Journal MCP wiki files
├── r2-manager/      # R2 Bucket Manager wiki files
├── kv-manager/      # KV Manager wiki files
└── your-project/    # Your new project wiki files
```

### 4. Initial Sync

After adding the configuration:

**Option A: Local Sync (Fast)**
```powershell
.\sync-wikis-to-r2.ps1 -WikiName your-project
```

**Option B: GitHub Actions (Automatic)**
- Commit and push your changes
- GitHub Actions will automatically sync all wikis
- Check Actions tab for progress

### 5. Trigger AutoRAG Index Sync

After files are in R2, sync the search index:

1. Go to: Cloudflare Dashboard → AI → AI Search → `sqlite-mcp-server-wiki`
2. Click **"Sync Index"** button
3. Wait 1-2 minutes for completion
4. Test search at: https://search.adamic.tech

### 6. Update Documentation

Update these files to document the new wiki:
- `wiki-search-worker/README.md` - Add to wiki sources list
- `adamic-blog/README.md` - Add to supported projects
- Both files: Update feature counts and descriptions

### 7. Verify Integration

Test that your wiki content is searchable:

```bash
curl -X POST https://search.adamic.tech/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "content from your new wiki", "mode": "ai"}'
```

### Common Gotchas

- ✅ **R2 folder names**: Use lowercase with hyphens (e.g., `your-project`, not `YourProject`)
- ✅ **Wiki path**: Ensure the local wiki path exists and contains `.md` files
- ✅ **GitHub URL**: Use the correct `.wiki.git` repository URL
- ✅ **Environment variables**: Both `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` must be set
- ✅ **Manual sync**: Always click "Sync Index" after uploading to R2 for immediate updates

### R2 Bucket Configuration

**Bucket Name**: `sqlite-mcp-server-wiki`  
**Region**: Automatic (Cloudflare's global network)  
**Public Access**: No (AI Search has direct binding)  
**File Format**: Markdown (`.md`) files only  
**Auto-Upload**: Via GitHub Actions on every push

## 📡 API Endpoints

### Web Interface (Primary)
- **URL**: https://search.adamic.tech
- **Features**: 
  - AI-Enhanced mode with natural language synthesis
  - Vector Search mode for raw document chunks
  - Example queries
  - Social sharing
  - Dark mode support

### API Endpoint
- **URL**: https://search.adamic.tech/api/search
- **Method**: POST
- **Content-Type**: application/json

**Request Body Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | (required) | Search query (3-500 characters) |
| `mode` | string | `"ai"` | `"ai"` for synthesized answers, `"search"` for raw chunks |
| `max_results` | number | `5` | Maximum results to return (up to 50) |
| `rewrite` | boolean | (auto) | Override automatic query rewriting. By default, the system uses smart detection to skip rewriting for specific queries (tool names, quoted terms, action verbs) to save ~100-200ms. |

### Search with AI (Recommended)

Get natural language answers synthesized from the wiki:

```bash
curl -X POST https://search.adamic.tech/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I use JSON helper tools?", "mode": "ai"}'
```

**Response format**:
```json
{
  "success": true,
  "data": {
    "response": "The JSON Helper Tools in SQLite MCP Server v2.6.0...",
    "data": [
      {
        "filename": "JSON-Helper-Tools.md",
        "score": 0.92,
        "content": [...]
      }
    ]
  }
}
```

### Raw Document Search

Get unprocessed wiki chunks for detailed exploration:

```bash
curl -X POST https://search.adamic.tech/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "vector search", "mode": "search"}'
```

### Health Check
```bash
curl https://search.adamic.tech/health
```

---

## 🔄 Maintenance

### Updating Search Content

**When wiki is updated**:
1. Navigate to: Cloudflare Dashboard → AI → AutoRAG
2. Select `sqlite-mcp-server-wiki`
3. Click **Sync** button
4. Wait for sync completion (~1-2 minutes)
5. Test search with updated query

**Verify sync**:
```bash
curl -X POST https://search.adamic.tech/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "latest features"}'
```

### Redeploying the Worker

**When code changes**:
```bash
cd C:\Users\chris\Desktop\sqlite-mcp-server\wiki-search-worker
npm run deploy
```

**When dependencies update**:
```bash
npm install
npm audit fix
npm run deploy
```

### Monitoring

**Check worker logs**:
1. Cloudflare Dashboard → Workers & Pages
2. Select `sqlite-wiki-search`
3. View **Logs** tab

**Analytics location**:
- Dashboard → Workers & Pages → sqlite-wiki-search → Metrics
- Rate limiting: Security → WAF → Rate limiting rules

---

## 🛠️ Troubleshooting

### Issue: Worker not updating after deploy
**Solution**: 
- Clear Cloudflare cache: Caching → Configuration → Purge Everything
- Check deployment logs for errors
- Verify `wrangler.toml` configuration

### Issue: Search returns outdated results
**Solution**:
- Sync AutoRAG in dashboard (AI → AutoRAG → Sync)
- Verify wiki source files are updated
- Check AutoRAG sync timestamp

### Issue: Rate limiting blocking legitimate users
**Solution**:
1. Check WAF logs: Security → Events
2. Adjust rate limits if needed
3. Add IP exceptions in WAF if necessary

### Issue: CORS errors
**Solution**:
- Check `ALLOWED_ORIGINS` in `wrangler.toml`
- Currently set to `"*"` for public access
- Modify `src/index.ts` CORS headers if needed

### Issue: TypeScript errors after changes
**Solution**:
```bash
# Add types back to tsconfig.json if removed
# File: tsconfig.json
{
  "compilerOptions": {
    "types": ["@cloudflare/workers-types"]
  }
}
```

### Issue: NPM audit vulnerabilities
**Solution**:
- Check `package.json` for `overrides` section
- Current override: `esbuild` to `^0.25.10`
- Run `npm audit fix` for automated fixes

---

## 📚 File Locations

### Worker Code
- **GitHub**: https://github.com/neverinfamous/wiki-search-worker
- **Local**: `C:\Users\chris\Desktop\wiki-search-worker\`
- **Main Worker**: `src/index.ts`
- **Config**: `wrangler.toml`
- **Package**: `package.json`
- **CI/CD**: `.github/workflows/deploy.yml`
- **Security**: `SECURITY.md`
- **Deployment Guide**: `DEPLOYMENT.md`

### Wiki Source
- **GitHub**: https://github.com/neverinfamous/sqlite-mcp-server.wiki
- **Local**: `C:\Users\chris\Desktop\sqlite-mcp-server.wiki\`
- **Files**: 19 markdown files
- **Main entry**: `Home.md`

### Documentation
- **This file**: `C:\Users\chris\Desktop\docs_images\wiki_autorag.md`
- **Main Project**: https://github.com/neverinfamous/sqlite-mcp-server

---

## 🔗 Related Repositories

- **[sqlite-mcp-server](https://github.com/neverinfamous/sqlite-mcp-server)** - Main project
- **[sqlite-mcp-server.wiki](https://github.com/neverinfamous/sqlite-mcp-server.wiki)** - Wiki source
- **[wiki-search-worker](https://github.com/neverinfamous/wiki-search-worker)** - This worker

---

## 📖 Additional Documentation

**In wiki-search-worker repository**:
- `README.md` - Project overview and quick start
- `DEPLOYMENT.md` - Complete deployment guide
- `SECURITY.md` - Security policy and reporting
- `API_TOKEN_SETUP.md` - API token creation guide
- `CREATE_API_TOKEN.md` - Detailed token instructions

**Features**:
- Dependabot configuration for automated updates
- GitHub Actions for CI/CD
- Comprehensive security policy
- Complete API documentation

## 🎯 Integration Examples

### JavaScript
```javascript
const result = await fetch('https://search.adamic.tech/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    query: 'statistical analysis tools',
    mode: 'ai' // or 'search' for raw results
  })
});
const data = await result.json();
console.log(data.data.response); // AI-synthesized answer
console.log(data.data.data);     // Source documents
```

### Python
```python
import requests

response = requests.post(
    'https://search.adamic.tech/api/search',
    json={
        'query': 'How do I backup my database?',
        'mode': 'ai'
    }
)

result = response.json()
print(result['data']['response'])  # AI answer

# Access sources
for source in result['data']['data']:
    print(f"Source: {source['filename']} (Score: {source['score']})")
```

### cURL with Mode Selection
```bash
# AI mode (synthesized answer)
curl -X POST https://search.adamic.tech/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "vector search", "mode": "ai"}'

# Search mode (raw chunks)
curl -X POST https://search.adamic.tech/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "vector search", "mode": "search"}'
```

---

## 💰 Cost & Performance

### Cloudflare Costs
- **Workers**: Free tier includes 100,000 requests/day
- **AutoRAG**: Pay-as-you-go pricing
  - AI-Enhanced queries: ~$0.01 per query (synthesis cost)
  - Vector search only: ~$0.001 per query
- **Bandwidth**: Included in Workers free tier

### Performance Metrics
- **Cold start**: ~100-200ms
- **AI search**: ~1-3 seconds (includes synthesis)
- **Vector search**: ~200-500ms (raw results)
- **Edge locations**: 300+ worldwide

### Rate Limits (Current)
- **Burst**: 15 requests per 10 seconds per IP
- **Sustained**: 60 requests per minute per IP
- **Protection**: Prevents abuse while allowing normal usage

---

## 🔐 Security Features

- ✅ **Rate limiting** - Two-tier protection (burst + sustained)
- ✅ **CORS headers** - Configurable origin restrictions
- ✅ **WAF protection** - Cloudflare Web Application Firewall
- ✅ **HTTPS only** - TLS 1.3 encryption
- ✅ **DDoS protection** - Cloudflare automatic mitigation
- ✅ **Input validation** - Query parameter sanitization

---

## 📊 SEO & UX Features

- ✅ **Dark mode** - Automatic system preference detection
- ✅ **Social sharing** - Twitter, LinkedIn, Reddit, Discord, Copy link
- ✅ **Mobile responsive** - Optimized for all screen sizes
- ✅ **Example queries** - Pre-filled search suggestions
- ✅ **Source attribution** - Links back to wiki pages
- ✅ **Meta tags** - Complete SEO optimization
- ✅ **Favicons** - Branded with main site assets
- ✅ **Loading states** - Clear user feedback

---

---

**Project**: [SQLite MCP Server](https://github.com/neverinfamous/sqlite-mcp-server)  
**Worker Repository**: [wiki-search-worker](https://github.com/neverinfamous/wiki-search-worker) 
**Production URL**: https://search.adamic.tech  
**Technology**: Cloudflare Workers + AI Search (formerly AutoRAG)  
**CI/CD**: GitHub Actions  
**Security**: Dependabot + Rate Limiting + WAF  
**Maintained by**: [@neverinfamous](https://github.com/neverinfamous)  
**Organization**: [Adamic](https://adamic.tech)  
**License**: MIT

