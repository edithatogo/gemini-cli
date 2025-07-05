import { describe, it, expect, beforeEach } from 'vitest';
import { validateAuthMethod } from './auth.js';
import { AuthType } from '@google/gemini-cli-core';

// Helper to clear env after each test
const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('validateAuthMethod', () => {
  it('accepts Vertex AI when GOOGLE_CLOUD_PROJECT is set', () => {
    process.env.GOOGLE_CLOUD_PROJECT = 'proj';
    process.env.GOOGLE_CLOUD_LOCATION = 'loc';
    const res = validateAuthMethod(AuthType.USE_VERTEX_AI);
    expect(res).toBeNull();
  });

  it('accepts Vertex AI when GOOGLE_CLOUD_PROJECT_ID is used as fallback', () => {
    delete process.env.GOOGLE_CLOUD_PROJECT;
    process.env.GOOGLE_CLOUD_PROJECT_ID = 'proj-id';
    process.env.GOOGLE_CLOUD_LOCATION = 'loc';
    const res = validateAuthMethod(AuthType.USE_VERTEX_AI);
    expect(res).toBeNull();
  });
});
