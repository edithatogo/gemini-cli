/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import { Colors } from '../colors.js';
import { shortAsciiLogo, longAsciiLogo } from './AsciiArt.js';
import { getAsciiArtWidth } from '../utils/textUtils.js';

interface HeaderProps {
  customAsciiArt?: string; // For user-defined ASCII art
  terminalWidth: number; // For responsive logo
}

export const Header: React.FC<HeaderProps> = ({
  customAsciiArt,
  terminalWidth,
}) => {
  let displayTitle: string;
  const widthOfLongLogo = getAsciiArtWidth(longAsciiLogo);
  const widthOfShortLogo = getAsciiArtWidth(shortAsciiLogo);

  if (customAsciiArt) {
    const customWidth = getAsciiArtWidth(customAsciiArt);
    displayTitle = terminalWidth >= customWidth ? customAsciiArt : 'Gemini';
  } else if (terminalWidth >= widthOfLongLogo) {
    displayTitle = longAsciiLogo;
  } else if (terminalWidth >= widthOfShortLogo) {
    displayTitle = shortAsciiLogo;
  } else {
    displayTitle = 'Gemini';
  }

  const artWidth = getAsciiArtWidth(displayTitle);

  return (
    <Box
      marginBottom={1}
      alignItems="flex-start"
      width={artWidth}
      flexShrink={0}
    >
      {Colors.GradientColors ? (
        <Gradient colors={Colors.GradientColors}>
          <Text>{displayTitle}</Text>
        </Gradient>
      ) : (
        <Text>{displayTitle}</Text>
      )}
    </Box>
  );
};
