# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/neverinfamous/wiki-search-worker/compare/v1.1.3...HEAD)

## [1.1.3](https://github.com/neverinfamous/wiki-search-worker/releases/tag/v1.1.3) - 2026-04-22

### Changed

- **AI Search Binding Configuration**: Switched the Worker to use the legacy `env.AI.aiSearch()` binding configured via `[ai]` in `wrangler.toml` to avoid CI/deployment issues caused by token scope limitations with the newer binding strategy.
- **Dependency Updates**: Updated `wrangler` to `4.84.1`, `@cloudflare/workers-types` to `4.20260423.1`, `typescript` to `6.0.3`, `typescript-eslint` to `8.59.0`, and `eslint` to `10.2.1`.

## [1.1.2](https://github.com/neverinfamous/wiki-search-worker/releases/tag/v1.1.2) - 2026-04-06

### Changed

- **Dependency Updates**:
    - `@cloudflare/workers-types`: `4.20260316.1` -> `4.20260405.1`
    - `eslint`: `10.0.3` -> `10.2.0`
    - `typescript`: `5.9.3` -> `6.0.2`
    - `typescript-eslint`: `8.57.0` -> `8.58.0`
    - `wrangler`: `4.74.0` -> `4.80.0`
    - `flatted`: `3.4.1` -> `3.4.2`
    - `picomatch`: `4.0.3` -> `4.0.4`

### Security

- Fixed High severity Prototype Pollution via parse() in NodeJS flatted by forcing `flatted` to `3.4.2`
- Fixed Moderate severity Method Injection in POSIX Character Classes causes incorrect Glob Matching by forcing `picomatch` to `4.0.4`
- Fixed Moderate severity Zero-step sequence causes process hang and memory exhaustion by forcing `brace-expansion` fix via `npm audit fix`

## [1.1.1](https://github.com/neverinfamous/wiki-search-worker/releases/tag/v1.1.1) - 2026-03-16

### Changed

- Bumped Cloudflare tooling (`@cloudflare/workers-types`, `wrangler`) in devDependencies.
- Added `undici` to npm overrides to specify required secure version.

### Fixed

- Fixed outdated Wrangler version reference in documentation.
- Tightened ESLint configuration warnings.
- Removed outdated "Last Updated" line from README header.

## [1.1.0](https://github.com/neverinfamous/wiki-search-worker/releases/tag/v1.1.0) - 2026-03-10

### Changed

- Migrated from deprecated AutoRAG API to AI Search V2 API (`env.AI.aiSearch()`)
- Updated `@cloudflare/workers-types` from 4.20260124.0 to 4.20260310.1
- Updated `@eslint/js` from 9.39.3 to 10.0.1 (major)
- Updated `eslint` from 9.39.3 to 10.0.3 (major)
- Updated `typescript-eslint` from 8.53.1 to 8.57.0
- Updated `wrangler` from 4.60.0 to 4.72.0
- Updated `tsconfig.json` to use `@cloudflare/workers-types/latest` for AI Search V2 type support
- Dropped deprecated `--ext` flag from lint script (ESLint 10 flat config handles file matching)

### Added

- Added `.prettierrc` and `.prettierignore` configuration files
