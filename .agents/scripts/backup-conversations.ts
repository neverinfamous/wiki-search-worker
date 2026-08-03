import { spawn } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const GEMINI_DIR = join(homedir(), '.gemini');

function spawnAsync(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit', shell: false });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command ${command} ${args.join(' ')} failed with code ${code}`));
    });
    child.on('error', reject);
  });
}

async function main() {
  try {
    console.log(`Starting automated git backup in ${GEMINI_DIR}...`);
    
    // Add all tracked and untracked files (respecting .gitignore)
    await spawnAsync('git', ['add', '-A'], GEMINI_DIR);
    
    // Commit with a timestamp
    const timestamp = new Date().toISOString();
    const commitMsg = `chore(backup): automated state snapshot ${timestamp}`;
    
    try {
      await spawnAsync('git', ['commit', '-m', commitMsg], GEMINI_DIR);
      console.log('Backup snapshot committed locally.');
    } catch {
      // git commit returns non-zero if there's nothing to commit. We can safely ignore this.
      console.log('No changes to commit. Local backup up to date.');
    }

    // Remote sync: check if 'origin' remote exists and attempt push
    try {
      await spawnAsync('git', ['remote', 'get-url', 'origin'], GEMINI_DIR);
      console.log('Syncing backup snapshot to remote origin...');
      await spawnAsync('git', ['push', 'origin', 'HEAD'], GEMINI_DIR);
      console.log('Remote push completed successfully.');
    } catch (pushErr: unknown) {
      console.warn(
        'Remote sync skipped or failed:',
        pushErr instanceof Error ? pushErr.message : pushErr
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred.');
    }
    process.exit(1);
  }
}

main();
