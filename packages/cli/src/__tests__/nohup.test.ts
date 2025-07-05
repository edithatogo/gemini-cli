import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Integration test for issue #3258.
// Path to the bundled CLI used in integration tests
const CLI_PATH = join(__dirname, '../../../bundle/gemini.js');

describe('CLI launched with closed stdin', () => {
  it('exits without EBADF when -p is provided', () => {
    const result = spawnSync('node', [CLI_PATH, '-p', 'hello', '--telemetry=false'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_UPDATE_NOTIFIER: '1', GEMINI_CLI_NO_RELAUNCH: '1' },
    });

    const stderr = result.stderr.toString();
    expect(stderr).not.toMatch(/EBADF/);
    // Missing API key will exit with code 1
    expect(result.status).toBe(1);
  });
});
