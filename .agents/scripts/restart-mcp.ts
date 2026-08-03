import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

const serverName = process.argv[2];

if (!serverName) {
  console.error('Usage: bun .\\.agents\\scripts\\restart-mcp.ts <server-name>');
  process.exit(1);
}

const CONFIG_PATH = process.env.MCP_CONFIG_PATH || path.join(os.homedir(), '.gemini', 'config', 'mcp_config.json');

function formatError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function readJsonFile<T>(filePath: string, label: string): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch (err) {
    throw new Error(`Failed to read or parse ${label} at ${filePath}: ${formatError(err)}`, { cause: err });
  }
}

async function main() {
  console.log(`🔄 Attempting to restart MCP server: ${serverName}`);

  let mcpConfig: Record<string, unknown>;
  try {
    mcpConfig = readJsonFile<Record<string, unknown>>(CONFIG_PATH, 'MCP config');
  } catch (err) {
    // Treat as ENOENT if not found
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`MCP config not found at: ${CONFIG_PATH}`, { cause: err });
    }
    throw err;
  }

  const mcpServers = mcpConfig.mcpServers as Record<string, { args?: string[], cwd?: string, env?: Record<string, string> }> | undefined;
  const serverConf = mcpServers?.[serverName];
  
  if (!serverConf) {
    throw new Error(`Server '${serverName}' not found in mcp_config.json!`);
  }

  let targetDir: string | null = null;
  if (serverConf.cwd) {
    targetDir = serverConf.cwd;
    try {
      if (!fs.statSync(targetDir).isDirectory()) {
        throw new Error(`Configured cwd is not a directory: ${targetDir}`);
      }
    } catch {
      throw new Error(`Configured cwd is invalid or does not exist: ${targetDir}`);
    }
  } else if (Array.isArray(serverConf.args) && serverConf.args.length > 0) {
    // Resolve relative to config path directory, not current process.cwd()
    let currentPath = path.resolve(path.dirname(CONFIG_PATH), serverConf.args[0]);
    try {
      currentPath = fs.statSync(currentPath).isDirectory() ? currentPath : path.dirname(currentPath);
      let depth = 0;
      while (depth++ < 10) {
        try {
          fs.readFileSync(path.join(currentPath, 'package.json'), 'utf8');
          targetDir = currentPath;
          break;
        } catch {
          const parent = path.dirname(currentPath);
          if (parent === currentPath) break;
          currentPath = parent;
        }
      }
    } catch {
      // statSync failed, path doesn't exist
    }
  }

  if (!targetDir) {
    throw new Error(`Could not determine workspace directory for server '${serverName}'. (Ensure 'cwd' is set in mcp_config.json)`);
  }

  const pkgPath = path.join(targetDir, 'package.json');
  
  const pkg = readJsonFile<Record<string, unknown>>(pkgPath, 'package.json in workspace');
  
  let pm = 'bun';
  if (pkg.packageManager && typeof pkg.packageManager === 'string') {
    pm = pkg.packageManager.split('@')[0];
  } else if (fs.existsSync(path.join(targetDir, 'pnpm-lock.yaml'))) {
    pm = 'pnpm';
  } else if (fs.existsSync(path.join(targetDir, 'yarn.lock'))) {
    pm = 'yarn';
  } else if (fs.existsSync(path.join(targetDir, 'package-lock.json'))) {
    pm = 'npm';
  }

  const scripts = pkg.scripts as Record<string, string> | undefined;
  const buildScript = scripts?.['build:js'] ? 'build:js' : scripts?.['build'] ? 'build' : null;

  if (buildScript) {
    console.log(`\n🔨 Running pre-restart checks in ${targetDir} (${buildScript})...`);
    console.log(`⏳ Running ${pm} run ${buildScript}...`);
    try {
      execSync(`${pm} run ${buildScript}`, { 
        stdio: 'inherit', 
        cwd: targetDir, 
        timeout: 60000 
      });
    } catch (err) {
      throw new Error(`Error during '${buildScript}'. Aborting restart.`, { cause: err });
    }
    console.log(`✅ Pre-restart checks and build complete.\n`);
  } else {
    console.log(`\n⚠️ No '${pm} run build' script found in package.json. Skipping build step.\n`);
  }

  console.log(`📝 Updating mcp_config.json to force IDE to gracefully restart the server daemon...`);
  
  if (!serverConf.env) {
    serverConf.env = {};
  }
  
  // Use a private token to avoid persistent environmental side-effects
  serverConf.env._RESTART_TOKEN = crypto.randomUUID();
  
  // Direct synchronous write to preserve the file inode for IDE file-watchers
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(mcpConfig, null, 2));

  console.log(`✅ IDE will automatically resurrect the ${serverName} server daemon shortly.`);
}

main().catch(err => {
  console.error(`❌ ${formatError(err)}`);
  process.exit(1);
});
