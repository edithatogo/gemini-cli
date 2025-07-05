import React from 'react';
import { render } from 'ink-testing-library';
import { Header } from '../Header.js';

describe('<Header /> responsive banner', () => {
  it('falls back to short logo when width is moderate', () => {
    const { lastFrame } = render(<Header terminalWidth={70} />);
    expect(lastFrame()).toContain('█████');
  });

  it('falls back to plain text when width is narrow', () => {
    const { lastFrame } = render(<Header terminalWidth={30} />);
    expect(lastFrame()).toContain('Gemini');
    expect(lastFrame()).not.toContain('█');
  });
});
