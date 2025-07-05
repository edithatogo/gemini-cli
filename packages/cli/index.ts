#!/usr/bin/env node

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { main } = await import(require.resolve('./src/gemini.js'));

// --- Global Entry Point ---
main().catch((error: unknown) => {
  console.error('An unexpected critical error occurred:');
  if (error instanceof Error) {
    console.error(error.stack);
  } else {
    console.error(String(error));
  }
  process.exit(1);
});
