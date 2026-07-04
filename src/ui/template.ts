import { STYLES } from './styles.js';
import { ICONS } from './icons.js';

/**
 * Public Search Interface Template
 */

let cachedTemplateString: string | null = null;
let cachedSiteKey: string | undefined = undefined;

function escapeHtmlAttr(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export const renderTemplate = (siteKey?: string): string => {
    if (cachedTemplateString !== null && cachedSiteKey === siteKey) {
        return cachedTemplateString;
    }
    
    cachedSiteKey = siteKey;
    cachedTemplateString = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MCP Servers & Cloudflare Manager Documentation | AI Search</title>
    <meta name="description" content="AI-powered search for MCP servers and Cloudflare tools. Find answers across MySQL, SQLite, PostgreSQL, Memory Journal, D1, DO, KV, and R2 docs.">
    <meta name="keywords" content="MCP server, MySQL MCP, SQLite MCP, PostgreSQL MCP, Memory Journal MCP, D1 Database Manager, DO Manager, Durable Objects Manager, R2 Bucket Manager, KV Manager, Cloudflare D1, Cloudflare R2, Cloudflare KV, Cloudflare Durable Objects, Workers KV, cloud storage, database management, AI search, vector search, Model Context Protocol, Cloudflare Workers">
    <meta name="author" content="Adamic">
    <meta name="theme-color" content="#1d4ed8">

    <!-- Canonical URL -->
    <link rel="canonical" href="https://search.adamic.tech/">

    <!-- Structured Data -->
    <script type="application/ld+json">
    [{
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Adamic AI Documentation Search",
      "description": "AI-powered search for MCP servers and Cloudflare tools.",
      "url": "https://search.adamic.tech",
      "applicationCategory": "SearchEngine",
      "operatingSystem": "Web",
      "publisher": {
        "@type": "Organization",
        "name": "Adamic",
        "logo": {
          "@type": "ImageObject",
          "url": "https://adamic.tech/assets/images/logo.webp"
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://search.adamic.tech/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://search.adamic.tech/?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }]
    </script>

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="MCP Servers & Cloudflare Manager Documentation | AI Search">
    <meta property="og:description" content="AI-powered search for MCP servers and Cloudflare tools. Find answers across MySQL, SQLite, PostgreSQL, Memory Journal, D1, DO, KV, and R2 docs.">
    <meta property="og:url" content="https://search.adamic.tech/">
    <meta property="og:image" content="https://adamic.tech/assets/images/logo.webp">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@adamic">
    <meta name="twitter:title" content="MCP Servers & Cloudflare Manager Documentation | AI Search">
    <meta name="twitter:description" content="AI-powered search for MCP servers and Cloudflare tools. Find answers across MySQL, SQLite, PostgreSQL, Memory Journal, D1, DO, KV, and R2 docs.">
    <meta name="twitter:image" content="https://adamic.tech/assets/images/logo.webp">

    <!-- Favicons -->
    <link rel="icon" type="image/png" sizes="32x32" href="https://adamic.tech/assets/images/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="https://adamic.tech/assets/images/favicons/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="https://adamic.tech/assets/images/favicons/apple-touch-icon.png">
    <link rel="manifest" href="https://adamic.tech/assets/images/favicons/site.webmanifest">


    <style>
${STYLES}
    </style>
    <script>
    (function() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
        applyTheme(savedTheme);
    })();
    </script>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</head>
<body>
    <header class="site-header">
        <div class="header-content">
            <a href="https://adamic.tech/" class="logo-link">
                <img src="data:image/webp;base64,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" alt="Adamic Logo" class="logo" width="58" height="58">
            </a>
            <nav class="main-nav">
                <a href="https://adamic.tech/" class="nav-link" title="Home">
                    <span class="nav-text">Home</span>
                    <span class="nav-icon">🏠</span>
                </a>
                <a href="https://adamic.tech/articles/" class="nav-link" title="Articles">
                    <span class="nav-text">Articles</span>
                    <span class="nav-icon">📚</span>
                </a>
                <a href="https://search.adamic.tech" class="nav-link active" title="AI Search">
                    <span class="nav-text">AI Search</span>
                    <span class="nav-icon">🔍</span>
                </a>
                <a href="https://adamic.tech/contact.html" class="nav-link" title="Contact">
                    <span class="nav-text">Contact</span>
                    <span class="nav-icon">📧</span>
                </a>
                <a href="https://hub.docker.com/u/writenotenow" target="_blank" rel="noopener noreferrer" class="nav-link" title="Docker Hub">
                    ${ICONS.DOCKER}
                </a>
                <a href="https://github.com/neverinfamous" target="_blank" rel="noopener noreferrer" class="nav-link" title="GitHub">
                    ${ICONS.GITHUB}
                </a>
                <button id="theme-toggle" class="nav-link" title="Toggle theme (currently: Dark)" aria-label="Theme: Dark">
                    <span id="theme-icon">🌙</span>
                </button>
            </nav>
            <div class="site-tagline">Adamic Support</div>

            <!-- Hamburger Menu Button -->
            <button class="hamburger" id="hamburger-btn" aria-label="Toggle navigation menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>

    <!-- Mobile Navigation Overlay -->
    <div class="mobile-nav-overlay" id="mobile-nav-overlay"></div>

    <!-- Mobile Navigation -->
    <nav class="mobile-nav" id="mobile-nav">
        <div class="mobile-nav-header">
            <h2>Adamic.tech</h2>
            <button class="mobile-nav-close" id="mobile-nav-close" aria-label="Close navigation menu">×</button>
        </div>
        <div class="mobile-nav-links">
            <a href="https://adamic.tech/" class="nav-link" title="Home">
                <span class="nav-text">Home</span>
                <span class="nav-icon">🏠</span>
            </a>
            <a href="https://adamic.tech/articles/" class="nav-link" title="Articles">
                <span class="nav-text">Articles</span>
                <span class="nav-icon">📚</span>
            </a>
            <a href="https://search.adamic.tech" class="nav-link active" title="AI Search">
                <span class="nav-text">AI Search</span>
                <span class="nav-icon">🔍</span>
            </a>
            <a href="https://adamic.tech/contact.html" class="nav-link" title="Contact">
                <span class="nav-text">Contact</span>
                <span class="nav-icon">📧</span>
            </a>
            <a href="https://hub.docker.com/u/writenotenow" target="_blank" rel="noopener noreferrer" class="nav-link" title="Docker Hub">
                <span class="nav-text">Docker Hub</span>
                ${ICONS.DOCKER}
            </a>
            <a href="https://github.com/neverinfamous" target="_blank" rel="noopener noreferrer" class="nav-link" title="GitHub">
                <span class="nav-text">GitHub</span>
                ${ICONS.GITHUB}
            </a>
            <button id="theme-toggle-mobile" class="nav-link" title="Toggle theme" aria-label="Theme: Dark">
                <span id="theme-icon-mobile">🌙</span>
                <span class="nav-text">Theme</span>
            </button>
        </div>
    </nav>

    <div class="container">
        <header class="page-header">
            <h1 id="page-top">🔍 Documentation Search</h1>
            <p>AI-Powered Search Across MCP Servers & Cloudflare Management Tools</p>
        </header>

        <main>
            <div class="quick-nav">
                <a href="#search-section">Search</a>
                <a href="#examples-section">Examples</a>
                <a href="#about-section">About</a>
            </div>

            <section class="search-card" id="search-section">
                <h2 class="search-section-heading">Search All Documentation</h2>
                <p class="search-description">Search comprehensive documentation for MCP servers and Cloudflare management tools. Enter queries below to find answers across MySQL MCP, SQLite MCP, PostgreSQL MCP, Memory Journal MCP, D1 Manager, DO Manager, KV Manager, and R2 Manager documentation.</p>
                <input type="text" id="searchInput" placeholder="Ask about MCP servers, D1, DO, KV, or R2 Manager..." autocomplete="off" aria-label="Search documentation">
                <div class="mode-toggle" role="group" aria-label="Search mode">
                    <button class="mode-btn active" data-mode="ai" aria-pressed="true">✨ AI-Enhanced</button>
                    <button class="mode-btn" data-mode="search" aria-pressed="false">📄 Raw Docs</button>
                </div>
                ${siteKey ? `<div class="cf-turnstile" data-sitekey="${escapeHtmlAttr(siteKey)}" data-theme="auto" style="margin-bottom: 1.5rem;"></div>` : ''}
                <button class="search-btn" id="searchBtn">Search Documentation</button>
            </section>

            <div class="loading" id="loading" aria-live="polite"><div class="spinner"></div><p>Searching across MCP servers and Cloudflare management documentation...</p></div>
            <div class="results" id="results" aria-live="polite"></div>

            <section class="examples" id="examples-section">
                <h2 class="search-section-heading">💡 Example Queries</h2>
                <p class="search-description">Search across MCP servers and Cloudflare management tools. Try these queries to explore features and capabilities.</p>

                <h3 class="search-section-subheading">Database & Storage Management</h3>
                <button class="example-btn" data-query="Explore enterprise capabilities of D1 Manager">Explore enterprise capabilities of D1 Manager</button>
                <button class="example-btn" data-query="Discover best practices for Cloudflare DO Management">Discover best practices for Cloudflare DO Management</button>
                <button class="example-btn" data-query="Learn about organization workflows in KV Manager">Learn about organization workflows in KV Manager</button>
                <button class="example-btn" data-query="Explore advanced file management in R2 Manager">Explore advanced file management in R2 Manager</button>

                <h3 class="search-section-subheading">MCP Server Features</h3>
                <button class="example-btn" data-query="Find documentation on MySQL MCP tool filtering">Find documentation on MySQL MCP tool filtering</button>
                <button class="example-btn" data-query="Explore PostgreSQL MCP query optimization">Explore PostgreSQL MCP query optimization</button>
                <button class="example-btn" data-query="How to integrate Memory Journal with GitHub">How to integrate Memory Journal with GitHub</button>
                <button class="example-btn" data-query="Learn about vector search with SQLite MCP">Learn about vector search with SQLite MCP</button>

                <h3 class="search-section-subheading">Security & Authentication</h3>
                <button class="example-btn" data-query="Understand Cloudflare Access Zero Trust features">Understand Cloudflare Access Zero Trust features</button>
                <button class="example-btn" data-query="Explore database security and connection protocols">Explore database security and connection protocols</button>

                <div class="about-box" id="about-section">
                    <h3>About Our Documentation</h3>
                    <p>This AI-powered search interface provides unified access to comprehensive documentation for four Model Context Protocol (MCP) servers and four Cloudflare management tools. Together, these solutions offer powerful database tools, modern cloud resource management, and enterprise authentication for AI-native workflows.</p>

                    <h4 class="search-about-subheading">Cloudflare Management Tools</h4>
                    <p><strong>D1 Database Manager:</strong> Enterprise-ready web application for managing Cloudflare D1 databases.</p>
                    <ul style="padding-left: 1.5rem; margin-bottom: 1rem; color: var(--text-color);">
                        <li><strong>Drizzle ORM:</strong> Introspect, push, check, and export schemas.</li>
                        <li><strong>Automated Backups:</strong> Scheduled R2 backups via cron triggers.</li>
                        <li><strong>Enterprise Features:</strong> Time Travel recovery, Read Replication, and Zero Trust auth.</li>
                        <li><strong>Performance:</strong> 60-70% faster ER diagrams and full client-side caching.</li>
                    </ul>

                    <p><strong>DO Manager:</strong> Full-featured management platform for Cloudflare Durable Objects.</p>
                    <ul style="padding-left: 1.5rem; margin-bottom: 1rem; color: var(--text-color);">
                        <li><strong>Migration & Freeze:</strong> Cross-namespace migration and read-only freeze protection.</li>
                        <li><strong>Instance Tools:</strong> SQL console V2, tags, cloning, diffs, and batch operations.</li>
                        <li><strong>Health Dashboard:</strong> Stale instance detection, quotas, and CPU metrics.</li>
                    </ul>

                    <p><strong>KV Manager:</strong> Full-featured management platform for Cloudflare Workers KV namespaces.</p>
                    <ul style="padding-left: 1.5rem; margin-bottom: 1rem; color: var(--text-color);">
                        <li><strong>Dual Metadata:</strong> KV Native (1024 bytes) + D1 Custom (unlimited size).</li>
                        <li><strong>Bulk Operations:</strong> Delete, copy, TTL, and tag management.</li>
                        <li><strong>Data Mobility:</strong> JSON/NDJSON import/export and R2 backup/restore.</li>
                    </ul>

                    <p><strong>R2 Bucket Manager:</strong> Enterprise cloud storage management for Cloudflare R2.</p>
                    <ul style="padding-left: 1.5rem; margin-bottom: 1rem; color: var(--text-color);">
                        <li><strong>AI Search:</strong> Connect R2 buckets to Cloudflare AI Search for semantic discovery.</li>
                        <li><strong>Security:</strong> API rate limiting, upload integrity verification, and Zero Trust access.</li>
                        <li><strong>Bulk Transfers:</strong> Multi-bucket ZIP download and cross-bucket search.</li>
                    </ul>

                    <h4 class="search-about-subheading">MCP Servers</h4>
                    <p><strong>MySQL MCP:</strong> Enterprise-grade MySQL operations.</p>
                    <ul style="padding-left: 1.5rem; margin-bottom: 1rem; color: var(--text-color);">
                        <li><strong>Smart Tools:</strong> 24 tool groups with intelligent filtering.</li>
                        <li><strong>Ecosystem:</strong> MySQL Router, ProxySQL, and Shell integrations.</li>
                        <li><strong>Enterprise Auth:</strong> OAuth 2.1 compliance.</li>
                    </ul>

                    <p><strong>Memory Journal MCP:</strong> Adaptive context management for AI assistants.</p>
                    <ul style="padding-left: 1.5rem; margin-bottom: 1rem; color: var(--text-color);">
                        <li><strong>Knowledge Graphs:</strong> Causal modeling with Mermaid diagram exports.</li>
                        <li><strong>Portability:</strong> Pure JS stack with zero native dependencies.</li>
                        <li><strong>Integrations:</strong> GitHub Issues, PRs, and semantic vector search.</li>
                    </ul>

                    <p><strong>PostgreSQL MCP:</strong> Enterprise-grade database intelligence.</p>
                    <ul style="padding-left: 1.5rem; margin-bottom: 1rem; color: var(--text-color);">
                        <li><strong>AI-Native:</strong> Vector similarity search via pgvector.</li>
                        <li><strong>Optimization:</strong> AI-powered index tuning with hypopg.</li>
                        <li><strong>Spatial/GIS:</strong> Advanced geospatial operations with PostGIS.</li>
                    </ul>

                    <p><strong>DB-MCP (SQLite):</strong> Powerful, AI-ready embedded database engine.</p>
                    <ul style="padding-left: 1.5rem; margin-bottom: 1rem; color: var(--text-color);">
                        <li><strong>Semantic Search:</strong> Native vector storage with AI embeddings.</li>
                        <li><strong>Analytics:</strong> Statistical analysis, JSON operations, and FTS5.</li>
                        <li><strong>Geospatial:</strong> SpatiaLite integration for GIS calculations.</li>
                    </ul>

                    <h4 class="search-about-subheading">Search Technology</h4>
                    <p>This interface uses Cloudflare's AI Search technology to provide intelligent, context-aware answers from all documentation repositories. The system employs semantic vector search to understand your questions and retrieve relevant documentation with source attribution and relevance scores.</p>

                    <h4 class="search-about-subheading">Getting Started</h4>
                    <p class="no-margin">All solutions are production-ready and available for instant deployment. MCP servers integrate with Claude Desktop and Cursor IDE. Cloudflare managers deploy to Workers or Docker. Use the search interface above to explore documentation for any topic across all solutions.</p>
                </div>
            </section>

            <div class="social-share">
                <span class="social-share-label">Share this page:</span>
                <a href="#" class="social-btn twitter" data-platform="twitter" title="Share on Twitter">
                    ${ICONS.TWITTER}
                </a>
                <a href="#" class="social-btn linkedin" data-platform="linkedin" title="Share on LinkedIn">
                    ${ICONS.LINKEDIN}
                </a>
                <a href="#" class="social-btn reddit" data-platform="reddit" title="Share on Reddit">
                    ${ICONS.REDDIT}
                </a>
                <a href="#" class="social-btn discord" data-platform="discord" title="Share on Discord">
                    ${ICONS.DISCORD}
                </a>
                <a href="#" class="social-btn copy" data-platform="copy" title="Copy link">
                    ${ICONS.COPY}
                </a>
                <span class="share-success">Copied!</span>
            </div>
        </main>

        <footer class="footer">
            <div class="footer-content">
                <div class="footer-section">
                    <h2>Projects</h2>
                    <ul>
                        <li><a href="https://github.com/neverinfamous/mysql-mcp" target="_blank" rel="noopener noreferrer">MySQL MCP</a></li>
                        <li><a href="https://github.com/neverinfamous/memory-journal-mcp" target="_blank" rel="noopener noreferrer">Memory Journal MCP</a></li>
                        <li><a href="https://github.com/neverinfamous/postgres-mcp" target="_blank" rel="noopener noreferrer">PostgreSQL MCP</a></li>
                        <li><a href="https://github.com/neverinfamous/sqlite-mcp-server" target="_blank" rel="noopener noreferrer">SQLite MCP</a></li>
                        <li><a href="https://github.com/neverinfamous/d1-manager" target="_blank" rel="noopener noreferrer">D1 Manager</a></li>
                        <li><a href="https://github.com/neverinfamous/do-manager" target="_blank" rel="noopener noreferrer">DO Manager</a></li>
                        <li><a href="https://github.com/neverinfamous/kv-manager" target="_blank" rel="noopener noreferrer">KV Manager</a></li>
                        <li><a href="https://github.com/neverinfamous/R2-Manager-Worker" target="_blank" rel="noopener noreferrer">R2 Manager</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h2>Resources</h2>
                    <ul>
                        <li><a href="https://search.adamic.tech">AI Search</a></li>
                        <li><a href="https://adamic.tech/articles/">Articles</a></li>
                        <li><a href="https://adamic.tech/sitemap.html">Site Map</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h2>Support</h2>
                    <ul>
                        <li><a href="https://adamic.tech/contact.html">Contact</a></li>
                        <li><a href="https://adamic.tech/security-policy.html">Security Policy</a></li>
                        <li><a href="https://github.com/neverinfamous" target="_blank" rel="noopener noreferrer">GitHub Profile</a></li>
                        <li><a href="https://hub.docker.com/u/writenotenow" target="_blank" rel="noopener noreferrer">Docker Hub</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Adamic. All rights reserved.</p>
            </div>
        </footer>

        <!-- Back to Top Button -->
        <button class="back-to-top" id="backToTop" aria-label="Back to top" title="Back to top">⇈</button>
    </div>
    <script>
        function escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
        let currentMode = 'ai';
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMode = btn.dataset.mode;
            });
        });
        async function performSearch(query) {
            const loading = document.getElementById('loading');
            const results = document.getElementById('results');
            const searchBtn = document.getElementById('searchBtn');
            loading.classList.add('show');
            results.classList.remove('show');
            searchBtn.disabled = true;
            try {
                const turnstileTokenInput = document.querySelector('[name="cf-turnstile-response"]');
                const turnstileToken = turnstileTokenInput ? turnstileTokenInput.value : undefined;
                
                const response = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, mode: currentMode, max_results: 5, turnstileToken })
                });
                const data = await response.json();
                loading.classList.remove('show');
                results.classList.add('show');
                if (data.success) {
                    let content = '';
                    if (currentMode === 'ai' && data.data && data.data.choices && data.data.choices.length > 0) {
                        // AI mode - show the chat completions response
                        const aiResponse = data.data.choices[0].message ? data.data.choices[0].message.content : '';
                        content = '<div class="result-card">';
                        content += '<h3 class="search-result-header">✨ AI Answer</h3>';
                        content += '<div class="result-content search-result-content">' + escapeHtml(aiResponse) + '</div>';

                        // Show source chunks if available
                        if (data.data.chunks && data.data.chunks.length > 0) {
                            content += '<hr class="search-result-divider">';
                            content += '<h4 class="search-sources-heading">📚 Sources:</h4>';
                            data.data.chunks.forEach(function(chunk) {
                                const filename = chunk.item ? chunk.item.key : chunk.id;
                                content += '<div class="search-source-item">';
                                content += '<strong>' + escapeHtml(filename) + '</strong> <span class="search-source-score">(Score: ' + (chunk.score * 100).toFixed(1) + '%)</span>';
                                content += '</div>';
                            });
                        }
                        content += '</div>';
                    } else if (currentMode === 'search' && data.data && data.data.chunks) {
                        // Raw search mode - show chunks with scores
                        content = '<div class="result-card">';
                        content += '<h3 class="search-result-header">📄 Search Results</h3>';
                        data.data.chunks.forEach(function(chunk) {
                            const filename = chunk.item ? chunk.item.key : chunk.id;
                            content += '<div class="search-source-item" style="margin-bottom:1rem;padding:1rem;border:1px solid var(--border-color);border-radius:6px;">';
                            content += '<strong>' + escapeHtml(filename) + '</strong> <span class="search-source-score">(Score: ' + (chunk.score * 100).toFixed(1) + '%)</span>';
                            content += '<div class="result-content" style="margin-top:0.5rem;font-size:0.9rem;">' + escapeHtml(chunk.text) + '</div>';
                            content += '</div>';
                        });
                        content += '</div>';
                    } else {
                        // Fallback
                        content = '<div class="result-card"><div class="result-content"><pre>' + escapeHtml(JSON.stringify(data.data, null, 2)) + '</pre></div></div>';
                    }
                    results.innerHTML = content;
                } else {
                    results.innerHTML = '<div class="result-card"><div class="error">Error: ' + escapeHtml(data.error) + '</div></div>';
                }
            } catch (error) {
                loading.classList.remove('show');
                results.classList.add('show');
                results.innerHTML = '<div class="result-card"><div class="error">Error: ' + escapeHtml(error.message) + '</div></div>';
            } finally {
                searchBtn.disabled = false;
            }
        }
        document.getElementById('searchBtn').addEventListener('click', () => {
            const query = document.getElementById('searchInput').value.trim();
            if (query) performSearch(query);
        });
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) performSearch(query);
            }
        });
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.dataset.query;
                document.getElementById('searchInput').value = query;
                performSearch(query);
            });
        });
        // Social sharing functionality
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.dataset.platform;
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent('MCP Servers & Cloudflare Managers Documentation Search - AI-Powered');
                const successMsg = document.querySelector('.share-success');

                if (platform === 'twitter') {
                    const twitterUrl = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title;
                    window.open(twitterUrl, '_blank', 'width=600,height=400');
                } else if (platform === 'linkedin') {
                    const linkedinUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + url;
                    window.open(linkedinUrl, '_blank', 'width=600,height=400');
                } else if (platform === 'reddit') {
                    const redditUrl = 'https://www.reddit.com/submit?url=' + url + '&title=' + title;
                    window.open(redditUrl, '_blank', 'width=600,height=400');
                } else if (platform === 'discord') {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        window.open('https://discord.com/channels/@me', '_blank');
                        alert('URL copied to clipboard. Paste it in Discord to share.');
                    }).catch(() => {
                        alert('Failed to copy URL. Please copy it manually and share on Discord.');
                    });
                } else if (platform === 'copy') {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        this.classList.add('copied');
                        if (successMsg) {
                            successMsg.classList.add('show');
                        }
                        setTimeout(() => {
                            this.classList.remove('copied');
                            if (successMsg) {
                                successMsg.classList.remove('show');
                            }
                        }, 2000);
                    }).catch(() => {
                        alert('Failed to copy URL to clipboard.');
                    });
                }
            });
        });
        // Mobile hamburger menu functionality
        const hamburger = document.getElementById('hamburger-btn');
        const mobileNav = document.getElementById('mobile-nav');
        const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        const mobileNavClose = document.getElementById('mobile-nav-close');

        function toggleMobileNav() {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            const isActive = mobileNav.classList.contains('active');
            mobileNavOverlay.style.display = isActive ? 'block' : 'none';
            document.body.style.overflow = isActive ? 'hidden' : '';
        }

        function closeMobileNav() {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            mobileNavOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }

        if (hamburger) hamburger.addEventListener('click', toggleMobileNav);
        if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
        if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);

        // Back to Top functionality - Always visible, smooth scroll to top
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Close mobile nav when clicking any link without target attribute
        document.querySelectorAll('.mobile-nav-links .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (!link.hasAttribute('target')) {
                    closeMobileNav();
                }
            });
        });

        // Theme Toggle Functionality
        const themeToggle = document.getElementById('theme-toggle');
        const themeToggleMobile = document.getElementById('theme-toggle-mobile');
        const themeIcon = document.getElementById('theme-icon');
        const themeIconMobile = document.getElementById('theme-icon-mobile');

        const themeConfig = {
            light: { icon: '☀️', label: 'Theme: Light', title: 'Toggle theme (currently: Light)' },
            dark: { icon: '🌙', label: 'Theme: Dark', title: 'Toggle theme (currently: Dark)' }
        };

        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }

        function updateThemeUI(theme) {
            // Fallback to 'dark' if theme is invalid (e.g., old 'system' value)
            const validTheme = themeConfig[theme] ? theme : 'dark';
            const config = themeConfig[validTheme];
            if (themeIcon) themeIcon.textContent = config.icon;
            if (themeIconMobile) themeIconMobile.textContent = config.icon;
            if (themeToggle) {
                themeToggle.setAttribute('aria-label', config.label);
                themeToggle.setAttribute('title', config.title);
            }
            if (themeToggleMobile) {
                themeToggleMobile.setAttribute('aria-label', config.label);
                themeToggleMobile.setAttribute('title', config.title);
            }
        }

        function toggleTheme() {
            const currentTheme = localStorage.getItem('theme') || 'dark';
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

            localStorage.setItem('theme', nextTheme);
            applyTheme(nextTheme);
            updateThemeUI(nextTheme);
        }

        // Initialize theme UI
        let currentTheme = localStorage.getItem('theme') || 'dark';
        // Migrate old 'system' value to 'dark'
        if (currentTheme === 'system' || !themeConfig[currentTheme]) {
            currentTheme = 'dark';
            localStorage.setItem('theme', currentTheme);
        }
        applyTheme(currentTheme);
        updateThemeUI(currentTheme);

        // Add click handlers
        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
        if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);
    </script>
</body>
</html>`;
    return cachedTemplateString;
};
