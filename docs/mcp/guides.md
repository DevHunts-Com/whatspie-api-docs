---
title: Guides
description: Connect Claude Desktop and other MCP clients to the Whatspie MCP server, pair devices, and fix common problems.
---

# MCP Guides

Each guide solves one task. `MCP_SERVER_URL` stands for the Whatspie MCP server URL; see the [Quickstart](./quickstart.md).

## Connect Claude Desktop

Claude Desktop starts MCP servers as local programs from its config file. To reach the Whatspie MCP server, it uses `npx` to run [`mcp-remote`](https://www.npmjs.com/package/mcp-remote), a small bridge that forwards everything to the server:

```
Claude Desktop ──▶ mcp-remote (started by npx) ──HTTPS──▶ Whatspie MCP server
```

`npx` downloads and starts only the bridge. You need Node.js installed; check with `npx -v`.

1. Open the Claude Desktop config file. Create it if it does not exist.

   | System | Config file |
   |---|---|
   | macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
   | Windows, installer version | `%APPDATA%\Claude\claude_desktop_config.json` |
   | Windows, Microsoft Store version | `%LOCALAPPDATA%\Packages\Claude_<id>\LocalCache\Roaming\Claude\claude_desktop_config.json` |

   If `%APPDATA%\Claude` does not exist on Windows, you have the Microsoft Store version. Look in `%LOCALAPPDATA%\Packages` for the folder that starts with `Claude_`.

2. Add the `whatspie` server. If the file already has an `mcpServers` object, add the entry inside it.

   ```json
   {
     "mcpServers": {
       "whatspie": {
         "command": "npx",
         "args": [
           "-y",
           "mcp-remote",
           "MCP_SERVER_URL",
           "--header",
           "Authorization:${AUTH_HEADER}"
         ],
         "env": {
           "AUTH_HEADER": "Bearer YOUR_API_TOKEN"
         }
       }
     }
   }
   ```

   Put the token in `env`, as shown. On Windows, an argument with a space in it can be split in two, which breaks the header. Keep `Authorization:${AUTH_HEADER}` exactly as written, with no space after the colon: the bridge fills in `${AUTH_HEADER}` from `env`.

3. Quit Claude Desktop completely: from the system tray on Windows, or with Cmd+Q on macOS. Closing the window is not enough. Then open it again.

4. Open a new chat and open the tools menu. The Whatspie tools are listed there.

## Connect VS Code and other MCP clients

Any client that supports MCP over HTTP can connect directly. Add a server of type HTTP with:

| Setting | Value |
|---|---|
| URL | `MCP_SERVER_URL` |
| Header name | `Authorization` |
| Header value | `Bearer YOUR_API_TOKEN` |

The header value must start with `Bearer` and a space. Do not use the client's "Authenticate" or OAuth button: the server uses an API token, not OAuth.

Start a new conversation after adding the server.

## Pair a device with a QR code

The `get_device_qr` tool returns the pairing QR code as an image.

1. Use a client that displays images, such as Claude Desktop. Terminal clients such as Claude Code cannot show the image; pair from the [Whatspie dashboard](https://app.whatspie.com) instead.
2. Ask: "Show the pairing QR code for device ID 12."
3. On your phone, open WhatsApp, go to **Linked devices**, tap **Link a device**, and scan the code.
4. Scan within about 20 seconds. WhatsApp replaces the code after that. If it has expired, ask for it again.

Do not ask Claude to redraw or re-encode the QR code. A redrawn code looks correct but does not scan.

If the device is already connected, there is no code to scan and the request currently fails with an error. Check the device status first with `get_device`.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `401` with `Missing Whatspie API token` | The `Authorization` header is missing, or its value lacks `Bearer `. | Set the value to `Bearer YOUR_API_TOKEN`. |
| `Dynamic Client Registration rejected (HTTP 404)` or `Cannot POST /register` | Same as above. After a `401`, the client tries OAuth, which the server does not support. | Fix the header. Do not click "Authenticate". |
| `Whatspie API error (403): Invalid Authentication Token` | The MCP server works, but the Whatspie API rejected the token. | Copy the token again from **Profile → Developer** in the dashboard. It may have been revoked or regenerated. |
| `Unexpected error: fetch failed` | The MCP server could not reach the Whatspie API. | Try again. If it keeps happening, contact Whatspie support. |
| `406 Not Acceptable` | A manual request without the right `Accept` header. | Send `Accept: application/json, text/event-stream`. |
| Tools do not appear | The conversation started before the server was added. | Start a new conversation. In Claude Desktop, quit fully and reopen. |
| Claude Desktop: `not valid MCP server configurations… skipped` | The entry uses `url`, which Claude Desktop does not accept. | Use the `mcp-remote` config in [Connect Claude Desktop](#connect-claude-desktop). |
| Claude Desktop on Windows: `spawn npx ENOENT` | Claude Desktop cannot find `npx`. | Set `"command": "cmd"` and start `args` with `"/c", "npx"`. |
| Claude Code: server missing in one folder | It was added without `--scope user`, so it belongs to another folder. | Add it again with `--scope user`. |
| QR code does not scan | It expired, or Claude redrew it. | See [Pair a device with a QR code](#pair-a-device-with-a-qr-code). |
| Message sent but never arrives | The sending device is not connected to WhatsApp. | Check the device status in the dashboard and pair it again. |
