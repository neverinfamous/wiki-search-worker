#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Sync all wiki documentation to R2 bucket for AutoRAG AI Search
    
.DESCRIPTION
    This script syncs local wiki files from multiple projects to the Cloudflare R2 bucket
    that powers the AI Search at search.adamic.tech. After running this script, you need
    to manually trigger a sync in the Cloudflare dashboard or wait for automatic sync.
    
.PARAMETER WikiName
    Optional. Specify a single wiki to sync: sqlite, postgres, memory-journal, r2-manager, d1-manager, or kv-manager
    If not specified, syncs all wikis.
    
.EXAMPLE
    .\sync-wikis-to-r2.ps1
    Syncs all wikis to R2
    
.EXAMPLE
    .\sync-wikis-to-r2.ps1 -WikiName r2-manager
    Syncs only the R2 Manager wiki
    
.EXAMPLE
    .\sync-wikis-to-r2.ps1 -WikiName d1-manager
    Syncs only the D1 Manager wiki
    
.NOTES
    Requires: Wrangler CLI, CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID environment variables
    After running: Go to https://dash.cloudflare.com/<REDACTED_ACCOUNT_ID>/ai/ai-search/sqlite-mcp-server-wiki
    and click "Sync Index" button (or wait up to 6 hours for automatic sync)
#>

param(
    [ValidateSet('sqlite', 'postgres', 'memory-journal', 'r2-manager', 'd1-manager', 'kv-manager', 'all')]
    [string]$WikiName = 'all'
)

# Configuration
$BUCKET_NAME = "sqlite-mcp-server-wiki"
$BASE_PATH = "C:\Users\chris\Desktop"

# Wiki configurations
$wikis = @{
    'sqlite' = @{
        Path = "$BASE_PATH\sqlite-mcp-server.wiki"
        Folder = "sqlite"
        DisplayName = "SQLite MCP Server"
    }
    'postgres' = @{
        Path = "$BASE_PATH\postgres-mcp.wiki"
        Folder = "postgres"
        DisplayName = "PostgreSQL MCP Server"
    }
    'memory-journal' = @{
        Path = "$BASE_PATH\memory-journal-mcp.wiki"
        Folder = "memory-journal"
        DisplayName = "Memory Journal MCP"
    }
    'r2-manager' = @{
        Path = "$BASE_PATH\R2-Manager-Worker.wiki"
        Folder = "r2-manager"
        DisplayName = "R2 Bucket Manager"
    }
    'd1-manager' = @{
        Path = "$BASE_PATH\d1-manager.wiki"
        Folder = "d1-manager"
        DisplayName = "D1 Database Manager"
    }
    'kv-manager' = @{
        Path = "$BASE_PATH\kv-manager.wiki"
        Folder = "kv-manager"
        DisplayName = "KV Manager"
    }
}

# Check environment variables
if (-not $env:CLOUDFLARE_API_TOKEN) {
    Write-Host "❌ Error: CLOUDFLARE_API_TOKEN environment variable not set" -ForegroundColor Red
    Write-Host "Set it with: `$env:CLOUDFLARE_API_TOKEN='your-token'" -ForegroundColor Yellow
    exit 1
}

if (-not $env:CLOUDFLARE_ACCOUNT_ID) {
    Write-Host "❌ Error: CLOUDFLARE_ACCOUNT_ID environment variable not set" -ForegroundColor Red
    Write-Host "Set it with: `$env:CLOUDFLARE_ACCOUNT_ID='your-account-id'" -ForegroundColor Yellow
    exit 1
}

# Check if wrangler is available
if (-not (Get-Command wrangler -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Wrangler CLI not found" -ForegroundColor Red
    Write-Host "Install with: npm install -g wrangler" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📚 Wiki to R2 Sync Script" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Determine which wikis to sync
$wikisToSync = @{}
if ($WikiName -eq 'all') {
    $wikisToSync = $wikis
    Write-Host "🎯 Syncing all wikis" -ForegroundColor Green
} else {
    $wikisToSync[$WikiName] = $wikis[$WikiName]
    Write-Host "🎯 Syncing only: $($wikis[$WikiName].DisplayName)" -ForegroundColor Green
}
Write-Host ""

# Sync each wiki
$totalFiles = 0
$successCount = 0
$failCount = 0

foreach ($wikiKey in $wikisToSync.Keys) {
    $wiki = $wikisToSync[$wikiKey]
    $wikiPath = $wiki.Path
    $folder = $wiki.Folder
    $displayName = $wiki.DisplayName
    
    Write-Host "📂 Processing: $displayName" -ForegroundColor Yellow
    Write-Host "   Path: $wikiPath" -ForegroundColor Gray
    Write-Host "   R2 Folder: $BUCKET_NAME/$folder/" -ForegroundColor Gray
    
    # Check if wiki directory exists
    if (-not (Test-Path $wikiPath)) {
        Write-Host "   ⚠️  Warning: Wiki directory not found, skipping" -ForegroundColor Red
        Write-Host ""
        continue
    }
    
    # Get all markdown files
    $mdFiles = Get-ChildItem -Path $wikiPath -Filter "*.md"
    
    if ($mdFiles.Count -eq 0) {
        Write-Host "   ⚠️  Warning: No markdown files found" -ForegroundColor Yellow
        Write-Host ""
        continue
    }
    
    Write-Host "   📄 Found $($mdFiles.Count) markdown files" -ForegroundColor Cyan
    
    # Upload each file
    foreach ($file in $mdFiles) {
        $totalFiles++
        $r2Path = "$folder/$($file.Name)"
        
        try {
            Write-Host "   ↗️  Uploading: $($file.Name)..." -NoNewline -ForegroundColor Gray
            
            # Upload to R2 using wrangler
            $result = npx wrangler r2 object put "$BUCKET_NAME/$r2Path" --file="$($file.FullName)" --remote 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host " ✅" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host " ❌" -ForegroundColor Red
                Write-Host "      Error: $result" -ForegroundColor Red
                $failCount++
            }
        } catch {
            Write-Host " ❌" -ForegroundColor Red
            Write-Host "      Error: $_" -ForegroundColor Red
            $failCount++
        }
    }
    
    Write-Host ""
}

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Sync Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Total files processed: $totalFiles" -ForegroundColor White
Write-Host "   ✅ Successful uploads: $successCount" -ForegroundColor Green
if ($failCount -gt 0) {
    Write-Host "   ❌ Failed uploads: $failCount" -ForegroundColor Red
}
Write-Host ""

if ($successCount -gt 0) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    Write-Host "⚠️  NEXT STEP: Sync AutoRAG Index" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 R2 files have been updated, but AutoRAG needs manual sync." -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Go to: https://dash.cloudflare.com/<REDACTED_ACCOUNT_ID>/ai/ai-search/sqlite-mcp-server-wiki" -ForegroundColor Cyan
    Write-Host "👆 Click the 'Sync Index' button" -ForegroundColor White
    Write-Host ""
    Write-Host "⏱️  Or wait up to 6 hours for automatic sync" -ForegroundColor Gray
    Write-Host ""
}

if ($failCount -gt 0) {
    exit 1
} else {
    exit 0
}

