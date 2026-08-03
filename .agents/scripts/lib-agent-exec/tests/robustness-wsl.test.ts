import { test, expect } from 'bun:test';

import { buildCommand, convertToWslPath } from '../command-builder.js';
import { ExecPayload } from '../schema.js';

test('WSL2 Command Builder: Translates Windows paths to /mnt/c/', () => {
  const payload: ExecPayload = {
    type: 'command',
    target: 'wsl2',
    command: 'stat',
    args: ['-r', 'search', 'C:\\Users\\chris\\Desktop\\wiki-search-worker'],
    env: { 'CUSTOM_VAR': '123' }
  };
  
  const { cmd, args } = buildCommand(payload, 'C:\\Users\\chris\\Documents');
  
  expect(cmd).toBe('wsl.exe');
  
  // Ensure cwd is translated
  expect(args[1]).toBe('/mnt/c/Users/chris/Documents');
  
  // Ensure env args are present
  expect(args.includes('CUSTOM_VAR=123')).toBe(true);
  
  // Ensure args are translated
  expect(args.includes('/mnt/c/Users/chris/Desktop/adamic')).toBe(true);
});

test('WSL2 Script Payload: Properly maps temp eval files', () => {
  const payload: ExecPayload = {
    type: 'eval',
    target: 'wsl2',
    code: 'print("hello world")',
    interpreter: 'python3'
  };
  
  const { cmd, args, tempScriptPath } = buildCommand(payload, 'C:\\scratch');
  
  expect(cmd).toBe('wsl.exe');
  expect(tempScriptPath).toBeTruthy();
  
  // Ensure the tempScriptPath on Windows host was translated in the wsl execution arguments
  const expectedWslPath = tempScriptPath!.replace(/^([a-zA-Z]):[/\\]/, (_, drive) => `/mnt/${drive.toLowerCase()}/`).replace(/\\/g, '/');
  
  expect(args.includes(expectedWslPath)).toBe(true);
});

test('convertToWslPath handles quoted absolute paths and forward slashes', () => {
  expect(convertToWslPath('"C:\\Users\\chris\\Desktop\\test.json"')).toBe('"/mnt/c/Users/chris/Desktop/test.json"');
  expect(convertToWslPath('C:/Users/chris/Desktop/test.json')).toBe('/mnt/c/Users/chris/Desktop/test.json');
  expect(convertToWslPath('FILE=C:\\Users\\chris\\Desktop\\test.json')).toBe('FILE=/mnt/c/Users/chris/Desktop/test.json');
});

test('grep -E preserves -E when pattern does not end with $', () => {
  const payload: ExecPayload = {
    type: 'command',
    target: 'wsl2',
    command: 'grep',
    args: ['-E', '\\]\\(file://C:', 'C:\\Users\\chris\\Desktop\\wiki-search-worker\\file.txt']
  };

  const { args } = buildCommand(payload, 'C:\\Users\\chris\\Desktop\\wiki-search-worker');
  expect(args.some(a => a.includes('-E'))).toBe(true);
  expect(args.some(a => a.includes('-P'))).toBe(false);
});


