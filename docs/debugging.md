# Debugging Gemini CLI

This guide collects tips for troubleshooting and running the CLI in special scenarios.

## Running from a custom workspace

By default, Gemini CLI resolves configuration and context files relative to the current working directory. When invoking the CLI from another location (for example, from within an IDE or script), use the `--workspace-root <dir>` option to specify the project root:

```bash
gemini --workspace-root /path/to/project
```

All settings and context files will be loaded from the provided directory.
