import { expect, test, describe, beforeAll, afterAll } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { getUncommittedState } from '../uncommitted.js';

import os from 'node:os';

describe('Uncommitted Working Tree State', () => {
  const testDir = path.join(os.tmpdir(), `uncommitted-repo-${Date.now()}`);

  beforeAll(() => {
    // Setup a clean git repo
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
    execSync('git init -b main', { cwd: testDir, stdio: 'ignore', windowsHide: true });
    execSync('git config user.name "Test Author"', { cwd: testDir, stdio: 'ignore', windowsHide: true });
    execSync('git config user.email "test@example.com"', { cwd: testDir, stdio: 'ignore', windowsHide: true });
    execSync('git config core.hooksPath ""', { cwd: testDir, stdio: 'ignore', windowsHide: true });
    
    // Create initial commit
    fs.writeFileSync(path.join(testDir, 'tracked.ts'), 'console.log("hello");');
    fs.writeFileSync(path.join(testDir, 'to_delete.txt'), 'delete me');
    execSync('git add .', { cwd: testDir, stdio: 'ignore', windowsHide: true });
    execSync('git commit -m "initial commit"', { cwd: testDir, stdio: 'ignore', windowsHide: true });
    
    // Modify tracked file
    fs.writeFileSync(path.join(testDir, 'tracked.ts'), 'console.log("hello world");\nconsole.log("extra line");');
    
    // Delete file
    fs.unlinkSync(path.join(testDir, 'to_delete.txt'));
    
    // Add untracked file
    fs.writeFileSync(path.join(testDir, 'untracked.md'), '# New File');
    
    // Add staged new file
    fs.writeFileSync(path.join(testDir, 'staged.js'), 'let a = 1;');
    execSync('git add staged.js', { cwd: testDir, stdio: 'ignore', windowsHide: true });
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('should parse uncommitted changes (staged, unstaged, untracked)', () => {
    const state = getUncommittedState({}, testDir);
    
    expect(state.commit).toBe('UNCOMMITTED');
    expect(state.author).toBe('Test Author');
    expect(state.email).toBe('test@example.com');
    expect(state.subject).toBe('Uncommitted Changes');
    expect(state.fileCount).toBe(4);
    
    const files = state.files || [];
    
    // Find modified tracked file
    const tracked = files.find(f => f.file === 'tracked.ts');
    expect(tracked).toBeDefined();
    expect(tracked?.status).toBe('M');
    expect(tracked?.language).toBe('TypeScript');
    expect(tracked?.insertions).toBeGreaterThan(0);
    
    // Find deleted file
    const deleted = files.find(f => f.file === 'to_delete.txt');
    expect(deleted).toBeDefined();
    expect(deleted?.status).toBe('D');
    
    // Find untracked file
    const untracked = files.find(f => f.file === 'untracked.md');
    expect(untracked).toBeDefined();
    expect(untracked?.status).toBe('U'); // '??' mapped to 'U'
    expect(untracked?.language).toBe('Markdown');
    expect(untracked?.insertions).toBe(0); // untracked files don't show up in git diff HEAD by default in numstat
    
    // Find staged new file
    const staged = files.find(f => f.file === 'staged.js');
    expect(staged).toBeDefined();
    expect(staged?.status).toBe('A');
    expect(staged?.language).toBe('JavaScript');
  });

  test('should include patch if requested', () => {
    const state = getUncommittedState({ 'include-patch': true }, testDir);
    expect(state.patch).toBeDefined();
    expect(state.patch).toContain('hello world');
    expect(state.patch).toContain('delete me');
  });
});
