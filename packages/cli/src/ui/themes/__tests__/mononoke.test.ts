/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { themeManager } from '../theme-manager.js';

// Ensure default theme is reset before each test
beforeEach(() => {
  themeManager.setActiveTheme(undefined);
});

describe('Mononoke theme registration', () => {
  it('should be listed among available themes', () => {
    const themeNames = themeManager
      .getAvailableThemes()
      .map((t) => t.name);
    expect(themeNames).toContain('Mononoke');
  });

  it('can be set as the active theme', () => {
    const result = themeManager.setActiveTheme('Mononoke');
    expect(result).toBe(true);
    expect(themeManager.getActiveTheme().name).toBe('Mononoke');
  });
});
