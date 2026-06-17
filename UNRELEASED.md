## [Unreleased]

### Security
- **Boundary Validation**: Added runtime `zod` validation for API endpoints to prevent blind casting of external payloads. (`90c9bc4`)

### Changed
- **Architecture**: Split massive `index.ts` monolith into focused handlers (`search`, `cors`), schemas, and a dedicated UI template. (`90c9bc4`)
- **Observability**: Implemented centralized structured logging and typed application error classes for safe client responses. (`90c9bc4`)
- **Dependency Updates**: Updated `pnpm` dependencies to address security vulnerabilities and patch platform limits. (`9fa26bb`)
- **feat**: Applied adversarial docs marketer guidelines by overhauling the AI Search page's About Section for high scannability. (`cff4e51`)

### Fixed
- Fixed missing favicon by adding `/favicon.ico` redirect to adamic.tech assets and injecting `site.webmanifest`. (`409bf9e`)
- Implemented adversarial-seo protocol by adding canonical URLs, JSON-LD structured data, and hardened external links. (`409bf9e`)
