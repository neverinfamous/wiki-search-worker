import { spawn } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const GEMINI_DIR = join(homedir(), '.gemini');
const GET_GIT_HISTORY_SCRIPT = join(__dirname, 'get-git-history-json.ts');
const RUNTIME_EXECUTABLE = 'bun';

// Aliases that this wrapper accepts; all map to --patch-search in the downstream script.
const SEARCH_FLAG_ALIASES = new Set(['--search', '--query', '-q']);

// Flags that select an output format; if none is present we default to --summary.
const FORMAT_FLAGS = new Set(['--summary', '--stats', '--no-body', '--jsonl']);

export function main() {
  const userArgs = process.argv.slice(2);
  const childArgs: string[] = [];

  // Map search aliases to the downstream --patch-search flag.
  for (let i = 0; i < userArgs.length; i++) {
    const arg = userArgs[i];
    if (SEARCH_FLAG_ALIASES.has(arg)) {
      const val = userArgs[i + 1];
      if (val === undefined || val.startsWith('-')) {
        console.error(`Error: ${arg} requires a value.`);
        process.exit(1);
      }
      i++;
      childArgs.push('--patch-search', val);
    } else {
      childArgs.push(arg);
    }
  }

  // Default to --summary for token efficiency when no format flag is given.
  const hasFormatFlag = childArgs.some((a) => FORMAT_FLAGS.has(a));
  if (!hasFormatFlag) {
    childArgs.push('--summary');
  }

  // The child process cwd is set via the spawn option; no need to mutate this process's cwd.
  const child = spawn(RUNTIME_EXECUTABLE, [GET_GIT_HISTORY_SCRIPT, ...childArgs], {
    cwd: GEMINI_DIR,
    stdio: 'inherit',
    shell: false,
  });

  child.on('close', (code, signal) => {
    if (signal !== null) {
      // Child was killed by a signal — treat as failure.
      process.exit(1);
    }
    process.exit(code ?? 0);
  });

  child.on('error', (err) => {
    console.error(`Failed to spawn ${RUNTIME_EXECUTABLE}:`, err);
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}
