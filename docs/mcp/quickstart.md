---
title: Quickstart
description: Run the Whatspie MCP server and send your first WhatsApp message from Claude Code.
---

# MCP Quickstart

In this tutorial you run the Whatspie MCP server on your computer, connect Claude Code to it, and send yourself a WhatsApp message by asking Claude. It takes about 10 minutes.

## What you'll build

The [Model Context Protocol](https://modelcontextprotocol.io) (MCP) is a standard way for AI assistants to use outside tools. The Whatspie MCP server turns the Whatspie API into tools that Claude can call:

```
Claude Code  ──MCP──▶  whatspie-mcp (your computer)  ──REST──▶  api.whatspie.com
```

You type a request in plain language. Claude picks a tool, the server calls the Whatspie API with your API token, and Claude shows you the result.

The server is an HTTP service that you start once, with Docker or Node.js, and leave running. AI apps then connect to its URL. It is not an npm package you run with `npx`. Claude Desktop does use `npx`, but only to start a small bridge to this HTTP server; see [Connect Claude Desktop](./guides.md#connect-claude-desktop).

## Before you start

You need:

- **A Whatspie API token.** Find it in the dashboard under **Developers**, or at [app.whatspie.com/profile?tab=developer](https://app.whatspie.com/profile?tab=developer). See [Authentication](../authentication.md).
- **A connected device.** At least one WhatsApp number paired in the [Whatspie dashboard](https://app.whatspie.com), with status connected.
- **Docker.** Check with `docker --version`.
- **Claude Code.** Check with `claude --version`.

Keep your device's phone number and your own phone number at hand. You will send the test message to yourself.

## Step 1: Start the server

Download the server and start it:

```bash
git clone https://github.com/DevHunts-Com/whatspie-mcp.git
cd whatspie-mcp
docker compose up -d --build
```

Check that it is running:

```bash
curl http://localhost:4000/health
```

You should see:

```json
{"status":"ok"}
```

## Step 2: Connect Claude Code

Register the server with Claude Code. Replace `YOUR_API_TOKEN` with your token, and keep the word `Bearer` and the space after it:

```bash
claude mcp add --transport http --scope user whatspie http://localhost:4000/mcp \
  --header "Authorization: Bearer YOUR_API_TOKEN"
```

Check the connection:

```bash
claude mcp list
```

You should see a line like this:

```
whatspie: http://localhost:4000/mcp (HTTP) - ✔ Connected
```

Now start Claude Code in a new terminal with `claude`. Tools load when a conversation starts, so a conversation that was already open will not see them.

## Step 3: List your devices

In Claude Code, type:

```
List my WhatsApp devices with their phone numbers and status.
```

Claude asks permission to run the `list_devices` tool. Approve it.

Claude replies with the devices on your account. Find the device you paired and note its phone number. You use it as the sender in the next step.

## Step 4: Send yourself a message

Type the following, with your device number as the sender and your own phone number as the receiver. Write numbers in international format without `+`, for example `6281234567890`:

```
Send "Hello from Claude" from device 6281111111111 to 6282222222222.
```

Claude asks permission to run `send_text_message`. Check the device and receiver in the request, then approve it.

Open WhatsApp on your phone. The message "Hello from Claude" arrives from your device's number.

You have connected Claude to WhatsApp through Whatspie.

## Next steps

- [Guides](./guides.md): connect Claude Desktop or VS Code, pair a device with a QR code, fix connection problems.
- [Reference](./reference.md): every tool and its parameters, configuration, and error messages.
