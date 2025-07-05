# Building Gemini CLI on Windows

This guide walks you through building the Gemini CLI from source on Windows. For a general overview of the project and features, see the [README](../README.md).

## Prerequisites

1. [Git for Windows](https://git-scm.com/download/win)
2. [Node.js 18 or later](https://nodejs.org/en/download/)
3. Optional: [pnpm](https://pnpm.io) if you prefer it over npm

Verify that `git` and `node` are available in your command prompt by running `git --version` and `node --version`.

## Steps

1. Clone the repository:
   ```cmd
   git clone https://github.com/google-gemini/gemini-cli.git
   cd gemini-cli
   ```
2. Install dependencies using either `npm` or `pnpm`:
   ```cmd
   npm ci
   ```
   or
   ```cmd
   pnpm install
   ```
3. Build the CLI:
   ```cmd
   npm run build
   ```
   To include the sandbox container, run:
   ```cmd
   npm run build:all
   ```
4. Start the CLI from the source directory:
   ```cmd
   npm start
   ```

After building, refer back to the [README](../README.md) for usage examples and troubleshooting tips.
