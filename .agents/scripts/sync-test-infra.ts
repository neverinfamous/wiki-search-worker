import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import yaml, { isMap, isSeq } from 'yaml';

const ADAMIC_ROOT_REL = '../adamic';
const MYSQL_MCP_ROOT_REL = '../mysql-mcp';
const ADAMIC_INFRA_REL = 'docs/unified-database-ecosystem';
const MYSQL_MCP_INFRA_REL = 'test-server/infrastructure';
const SOURCE_VOLUME_PREFIX = '../../../mysql-mcp/';
const TARGET_VOLUME_PREFIX = '../../';

async function main() {
    const adamicRoot = path.resolve(process.cwd(), ADAMIC_ROOT_REL);
    const mysqlMcpRoot = path.resolve(process.cwd(), MYSQL_MCP_ROOT_REL);

    const adamicInfra = path.join(adamicRoot, ADAMIC_INFRA_REL);
    const mysqlMcpInfra = path.join(mysqlMcpRoot, MYSQL_MCP_INFRA_REL);

    if (!fs.existsSync(mysqlMcpRoot)) {
        console.error(`Error: Could not find mysql-mcp directory at ${mysqlMcpRoot}`);
        process.exit(1);
    }

    // 1. Static directory synchronization
    console.log('🔄 Synchronizing directories from adamic to mysql-mcp...');

    const filterFn = (src: string, _dest: string) => {
        const relPath = path.relative(adamicInfra, src).replace(/\\/g, '/');
        // Exclude database-specific Datadog integration configs not needed in mysql-mcp
        if (relPath.startsWith('config/datadog-integration-configs/postgres.d') ||
            relPath.startsWith('config/datadog-integration-configs/mongo.d')) {
            return false;
        }
        // Exclude root-level docs and env file to prevent clobbering mysql-mcp specific configs
        if (relPath === 'README.md' || relPath === 'AGENT_README.md' || relPath === '.env' || relPath === 'scripts/AGENT_README.md') {
            return false;
        }
        // Exclude the docker-compose.yml as it is handled by YAML filtering
        if (relPath === 'docker-compose.yml') {
            return false;
        }
        // Exclude dockerfiles dir since it only builds the custom postgres image
        if (relPath === 'dockerfiles' || relPath.startsWith('dockerfiles/')) {
            return false;
        }
        // Exclude logs directory to prevent stray logs from being copied
        if (relPath === 'logs' || relPath.startsWith('logs/')) {
            return false;
        }
        return true;
    };

    await fsPromises.cp(adamicInfra, mysqlMcpInfra, { recursive: true, force: true, filter: filterFn });
    console.log('  ✅ Copied infrastructure directories (excluding heavy DB configs)');

    // Also sync test-seed.sql specifically
    const seedSrc = path.join(adamicRoot, 'docs/test-seed.sql');
    const seedDest = path.join(mysqlMcpRoot, 'test-server/test-seed.sql');
    if (fs.existsSync(seedSrc)) {
        await fsPromises.copyFile(seedSrc, seedDest);
        console.log('  ✅ Synced: test-seed.sql');
    }

    // 2. YAML filtering for docker-compose.yml
    console.log('\n🔄 Generating mysql-mcp docker-compose.yml...');
    const composePathIn = path.join(adamicInfra, 'docker-compose.yml');
    const composePathOut = path.join(mysqlMcpInfra, 'docker-compose.yml');

    if (fs.existsSync(composePathIn)) {
        const doc = yaml.parseDocument(await fsPromises.readFile(composePathIn, 'utf8'));

        // Strip out heavy services not needed for pure MySQL integration testing
        const services = doc.get('services');
        if (isMap(services)) {
            services.delete('postgres-server');
            services.delete('mongo-server');
            
            // Correct the Datadog .env reference
            const dd = services.get('datadog-unified');
            if (isMap(dd)) {
                const envFile = dd.get('env_file');
                if (isSeq(envFile)) {
                    envFile.set(0, '.env');
                }
            }
        }

        // Strip associated volumes
        const volumes = doc.get('volumes');
        if (isMap(volumes)) {
            volumes.delete('postgres-data-v2');
            volumes.delete('mongo-data-v2');
        }

        let outYaml = doc.toString();
        // Normalize adamic-relative volume paths to mysql-mcp test-server relative paths.
        outYaml = outYaml.replaceAll(SOURCE_VOLUME_PREFIX, TARGET_VOLUME_PREFIX);
        await fsPromises.writeFile(composePathOut, outYaml);
        console.log(`  ✅ Successfully generated lightweight docker-compose.yml`);
    } else {
        console.error(`Error: Could not find source docker-compose.yml at ${composePathIn}`);
        process.exit(1);
    }

    // 3. Sync Observability Skills
    console.log('\n🔄 Synchronizing observability skills from adamic to mysql-mcp...');
    const skillsToSync = ['datadog', 'opentelemetry', 'mysql', 'mysql-mcp', 'mysql-mcp-infrastructure'];
    const adamicSkillsDir = path.join(adamicRoot, 'skills');
    const mysqlMcpSkillsDir = path.join(mysqlMcpRoot, 'skills');

    if (!fs.existsSync(mysqlMcpSkillsDir)) {
        await fsPromises.mkdir(mysqlMcpSkillsDir, { recursive: true });
    }

    for (const skill of skillsToSync) {
        const src = path.join(adamicSkillsDir, skill);
        const dest = path.join(mysqlMcpSkillsDir, skill);
        if (fs.existsSync(src)) {
            await fsPromises.cp(src, dest, { recursive: true, force: true });
            console.log(`  ✅ Synced skill: ${skill}`);
        } else {
            console.warn(`  ⚠️ Warning: Could not find skill at ${src}`);
        }
    }

    console.log('\n🎉 Test Infrastructure Synchronization Complete!');
}

main().catch(console.error);
