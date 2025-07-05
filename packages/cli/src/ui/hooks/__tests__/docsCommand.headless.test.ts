import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import open from 'open';
import { useSlashCommandProcessor } from '../slashCommandProcessor.js';
import { MessageType } from '../../types.js';
import { useSessionStats } from '../../contexts/SessionContext.js';
import { LoadedSettings } from '../../../config/settings.js';

vi.mock('open', () => ({ default: vi.fn() }));
vi.mock('../../contexts/SessionContext.js', () => ({
  useSessionStats: vi.fn(),
}));

describe('docs command in headless environment', () => {
  const docsUrl = 'https://goo.gle/gemini-cli-docs';
  let addItem: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    addItem = vi.fn();
    vi.mocked(open).mockRejectedValue(new Error('no browser'));
    vi.mocked(useSessionStats).mockReturnValue({
      stats: { sessionStartTime: new Date(), cumulative: {} },
    });
    delete process.env.SANDBOX;
  });

  const renderProcessor = () => {
    const settings = {
      merged: { contextFileName: 'GEMINI.md' },
    } as LoadedSettings;
    return renderHook(() =>
      useSlashCommandProcessor(
        null,
        settings,
        [],
        addItem,
        vi.fn(),
        vi.fn(),
        vi.fn(),
        vi.fn(),
        vi.fn(),
        vi.fn(),
        vi.fn(),
        vi.fn().mockResolvedValue(undefined),
        vi.fn(),
        false,
        vi.fn(),
        vi.fn(),
      ),
    );
  };

  it('prints docs URL when open fails', async () => {
    const { result } = renderProcessor();
    await act(async () => {
      await result.current.handleSlashCommand('/docs');
    });
    expect(open).toHaveBeenCalledWith(docsUrl);
    expect(addItem).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: MessageType.INFO,
        text: `Opening documentation in your browser: ${docsUrl}`,
      }),
      expect.any(Number),
    );
    expect(addItem).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: MessageType.INFO,
        text: `Please open the following URL in your browser to view the documentation:\n${docsUrl}`,
      }),
      expect.any(Number),
    );
  });
});
