/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi } from 'vitest';
import { warnIfRootDir } from '../rootWarning.js';

describe('warnIfRootDir', () => {
  it('warns when cwd is unix root', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    warnIfRootDir('/');
    expect(warnSpy).toHaveBeenCalledWith(
      'Warning: Running Gemini CLI from the root directory. Consider running inside a project folder.',
    );
  });

  it('warns when cwd is windows root', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    warnIfRootDir('C:/');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('does not warn for project directory', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    warnIfRootDir('/home/user/project');
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
