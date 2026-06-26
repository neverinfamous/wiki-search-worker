import { execSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { readdirSync, existsSync } from 'node:fs';

const BUCKET_NAME = 'adamic-blog-search';
const BASE_PATH = resolve(process.cwd(), '..');

const WIKIS = {
    'sqlite': { path: join(BASE_PATH, 'db-mcp.wiki'), folder: 'sqlite', displayName: 'SQLite MCP Server' },
    'postgres': { path: join(BASE_PATH, 'postgres-mcp.wiki'), folder: 'postgres', displayName: 'PostgreSQL MCP Server' },
    'memory-journal': { path: join(BASE_PATH, 'memory-journal-mcp.wiki'), folder: 'memory-journal', displayName: 'Memory Journal MCP' },
    'r2-manager': { path: join(BASE_PATH, 'R2-Manager-Worker.wiki'), folder: 'r2-manager', displayName: 'R2 Bucket Manager' },
    'd1-manager': { path: join(BASE_PATH, 'd1-manager.wiki'), folder: 'd1-manager', displayName: 'D1 Database Manager' },
    'do-manager': { path: join(BASE_PATH, 'do-manager.wiki'), folder: 'do-manager', displayName: 'DO Manager' },
    'kv-manager': { path: join(BASE_PATH, 'kv-manager.wiki'), folder: 'kv-manager', displayName: 'KV Manager' },
    'mysql-mcp': { path: join(BASE_PATH, 'mysql-mcp.wiki'), folder: 'mysql-mcp', displayName: 'MySQL MCP Server' }
};

function main() {
    const args = process.argv.slice(2);
    const syncAll = args.includes('--all');
    const specificWiki = args.find(a => !a.startsWith('--'));

    if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
        console.error('Error: CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID environment variables must be set.');
        process.exit(1);
    }

    try {
        execSync('npx --no wrangler --version', { stdio: 'ignore' });
    } catch {
        console.error('Error: Wrangler CLI not found or failed to run. Make sure it is installed.');
        process.exit(1);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Wiki to R2 Sync Script');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    let wikisToSync = {};
    if (syncAll) {
        wikisToSync = WIKIS;
        console.log('Syncing all wikis\n');
    } else if (specificWiki && WIKIS[specificWiki]) {
        wikisToSync[specificWiki] = WIKIS[specificWiki];
        console.log(`Syncing only: ${WIKIS[specificWiki].displayName}\n`);
    } else {
        console.error('Error: Please specify a valid wiki name or use --all');
        console.log('Valid wikis:', Object.keys(WIKIS).join(', '));
        process.exit(1);
    }

    let totalFiles = 0;
    let successCount = 0;
    let failCount = 0;

    for (const [key, wiki] of Object.entries(wikisToSync)) {
        console.log(`Processing: ${wiki.displayName}`);
        console.log(`   Path: ${wiki.path}`);
        console.log(`   R2 Folder: ${BUCKET_NAME}/${wiki.folder}/`);

        if (!existsSync(wiki.path)) {
            console.log('   Warning: Wiki directory not found, skipping\n');
            continue;
        }

        const files = readdirSync(wiki.path).filter(f => f.endsWith('.md'));
        if (files.length === 0) {
            console.log('   Warning: No markdown files found\n');
            continue;
        }

        console.log(`   Found ${files.length} markdown files`);

        for (const file of files) {
            totalFiles++;
            const r2Path = `${wiki.folder}/${file}`;
            const fullPath = join(wiki.path, file);
            
            process.stdout.write(`   Uploading: ${file}...`);
            
            try {
                execSync(`npx --no wrangler r2 object put "${BUCKET_NAME}/${r2Path}" --file="${fullPath}" --remote`, { stdio: 'pipe' });
                console.log(' Done');
                successCount++;
            } catch (err) {
                console.log(' Failed');
                console.log(`      Error: ${err.message}`);
                failCount++;
            }
        }
        console.log();
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Sync Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`   Total files processed: ${totalFiles}`);
    console.log(`   Successful uploads: ${successCount}`);
    if (failCount > 0) {
        console.log(`   Failed uploads: ${failCount}`);
    }
    console.log();

    if (successCount > 0) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('NEXT STEP: Sync AI Search Index');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('R2 files have been updated, but Cloudflare AI Search needs manual sync.');
        console.log('Go to: Cloudflare Dashboard -> AI -> AI Search -> adamic-blog-search');
        console.log('Click the "Sync Index" button\n');
        console.log('Or wait up to 6 hours for automatic sync\n');
    }

    process.exit(failCount > 0 ? 1 : 0);
}

main();
