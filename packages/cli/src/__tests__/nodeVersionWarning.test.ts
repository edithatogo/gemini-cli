/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getNodeVersionWarning } from '../utils/nodeVersionWarning.js';
import * as packageUtil from '../utils/package.js';

vi.mock('../utils/package.js');

describe('getNodeVersionWarning', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns null when version satisfies requirement', async () => {
    vi.mocked(packageUtil.getPackageJson).mockResolvedValue({
      engines: { node: '>=18' },
    } as packageUtil.PackageJson);

    const warning = await getNodeVersionWarning('18.12.0');
    expect(warning).toBeNull();
  });

  it('returns warning when version does not satisfy requirement', async () => {
    vi.mocked(packageUtil.getPackageJson).mockResolvedValue({
      engines: { node: '>=20' },
    } as packageUtil.PackageJson);

    const warning = await getNodeVersionWarning('18.12.0');
    expect(warning).toContain('>=20');
  });

  it('returns null when engines.node missing', async () => {
    vi.mocked(packageUtil.getPackageJson).mockResolvedValue(
      {} as packageUtil.PackageJson,
    );

    const warning = await getNodeVersionWarning('18.0.0');
    expect(warning).toBeNull();
  });
});
