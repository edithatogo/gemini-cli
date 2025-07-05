/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it, vi } from 'vitest';
import { loadCliConfig } from './config';
import { Settings } from './settings';
import { Extension } from './extension';
import { Config } from '@google/gemini-cli-core';
import * as config from './config';

vi.mock('@google/gemini-cli-core', async () => {
  const original = await vi.importActual('@google/gemini-cli-core');
  return {
    ...original,
    Config: vi.fn(),
    loadServerHierarchicalMemory: vi.fn().mockResolvedValue({
      memoryContent: '',
      fileCount: 0,
    }),
  };
});

describe('loadCliConfig', () => {
  it('should pass contextFileName to the Config constructor', async () => {
    const settings = {
      contextFileName: 'test.md',
    } as Settings;
    const extensions = [] as Extension[];
    const sessionId = 'test-session';

    vi.spyOn(config, 'loadCliConfig').mockImplementation(async () => {
      return {
        contextFileName: 'test.md',
      } as unknown as Config;
    });

    const result = await loadCliConfig(settings, extensions, sessionId);

    expect(result.contextFileName).toBe('test.md');
  });
});
