# Wiki Search Worker

Public search interface for SQLite MCP Server Wiki using Cloudflare AI Search (formerly AutoRAG).

🔗 **Live Site**: https://search.adamic.tech

## Overview

This Cloudflare Worker provides an AI-powered search interface for the [SQLite MCP Server Wiki](https://github.com/neverinfamous/sqlite-mcp-server.wiki). It uses Cloudflare's AI Search technology to deliver intelligent, context-aware answers from the complete wiki documentation.

### Features

- 🤖 **AI-Enhanced Search** - Natural language answers with source attribution
- ⚡ **Vector Search** - Fast semantic search across all documentation
- 📚 **Complete Coverage** - Searches all 73 tools across 19 wiki pages
- 🎯 **Context-Aware** - Understands questions and provides relevant examples
- 🌙 **Dark Mode** - Automatic theme detection
- 📱 **Mobile Responsive** - Works on all devices
- 🔒 **Rate Limited** - DDoS protection via Cloudflare WAF

## Architecture

```
GitHub Wiki → GitHub Actions → R2 Bucket → AI Search Index → Worker → Users
```

### Components

- **Cloudflare Worker**: Serverless search interface (`src/index.ts`)
- **R2 Bucket**: Storage for wiki markdown files (`sqlite-mcp-server-wiki`)
- **AI Search**: Managed search and indexing service
- **GitHub Actions**: Automated deployment pipeline

## Automated Deployment

Every push to `main` automatically:

1. ✅ Deploys Worker to Cloudflare
2. ✅ Syncs wiki files to R2 bucket
3. ⚠️ Requires manual "Sync Index" click (or waits 6 hours for auto-sync)

See [DEPLOYMENT.md](DEPLOYMENT.md) for setup instructions.

## Local Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Deploy to production
npm run deploy
```

## Configuration

### Environment Variables (GitHub Secrets)

- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Workers + R2 permissions
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

### Wrangler Configuration

See `wrangler.toml` for Worker configuration including:
- AI Search binding
- CORS settings
- Custom domain routing

## Rate Limiting

Two-tier protection via Cloudflare WAF:

- **Burst**: 20 requests per 10 seconds
- **Sustained**: 100 requests per minute

## Security

See [SECURITY.md](SECURITY.md) for:
- Security policy
- Vulnerability reporting
- Security measures

## Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [API_TOKEN_SETUP.md](API_TOKEN_SETUP.md) - API token creation
- [CREATE_API_TOKEN.md](CREATE_API_TOKEN.md) - Detailed token guide
- [SECURITY.md](SECURITY.md) - Security policy

## Related Repositories

- [sqlite-mcp-server](https://github.com/neverinfamous/sqlite-mcp-server) - Main project
- [sqlite-mcp-server.wiki](https://github.com/neverinfamous/sqlite-mcp-server.wiki) - Wiki source

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Storage**: Cloudflare R2
- **Search**: Cloudflare AI Search (AutoRAG)
- **CI/CD**: GitHub Actions
- **Language**: TypeScript

## Performance

- **Search Latency**: < 500ms (AI-enhanced), < 100ms (vector search)
- **Global Edge**: Deployed to 300+ Cloudflare data centers
- **Uptime**: 99.99% SLA via Cloudflare
- **Cost**: ~$5/month (Workers + R2 + AI Search)

## Support

- **Issues**: Report bugs via [GitHub Issues](https://github.com/neverinfamous/wiki-search-worker/issues)
- **Security**: See [SECURITY.md](SECURITY.md)
- **Contact**: writenotenow@gmail.com

## License

MIT License - See LICENSE file for details

---

**Maintained by**: [@neverinfamous](https://github.com/neverinfamous)  
**Organization**: [Adamic](https://adamic.tech)
