import { readdir, readFile } from "node:fs/promises";
import { join, resolve, dirname, basename, extname, relative } from "node:path";
import { fromMarkdown } from "mdast-util-from-markdown";
import { visit } from "unist-util-visit";

const IGNORED_DIRS = new Set([".git", "node_modules", "dist", ".cache", "build"]);

// Helper to determine if a URI is external or absolute
function isExternalLink(url: string): boolean {
  // Matches http:, https:, mailto:, tel:, file:, vscode:, etc. plus protocol-relative //
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url) || url.startsWith("//");
}

async function walkDir(dir: string): Promise<string[]> {
  const files: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    const subdirPromises: Promise<string[]>[] = [];
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name)) continue;
        const fullPath = join(dir, entry.name);
        files.push(fullPath); // Track directory as a valid target
        subdirPromises.push(walkDir(fullPath));
      } else {
        files.push(join(dir, entry.name));
      }
    }
    
    const subdirs = await Promise.all(subdirPromises);
    for (const subdirFiles of subdirs) {
      files.push(...subdirFiles);
    }
  } catch (err) {
    console.error(`❌ Failed to read directory: ${dir}`);
    console.error(err);
    // Rethrow to fail fast if we cannot read a directory we intended to read
    throw err;
  }
  return files;
}

// Simple chunking utility to limit concurrency
async function processInChunks<T>(items: T[], chunkSize: number, process: (item: T) => Promise<void>) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await Promise.all(chunk.map(process));
  }
}

async function main() {
  const args = process.argv.slice(2);
  const targetDir = args[0] ? resolve(args[0]) : process.cwd();

  console.log(`🔍 Auditing internal wiki links in: ${targetDir}`);
  
  let allFiles: string[];
  try {
    allFiles = await walkDir(targetDir);
  } catch {
    process.exitCode = 1;
    return;
  }

  const mdFiles = allFiles.filter(f => extname(f).toLowerCase() === ".md");
  
  const availablePages = new Set<string>();
  const availableFiles = new Set<string>();
  
  for (const f of allFiles) {
    const absolutePath = resolve(f);
    
    // Since we now push directories too, we need to check if it's a markdown file
    if (extname(f).toLowerCase() === ".md") {
      availableFiles.add(absolutePath);
      const relPath = relative(targetDir, f);
      const pageName = relPath.replace(/\.[mM][dD]$/, "").replace(/\\/g, "/");
      availablePages.add(pageName);
      
      const baseName = basename(f, extname(f));
      availablePages.add(baseName);
    } else {
      // It's either a directory or another file type, track it in availableFiles anyway
      // so relative links to it (like images or dirs) are valid.
      availableFiles.add(absolutePath);
    }
  }

  let brokenLinkCount = 0;
  
  const checkFile = async (file: string) => {
    const content = await readFile(file, "utf-8");
    const fileDir = dirname(file);
    const fileBrokenLinks: string[] = [];
    
    const tree = fromMarkdown(content);
    
    visit(tree, "link", (node) => {
      const linkTarget = (node.url || "").trim();
      
      if (!linkTarget || isExternalLink(linkTarget)) {
        return;
      }
      
      const [pathPart] = linkTarget.split("#");
      
      // Self-referencing anchor
      if (!pathPart) {
        return;
      }
      
      let isValid = false;
      let decodedPathPart: string;
      
      try {
        decodedPathPart = decodeURIComponent(pathPart);
      } catch {
        // If it fails to decode, fallback to the raw pathPart
        decodedPathPart = pathPart;
      }
      
      // 1. Check if it matches a wiki page name
      if (availablePages.has(decodedPathPart)) {
        isValid = true;
      } 
      // 2. Check if it's an explicit relative file path
      else {
        const resolvedPath = resolve(fileDir, decodedPathPart);
        if (availableFiles.has(resolvedPath)) {
          isValid = true;
        }
      }
      
      if (!isValid) {
        // Optional: you could extract text from node.children, but target URL is enough for the script
        fileBrokenLinks.push(`- Target '${pathPart}' not found.`);
        brokenLinkCount++;
      }
    });
    
    if (fileBrokenLinks.length > 0) {
      const relativePath = relative(targetDir, file);
      console.log(`\n📄 ${relativePath}`);
      for (const broken of fileBrokenLinks) {
        console.log(`  ${broken}`);
      }
    }
  };

  await processInChunks(mdFiles, 20, checkFile);

  if (brokenLinkCount > 0) {
    console.error(`\n❌ Found ${brokenLinkCount} broken internal link(s).`);
    process.exitCode = 1;
  } else {
    console.log(`\n✅ All internal links are valid!`);
    process.exitCode = 0;
  }
}

main().catch((err) => {
  console.error("An unexpected error occurred:", err);
  process.exitCode = 1;
});
