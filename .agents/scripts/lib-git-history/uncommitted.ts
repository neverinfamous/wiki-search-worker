import { spawnSync } from 'node:child_process';
import type { z } from 'zod';
import type { entrySchema, FileStatus } from './schema.js';
import type { CliArgs } from './cli.js';
import { GIT_CMD_MAX_BUFFER } from './constants.js';
import { flattenString, getLanguage } from './parser-utils.js';

export function getUncommittedState(args: CliArgs, cwd: string = process.cwd()): z.infer<typeof entrySchema> {
  const execOpts = { cwd, encoding: 'utf-8' as const, maxBuffer: GIT_CMD_MAX_BUFFER, windowsHide: true };
  
  let nameStatus = '';
  try {
    const res = spawnSync('git', ['--no-pager', 'status', '-z', '--porcelain'], execOpts);
    if (!res.error && res.status === 0) nameStatus = res.stdout;
  } catch { /* ignore */ }
  
  let numstat = '';
  try {
    const res = spawnSync('git', ['--no-pager', 'diff', '--numstat', '-z', 'HEAD'], execOpts);
    if (!res.error && res.status === 0) numstat = res.stdout;
  } catch { /* ignore */ }
  
  let patch: string | undefined;
  if (args['include-patch']) {
    try {
      const res = spawnSync('git', ['--no-pager', 'diff', 'HEAD'], execOpts);
      if (!res.error && res.status === 0) patch = res.stdout;
    } catch { /* ignore */ }
  }

  const numstatsMap = new Map<string, { insertions: number, deletions: number }>();
  if (numstat) {
    const parts = numstat.split('\0');
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      const tab1 = part.indexOf('\t');
      if (tab1 !== -1) {
        const tab2 = part.indexOf('\t', tab1 + 1);
        if (tab2 !== -1) {
           const ins = part.slice(0, tab1);
           const del = part.slice(tab1 + 1, tab2);
           let file = part.slice(tab2 + 1);
           if (file === '') {
             i += 2;
             file = parts[i];
           }
           numstatsMap.set(file, {
             insertions: ins === '-' ? 0 : parseInt(ins, 10) || 0,
             deletions: del === '-' ? 0 : parseInt(del, 10) || 0
           });
        }
      }
    }
  }

  const files: FileStatus[] = [];
  let totalInsertions = 0;
  let totalDeletions = 0;

  if (nameStatus) {
    const parts = nameStatus.split('\0');
    for (let i = 0; i < parts.length - 1; i++) {
      const statusLine = parts[i];
      if (!statusLine) continue;
      
      const xy = statusLine.slice(0, 2);
      const file = statusLine.slice(3);
      let oldFile: string | undefined;
      
      if (xy[0] === 'R' || xy[0] === 'C' || xy[1] === 'R' || xy[1] === 'C') {
         i++;
         oldFile = parts[i];
      }

      let mappedStatus = xy;
      if (xy === '??') mappedStatus = 'U';
      else if (xy[0] !== ' ' && xy[0] !== '?') mappedStatus = xy[0];
      else if (xy[1] !== ' ') mappedStatus = xy[1];

      const stats = numstatsMap.get(file) || { insertions: 0, deletions: 0 };
      
      const flatFile = flattenString(file);
      const flatStatus = flattenString(mappedStatus);
      const flatOldFile = oldFile ? flattenString(oldFile) : undefined;
      const lang = getLanguage(flatFile);

      files.push({
        status: flatStatus,
        file: flatFile,
        ...(flatOldFile ? { oldFile: flatOldFile } : {}),
        ...(lang ? { language: lang } : {}),
        insertions: stats.insertions,
        deletions: stats.deletions
      });
      totalInsertions += stats.insertions;
      totalDeletions += stats.deletions;
    }
  }

  let author = 'Unknown';
  let email = 'unknown@example.com';
  try {
    const resAuthor = spawnSync('git', ['config', 'user.name'], execOpts);
    if (!resAuthor.error && resAuthor.status === 0 && resAuthor.stdout.trim()) author = resAuthor.stdout.trim();
    
    const resEmail = spawnSync('git', ['config', 'user.email'], execOpts);
    if (!resEmail.error && resEmail.status === 0 && resEmail.stdout.trim()) email = resEmail.stdout.trim();
  } catch { /* ignore */ }

  return {
    commit: 'UNCOMMITTED',
    author: flattenString(author),
    email: flattenString(email),
    date: new Date().toISOString(),
    subject: 'Uncommitted Changes',
    cleanSubject: 'Uncommitted Changes',
    files: files.length > 0 ? files : undefined,
    fileCount: files.length,
    totalInsertions,
    totalDeletions,
    patch: patch || undefined
  };
}
