/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import { strict as assert } from 'assert';
import { TestRig } from './test-helper.js';
import { join } from 'path';
import { execSync } from 'child_process';

// Verify the CLI runs when executed from a directory different than the bundle location

test('cli runs from another cwd', async (t) => {
  const rig = new TestRig();
  rig.setup(t.name);
  rig.createFile('sample.txt', 'hello');
  rig.mkdir('sub');
  rig.sync();

  const cwd = join(rig.testDir, 'sub');
  const output = execSync(
    `node ${rig.bundlePath} --yolo --prompt "list files"`,
    { cwd, encoding: 'utf-8' },
  );

  assert.ok(output.includes('sample.txt'));
});
