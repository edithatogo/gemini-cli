/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Mocked } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCompletion } from './useCompletion.js';
import * as fs from 'fs/promises';
import { FileDiscoveryService } from '@google/gemini-cli-core';

vi.mock('path', async () => {
  const actual = await vi.importActual<typeof import('path')>('path');
  return { ...actual.win32, posix: actual.posix, win32: actual.win32 };
});

vi.mock('fs/promises');
vi.mock('@google/gemini-cli-core', async () => {
  const actual = await vi.importActual('@google/gemini-cli-core');
  return {
    ...actual,
    FileDiscoveryService: vi.fn(),
    isNodeError: vi.fn((e) => e.code === 'ENOENT'),
    escapePath: vi.fn((p) => p),
    unescapePath: vi.fn((p) => p),
    getErrorMessage: vi.fn((e) => e.message),
  };
});

const originalPlatform = process.platform;

describe('useCompletion Windows path handling', () => {
  let mockFileDiscoveryService: Mocked<FileDiscoveryService>;
  const testCwd = 'C:\\project';
  const slashCommands = [
    { name: 'help', description: 'Show help', action: vi.fn() },
    { name: 'clear', description: 'Clear screen', action: vi.fn() },
  ];
  const mockConfig = {
    getFileFilteringRespectGitIgnore: vi.fn(() => true),
    getFileService: vi.fn(),
    getEnableRecursiveFileSearch: vi.fn(() => true),
  };

  beforeEach(() => {
    mockFileDiscoveryService = {
      shouldGitIgnoreFile: vi.fn(() => false),
      filterFiles: vi.fn((f) => f),
    } as unknown as Mocked<FileDiscoveryService>;
    mockConfig.getFileService.mockReturnValue(mockFileDiscoveryService);
    vi.mocked(FileDiscoveryService).mockImplementation(
      () => mockFileDiscoveryService,
    );
    Object.defineProperty(process, 'platform', { value: 'win32' });
    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(process, 'platform', { value: originalPlatform });
    vi.restoreAllMocks();
  });

  it('returns forward slashes for Windows suggestions', async () => {
    vi.mocked(fs.readdir).mockResolvedValue([
      { name: 'src', isDirectory: () => true },
      { name: 'README.md', isDirectory: () => false },
    ] as Array<{ name: string; isDirectory: () => boolean }>);

    const { result } = renderHook(() =>
      useCompletion('@', testCwd, true, slashCommands, mockConfig),
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 150));
    });

    expect(result.current.suggestions).toEqual(
      expect.arrayContaining([
        { label: 'src/', value: 'src/' },
        { label: 'README.md', value: 'README.md' },
      ]),
    );
    // ensure no backslashes
    expect(result.current.suggestions.some((s) => s.label.includes('\\'))).toBe(
      false,
    );
  });
});
