# Changelog

All notable changes to this project are documented in this file.
This changelog is auto-generated from Git history using [lib-git-history](https://github.com/neverinfamous/adamic).

## [v1.4.0]

### Performance

- optimize Turnstile validation and rate limit checks by **Chris** ([40762ee](https://github.com/neverinfamous/wiki-search-worker/commit/40762ee3c57da03e45928746386d6678f50feb40))
- optimize memory allocations in hot path by **Chris** ([343e9ac](https://github.com/neverinfamous/wiki-search-worker/commit/343e9ac5bb22ad84facbd122c62059e5bb71e54f))

### Security

- address security audit findings for turnstile and rate limiting by **Chris** ([c76fb7c](https://github.com/neverinfamous/wiki-search-worker/commit/c76fb7cf67a0cc2e2d802bbd53a6d347027d9c23))
- implement fail-closed security for turnstile and rate limiter by **Chris** ([50946de](https://github.com/neverinfamous/wiki-search-worker/commit/50946de2b417067c9383be70613039c45600b3fa))

### Changed

- ---
product: "Wiki Search Worker"
version: "v1.4.0"
date: "2026-07-09"
slug: "wiki-search-worker-v1-4-0"
npm_package: "N/A"
github_repo: "neverinfamous/wiki-search-worker"
description: "Automated wiki syncs, performance optimizations, and security hardening."
---

# Wiki Search Worker v1.4.0

This release introduces automated background syncing for the MCP Wiki ecosystem, comprehensive performance optimizations to rate limiting, and robust security hardening across our API handlers.

## Highlights
- **Automated Wiki Syncs**: The worker now autonomously synchronizes the entire wiki ecosystem on a weekly schedule, pulling directly from our centralized `wikis.json` configuration.
- **Enhanced Security Boundaries**: We've completely overhauled the API handlers, implementing strict Zod schema validation at the boundaries and fail-closed security for Cloudflare Turnstile.
- **Performance Optimizations**: Rate limiting and Turnstile validations have been optimized, resulting in a significantly faster and more reliable search experience.

## Added
- Automated wiki synchronization via a weekly GitHub cron schedule.
- Rich SEO enhancements, including automated social preview images and `SearchAction` schema markup.

## Changed
- Centralized all wiki configurations into a single `wikis.json` file to unify local development and CI automation.
- Hardened TypeScript constraints across the codebase, eliminating magic strings and enforcing strict type safety.
- Streamlined CORS logic and extracted rate limiting into dedicated, reusable helper functions.
- Upgraded foundational CI dependencies to secure the supply chain and support Node.js 24 natively.

## Fixed
- Addressed key security audit findings, ensuring fail-closed behavior for all rate limit and Turnstile verification failures.
- Eliminated transient 500 errors during R2 object synchronization by implementing robust automatic retries.
- Resolved 522 connection timeouts and cross-origin redirect failures associated with proxying external favicons. by **Chris** ([c9fdaf3](https://github.com/neverinfamous/wiki-search-worker/commit/c9fdaf39be6baed88c135484497b676f25f608ec))
- add retries to r2 object put to handle transient 500 errors by **Chris** ([da80617](https://github.com/neverinfamous/wiki-search-worker/commit/da80617028117697fbe918345480ae7e67402a58))
- automate wiki syncs via github cron and node script by **Chris** ([081d054](https://github.com/neverinfamous/wiki-search-worker/commit/081d054d7672351ae494bea6b69c9724ac407f17))
- adversarial performance audit optimizations by **Chris** ([3f1a2ec](https://github.com/neverinfamous/wiki-search-worker/commit/3f1a2ecc73933ef7a0caf98956594c6cfa979e84))
- optimize hot-path allocations and parallelize verification by **Chris** ([4927416](https://github.com/neverinfamous/wiki-search-worker/commit/49274167a83089dabc5b3eb0b36805948f56ac28))
-  by **Chris** ([4f441d9](https://github.com/neverinfamous/wiki-search-worker/commit/4f441d9acb8a9ff2b8722f89dc89dea3a7ad6b3c))
- Category: Refactored
Refactored wiki-search-worker codebase following an adversarial code quality audit:
- Removed unused ConfigurationError class.
- Extracted and deduplicated CORS header application logic.
- Centralized 500 error handling in the root router instead of handlers.
- Centralized magic values (Turnstile URLs, thresholds) in constants.ts.
- Fixed critical rate limiting bug by rejecting requests missing cf-connecting-ip.
- Added strict return typing to Cloudflare AI Search bindings.
- Improved query parser complexity by pulling static regex arrays out of scope. by **Chris** ([62b032a](https://github.com/neverinfamous/wiki-search-worker/commit/62b032a1b6ace0fb7b80b321da9f26e2f00905c3))
- Extract magic numbers to constants, modularize inline SVGs to icons.ts, and sync version with package.json by **Chris** ([aecad40](https://github.com/neverinfamous/wiki-search-worker/commit/aecad40b98fa53fac3ca8dcbf6ac0b9874d4a1ba))
- Refactored CORS logic to eliminate duplication, extracted rate limiting and turnstile verification to helper functions to reduce complexity, and centralized security headers and version string as constants. by **Chris** ([56b54bc](https://github.com/neverinfamous/wiki-search-worker/commit/56b54bcde0cdf14523c4b17d8b4c39f376e5e5dc))
- Refactored AI search and Turnstile handlers to use Zod for strict validation at I/O boundaries. Removed magic strings in favor of environment variable fallbacks and centralized constants. by **Chris** ([62038f1](https://github.com/neverinfamous/wiki-search-worker/commit/62038f1b2dd3b6a7b4f3198bd0448f504fa220b7))

## [v1.3.0]

### Features

- implement Turnstile validation and Native Rate Limiter by **Chris** ([a1bb7c8](https://github.com/neverinfamous/wiki-search-worker/commit/a1bb7c8ed2a9b03445e4376a58cac747ae6b5412))

### Bug Fixes

- address Copilot code review feedback on v1.2.0 by **Chris** ([eb14e3f](https://github.com/neverinfamous/wiki-search-worker/commit/eb14e3fe4fc4095f1e182f88bb903063b66442f9))
- inherit ai and search bindings for production env by **Chris** ([b450768](https://github.com/neverinfamous/wiki-search-worker/commit/b45076854fbdcefe48b5b56512d85417eba6d18a))
- broaden favicon redirects to include apple-touch-icons by **Chris** ([93fbfde](https://github.com/neverinfamous/wiki-search-worker/commit/93fbfdeeead56ba4a349a377a4a6fad9e7a48c2e))

## [v1.2.0]

### Features

- apply adversarial docs marketer improvements to About section by **Chris** ([cff4e51](https://github.com/neverinfamous/wiki-search-worker/commit/cff4e5147fd993e5e7a24ccc8763abed5502dfab))

### Bug Fixes

- remove tool counts from AI search descriptions by **Chris** ([86a0fbb](https://github.com/neverinfamous/wiki-search-worker/commit/86a0fbb012d511b25d35986ad8ff43e142f88c9c))
- align mobile menu button next to logo for consistency with blog pages by **Chris** ([5aa8894](https://github.com/neverinfamous/wiki-search-worker/commit/5aa889449770ae3e5d80f349af5b68744634a556))

## [v1.1.7]

### Features

- migrate to adamic-blog-search index and update wiki sync logic by **Chris** ([fe37f24](https://github.com/neverinfamous/wiki-search-worker/commit/fe37f24d2455f21598053b92730e205b9d37fb5e))

### Bug Fixes

- format package.json correctly by **Chris** ([0f9f3a5](https://github.com/neverinfamous/wiki-search-worker/commit/0f9f3a5394d342209b28b541570abf145d64e9da))
- add packageManager to package.json for CI by **Chris** ([12bdfe7](https://github.com/neverinfamous/wiki-search-worker/commit/12bdfe767270e1718978f5651f592a9d80789cd2))
- address copilot PR feedback on XSS, pnpm-workspace, and sync script by **Chris** ([9618c14](https://github.com/neverinfamous/wiki-search-worker/commit/9618c14caff524572c8a9808cbb69e1d65e892d1))
- add packages field to pnpm-workspace and remove package-lock.json by **Chris** ([706b590](https://github.com/neverinfamous/wiki-search-worker/commit/706b590b6f3baab0d8ed186f0d975a3d4662d24c))
- CORS bypass, XSS sanitization, deploy.yml bucket/wikis, pnpm CI by **Chris** ([782dd1a](https://github.com/neverinfamous/wiki-search-worker/commit/782dd1a6f3f862ea382570ce9d3375ddaeaca279))
- update tsconfig and wrangler script by **Chris** ([07e7a3f](https://github.com/neverinfamous/wiki-search-worker/commit/07e7a3fb96e3a0bef8233236b06ab7aa84a9cbba))
- replace broken logo url with inline base64 by **Chris** ([87af5fd](https://github.com/neverinfamous/wiki-search-worker/commit/87af5fd66e98350407f557a16615f3d734bfe02b))
- migrate to namespace binding and specify instance_ids by **Chris** ([8951415](https://github.com/neverinfamous/wiki-search-worker/commit/8951415da75b5b5074b291a9c063806d12fcd0fa))

## [v1.1.3]

### Bug Fixes

- Revert to legacy AI binding due to Cloudflare API permissions (#25) by **Chris LeRoux** (with Chris & Mike) ([4359dce](https://github.com/neverinfamous/wiki-search-worker/commit/4359dce8bb7d5acc557473f089882cf1ec3fae53))
- Resolve Cloudflare Workers deployment failure (#24) by **Chris LeRoux** (with Chris & Mike) ([a2fd6dd](https://github.com/neverinfamous/wiki-search-worker/commit/a2fd6dd92e22bd13ed2d6c5c5605c7e533894b64))
