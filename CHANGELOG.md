# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Migrated from deprecated AutoRAG API to AI Search V2 API (`env.AI.aiSearch()`)
- Updated `@cloudflare/workers-types` from 4.20260124.0 to 4.20260305.0
- Updated `@eslint/js` from 9.39.3 to 10.0.1 (major)
- Updated `eslint` from 9.39.3 to 10.0.2 (major)
- Updated `typescript-eslint` from 8.53.1 to 8.56.1
- Updated `wrangler` from 4.60.0 to 4.69.0
- Updated `tsconfig.json` to use `@cloudflare/workers-types/latest` for AI Search V2 type support
- Dropped deprecated `--ext` flag from lint script (ESLint 10 flat config handles file matching)

### Added

- Added `.prettierrc` and `.prettierignore` configuration files
