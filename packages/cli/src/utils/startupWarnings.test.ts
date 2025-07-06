/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { getStartupWarnings } from './startupWarnings.js';
import fs from 'fs/promises';
import os from 'os';
import { join as pathJoin } from 'node:path';

// Mock process.version
const originalProcessVersion = process.version;

// Helper function to create a temporary warnings file
async function createTemporaryWarningsFile(content: string): Promise<string> {
  const warningsFilePath = pathJoin(os.tmpdir(), 'gemini-cli-warnings.txt');
  await fs.writeFile(warningsFilePath, content);
  return warningsFilePath;
}

// Helper function to delete the temporary warnings file
async function deleteTemporaryWarningsFile(): Promise<void> {
  const warningsFilePath = pathJoin(os.tmpdir(), 'gemini-cli-warnings.txt');
  try {
    await fs.unlink(warningsFilePath);
  } catch (error) {
    // Ignore errors if the file doesn't exist
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return;
    }
    throw error;
  }
}

describe('getStartupWarnings', () => {
  beforeEach(async () => {
    // Reset process.version before each test
    Object.defineProperty(process, 'version', {
      value: originalProcessVersion,
      writable: true,
    });
    // Ensure no temporary file exists from previous runs
    await deleteTemporaryWarningsFile();
  });

  afterEach(async () => {
    // Clean up the temporary file after each test
    await deleteTemporaryWarningsFile();
    // Restore original process.version
    Object.defineProperty(process, 'version', {
      value: originalProcessVersion,
      writable: true,
    });
  });

  it('should return a warning for Node.js version less than 20', async () => {
    Object.defineProperty(process, 'version', {
      value: 'v18.0.0',
      writable: true,
    });
    const warnings = await getStartupWarnings();
    expect(warnings).toContain(
      'Warning: You are using Node.js v18.0.0. Please upgrade to Node.js 20 or higher for optimal performance and security.',
    );
  });

  it('should not return a Node.js version warning for Node.js version 20', async () => {
    Object.defineProperty(process, 'version', {
      value: 'v20.0.0',
      writable: true,
    });
    const warnings = await getStartupWarnings();
    expect(
      warnings.some((w) => w.startsWith('Warning: You are using Node.js')),
    ).toBe(false);
  });

  it('should not return a Node.js version warning for Node.js version greater than 20', async () => {
    Object.defineProperty(process, 'version', {
      value: 'v21.0.0',
      writable: true,
    });
    const warnings = await getStartupWarnings();
    expect(
      warnings.some((w) => w.startsWith('Warning: You are using Node.js')),
    ).toBe(false);
  });

  it('should return warnings from the temporary file', async () => {
    await createTemporaryWarningsFile('Temporary warning 1\nTemporary warning 2');
    // Keep Node version compliant to isolate this test
    Object.defineProperty(process, 'version', {
      value: 'v20.0.0',
      writable: true,
    });
    const warnings = await getStartupWarnings();
    expect(warnings).toContain('Temporary warning 1');
    expect(warnings).toContain('Temporary warning 2');
  });

  it('should return both Node version warning and temporary file warnings', async () => {
    Object.defineProperty(process, 'version', {
      value: 'v19.5.0',
      writable: true,
    });
    await createTemporaryWarningsFile('Temporary file warning');
    const warnings = await getStartupWarnings();
    expect(warnings).toContain(
      'Warning: You are using Node.js v19.5.0. Please upgrade to Node.js 20 or higher for optimal performance and security.',
    );
    expect(warnings).toContain('Temporary file warning');
  });

  it('should return an empty array when no warnings are present and Node version is compliant', async () => {
    Object.defineProperty(process, 'version', {
      value: 'v20.0.0',
      writable: true,
    });
    const warnings = await getStartupWarnings();
    expect(warnings).toEqual([]);
  });

  it('should handle errors when deleting the temporary warnings file', async () => {
    await createTemporaryWarningsFile('A warning');
    Object.defineProperty(process, 'version', {
      value: 'v20.0.0', // Compliant Node version
      writable: true,
    });

    // Mock fs.unlink to throw an error that is not ENOENT
    const originalUnlink = fs.unlink;
    (fs.unlink as jest.Mock) = jest.fn().mockImplementation(async () => {
      const error = new Error('Test unlink error');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).code = 'EACCES'; // Simulate a permission error
      throw error;
    });

    const warnings = await getStartupWarnings();
    expect(warnings).toContain('A warning');
    expect(warnings).toContain('Warning: Could not delete temporary warnings file.');

    // Restore original fs.unlink
    fs.unlink = originalUnlink;
  });
});
