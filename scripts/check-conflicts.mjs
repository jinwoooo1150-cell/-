#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const skipDirs = new Set(['.git', 'node_modules', '.expo', 'dist', 'build']);
const conflictPattern = /^(<<<<<<<|=======|>>>>>>>)\b/m;

const conflicts = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const relPath = relative(root, fullPath);

    if (!relPath || relPath.startsWith('..')) continue;

    const st = statSync(fullPath);
    if (st.isDirectory()) {
      if (skipDirs.has(entry)) continue;
      walk(fullPath);
      continue;
    }

    if (st.size > 2 * 1024 * 1024) continue;

    let content = '';
    try {
      content = readFileSync(fullPath, 'utf8');
    } catch {
      continue;
    }

    if (!conflictPattern.test(content)) continue;

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      if (/^(<<<<<<<|=======|>>>>>>>)\b/.test(lines[i])) {
        conflicts.push(`${relPath}:${i + 1}: ${lines[i]}`);
      }
    }
  }
}

walk(root);

if (conflicts.length > 0) {
  console.error('Merge conflict markers found:');
  for (const line of conflicts) console.error(`- ${line}`);
  process.exit(1);
}

console.log('No merge conflict markers found.');
