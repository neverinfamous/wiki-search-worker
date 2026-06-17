## [Unreleased]

### Changed
- Consolidated `wrangler.toml` environments into a single top-level configuration to prevent deployment of redundant duplicate workers and explicitly bind all routes to the primary worker. (`57bce46`)
### Fixed
- Addressed Copilot PR review feedback: fixed Zod default parsing, sanitized CORS origins, hardened logger context spreading, prevented internal error leakage, and mitigated XSS vector in search UI fallback. (`eb14e3f`)
