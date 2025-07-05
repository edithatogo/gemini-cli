# Sandboxing in the Gemini CLI

This document provides a guide to sandboxing in the Gemini CLI, including prerequisites, quickstart, and configuration.

## Prerequisites

Before using sandboxing, you need to install and set up the Gemini CLI:

```bash
# install gemini-cli with npm
npm install -g @google/gemini-cli

# Verify installation
gemini --version
```

## Overview of sandboxing

Sandboxing isolates potentially dangerous operations (such as shell commands or file modifications) from your host system, providing a security barrier between AI operations and your environment.

The benefits of sandboxing include:

- **Security**: Prevent accidental system damage or data loss.
- **Isolation**: Limit file system access to project directory.
- **Consistency**: Ensure reproducible environments across different systems.
- **Safety**: Reduce risk when working with untrusted code or experimental commands.

## Sandboxing methods

Your ideal method of sandboxing may differ depending on your platform and your preferred container solution.

### 1. macOS Seatbelt (macOS only)

Lightweight, built-in sandboxing using `sandbox-exec`.

**Default profile**: `permissive-open` - restricts writes outside project directory but allows most other operations.

### 2. Container-based (Docker/Podman)

Cross-platform sandboxing with complete process isolation.

**Note**: Requires building the sandbox image locally or using a published image from your organization's registry.

## Quickstart

To get started with sandboxing, you can use command-line flags, environment variables, or your `settings.json` file.

### Using Command-Line Flags

The easiest way to enable sandboxing for a single command is with the `-s` or `--sandbox` flag.

```bash
# Enable sandboxing for a single command
gemini -s -p "analyze the code structure"
```

### Using Environment Variables

For a more persistent setting, you can use the `GEMINI_SANDBOX` environment variable.

```bash
# Enable sandboxing for the current session
export GEMINI_SANDBOX=true
gemini -p "run the test suite"
```

### Using `settings.json`

For a permanent setting, you can add `"sandbox": true` to your `settings.json` file.

```json
{
  "sandbox": "docker"
}
```

## Configuration

### Enable sandboxing (in order of precedence)

1. **Command flag**: `-s` or `--sandbox`
2. **Environment variable**: `GEMINI_SANDBOX=true|docker|podman|sandbox-exec`
3. **Settings file**: `"sandbox": true` in `settings.json`

### macOS Seatbelt profiles

Built-in profiles (set via `SEATBELT_PROFILE` env var):

- `permissive-open` (default): Write restrictions, network allowed
- `permissive-closed`: Write restrictions, no network
- `permissive-proxied`: Write restrictions, network via proxy
- `restrictive-open`: Strict restrictions, network allowed
- `restrictive-closed`: Maximum restrictions

To use a proxied profile, you must also set the `GEMINI_SANDBOX_PROXY_COMMAND` environment variable to a command that starts a proxy server. See the "Proxied Networking" section for more details.

### Custom macOS Seatbelt Profiles

You can create your own custom Seatbelt profiles by creating a `.sb` file in the `.gemini` directory in your project's root. For example, to create a profile named `my-profile`, you would create a file named `.gemini/sandbox-macos-my-profile.sb`. You can then use this profile by setting `SEATBELT_PROFILE=my-profile`.

### Container-based Sandboxing

#### Custom Dockerfiles

To customize the container-based sandbox, you can create a `.gemini/sandbox.Dockerfile` file in your project's root directory. This file will be used to build the sandbox image. For example, to install a new tool in the sandbox, you could add the following to your Dockerfile:

```dockerfile
FROM gcr.io/gemini-cli/sandbox:latest
RUN apt-get update && apt-get install -y <my-tool>
```

After creating or modifying the Dockerfile, you must rebuild the sandbox image by running `gemini` with the `BUILD_SANDBOX=1` environment variable.

#### Proxied Networking

All sandboxing methods support proxied networking. To use a proxy, you must set the `GEMINI_SANDBOX_PROXY_COMMAND` environment variable to a command that starts a proxy server that listens on `:::8877`. The proxy will be started and stopped automatically with the sandbox.

See `scripts/example-proxy.js` for an example of a minimal proxy.

#### Mounting Additional Directories

By default, the container-based sandbox mounts the project directory and the system temp directory. You can mount additional directories by setting the `SANDBOX_MOUNTS` environment variable. This variable should be a space-separated list of mount points in the format `<host-path>:<container-path>`.

```bash
export SANDBOX_MOUNTS="/path/to/my/data:/data"
```

## Linux UID/GID handling

The sandbox automatically handles user permissions on Linux. Override these permissions with:

```bash
export SANDBOX_SET_UID_GID=true   # Force host UID/GID
export SANDBOX_SET_UID_GID=false  # Disable UID/GID mapping
```

## Troubleshooting

### Common issues

**"Operation not permitted"**

- Operation requires access outside sandbox.
- Try more permissive profile or add mount points.

**Missing commands**

- Add to custom Dockerfile.
- Install via `sandbox.bashrc`.

**Network issues**

- Check sandbox profile allows network.
- Verify proxy configuration.

### Debug mode

```bash
DEBUG=1 gemini -s -p "debug command"
```

### Inspect sandbox

```bash
# Check environment
gemini -s -p "run shell command: env | grep SANDBOX"

# List mounts
gemini -s -p "run shell command: mount | grep workspace"
```

## Security notes

- Sandboxing reduces but doesn't eliminate all risks.
- Use the most restrictive profile that allows your work.
- Container overhead is minimal after first build.
- GUI applications may not work in sandboxes.

## Related documentation

- [Configuration](./cli/configuration.md): Full configuration options.
- [Commands](./cli/commands.md): Available commands.
- [Troubleshooting](./troubleshooting.md): General troubleshooting.
