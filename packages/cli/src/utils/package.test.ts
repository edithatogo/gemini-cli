/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it, vi } from 'vitest';
import { getPackageJson } from './package';
import * as readPackageUp from 'read-package-up';

vi.mock('read-package-up', async () => {
  return {
    readPackageUp: vi.fn(),
  };
});

describe('getPackageJson', () => {
  it('should throw an error if readPackageUp returns no result', async () => {
    vi.spyOn(readPackageUp, 'readPackageUp').mockResolvedValue(undefined);
    await expect(getPackageJson()).rejects.toThrow('Could not find package.json');
  });
});
