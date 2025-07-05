/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { main } from './gemini.js';
import { warnIfRootDir } from './rootWarning.js';

export async function start() {
  warnIfRootDir();
  await main();
}
