## [Unreleased]

### Security
- Patched critical CI command injection vulnerability in `sync-wikis.yml`, pinned all GitHub Actions and CLI tools to explicit SHAs, hardened CORS policies to fail-closed, added comprehensive HTTP security headers, enforced `.strict()` input validation on search schemas, and truncated PII logging in search handlers. (`3574360`)
### Changed
- Consolidated `wrangler.toml` environments into a single top-level configuration to prevent deployment of redundant duplicate workers and explicitly bind all routes to the primary worker. (`57bce46`)
### Fixed
- Addressed Copilot PR review feedback: fixed Zod default parsing, sanitized CORS origins, hardened logger context spreading, prevented internal error leakage, and mitigated XSS vector in search UI fallback. (`eb14e3f`)
