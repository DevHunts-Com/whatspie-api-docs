---
title: Quickstart
description: Connect Claude Code or Claude Desktop to the Whatspie MCP server and send your first WhatsApp message by asking Claude.
---

# MCP Quickstart

In this tutorial you connect Claude Code or Claude Desktop to the Whatspie MCP server and send a WhatsApp message by asking Claude. It takes about 5 minutes.

## What you'll build

Whatspie runs the MCP server for you at `https://mcp.whatspie.com/mcp`. You connect Claude to it with your Whatspie API token. Nothing to install or keep running on your side, except the small bridge that Claude Desktop needs.

You type a request in plain language, such as "send Hi to my colleague". Claude picks the right action (a *tool*), the MCP server calls the Whatspie API with your API token, and Claude shows you the result.

```
Claude  ──MCP──▶  Whatspie MCP server  ──▶  Whatspie API
```

MCP, the [Model Context Protocol](https://modelcontextprotocol.io), is the standard that lets Claude use outside tools like this one. Claude Code connects to the server directly. Claude Desktop connects through a small bridge program that it starts with `npx`.

## Before you start

You need:

- **A Whatspie API token.** Find it in the dashboard under **Profile → Developer**, or at [app.whatspie.com/profile?tab=developer](https://app.whatspie.com/profile?tab=developer). See [Authentication](../authentication.md). Treat it like a password.
- **A connected device**: a WhatsApp number paired with Whatspie. Its `paired_status` is `PAIRED`, which means connected to WhatsApp. If you don't have one, follow [Connect your first device](../device-management.md#connect-your-first-device).
- **One AI app:**
  - **Claude Code.** Check with `claude --version`.
  - **Claude Desktop** ([download](https://claude.ai/download)), plus **Node.js** ([download](https://nodejs.org/)) for the bridge. Check with `npx -v`.

Keep two numbers at hand: your device's phone number (the sender) and a number you can check on a phone (the receiver).

## Step 1: Connect your AI app

Your token is not stored on the MCP server. Your AI app sends it with every request, in the `Authorization` header you set up here.

Follow the option for the app you use. In both, replace `YOUR_API_TOKEN` with your token, and keep the word `Bearer` before the token.

### Option A: Claude Code

Run this in your terminal (not inside Claude), as one line:

```bash
claude mcp add --transport http --scope user whatspie https://mcp.whatspie.com/mcp --header "Authorization: Bearer YOUR_API_TOKEN"
```

`--scope user` makes the server available in every folder, not only the current one.

Check the connection:

```bash
claude mcp list
```

You should see a line like this:

```
whatspie: https://mcp.whatspie.com/mcp (HTTP) - ✔ Connected
```

Now start Claude Code in a new terminal with `claude`. Tools load when a conversation starts, so a conversation that was already open will not see them.

### Option B: Claude Desktop

1. Open the Claude Desktop config file. Create it if it does not exist. If you create it in Notepad, set **Save as type** to **All files**, so the file is not saved as `claude_desktop_config.json.txt`.

   | System | Config file |
   |---|---|
   | Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
   | Windows, Microsoft Store version | `%LOCALAPPDATA%\Packages\Claude_<id>\LocalCache\Roaming\Claude\claude_desktop_config.json`. If `%APPDATA%\Claude` does not exist, you have this version: open `%LOCALAPPDATA%\Packages` in File Explorer and look for the folder whose name starts with `Claude_`. |
   | macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |

   Quickest way on Windows: run this in PowerShell. Notepad opens the file, and offers to create it if it does not exist. For the Microsoft Store version, put the Store path from the table between the quotes instead.

   ```powershell
   notepad "$env:APPDATA\Claude\claude_desktop_config.json"
   ```

2. Put this in the file. If it already has an `mcpServers` section, add only the `whatspie` entry inside it, and put a comma between it and the entry before it. The file must stay valid JSON: no missing or extra commas.

   ```json
   {
     "mcpServers": {
       "whatspie": {
         "command": "npx",
         "args": [
           "-y",
           "mcp-remote",
           "https://mcp.whatspie.com/mcp",
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

   Keep `Authorization:${AUTH_HEADER}` exactly as written, with no space after the colon. The bridge fills in `${AUTH_HEADER}` from the `env` section.

   To check that the file is valid JSON, open it in an editor such as VS Code: it underlines mistakes like a missing comma.

3. Quit Claude Desktop completely (on Windows: right-click its icon in the system tray, then **Quit**) and open it again.

4. Open a new chat. The Whatspie tools are listed in the tools menu of the chat input.

If Claude Desktop shows `spawn npx ENOENT`, it cannot find `npx`. Install Node.js and restart Claude Desktop. If the error stays on Windows, replace the whole `whatspie` entry with this one. It runs `npx` through `cmd`:

```json
"whatspie": {
  "command": "cmd",
  "args": [
    "/c",
    "npx",
    "-y",
    "mcp-remote",
    "https://mcp.whatspie.com/mcp",
    "--header",
    "Authorization:${AUTH_HEADER}"
  ],
  "env": {
    "AUTH_HEADER": "Bearer YOUR_API_TOKEN"
  }
}
```

**Didn't work?** See [Troubleshooting](./guides.md#troubleshooting): it lists each error message and its fix.

## Step 2: List your devices

In a new conversation (Claude Code or Claude Desktop), type:

```
List my WhatsApp devices with their phone numbers and status.
```

Claude asks permission to run the `list_devices` tool. Approve it.

Claude replies with the devices on your account. Find the device whose `paired_status` is `PAIRED` (connected) and note its phone number. You use it as the sender in the next step.

If the list is empty, or no device is connected, follow [Connect your first device](../device-management.md#connect-your-first-device) first.

## Step 3: Send a test message

Type the following, with your device number as the sender and the number you can check as the receiver. Write numbers in international format without `+`, for example `6281234567890`:

```
Send "Hello from Claude" from device 6281111111111 to 6282222222222.
```

Claude asks permission to run `send_text_message`. Check the device and receiver in the request, then approve it.

Claude replies with the message's ID and status `PENDING`. This is normal: the message is queued, not failed. Within seconds it changes to `SENT` or straight to `RECEIVED`, which means the message reached the phone.

Open WhatsApp on the receiving phone. The message "Hello from Claude" arrives from your device's number.

**Nothing arrived?**

- Check that the device is connected: ask Claude "Show the status of my WhatsApp devices" and check that your device's `paired_status` is `PAIRED`, or check it in the dashboard.
- Ask Claude: "What is the status of the message you just sent?" Claude runs `get_message` with the message ID from its reply. A status of `ERROR` comes with a reason; see [Status values](../messaging/get-message.md#status-values).

You have connected Claude to WhatsApp through Whatspie.

## Next steps

- [Guides](./guides.md): connect VS Code, pair a device with a QR code, fix connection problems.
- [Reference](./reference.md): every tool and its parameters, and error messages.
