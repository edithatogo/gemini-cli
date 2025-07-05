/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ColorsTheme, Theme } from './theme.js';

const mononokeColors: ColorsTheme = {
  type: 'dark',
  Background: '#1b1b1b',
  Foreground: '#c8d3f5',
  LightBlue: '#7dcfff',
  AccentBlue: '#82aaff',
  AccentPurple: '#c792ea',
  AccentCyan: '#89ddff',
  AccentGreen: '#c3e88d',
  AccentYellow: '#ffcb6b',
  AccentRed: '#f07178',
  Comment: '#545c7e',
  Gray: '#717cb4',
  GradientColors: ['#82aaff', '#c792ea'],
};

export const Mononoke: Theme = new Theme(
  'Mononoke',
  'dark',
  {
    hljs: {
      display: 'block',
      overflowX: 'auto',
      padding: '0.5em',
      background: mononokeColors.Background,
      color: mononokeColors.Foreground,
    },
    'hljs-keyword': {
      color: mononokeColors.AccentBlue,
      fontWeight: 'bold',
    },
    'hljs-selector-tag': {
      color: mononokeColors.AccentBlue,
      fontWeight: 'bold',
    },
    'hljs-literal': {
      color: mononokeColors.AccentBlue,
      fontWeight: 'bold',
    },
    'hljs-section': {
      color: mononokeColors.AccentBlue,
      fontWeight: 'bold',
    },
    'hljs-link': {
      color: mononokeColors.AccentBlue,
    },
    'hljs-function .hljs-keyword': {
      color: mononokeColors.AccentPurple,
    },
    'hljs-subst': {
      color: mononokeColors.Foreground,
    },
    'hljs-string': {
      color: mononokeColors.AccentYellow,
    },
    'hljs-title': {
      color: mononokeColors.AccentYellow,
      fontWeight: 'bold',
    },
    'hljs-name': {
      color: mononokeColors.AccentYellow,
      fontWeight: 'bold',
    },
    'hljs-type': {
      color: mononokeColors.AccentYellow,
      fontWeight: 'bold',
    },
    'hljs-attribute': {
      color: mononokeColors.AccentYellow,
    },
    'hljs-symbol': {
      color: mononokeColors.AccentYellow,
    },
    'hljs-bullet': {
      color: mononokeColors.AccentYellow,
    },
    'hljs-addition': {
      color: mononokeColors.AccentGreen,
    },
    'hljs-variable': {
      color: mononokeColors.AccentYellow,
    },
    'hljs-template-tag': {
      color: mononokeColors.AccentYellow,
    },
    'hljs-template-variable': {
      color: mononokeColors.AccentYellow,
    },
    'hljs-comment': {
      color: mononokeColors.Comment,
    },
    'hljs-quote': {
      color: mononokeColors.Comment,
    },
    'hljs-deletion': {
      color: mononokeColors.AccentRed,
    },
    'hljs-meta': {
      color: mononokeColors.Comment,
    },
    'hljs-doctag': {
      fontWeight: 'bold',
    },
    'hljs-strong': {
      fontWeight: 'bold',
    },
    'hljs-emphasis': {
      fontStyle: 'italic',
    },
  },
  mononokeColors,
);
