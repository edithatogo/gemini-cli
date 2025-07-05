/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('DEFAULT_GEMINI_FLASH_MODEL', () => {
  const originalEnv = process.env.GEMINI_FLASH_MODEL;

  afterEach(() => {
    vi.resetModules();
    if (originalEnv === undefined) {
      delete process.env.GEMINI_FLASH_MODEL;
    } else {
      process.env.GEMINI_FLASH_MODEL = originalEnv;
    }
  });

  it('uses GEMINI_FLASH_MODEL env var when set', async () => {
    process.env.GEMINI_FLASH_MODEL = 'custom-flash';
    vi.resetModules();
    const { DEFAULT_GEMINI_FLASH_MODEL } = await import('./models.js');
    expect(DEFAULT_GEMINI_FLASH_MODEL).toBe('custom-flash');
  });

  it('falls back to default when env var is not set', async () => {
    delete process.env.GEMINI_FLASH_MODEL;
    vi.resetModules();
    const { DEFAULT_GEMINI_FLASH_MODEL } = await import('./models.js');
    expect(DEFAULT_GEMINI_FLASH_MODEL).toBe('gemini-2.5-flash');
  });
});

