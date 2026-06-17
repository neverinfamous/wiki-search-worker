/**
 * Public Search Interface Template
 */

export const HTML_CONTENT = `<!DOCTYPE html>
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
    {
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
    }
    </script>

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="MCP Servers & Cloudflare Manager Documentation | AI Search">
    <meta property="og:description" content="AI-powered search for MCP servers and Cloudflare tools. Find answers across MySQL, SQLite, PostgreSQL, Memory Journal, D1, DO, KV, and R2 docs.">
    <meta property="og:url" content="https://search.adamic.tech/">

    <!-- Twitter Card -->
    <meta property="twitter:card" content="summary">
    <meta property="twitter:title" content="MCP Servers & Cloudflare Manager Documentation | AI Search">
    <meta property="twitter:description" content="AI-powered search for MCP servers and Cloudflare tools. Find answers across MySQL, SQLite, PostgreSQL, Memory Journal, D1, DO, KV, and R2 docs.">

    <!-- Favicons -->
    <link rel="icon" type="image/png" sizes="32x32" href="https://adamic.tech/assets/images/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="https://adamic.tech/assets/images/favicons/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="https://adamic.tech/assets/images/favicons/apple-touch-icon.png">
    <link rel="manifest" href="https://adamic.tech/assets/images/favicons/site.webmanifest">

    <!-- External Stylesheets - Async Loading -->
    <link rel="stylesheet" href="https://adamic.tech/assets/css/main.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://adamic.tech/assets/css/main.css"></noscript>
    <link rel="stylesheet" href="https://adamic.tech/assets/css/pages.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://adamic.tech/assets/css/pages.css"></noscript>

    <style>
:root{--primary-color:#1d4ed8;--text-color:#1f2937;--text-muted:#4b5563;--border-color:#e5e7eb;--background:#fff;--background-alt:#f9fafb;--btn-text-color:#fff}*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;font-weight:400;line-height:1.6;background:var(--background);color:var(--text-color);text-rendering:optimizeSpeed;min-height:100vh;padding-top:120px}.site-header{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(255,255,255,.95);border-bottom:1px solid var(--border-color);backdrop-filter:blur(10px);padding:1rem 0;contain:layout style}.header-content{max-width:1200px;margin:0 auto;padding:0 1.5rem;display:flex;align-items:center;gap:.75rem;height:88px}.logo-link{display:inline-block;text-decoration:none}.logo{height:58px;width:58px;display:block;object-fit:contain}
.main-nav{display:flex;align-items:center;gap:.4rem;margin-left:.5rem}.nav-link{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.6rem 1.2rem;background:var(--background-alt);border:1px solid var(--border-color);border-radius:6px;color:var(--text-color);text-decoration:none;font-size:.875rem;font-weight:500;transition:all .2s;white-space:nowrap;box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;letter-spacing:0}.nav-link:hover{background:var(--primary-color);color:var(--btn-text-color);border-color:var(--primary-color)}.nav-link.active{background:var(--primary-color);color:var(--btn-text-color);border-color:var(--primary-color)}.nav-text{display:inline}.nav-icon{display:none}.site-tagline{color:var(--text-muted);font-size:.875rem;margin-left:auto;line-height:1.2;white-space:nowrap}
.hamburger{display:none;flex-direction:column;cursor:pointer;padding:.5rem;border:none;background:none;margin-left:.5rem}.hamburger span{width:24px;height:2px;background:var(--text-color);margin:3px 0;transition:.3s;border-radius:2px}.hamburger.active span:nth-child(1){transform:rotate(-45deg) translate(-5px,6px)}.hamburger.active span:nth-child(2){opacity:0}.hamburger.active span:nth-child(3){transform:rotate(45deg) translate(-5px,-6px)}.mobile-nav-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:998}.mobile-nav{display:block;position:fixed;top:0;right:-300px;width:280px;height:100vh;background:var(--background);border-left:1px solid var(--border-color);z-index:1000;transition:right .3s ease;padding:2rem 1rem;box-shadow:-4px 0 20px rgba(0,0,0,.1);text-align:left}.mobile-nav.active{right:0}.mobile-nav-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid var(--border-color)}.mobile-nav-header h2{margin:0;font-size:1.25rem;font-weight:700;color:var(--text-color)}.mobile-nav-close{background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-color);padding:.5rem}.mobile-nav-links{display:flex;flex-direction:column;gap:.5rem;text-align:left}.mobile-nav-links .nav-link{display:flex;align-items:center;justify-content:flex-start;gap:.75rem;padding:.75rem 1rem;background:var(--background-alt);border:1px solid var(--border-color);border-radius:6px;color:var(--text-color);text-decoration:none;font-size:.875rem;font-weight:500;transition:all .2s}.mobile-nav-links .nav-link:hover{background:var(--primary-color);color:#fff;border-color:var(--primary-color)}.mobile-nav-links .nav-link .nav-text{display:inline}.mobile-nav-links .nav-link .nav-icon{display:inline}
.footer{background:var(--background-alt);border-top:1px solid var(--border-color);margin-top:3rem;padding:2rem 0 1rem;contain:layout style paint}.footer-content{max-width:1200px;margin:0 auto;padding:0 2rem;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem}.footer-section h2{font-size:1.125rem;font-weight:600;color:var(--text-color);margin-bottom:1rem}.footer-section ul{list-style:none;padding:0;margin:0}.footer-section li{margin-bottom:.5rem}.footer-section a{color:var(--text-color);text-decoration:none;font-size:.9rem;transition:color .2s}.footer-section a:hover{color:var(--primary-color);text-decoration:underline}.footer-bottom{max-width:1200px;margin:0 auto;padding:1.5rem 2rem 0;border-top:1px solid var(--border-color);margin-top:1.5rem;text-align:center;display:flex;justify-content:center;align-items:center}.footer-bottom p{color:var(--text-muted);font-size:.875rem;margin:0}.footer-bottom a{color:var(--text-color);text-decoration:none;font-weight:500}.footer-bottom a:hover{color:var(--primary-color);text-decoration:underline}.back-to-top{position:fixed;top:min(50%,calc(100vh - 422px));left:10%;transform:translateY(-50%);width:50px;height:50px;background:var(--primary-color);color:#fff;border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.25rem;box-shadow:0 4px 12px rgba(0,0,0,.15);transition:all .3s ease;opacity:1;visibility:visible;z-index:1000;font-weight:700}.back-to-top:hover{background:var(--text-color);transform:translateY(-50%) translateX(2px);box-shadow:0 6px 16px rgba(0,0,0,.2)}.back-to-top:active{transform:translateY(-50%) translateX(0)}.back-to-top:focus{outline:2px solid var(--primary-color);outline-offset:2px}
@media (max-width:768px){body{padding-top:100px}.header-content{padding:0 1rem}.main-nav{display:none}.site-tagline{display:none}.hamburger{display:flex}.footer{padding:1.5rem 0 1rem}.footer-content{padding:0 1rem;grid-template-columns:1fr;gap:1.5rem;text-align:center}.footer-section ul{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center}.footer-section li{margin-bottom:0;display:inline-block}.footer-bottom{padding:1rem 1rem 0;flex-direction:column;gap:.5rem}.footer-section h2{font-size:1rem}.footer-section a{font-size:.875rem}.back-to-top{display:none!important}}.container{max-width:900px;margin:0 auto;width:100%;padding:2rem 1rem}.page-header{text-align:center;margin-bottom:3rem;padding-bottom:2rem;border-bottom:2px solid var(--border-color)}.page-header h1{font-size:2.5rem;margin-bottom:.75rem;font-weight:700;color:var(--text-color)}.page-header p{font-size:1.1rem;color:var(--text-muted)}
.search-card{background:var(--background-alt);border:1px solid var(--border-color);border-radius:12px;padding:2rem;margin-bottom:2rem;contain:layout style paint}#searchInput{width:100%;padding:1rem 1.5rem;font-size:1rem;border:2px solid var(--border-color);border-radius:8px;outline:none;margin-bottom:1.5rem;background:var(--background);color:var(--text-color)}#searchInput:focus{border-color:var(--primary-color)}.mode-toggle{display:flex;gap:.5rem;margin-bottom:1.5rem;background:var(--background);padding:.5rem;border-radius:8px;border:1px solid var(--border-color)}.mode-btn{flex:1;padding:.75rem 1rem;border:none;border-radius:6px;background:transparent;cursor:pointer;font-weight:600;transition:all .2s;color:var(--text-color)}.mode-btn.active{background:var(--primary-color);color:var(--btn-text-color)}.search-btn{padding:1rem 2rem;font-size:1rem;font-weight:600;color:var(--btn-text-color);background:var(--primary-color);border:none;border-radius:8px;cursor:pointer;width:100%;transition:all .2s}.search-btn:hover:not(:disabled){background:#1e40af;transform:translateY(-1px)}.search-btn:disabled{opacity:.6;cursor:not-allowed}.loading{display:none;text-align:center;padding:2rem;color:var(--text-muted)}.loading.show{display:block}.spinner{border:3px solid var(--border-color);border-top:3px solid var(--primary-color);border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin:0 auto 1rem}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.results{display:none;margin-top:2rem}.results.show{display:block}.result-card{background:var(--background-alt);border:1px solid var(--border-color);border-radius:8px;padding:2rem;margin-bottom:1.5rem}.result-content{line-height:1.8;color:var(--text-color);white-space:pre-wrap}.error{background:#fee2e2;color:#991b1b;padding:1rem;border-radius:8px;border:1px solid #fecaca}.examples{background:var(--background-alt);border:1px solid var(--border-color);border-radius:8px;padding:2rem;margin-bottom:2rem;contain:layout style paint}.example-btn{display:block;width:100%;padding:1rem;margin-bottom:.5rem;text-align:left;background:var(--background);border:1px solid var(--border-color);border-radius:6px;cursor:pointer;transition:all .2s;color:var(--text-color);font-weight:500}.example-btn:hover{background:var(--background-alt);border-color:var(--primary-color)}
.about-box{margin-top:2rem;padding:1.5rem;background:var(--background-alt);border-radius:8px;border:1px solid var(--border-color);border-left:4px solid var(--primary-color)}.about-box h3{font-size:1.1rem;margin-bottom:.75rem;color:var(--text-color)}.about-box p{margin-bottom:.75rem;line-height:1.6;color:var(--text-color)}.about-box p.no-margin{margin-bottom:0}.about-box a{color:var(--primary-color);text-decoration:underline}.about-box a:hover{color:#1e40af}.social-share{display:flex;align-items:center;gap:.5rem;margin:1.5rem 0;padding:1rem;background:var(--background-alt);border:1px solid var(--border-color);border-radius:8px;contain:layout style}.social-share-label{font-size:.875rem;font-weight:500;color:var(--text-muted);margin-right:.5rem}.social-btn{display:inline-flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border-radius:6px;text-decoration:none;transition:all .2s;font-size:1.1rem;border:1px solid var(--border-color);background:var(--background)}.social-btn:hover{transform:translateY(-2px);box-shadow:0 4px 8px -2px rgb(0 0 0/.1)}.social-btn.twitter{color:#1da1f2}.social-btn.twitter:hover{background:#1da1f2;color:#fff;border-color:#1da1f2}.social-btn.linkedin{color:#0077b5}.social-btn.linkedin:hover{background:#0077b5;color:#fff;border-color:#0077b5}.social-btn.reddit{color:#FF4500}.social-btn.reddit:hover{background:#FF4500;color:#fff;border-color:#FF4500}.social-btn.discord{color:#5865F2}.social-btn.discord:hover{background:#5865F2;color:#fff;border-color:#5865F2}.social-btn.copy{color:var(--text-muted)}.social-btn.copy:hover{background:var(--primary-color);color:#fff;border-color:var(--primary-color)}.social-btn.copied{background:#10b981;color:#fff;border-color:#10b981}.share-success{font-size:.75rem;color:#10b981;margin-left:.5rem;opacity:0;transition:opacity .3s}.share-success.show{opacity:1}#theme-toggle{min-width:50px;padding:.75rem .75rem;cursor:pointer}#theme-toggle:hover{background:var(--primary-color);color:#fff;border-color:var(--primary-color)}#theme-icon{font-size:1.1rem;line-height:1}@media (max-width:768px){#theme-toggle .nav-text{display:none}}
html[data-theme="light"]{--primary-color:#2563eb;--text-color:#1f2937;--text-muted:#6b7280;--border-color:#e5e7eb;--background:#fff;--background-alt:#f9fafb;--btn-text-color:#fff}html[data-theme="light"] .site-header{background:rgba(255,255,255,.95)}html[data-theme="light"] .social-btn.reddit{color:#FF4500;border-color:#FF4500}html[data-theme="light"] .social-btn.discord{color:#5865F2;border-color:#5865F2}html[data-theme="dark"]{--primary-color:#60a5fa;--text-color:#f9fafb;--text-muted:#d1d5db;--border-color:#374151;--background:#111827;--background-alt:#1f2937;--btn-text-color:#111827}html[data-theme="dark"] .site-header{background:rgba(17,24,39,.95)}html[data-theme="dark"] .about-box a:hover{color:#93c5fd}html[data-theme="dark"] .social-btn.reddit{color:#FF7B54;border-color:#FF7B54}html[data-theme="dark"] .social-btn.discord{color:#7289DA;border-color:#7289DA}@media (prefers-color-scheme:dark){html:not([data-theme]){--primary-color:#60a5fa;--text-color:#f9fafb;--text-muted:#d1d5db;--border-color:#374151;--background:#111827;--background-alt:#1f2937;--btn-text-color:#111827}.site-header{background:rgba(17,24,39,.95)}.about-box a:hover{color:#93c5fd}.social-btn.reddit{color:#FF7B54;border-color:#FF7B54}.social-btn.discord{color:#7289DA;border-color:#7289DA}}
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
                    <svg width="18" height="23" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .101.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.30-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983 0 1.944-.09 2.86-.266a12.248 12.248 0 003.255-1.138A11.382 11.382 0 0016.366 16c.412-.738.744-1.527.991-2.35l.144-.005c.131 0 .263-.001.394-.005.494-.011.98-.097 1.42-.25.394-.138.748-.315 1.055-.528l.365-.253-.4-.288c-.048-.034-.16-.117-.25-.16l-.004-.002c-.287-.208-.82-.582-1.327-.582z"/>
                    </svg>
                </a>
                <a href="https://github.com/neverinfamous" target="_blank" rel="noopener noreferrer" class="nav-link" title="GitHub">
                    <svg width="18" height="23" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
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
                <svg width="18" height="23" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .101.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.30-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983 0 1.944-.09 2.86-.266a12.248 12.248 0 003.255-1.138A11.382 11.382 0 0016.366 16c.412-.738.744-1.527.991-2.35l.144-.005c.131 0 .263-.001.394-.005.494-.011.98-.097 1.42-.25.394-.138.748-.315 1.055-.528l.365-.253-.4-.288c-.048-.034-.16-.117-.25-.16l-.004-.002c-.287-.208-.82-.582-1.327-.582z"/>
                </svg>
            </a>
            <a href="https://github.com/neverinfamous" target="_blank" rel="noopener noreferrer" class="nav-link" title="GitHub">
                <span class="nav-text">GitHub</span>
                <svg width="18" height="23" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                </a>
                <a href="#" class="social-btn linkedin" data-platform="linkedin" title="Share on LinkedIn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>
                <a href="#" class="social-btn reddit" data-platform="reddit" title="Share on Reddit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                    </svg>
                </a>
                <a href="#" class="social-btn discord" data-platform="discord" title="Share on Discord">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                </a>
                <a href="#" class="social-btn copy" data-platform="copy" title="Copy link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
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
                const response = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, mode: currentMode, max_results: 5 })
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
                        content = '<div class="result-card"><div class="result-content"><pre>' + JSON.stringify(data.data, null, 2) + '</pre></div></div>';
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
