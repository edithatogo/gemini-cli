import { describe, it, expect, vi } from 'vitest';
import { GitService } from '../../services/gitService.js';

const mockEnv = vi.fn();
const mockCommit = vi.fn(async () => ({ commit: 'abc123' }));
const mockAdd = vi.fn();
const mockCheckIsRepo = vi.fn();
const mockInit = vi.fn();
const mockRaw = vi.fn();
vi.mock('simple-git', () => ({
  simpleGit: vi.fn(() => ({
    checkIsRepo: mockCheckIsRepo,
    init: mockInit,
    raw: mockRaw,
    add: mockAdd,
    commit: mockCommit,
    env: mockEnv.mockImplementation(() => ({
      checkIsRepo: mockCheckIsRepo,
      init: mockInit,
      raw: mockRaw,
      add: mockAdd,
      commit: mockCommit,
    })),
  })),
  CheckRepoActions: { IS_REPO_ROOT: 'is-repo-root' },
}));

vi.mock('../../utils/gitUtils.js', () => ({
  isGitRepository: () => true,
}));

vi.mock('node:child_process', () => ({
  exec: vi.fn((_, cb) => { cb(null, 'git version'); return {}; }),
}));

vi.mock('fs/promises', () => ({
  mkdir: vi.fn(),
  readFile: vi.fn().mockResolvedValue(''),
  writeFile: vi.fn(),
}));

vi.mock('os', () => ({
  homedir: () => '/tmp',
}));

vi.mock('crypto', () => ({
  createHash: () => ({ update: () => ({ digest: () => 'hash' }) }),
}));

describe('GitService createFileSnapshot', () => {
  it('strips wrapping quotes from commit message', async () => {
    const service = new GitService('/project');
    await service.createFileSnapshot("'test commit'");
    expect(mockCommit).toHaveBeenCalledWith('test commit');
  });
});
