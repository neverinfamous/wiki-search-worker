## [Unreleased]

### Fixed
- Fixed broken adamic.tech logo on the search page by replacing it with an inline base64 image data URI. (`87af5fd`)
- **search**: Fixed `AiSearchError: Account not authorized to use AI Search` by migrating from the legacy `[ai]` instance binding to the modern `[[ai_search_namespaces]]` binding (`WIKI_SEARCH`) and specifying `instance_ids` in search options.

### Security
- **deps**: Mitigated critical `esbuild` and `ws` CVEs (remote code execution and memory exhaustion DoS) by enforcing exact nested resolutions in `pnpm-workspace.yaml`. (`7382b01`)

### Changed
- **deps**: Updated `@cloudflare/workers-types` to `4.20260615.1`. (`7382b01`)
- **src**: Added explicit interface typing (`AiSearchBinding`) and strictly typed environment variables in `index.ts` to remediate TypeScript compilation errors. (`7382b01`)
- **search**: Updated Cloudflare AI Search index binding from `sqlite-mcp-server-wiki` to the standardized `adamic-blog-search` namespace and provisioned an auto-syncing `blog-index` instance.
- **sync**: Added `do-manager` to the `sync-wikis-to-r2.ps1` script and corrected the local path mapping for `db-mcp.wiki`.
- **ui**: Replaced static database tool descriptions with version-agnostic approximations (e.g., `750+ specialized tools`) to prevent documentation drift in `index.ts`.
