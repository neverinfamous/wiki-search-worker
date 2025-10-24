/**
 * SQLite MCP Server Wiki Search Worker
 * Provides public AI-powered search interface for the SQLite MCP Server documentation
 */

// Embedded HTML content
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MCP & R2 Documentation Search | AI-Powered</title>
    <meta name="description" content="AI-powered search for MCP and R2 documentation. SQLite (73 tools), PostgreSQL (63 tools), Memory Journal (15 tools), R2 cloud storage. Find answers instantly.">
    <meta name="keywords" content="MCP server, SQLite MCP, PostgreSQL MCP, Memory Journal MCP, R2 Bucket Manager, Cloudflare R2, cloud storage, database search, AI search, vector search, JSON tools, SQL injection prevention, statistical analysis, performance tuning, journal entries, knowledge management, Model Context Protocol">
    <meta name="author" content="Adamic">
    <meta name="theme-color" content="#2563eb">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="MCP & R2 Documentation Search | AI-Powered">
    <meta property="og:description" content="AI-powered search for MCP and R2 documentation. SQLite (73 tools), PostgreSQL (63 tools), Memory Journal (15 tools), R2 cloud storage. Find answers instantly.">
    <meta property="og:url" content="https://search.adamic.tech/">
    
    <!-- Twitter Card -->
    <meta property="twitter:card" content="summary">
    <meta property="twitter:title" content="MCP & R2 Documentation Search | AI-Powered">
    <meta property="twitter:description" content="AI-powered search for MCP and R2 documentation. SQLite (73 tools), PostgreSQL (63 tools), Memory Journal (15 tools), R2 cloud storage.">
    
    <!-- Favicons -->
    <link rel="icon" type="image/png" sizes="32x32" href="https://adamic.tech/assets/images/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="https://adamic.tech/assets/images/favicons/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="https://adamic.tech/assets/images/favicons/apple-touch-icon.png">
    
    <style>
        :root { --primary-color: #2563eb; --text-color: #1f2937; --text-muted: #6b7280; --border-color: #e5e7eb; --background: #ffffff; --background-alt: #f9fafb; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 16px;
            font-weight: 400;
            line-height: 1.6;
            background: var(--background);
            color: var(--text-color);
            text-rendering: optimizeSpeed;
            min-height: 100vh;
            padding-top: 120px;
        }
        /* Header Navigation */
        .site-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.95);
            border-bottom: 1px solid var(--border-color);
            backdrop-filter: blur(10px);
            padding: 1rem 0;
            contain: layout style;
        }
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            height: 88px;
        }
        .logo-link { display: inline-block; text-decoration: none; }
        .logo { height: 58px; width: 58px; display: block; object-fit: contain; }
        .main-nav {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            margin-left: 0.5rem;
        }
        .nav-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.6rem 1.2rem;
            background: var(--background-alt);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s;
            white-space: nowrap;
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            letter-spacing: 0;
        }
        .nav-link:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        .nav-link.active {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        .nav-text { display: inline; }
        .nav-icon { display: none; }
        .site-tagline {
            color: var(--text-muted);
            font-size: 0.875rem;
            margin-left: auto;
            line-height: 1.2;
            white-space: nowrap;
        }
        /* Hamburger Menu */
        .hamburger {
            display: none;
            flex-direction: column;
            cursor: pointer;
            padding: 0.5rem;
            border: none;
            background: none;
            margin-left: auto;
        }
        .hamburger span {
            width: 24px;
            height: 2px;
            background: var(--text-color);
            margin: 3px 0;
            transition: 0.3s;
            border-radius: 2px;
        }
        .hamburger.active span:nth-child(1) { transform: rotate(-45deg) translate(-5px, 6px); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: rotate(45deg) translate(-5px, -6px); }
        
        /* Mobile Navigation */
        .mobile-nav-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
        }
        .mobile-nav {
            display: block;
            position: fixed;
            top: 0;
            right: -300px;
            width: 280px;
            height: 100vh;
            background: var(--background);
            border-left: 1px solid var(--border-color);
            z-index: 1000;
            transition: right 0.3s ease;
            padding: 2rem 1rem;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
            text-align: left;
        }
        .mobile-nav.active { right: 0; }
        .mobile-nav-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        .mobile-nav-header h2 {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-color);
        }
        .mobile-nav-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-color);
            padding: 0.5rem;
        }
        .mobile-nav-links {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            text-align: left;
        }
        .mobile-nav-links .nav-link {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            background: var(--background-alt);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s;
        }
        .mobile-nav-links .nav-link:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        .mobile-nav-links .nav-link .nav-text { display: inline; }
        .mobile-nav-links .nav-link .nav-icon { display: inline; }
        
        /* Footer Styles */
        .footer {
            background: var(--background-alt);
            border-top: 1px solid var(--border-color);
            margin-top: 3rem;
            padding: 2rem 0 1rem;
            contain: layout style paint;
        }
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
        }
        .footer-section h2 {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 1rem;
        }
        .footer-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .footer-section li {
            margin-bottom: 0.5rem;
        }
        .footer-section a {
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.2s;
        }
        .footer-section a:hover {
            color: var(--primary-color);
            text-decoration: underline;
        }
        .footer-bottom {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.5rem 2rem 0;
            border-top: 1px solid var(--border-color);
            margin-top: 1.5rem;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .footer-bottom p {
            color: var(--text-muted);
            font-size: 0.875rem;
            margin: 0;
        }
        .footer-bottom a {
            color: var(--text-color);
            text-decoration: none;
            font-weight: 500;
        }
        .footer-bottom a:hover {
            color: var(--primary-color);
            text-decoration: underline;
        }
        
        /* Back to Top Button - Desktop only, matches main site */
        .back-to-top {
            position: fixed;
            top: min(50%, calc(100vh - 422px));
            left: 10%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            opacity: 1;
            visibility: visible;
            z-index: 1000;
            font-weight: bold;
        }
        .back-to-top:hover {
            background: var(--text-color);
            transform: translateY(-50%) translateX(2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
        .back-to-top:active {
            transform: translateY(-50%) translateX(0);
        }
        .back-to-top:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        
        @media (max-width: 768px) {
            body { padding-top: 100px; }
            .header-content { padding: 0 1rem; }
            .main-nav { display: none; }
            .site-tagline { display: none; }
            .hamburger { display: flex; }
            .footer { padding: 1.5rem 0 1rem; }
            .footer-content {
                padding: 0 1rem;
                grid-template-columns: 1fr;
                gap: 1.5rem;
                text-align: center;
            }
            .footer-section ul {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                justify-content: center;
            }
            .footer-section li {
                margin-bottom: 0;
                display: inline-block;
            }
            .footer-bottom {
                padding: 1rem 1rem 0;
                flex-direction: column;
                gap: 0.5rem;
            }
            .footer-section h2 { font-size: 1rem; }
            .footer-section a { font-size: 0.875rem; }
            .back-to-top {
                display: none !important;
            }
        }
        .container { max-width: 900px; margin: 0 auto; width: 100%; padding: 2rem 1rem; }
        .page-header { text-align: center; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 2px solid var(--border-color); }
        .page-header h1 { font-size: 2.5rem; margin-bottom: 0.75rem; font-weight: 700; color: var(--text-color); }
        .page-header p { font-size: 1.1rem; color: var(--text-muted); }
        .search-card {
            background: var(--background-alt);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
            contain: layout style paint;
        }
        #searchInput {
            width: 100%;
            padding: 1rem 1.5rem;
            font-size: 1rem;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            outline: none;
            margin-bottom: 1.5rem;
            background: var(--background);
            color: var(--text-color);
        }
        #searchInput:focus { border-color: var(--primary-color); }
        .mode-toggle {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
            background: var(--background);
            padding: 0.5rem;
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }
        .mode-btn {
            flex: 1;
            padding: 0.75rem 1rem;
            border: none;
            border-radius: 6px;
            background: transparent;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
            color: var(--text-color);
        }
        .mode-btn.active {
            background: var(--primary-color);
            color: white;
        }
        .search-btn {
            padding: 1rem 2rem;
            font-size: 1rem;
            font-weight: 600;
            color: white;
            background: var(--primary-color);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            transition: all 0.2s;
        }
        .search-btn:hover:not(:disabled) {
            background: #1e40af;
            transform: translateY(-1px);
        }
        .search-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .loading { display: none; text-align: center; padding: 2rem; color: var(--text-muted); }
        .loading.show { display: block; }
        .spinner {
            border: 3px solid var(--border-color);
            border-top: 3px solid var(--primary-color);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .results { display: none; margin-top: 2rem; }
        .results.show { display: block; }
        .result-card {
            background: var(--background-alt);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 2rem;
            margin-bottom: 1.5rem;
        }
        .result-content { line-height: 1.8; color: var(--text-color); white-space: pre-wrap; }
        .error { background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; border: 1px solid #fecaca; }
        .examples { background: var(--background-alt); border: 1px solid var(--border-color); border-radius: 8px; padding: 2rem; margin-bottom: 2rem; contain: layout style paint; }
        .example-btn {
            display: block;
            width: 100%;
            padding: 1rem;
            margin-bottom: 0.5rem;
            text-align: left;
            background: var(--background);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            color: var(--text-color);
            font-weight: 500;
        }
        .example-btn:hover { background: var(--background-alt); border-color: var(--primary-color); }
        .about-box {
            margin-top: 2rem;
            padding: 1.5rem;
            background: var(--background-alt);
            border-radius: 8px;
            border: 1px solid var(--border-color);
            border-left: 4px solid var(--primary-color);
        }
        .about-box h3 {
            font-size: 1.1rem;
            margin-bottom: 0.75rem;
            color: var(--text-color);
        }
        .about-box p {
            margin-bottom: 0.75rem;
            line-height: 1.6;
            color: var(--text-color);
        }
        .about-box p.no-margin {
            margin-bottom: 0;
        }
        .about-box a {
            color: var(--primary-color);
            text-decoration: underline;
        }
        .about-box a:hover {
            color: #1e40af;
        }
        .social-share {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 1.5rem 0;
            padding: 1rem;
            background: var(--background-alt);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            contain: layout style;
        }
        .social-share-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-muted);
            margin-right: 0.5rem;
        }
        .social-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 6px;
            text-decoration: none;
            transition: all 0.2s;
            font-size: 1.1rem;
            border: 1px solid var(--border-color);
            background: var(--background);
        }
        .social-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px -2px rgb(0 0 0 / 0.1);
        }
        .social-btn.twitter { color: #1da1f2; }
        .social-btn.twitter:hover { background: #1da1f2; color: white; border-color: #1da1f2; }
        .social-btn.linkedin { color: #0077b5; }
        .social-btn.linkedin:hover { background: #0077b5; color: white; border-color: #0077b5; }
        .social-btn.reddit { color: #FF4500; }
        .social-btn.reddit:hover { background: #FF4500; color: white; border-color: #FF4500; }
        .social-btn.discord { color: #5865F2; }
        .social-btn.discord:hover { background: #5865F2; color: white; border-color: #5865F2; }
        .social-btn.copy { color: var(--text-muted); }
        .social-btn.copy:hover { background: var(--primary-color); color: white; border-color: var(--primary-color); }
        .social-btn.copied { background: #10b981; color: white; border-color: #10b981; }
        .share-success {
            font-size: 0.75rem;
            color: #10b981;
            margin-left: 0.5rem;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .share-success.show { opacity: 1; }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            :root {
                --primary-color: #60a5fa;
                --text-color: #f9fafb;
                --text-muted: #d1d5db;
                --border-color: #374151;
                --background: #111827;
                --background-alt: #1f2937;
            }
            body { background: var(--background); color: var(--text-color); }
            .site-header { background: rgba(17, 24, 39, 0.95); border-bottom-color: var(--border-color); }
            .nav-link { background: var(--background-alt); border-color: var(--border-color); color: var(--text-color); }
            .nav-link:hover, .nav-link.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }
            .hamburger span { background: var(--text-color); }
            .mobile-nav { background: var(--background); border-left-color: var(--border-color); }
            .mobile-nav-header { border-bottom-color: var(--border-color); }
            .mobile-nav-header h2 { color: var(--text-color); }
            .mobile-nav-close { color: var(--text-color); }
            .mobile-nav-links .nav-link { background: var(--background-alt); border-color: var(--border-color); color: var(--text-color); }
            .mobile-nav-links .nav-link:hover { background: var(--primary-color); color: white; border-color: var(--primary-color); }
            .search-card { background: var(--background-alt); border-color: var(--border-color); }
            .result-card { background: var(--background-alt); border-color: var(--border-color); }
            .examples { background: var(--background-alt); border-color: var(--border-color); }
            .about-box { background: var(--background-alt); border-color: var(--border-color); border-left-color: var(--primary-color); }
            .about-box h3 { color: var(--text-color); }
            .about-box p { color: var(--text-color); }
            .about-box a { color: var(--primary-color); }
            .about-box a:hover { color: #93c5fd; }
            #searchInput { background: var(--background); color: var(--text-color); border-color: var(--border-color); }
            .example-btn { background: var(--background); border-color: var(--border-color); color: var(--text-color); }
            .example-btn:hover { background: var(--background-alt); }
            .mode-toggle { background: var(--background); border-color: var(--border-color); }
            .social-btn { background: var(--background-alt); border-color: var(--border-color); }
            .social-btn.reddit { color: #FF7B54; border-color: #FF7B54; }
            .social-btn.discord { color: #7289DA; border-color: #7289DA; }
            .footer { background: var(--background-alt); border-top-color: var(--border-color); }
            .footer-section h2 { color: var(--text-color); }
            .footer-section a { color: var(--text-color); }
            .footer-section a:hover { color: var(--primary-color); }
            .footer-bottom { border-top-color: var(--border-color); }
            .footer-bottom p { color: var(--text-muted); }
            .footer-bottom a { color: var(--text-color); }
            .footer-bottom a:hover { color: var(--primary-color); }
        }
    </style>
</head>
<body>
    <header class="site-header">
        <div class="header-content">
            <a href="https://adamic.tech/" class="logo-link">
                <img src="https://adamic.tech/assets/images/logo.webp" alt="Adamic Logo" class="logo" width="58" height="58">
            </a>
            <nav class="main-nav">
                <a href="https://adamic.tech/" class="nav-link" title="Home" style="min-width: 79px; font-weight: 400;">
                    <span class="nav-text">Home</span>
                    <span class="nav-icon">🏠</span>
                </a>
                <a href="https://adamic.tech/articles/" class="nav-link" title="Articles" style="min-width: 88px; font-weight: 400;">
                    <span class="nav-text">Articles</span>
                    <span class="nav-icon">📚</span>
                </a>
                <a href="https://search.adamic.tech" class="nav-link active" title="AI Search" style="min-width: 100px; font-weight: 600;">
                    <span class="nav-text">AI Search</span>
                    <span class="nav-icon">🔍</span>
                </a>
                <a href="https://adamic.tech/faq.html" class="nav-link" title="FAQ" style="min-width: 67px; font-weight: 400;">
                    <span class="nav-text">FAQ</span>
                    <span class="nav-icon">❓</span>
                </a>
                <a href="https://adamic.tech/contact.html" class="nav-link" title="Contact" style="min-width: 90px; font-weight: 400;">
                    <span class="nav-text">Contact</span>
                    <span class="nav-icon">📧</span>
                </a>
                <a href="https://hub.docker.com/u/writenotenow" target="_blank" rel="noopener" class="nav-link" title="Docker Hub">
                    <svg width="18" height="23" viewBox="0 0 24 24" fill="currentColor" style="display: inline-block; vertical-align: middle; padding: 4px 0;">
                        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .101.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.30-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983 0 1.944-.09 2.86-.266a12.248 12.248 0 003.255-1.138A11.382 11.382 0 0016.366 16c.412-.738.744-1.527.991-2.35l.144-.005c.131 0 .263-.001.394-.005.494-.011.98-.097 1.42-.25.394-.138.748-.315 1.055-.528l.365-.253-.4-.288c-.048-.034-.16-.117-.25-.16l-.004-.002c-.287-.208-.82-.582-1.327-.582z"/>
                    </svg>
                </a>
                <a href="https://github.com/neverinfamous" target="_blank" rel="noopener" class="nav-link" title="GitHub">
                    <svg width="18" height="23" viewBox="0 0 24 24" fill="currentColor" style="display: inline-block; vertical-align: middle; padding: 4px 0;">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                </a>
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
            <a href="https://search.adamic.tech" class="nav-link" title="AI Search" style="background: var(--primary-color); color: white;">
                <span class="nav-text">AI Search</span>
                <span class="nav-icon">🔍</span>
            </a>
            <a href="https://adamic.tech/faq.html" class="nav-link" title="FAQ">
                <span class="nav-text">FAQ</span>
                <span class="nav-icon">❓</span>
            </a>
            <a href="https://adamic.tech/contact.html" class="nav-link" title="Contact">
                <span class="nav-text">Contact</span>
                <span class="nav-icon">📧</span>
            </a>
            <a href="https://hub.docker.com/u/writenotenow" target="_blank" rel="noopener" class="nav-link" title="Docker Hub">
                <span class="nav-text">Docker Hub</span>
                <svg width="18" height="23" viewBox="0 0 24 24" fill="currentColor" style="display: inline-block; vertical-align: middle; padding: 4px 0;">
                    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .101.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.30-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983 0 1.944-.09 2.86-.266a12.248 12.248 0 003.255-1.138A11.382 11.382 0 0016.366 16c.412-.738.744-1.527.991-2.35l.144-.005c.131 0 .263-.001.394-.005.494-.011.98-.097 1.42-.25.394-.138.748-.315 1.055-.528l.365-.253-.4-.288c-.048-.034-.16-.117-.25-.16l-.004-.002c-.287-.208-.82-.582-1.327-.582z"/>
                </svg>
            </a>
            <a href="https://github.com/neverinfamous" target="_blank" rel="noopener" class="nav-link" title="GitHub">
                <span class="nav-text">GitHub</span>
                <svg width="18" height="23" viewBox="0 0 24 24" fill="currentColor" style="display: inline-block; vertical-align: middle; padding: 4px 0;">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>
        </div>
    </nav>
    
    <div class="container">
        <header class="page-header">
            <h1>🔍 Documentation Search</h1>
            <p>AI-Powered Search Across MCP Servers & Cloudflare R2 Bucket Manager</p>
        </header>
        
        <main>
            <section class="search-card">
                <h2 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--text-color);">Search All Documentation</h2>
                <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem;">Search comprehensive documentation for <a href="https://adamic.tech/">MCP servers and R2 Manager</a>. Need help? Check our <a href="https://adamic.tech/faq.html">installation guide</a>, browse <a href="https://adamic.tech/articles/">articles</a>, or <a href="https://adamic.tech/contact.html">contact us</a>.</p>
                <input type="text" id="searchInput" placeholder="Ask about SQLite, PostgreSQL, Memory Journal MCP, or R2 Bucket Manager..." autocomplete="off" aria-label="Search documentation">
                <div class="mode-toggle" role="group" aria-label="Search mode">
                    <button class="mode-btn active" data-mode="ai" aria-pressed="true">✨ AI-Enhanced</button>
                    <button class="mode-btn" data-mode="search" aria-pressed="false">📄 Raw Docs</button>
                </div>
                <button class="search-btn" id="searchBtn">Search Documentation</button>
            </section>
            
            <div class="loading" id="loading" aria-live="polite"><div class="spinner"></div><p>Searching across MCP servers and R2 Manager documentation...</p></div>
            <div class="results" id="results" aria-live="polite"></div>
            
            <section class="examples">
                <h2 style="font-size: 1.25rem; margin-bottom: 1rem;">💡 Example Queries</h2>
                <p style="margin-bottom: 1rem; color: var(--text-muted);">Search across MCP servers and R2 Bucket Manager documentation. Try these queries to explore features. New to MCP? Start with our <a href="https://adamic.tech/">overview page</a>.</p>
                
                <h3 style="font-size: 1rem; margin: 1.5rem 0 0.75rem; color: var(--text-color); font-weight: 600;">SQLite MCP Server Queries</h3>
                <button class="example-btn" data-query="How do I use JSON helper tools for data normalization?">How do I use JSON helper tools for data normalization?</button>
                <button class="example-btn" data-query="How do I set up vector search with embeddings in SQLite?">How do I set up vector search with embeddings in SQLite?</button>
                <button class="example-btn" data-query="What SpatiaLite geospatial operations are available?">What SpatiaLite geospatial operations are available?</button>
                
                <h3 style="font-size: 1rem; margin: 1.5rem 0 0.75rem; color: var(--text-color); font-weight: 600;">PostgreSQL MCP Server Queries</h3>
                <button class="example-btn" data-query="How do I optimize PostgreSQL query performance?">How do I optimize PostgreSQL query performance?</button>
                <button class="example-btn" data-query="What PostGIS geospatial features are available?">What PostGIS geospatial features are available?</button>
                <button class="example-btn" data-query="How do I use pgvector for semantic search?">How do I use pgvector for semantic search?</button>
                
                <h3 style="font-size: 1rem; margin: 1.5rem 0 0.75rem; color: var(--text-color); font-weight: 600;">Memory Journal MCP Server Queries</h3>
                <button class="example-btn" data-query="How do I create and link journal entries with relationships?">How do I create and link journal entries with relationships?</button>
                <button class="example-btn" data-query="How do I generate Mermaid visualizations of entry relationships?">How do I generate Mermaid visualizations of entry relationships?</button>
                <button class="example-btn" data-query="What are the available workflow prompts for sprint retrospectives?">What are the available workflow prompts for sprint retrospectives?</button>
                
                <h3 style="font-size: 1rem; margin: 1.5rem 0 0.75rem; color: var(--text-color); font-weight: 600;">R2 Bucket Manager Queries</h3>
                <button class="example-btn" data-query="How do I perform chunked uploads and manage large files?">How do I perform chunked uploads and manage large files?</button>
                <button class="example-btn" data-query="How do I set up GitHub SSO authentication with Cloudflare Access?">How do I set up GitHub SSO authentication with Cloudflare Access?</button>
                <button class="example-btn" data-query="What folder and file organization features are available?">What folder and file organization features are available?</button>
                
                <h3 style="font-size: 1rem; margin: 1.5rem 0 0.75rem; color: var(--text-color); font-weight: 600;">Security & Best Practices</h3>
                <button class="example-btn" data-query="How do I prevent SQL injection attacks?">How do I prevent SQL injection attacks with parameter binding?</button>
                <button class="example-btn" data-query="What are the backup and restore best practices?">What are the backup and restore best practices?</button>
                
                <div class="about-box">
                    <h3>About Our Documentation</h3>
                    <p>This AI-powered search interface provides unified access to comprehensive documentation for three enterprise-grade Model Context Protocol (MCP) servers plus R2 Bucket Manager. Together, these solutions offer 151+ specialized database tools and modern cloud storage management for AI-native workflows.</p>
                    
                    <h4 style="font-size: 1rem; margin: 1rem 0 0.5rem; color: var(--text-color);">SQLite MCP Server (73 Tools)</h4>
                    <p>The SQLite MCP Server transforms SQLite into a powerful, AI-ready database engine with enterprise-grade capabilities. It provides 73 specialized tools across 14 categories including JSON operations, statistical analysis, vector search, geospatial operations with SpatiaLite, full-text search with FTS5, and advanced text processing. Features include JSON auto-normalization, SQL injection protection, JSONB binary storage, semantic vector search with embeddings, BM25 ranking, virtual tables for CSV and JSON import, PRAGMA optimization tools, and comprehensive backup and restore functionality with integrity verification. Learn more on our <a href="https://adamic.tech/">homepage</a>.</p>
                    
                    <h4 style="font-size: 1rem; margin: 1rem 0 0.5rem; color: var(--text-color);">PostgreSQL MCP Server (63 Tools)</h4>
                    <p>The PostgreSQL MCP Server delivers enterprise-grade database operations with 63 specialized tools across 9 categories. It features real-time performance monitoring with pg_stat_statements, AI-powered index tuning with hypopg for zero-risk hypothetical testing, vector similarity search via pgvector, advanced geospatial operations with PostGIS, comprehensive JSON/JSONB operations, statistical analysis including correlation and regression, full-text search capabilities, backup and recovery planning, and real-time monitoring with alerting. Read the latest updates in our <a href="https://adamic.tech/articles/">blog</a>.</p>
                    
                    <h4 style="font-size: 1rem; margin: 1rem 0 0.5rem; color: var(--text-color);">Memory Journal MCP Server (15 Tools)</h4>
                    <p>The Memory Journal MCP Server captures development work as structured journal entries with automatic project context. It features 15 specialized tools for creating, linking, and visualizing journal entries. Perfect for personal knowledge management and tracking development progress.</p>
                    
                    <h4 style="font-size: 1rem; margin: 1rem 0 0.5rem; color: var(--text-color);">R2 Bucket Manager</h4>
                    <p>R2 Bucket Manager provides enterprise-grade cloud storage management for Cloudflare R2. Features include advanced file operations (chunked uploads, drag-and-drop), smart filtering, GitHub SSO authentication, folder hierarchies, signed URLs, batch operations, and zero-trust access. Complement your MCP servers with secure, scalable cloud storage.</p>
                    
                    <h4 style="font-size: 1rem; margin: 1rem 0 0.5rem; color: var(--text-color);">Search Technology</h4>
                    <p>This search interface uses Cloudflare's AI Search technology to provide intelligent, context-aware answers from all three wiki repositories. The system employs semantic vector search to understand your questions and retrieve relevant documentation chunks from comprehensive guides, tutorials, and API references. Results include source attribution showing which server and documentation page contains the answer, along with relevance scores to help you find the most accurate information quickly.</p>
                    
                    <h4 style="font-size: 1rem; margin: 1rem 0 0.5rem; color: var(--text-color);">Use Cases & Applications</h4>
                    <p>SQLite MCP excels in embedded applications, mobile apps, edge computing, IoT devices, and rapid prototyping. PostgreSQL MCP is ideal for enterprise applications, high-traffic web services, data warehousing, business intelligence, and real-time analytics. Memory Journal MCP is perfect for knowledge management, development logging, sprint planning, team retrospectives, and building personal knowledge graphs.</p>
                    
                    <p>Common use cases: AI-powered applications with vector embeddings and semantic search, geospatial applications with mapping services, statistical data analysis and reporting, full-text search implementations, secure database operations with SQL injection protection, JSON document storage and querying, development work tracking and reflection, sprint planning and retrospectives, and Model Context Protocol integration with Claude Desktop and Cursor IDE.</p>
                    
                    <h4 style="font-size: 1rem; margin: 1rem 0 0.5rem; color: var(--text-color);">Getting Started</h4>
                    <p class="no-margin">All solutions are production-ready and available for instant deployment. Each server integrates seamlessly with Claude Desktop and Cursor IDE via the Model Context Protocol. For more details, visit our <a href="https://adamic.tech/">main site</a>, check the <a href="https://adamic.tech/faq.html">FAQ</a> for setup questions, read <a href="https://adamic.tech/articles/">articles</a>, or <a href="https://adamic.tech/contact.html">contact support</a>.</p>
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
                        <li><a href="https://github.com/neverinfamous/memory-journal-mcp" target="_blank" rel="noopener">Memory Journal MCP</a></li>
                        <li><a href="https://github.com/neverinfamous/postgres-mcp" target="_blank" rel="noopener">PostgreSQL MCP</a></li>
                        <li><a href="https://github.com/neverinfamous/sqlite-mcp-server" target="_blank" rel="noopener">SQLite MCP</a></li>
                        <li><a href="https://github.com/neverinfamous/R2-Manager-Worker" target="_blank" rel="noopener">R2 Bucket Manager</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h2>Resources</h2>
                    <ul>
                        <li><a href="https://search.adamic.tech">AI Search</a></li>
                        <li><a href="https://adamic.tech/articles/">Articles</a></li>
                        <li><a href="https://adamic.tech/faq.html">FAQ</a></li>
                        <li><a href="https://adamic.tech/sitemap.html">Site Map</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h2>Support</h2>
                    <ul>
                        <li><a href="https://adamic.tech/contact.html">Contact</a></li>
                        <li><a href="https://adamic.tech/security-policy.html">Security Policy</a></li>
                        <li><a href="https://github.com/neverinfamous" target="_blank" rel="noopener">GitHub Profile</a></li>
                        <li><a href="https://hub.docker.com/u/writenotenow" target="_blank" rel="noopener">Docker Hub</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Adamic. All rights reserved.</p>
            </div>
        </footer>
        
        <!-- Back to Top Button -->
        <button class="back-to-top" id="backToTop" aria-label="Back to top" title="Back to top">⇈</button>
    </div>
    <script>
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
                    if (currentMode === 'ai' && data.data && data.data.response) {
                        // AI mode - show the synthesized response
                        content = '<div class="result-card">';
                        content += '<h3 style="color: #667eea; margin-bottom: 1rem;">✨ AI Answer</h3>';
                        content += '<div class="result-content" style="white-space: pre-wrap;">' + data.data.response + '</div>';
                        
                        // Show sources if available
                        if (data.data.data && data.data.data.length > 0) {
                            content += '<hr style="margin: 2rem 0; border: none; border-top: 2px solid var(--border-color);">';
                            content += '<h4 style="color: var(--text-muted); margin-bottom: 1rem;">📚 Sources:</h4>';
                            data.data.data.forEach(function(source) {
                                content += '<div style="background: var(--background-alt); padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; border-left: 4px solid var(--primary-color);">';
                                content += '<strong>' + source.filename + '</strong> <span style="color: var(--text-muted);">(Score: ' + (source.score * 100).toFixed(1) + '%)</span>';
                                content += '</div>';
                            });
                        }
                        content += '</div>';
                    } else {
                        // Raw search mode or fallback
                        content = '<div class="result-card"><div class="result-content"><pre>' + JSON.stringify(data.data, null, 2) + '</pre></div></div>';
                    }
                    results.innerHTML = content;
                } else {
                    results.innerHTML = '<div class="result-card"><div class="error">Error: ' + data.error + '</div></div>';
                }
            } catch (error) {
                loading.classList.remove('show');
                results.classList.add('show');
                results.innerHTML = '<div class="result-card"><div class="error">Error: ' + error.message + '</div></div>';
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
                const title = encodeURIComponent('MCP Server Documentation Search - SQLite, PostgreSQL & Memory Journal');
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
    </script>
</body>
</html>`;

export interface Env {
	AI: Ai;
	// CORS origins you want to allow (set in wrangler.toml vars)
	ALLOWED_ORIGINS?: string;
}

interface SearchRequest {
	query: string;
	mode?: 'ai' | 'search'; // ai = AI-enhanced, search = standard vector search
	max_results?: number;
}

interface SearchResponse {
	success: boolean;
	data?: any;
	error?: string;
	mode: string;
	timestamp: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return handleCORS(request, env);
		}

		// Handle different endpoints
		const url = new URL(request.url);
		const path = url.pathname;

		try {
			// Serve web interface at root
			if (path === '/') {
				return new Response(HTML_CONTENT, {
					headers: {
						'Content-Type': 'text/html; charset=utf-8',
					},
				});
			}

			// Health check endpoint
			if (path === '/health') {
				return jsonResponse({
					status: 'healthy',
					service: 'MCP Server Documentation Search',
					version: '3.0.0',
					servers: ['SQLite MCP Server', 'PostgreSQL MCP Server', 'Memory Journal MCP Server'],
					endpoints: {
						search: '/api/search (POST)',
						health: '/health (GET)',
					},
					documentation: {
						sqlite: 'https://github.com/neverinfamous/sqlite-mcp-server/wiki',
						postgres: 'https://github.com/neverinfamous/postgres-mcp/wiki',
						memoryJournal: 'https://github.com/neverinfamous/memory-journal-mcp/wiki'
					},
				});
			}

		// Search endpoint
		if (path === '/api/search') {
			if (request.method === 'POST') {
				return await handleSearch(request, env);
			} else if (request.method === 'GET') {
				// For GET requests (e.g., from crawlers), return method info with noindex
				return jsonResponse(
					{
						error: 'Method not allowed',
						message: 'This endpoint requires POST method with JSON body',
						usage: {
							method: 'POST',
							contentType: 'application/json',
							body: {
								query: 'string (required, 3-500 chars)',
								mode: 'ai | search (optional, default: ai)',
								max_results: 'number (optional, default: 5)'
							}
						},
						documentation: 'https://adamic.tech/faq.html'
					},
					405,
					{ 'X-Robots-Tag': 'noindex, nofollow' }
				);
			}
		}

		// Not found
		return jsonResponse(
			{ error: 'Endpoint not found' },
			404
		);
		} catch (error) {
			console.error('Worker error:', error);
			return jsonResponse(
				{
					success: false,
					error: error instanceof Error ? error.message : 'Internal server error',
				},
				500
			);
		}
	},
};

async function handleSearch(request: Request, env: Env): Promise<Response> {
	try {
		console.log('Search request received:', request.url);
		
		// Parse request body
		const body = await request.json() as SearchRequest;
		console.log('Search query:', body.query, 'Mode:', body.mode || 'ai');
		
		if (!body.query || typeof body.query !== 'string') {
			return jsonResponse(
				{
					success: false,
					error: 'Query parameter is required and must be a string',
				},
				400
			);
		}

		// Validate query length
		if (body.query.length < 3) {
			return jsonResponse(
				{
					success: false,
					error: 'Query must be at least 3 characters long',
				},
				400
			);
		}

		if (body.query.length > 500) {
			return jsonResponse(
				{
					success: false,
					error: 'Query must be less than 500 characters',
				},
				400
			);
		}

		const mode = body.mode || 'ai';
		const maxResults = body.max_results || 5;

		// Call AutoRAG based on mode
		let result;
		const startTime = Date.now();

		if (mode === 'ai') {
			// AI-enhanced search with generated response
			result = await env.AI.autorag('sqlite-mcp-server-wiki').aiSearch({
				query: body.query,
				max_num_results: maxResults,
				rewrite_query: true, // Improve search accuracy
				ranking_options: {
					score_threshold: 0.3, // Filter low-quality results
				},
			});
		} else {
			// Standard vector search (returns raw chunks)
			result = await env.AI.autorag('sqlite-mcp-server-wiki').search({
				query: body.query,
				max_num_results: maxResults,
				rewrite_query: true,
				ranking_options: {
					score_threshold: 0.3,
				},
			});
		}

		const responseTime = Date.now() - startTime;
		
		// Log search results
		const resultCount = mode === 'ai' 
			? (result?.data?.length || 0) 
			: (Array.isArray(result) ? result.length : 0);
		console.log('Search completed:', {
			query: body.query,
			mode,
			resultCount,
			responseTime: `${responseTime}ms`
		});

		const response: SearchResponse = {
			success: true,
			data: result,
			mode,
			timestamp: new Date().toISOString(),
		};

		// Add response time header
		return jsonResponse(response, 200, {
			'X-Response-Time': `${responseTime}ms`,
		});
	} catch (error) {
		console.error('Search error:', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			url: request.url
		});
		return jsonResponse(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Search failed',
				mode: 'unknown',
				timestamp: new Date().toISOString(),
			},
			500
		);
	}
}

function handleCORS(request: Request, env: Env): Response {
	const origin = request.headers.get('Origin');
	const allowedOrigins = env.ALLOWED_ORIGINS?.split(',') || ['*'];
	
	const headers: Record<string, string> = {
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Max-Age': '86400', // 24 hours
	};

	if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
		headers['Access-Control-Allow-Origin'] = origin || '*';
	}

	return new Response(null, {
		status: 204,
		headers,
	});
}

function jsonResponse(data: any, status = 200, additionalHeaders?: Record<string, string>): Response {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...additionalHeaders,
	};

	// Add CORS headers to all responses
	headers['Access-Control-Allow-Origin'] = '*'; // Adjust based on your needs
	headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
	headers['Access-Control-Allow-Headers'] = 'Content-Type';

	return new Response(JSON.stringify(data, null, 2), {
		status,
		headers,
	});
}

