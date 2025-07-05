import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import path from 'node:path';
import { tmpdir } from 'node:os';
import fs from 'node:fs';

import { main } from '../gemini.js';
import { loadSettings } from '../config/settings.js';
import { loadExtensions } from '../config/extension.js';
import { loadCliConfig } from '../config/config.js';

vi.mock('../config/settings.js', async (importActual) => {
  const actual = await importActual<typeof import('../config/settings.js')>();
  return {
    ...actual,
    loadSettings: vi.fn(() =>
      new actual.LoadedSettings(
        { path: '', settings: {} },
        { path: '', settings: {} },
        [],
      ),
    ),
  };
});

vi.mock('../config/extension.js', () => ({
  loadExtensions: vi.fn(() => []),
}));

const observedCwds: string[] = [];
vi.mock('../config/config.js', () => ({
  loadCliConfig: vi.fn(async () => {
    observedCwds.push(process.cwd());
    return {
      getSandbox: () => false,
      getQuestion: () => '',
    };
  }),
}));

vi.mock('../utils/startupWarnings.js', () => ({
  getStartupWarnings: vi.fn(async () => []),
}));

vi.mock('ink', () => ({
  render: vi.fn(),
}));

vi.mock('../utils/sandbox.js', () => ({
  start_sandbox: vi.fn(),
}));

vi.mock('../utils/cleanup.js', () => ({
  cleanupCheckpoints: vi.fn(),
}));

describe('workspace-root option', () => {
  const originalCwd = process.cwd();

  beforeEach(() => {
    vi.resetAllMocks();
    observedCwds.length = 0;
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it('changes file resolution to the provided workspace root', async () => {
    const dir = fs.mkdtempSync(path.join(tmpdir(), 'gemini-ws-'));
    try {
      await main(dir);
    } catch {
      // ignore errors from incomplete mocks
    }

    expect(loadSettings).toHaveBeenCalledWith(dir);
    expect(loadExtensions).toHaveBeenCalledWith(dir);
    expect(observedCwds[0]).toBe(dir);

    fs.rmSync(dir, { recursive: true, force: true });
  });
});
