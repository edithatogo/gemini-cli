/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Logs a warning if the CLI is started from a system root directory.
 */
export function warnIfRootDir(cwd: string = process.cwd()): void {
  const isUnixRoot = cwd === '/';
  const isWindowsRoot = /^[a-zA-Z]:[\\/]?$/.test(cwd);
  if (isUnixRoot || isWindowsRoot) {
    console.warn(
      'Warning: Running Gemini CLI from the root directory. Consider running inside a project folder.',
    );
  }
}
