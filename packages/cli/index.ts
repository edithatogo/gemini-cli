#!/usr/bin/env node

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './src/gemini.js';
import { main } from './src/gemini.js';

function getWorkspaceRootArg(): string | undefined {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--workspace-root' && i + 1 < args.length) {
      return args[i + 1];
    }
    if (arg.startsWith('--workspace-root=')) {
      return arg.substring('--workspace-root='.length);
    }
  }
  return undefined;
}

// --- Global Entry Point ---
const workspaceRoot = getWorkspaceRootArg();
main(workspaceRoot).catch((error) => {
  console.error('An unexpected critical error occurred:');
  if (error instanceof Error) {
    console.error(error.stack);
  } else {
    console.error(String(error));
  }
  process.exit(1);
});
