/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import semver from 'semver';
import { getPackageJson } from './package.js';

export async function getNodeVersionWarning(
  currentVersion: string = process.version,
): Promise<string | null> {
  const pkgJson = await getPackageJson();
  const required = pkgJson?.engines?.node;
  if (!required) {
    return null;
  }
  if (!semver.satisfies(currentVersion, required)) {
    return `Gemini CLI requires Node.js ${required}. You are using ${currentVersion}.`;
  }
  return null;
}
