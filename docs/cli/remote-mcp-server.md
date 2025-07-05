# Running a remote MCP server

This guide explains how to run an MCP (Model Context Protocol) server on another machine and connect to it from the Gemini CLI.

## 1. Start the MCP server on the remote machine

Launch your MCP server on the remote host and expose its network port. The example below runs the GitHub MCP server in a Docker container:

```bash
docker run -it --rm -e GITHUB_PERSONAL_ACCESS_TOKEN \
  -p 3000:3000 ghcr.io/github/github-mcp-server
```

Replace the command and port with those required by your server.

## 2. Configure Gemini CLI to connect

On the machine where you run Gemini CLI, add a server entry to `.gemini/settings.json` that points at the remote host. Use `httpUrl` for HTTP streaming servers or the `url` property if your server exposes an SSE endpoint:

```json
{
  "mcpServers": {
    "github-remote": {
      "httpUrl": "http://REMOTE_HOST:3000/mcp",
      "timeout": 30000
    }
  }
}
```

Adjust `REMOTE_HOST`, the path, and timeout for your environment.

## 3. Launch Gemini CLI

Run the CLI as usual:

```bash
gemini
```

Gemini CLI will connect to the remote MCP server when it starts and you can issue commands that use the remote tools, for example:

```bash
"create an issue in repo \"foo/bar\" titled 'Fix remote tests'"
```

---

**Tips**

- Ensure the remote port is reachable from your machine. If the server is behind a firewall, you can forward the port using SSH.
- Secure the connection with TLS, VPN, or other methods if the server is on an untrusted network.
