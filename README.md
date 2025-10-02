# SQLite MCP Server Wiki Search Worker

Public AI-powered search interface for the SQLite MCP Server documentation using Cloudflare AutoRAG.

## Features

- ✅ **AI-Enhanced Search** - Natural language queries with synthesized answers
- ✅ **Standard Vector Search** - Raw document chunks for direct access
- ✅ **CORS Support** - Configurable cross-origin access
- ✅ **Rate Limiting Ready** - Built on Cloudflare's edge network
- ✅ **Auto-Updating** - Syncs with wiki changes automatically

## Quick Start

### 1. Install Dependencies

This will install `@cloudflare/workers-types`, TypeScript, and Wrangler:

```bash
npm install
```

**Note**: The TypeScript types will be available after installation. If you see linting errors before running `npm install`, they will resolve automatically once dependencies are installed.

### 2. Development

Run locally with hot reload:
```bash
npm run dev
```

### 3. Deploy

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

Deploy to production:
```bash
npm run deploy:production
```

## API Endpoints

### POST `/api/search`

Search the SQLite MCP Server wiki.

**Request Body:**
```json
{
  "query": "How do I use JSON helper tools?",
  "mode": "ai",
  "max_results": 5
}
```

**Parameters:**
- `query` (required): Search query (3-500 characters)
- `mode` (optional): `"ai"` for AI-enhanced or `"search"` for raw results (default: `"ai"`)
- `max_results` (optional): Maximum number of results (default: 5)

**Response (AI mode):**
```json
{
  "success": true,
  "data": {
    "response": "The JSON helper tools include...",
    "sources": [...]
  },
  "mode": "ai",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

**Response (Standard mode):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "content": "...",
        "score": 0.85,
        "metadata": {...}
      }
    ]
  },
  "mode": "search",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### GET `/health`

Health check endpoint.

## Usage Examples

### cURL

**AI-Enhanced Search:**
```bash
curl -X POST https://sqlite-wiki-search.YOUR-SUBDOMAIN.workers.dev/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I prevent SQL injection?",
    "mode": "ai",
    "max_results": 3
  }'
```

**Standard Vector Search:**
```bash
curl -X POST https://sqlite-wiki-search.YOUR-SUBDOMAIN.workers.dev/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "statistical analysis tools",
    "mode": "search",
    "max_results": 5
  }'
```

### JavaScript/Fetch

```javascript
async function searchWiki(query, mode = 'ai') {
  const response = await fetch('https://sqlite-wiki-search.YOUR-SUBDOMAIN.workers.dev/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      mode,
      max_results: 5,
    }),
  });
  
  return await response.json();
}

// Example usage
const result = await searchWiki('How do I use vector search?');
console.log(result.data.response);
```

### Python

```python
import requests

def search_wiki(query: str, mode: str = 'ai', max_results: int = 5):
    response = requests.post(
        'https://sqlite-wiki-search.YOUR-SUBDOMAIN.workers.dev/api/search',
        json={
            'query': query,
            'mode': mode,
            'max_results': max_results
        }
    )
    return response.json()

# Example usage
result = search_wiki('How do I backup my database?')
print(result['data']['response'])
```

## Configuration

### CORS Settings

Edit `wrangler.toml` to configure allowed origins:

```toml
[vars]
# Allow all origins (development)
ALLOWED_ORIGINS = "*"

# Allow specific origins (production)
[env.production]
vars = { ALLOWED_ORIGINS = "https://adamic.tech,https://docs.adamic.tech" }
```

### Custom Domain

Uncomment and configure routes in `wrangler.toml`:

```toml
routes = [
  { pattern = "search.adamic.tech/*", zone_name = "adamic.tech" }
]
```

## Updating the Index

The AutoRAG automatically syncs with your wiki. To manually trigger an update:

1. Go to Cloudflare Dashboard → AI → AI Search
2. Select `sqlite-mcp-server-wiki`
3. Click **Sync** to reindex

Changes to the wiki will be reflected in search results after syncing.

## Rate Limiting

Consider adding rate limiting for production:

```typescript
// Add to worker with Cloudflare Rate Limiting
// See: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
```

## Monitoring

View logs and analytics:

```bash
npm run tail
```

Or visit: https://dash.cloudflare.com → Workers & Pages → sqlite-wiki-search

## Security Considerations

1. **CORS**: Restrict `ALLOWED_ORIGINS` in production
2. **Rate Limiting**: Implement for public APIs
3. **Input Validation**: Already included (3-500 char queries)
4. **API Token**: Worker uses AI binding (no exposed tokens)

## Cost Estimation

Cloudflare Workers Free Tier includes:
- 100,000 requests/day
- 10ms CPU time/request

AutoRAG usage is billed separately based on:
- Vector search operations
- AI model usage (for AI-enhanced mode)

Estimated cost for 10,000 searches/month: ~$1-5 USD

## Support

- **Documentation**: https://github.com/neverinfamous/sqlite-mcp-server/wiki
- **Issues**: https://github.com/neverinfamous/sqlite-mcp-server/issues
- **Blog**: https://adamic.tech

## Troubleshooting

### NPM Audit Warnings

If you see vulnerabilities in `esbuild` after `npm install`, they should be automatically fixed by the `overrides` in `package.json`. Verify with:

```bash
npm audit
# Should show: found 0 vulnerabilities
```

The deprecated package warnings (`rollup-plugin-inject`, `sourcemap-codec`) are from transitive dependencies in wrangler and don't affect functionality or security.

## License

MIT - Same as SQLite MCP Server project

