import { readFile, writeFile, readdir, mkdir, rm, chmod } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { existsSync } from "node:fs";

const DESKTOP_DIR = "C:\\Users\\chris\\Desktop";
const SOURCE_DIR = join(DESKTOP_DIR, "adamic", ".agents");

const TARGET_REPOS = [
  "adamic-blog",
  "wiki-search-worker",
  "memory-journal-mcp",
  "mysql-mcp",
  "db-mcp",
  "postgres-mcp",
  "d1-manager",
  "do-manager",
  "kv-manager",
  "R2-Manager-Worker",
  "container-manager",
  "worker-manager",
  "do-manager-admin-hooks",
  "do-test-worker",
];

const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".js",
  ".mjs",
  ".cjs",
  ".md",
  ".json",
  ".yml",
  ".yaml",
  ".ps1",
  ".sh",
]);

const IGNORED_PATHS = [
  "scratch",
  "scripts/usability",
  "node_modules"
];

interface SourceFile {
  relPath: string;
  isText: boolean;
  content: string | Buffer;
}

/**
 * Recursively load all files from the source .agents directory into memory.
 */
async function loadSourceFiles(dir: string, baseDir: string = dir): Promise<Map<string, SourceFile>> {
  const sourceMap = new Map<string, SourceFile>();
  const entries = await readdir(dir, { withFileTypes: true });

  await Promise.all(entries.map(async (entry) => {
    const fullPath = join(dir, entry.name);
    const relPath = fullPath.slice(baseDir.length + 1).replace(/\\/g, "/");

    if (IGNORED_PATHS.some(ignored => relPath.startsWith(ignored) || relPath.includes(ignored))) {
      return;
    }

    if (entry.isDirectory()) {
      const subMap = await loadSourceFiles(fullPath, baseDir);
      for (const [k, v] of subMap) {
        sourceMap.set(k, v);
      }
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      const isText = TEXT_EXTENSIONS.has(ext);
      const content = isText ? await readFile(fullPath, "utf8") : await readFile(fullPath);
      sourceMap.set(relPath, { relPath, isText, content });
    }
  }));

  return sourceMap;
}

/**
 * Synchronize a target repository using in-memory differential comparison.
 */
async function syncRepo(
  repo: string,
  sourceMap: Map<string, SourceFile>,
  sourcePathStr: string,
  sourcePathEscaped: string
) {
  const targetRepoDir = join(DESKTOP_DIR, repo);
  if (!existsSync(targetRepoDir)) {
    return { repo, status: "skipped", reason: "Directory does not exist" };
  }

  const targetPath = join(targetRepoDir, ".agents");
  const targetPathStr = join(DESKTOP_DIR, repo);
  const targetPathEscaped = targetPathStr.replace(/\\/g, "\\\\");

  let updatedCount = 0;
  let unchangedCount = 0;
  let prunedCount = 0;

  try {
    // 1. Gather existing files in target .agents directory
    const existingRelFiles = new Set<string>();
    if (existsSync(targetPath)) {
      const targetEntries = await readdir(targetPath, { recursive: true, withFileTypes: true });
      for (const entry of targetEntries) {
        if (entry.isFile()) {
          const fullPath = join(entry.parentPath, entry.name);
          const relPath = fullPath.slice(targetPath.length + 1).replace(/\\/g, "/");
          existingRelFiles.add(relPath);
        }
      }
    } else {
      await mkdir(targetPath, { recursive: true });
    }

    // 2. Process source files in chunks to prevent EMFILE limits
    const sourceFiles = Array.from(sourceMap.values());
    const CHUNK_SIZE = 50;

    for (let i = 0; i < sourceFiles.length; i += CHUNK_SIZE) {
      const chunk = sourceFiles.slice(i, i + CHUNK_SIZE);
      await Promise.all(
        chunk.map(async (srcFile) => {
          const targetFilePath = join(targetPath, srcFile.relPath);

          // Handle .jsonl files: preserve existing contents or initialize empty file
          if (srcFile.relPath.endsWith(".jsonl")) {
            if (!existsSync(targetFilePath)) {
              await mkdir(dirname(targetFilePath), { recursive: true });
              await writeFile(targetFilePath, "");
              updatedCount++;
            } else {
              unchangedCount++;
            }
            return;
          }

          // Prepare transformed content
          let transformedContent: string | Buffer;
          if (srcFile.isText && typeof srcFile.content === "string") {
            let text = srcFile.content;
            
            // Protect master repository paths that should never be localized
            const protect = ["docs", "skills"];
            for (const p of protect) {
              const pStr = join(sourcePathStr, p);
              text = text.replaceAll(pStr, `%%PROTECT_${p}%%`);
              text = text.replaceAll(pStr.replace(/\\/g, "\\\\"), `%%PROTECT_${p}_ESC%%`);
            }

            // Perform standard repository localization
            if (text.includes(sourcePathStr) || text.includes(sourcePathEscaped)) {
              text = text.replaceAll(sourcePathStr, targetPathStr);
              text = text.replaceAll(sourcePathEscaped, targetPathEscaped);
            }
            
            // Restore protected master paths
            for (const p of protect) {
              const pStr = join(sourcePathStr, p);
              text = text.replaceAll(`%%PROTECT_${p}%%`, pStr);
              text = text.replaceAll(`%%PROTECT_${p}_ESC%%`, pStr.replace(/\\/g, "\\\\"));
            }

            transformedContent = text;
          } else {
            transformedContent = srcFile.content;
          }

          // Compare existing file content to avoid redundant disk writes
          if (existingRelFiles.has(srcFile.relPath)) {
            try {
              if (srcFile.isText && typeof transformedContent === "string") {
                const existingText = await readFile(targetFilePath, "utf8");
                if (existingText === transformedContent) {
                  unchangedCount++;
                  return;
                }
              } else {
                const existingBuf = await readFile(targetFilePath);
                if (Buffer.isBuffer(transformedContent) && existingBuf.equals(transformedContent)) {
                  unchangedCount++;
                  return;
                }
              }
            } catch {
              // Read failure, proceed to overwrite
            }
          }

          // Write file only when new or content has changed
          await mkdir(dirname(targetFilePath), { recursive: true });
          
          // Clear read-only if necessary
          if (existsSync(targetFilePath)) {
            try {
              await chmod(targetFilePath, 0o666);
            } catch (err) {
              console.warn(`  ⚠️ Warning: Failed to chmod ${targetFilePath} - ${String(err)}`);
            }
          }

          await writeFile(targetFilePath, transformedContent);
          updatedCount++;
        })
      );
    }

    // 3. Prune orphan files that no longer exist in source .agents
    for (const relPath of existingRelFiles) {
      if (!sourceMap.has(relPath) && !relPath.endsWith(".jsonl")) {
        const orphanPath = join(targetPath, relPath);
        try {
          await rm(orphanPath, { force: true });
          prunedCount++;
        } catch (err) {
          console.warn(`  ⚠️ Warning: Failed to remove orphan ${orphanPath} - ${String(err)}`);
        }
      }
    }

    return {
      repo,
      status: "synced",
      updatedCount,
      unchangedCount,
      prunedCount,
    };
  } catch (error) {
    return { repo, status: "error", error: String(error) };
  }
}

async function syncWorkflows() {
  const startTime = performance.now();
  console.log(`🔄 Starting optimized agent ecosystem sync from: ${SOURCE_DIR}`);

  if (!existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory does not exist: ${SOURCE_DIR}`);
    process.exit(1);
  }

  // Pre-load all source files once into memory
  const sourceMap = await loadSourceFiles(SOURCE_DIR);
  console.log(`📦 Loaded ${sourceMap.size} source files into memory.`);

  const sourcePathStr = join(DESKTOP_DIR, "adamic");
  const sourcePathEscaped = sourcePathStr.replace(/\\/g, "\\\\");

  // Sync target repositories concurrently
  const results = await Promise.all(
    TARGET_REPOS.map((repo) => syncRepo(repo, sourceMap, sourcePathStr, sourcePathEscaped))
  );

  const durationMs = performance.now() - startTime;

  let hasError = false;
  for (const res of results) {
    if (res.status === "synced") {
      const details = `(updated: ${res.updatedCount}, unchanged: ${res.unchangedCount}${res.prunedCount ? `, pruned: ${res.prunedCount}` : ""})`;
      console.log(`   ✓ Synced: ${res.repo} ${details}`);
    } else if (res.status === "skipped") {
      console.log(`   ⏭️ Skipped (not cloned): ${res.repo}`);
    } else {
      hasError = true;
      console.error(`   ❌ Failed: ${res.repo} - ${res.error}`);
    }
  }

  if (hasError) {
    console.error(`❌ Sync completed with errors in ${(durationMs / 1000).toFixed(2)}s`);
    process.exit(1);
  } else {
    console.log(`✨ Agent ecosystem sync completed successfully in ${(durationMs / 1000).toFixed(2)}s!`);
  }
}

syncWorkflows().catch(console.error);
