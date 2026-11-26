---
title: Introduction
description: What the Whatspie API is, its base URL, authentication, response format, and what you can do with it.
---

# Introduction

The Whatspie API lets your application send and manage WhatsApp messages through WhatsApp numbers you have connected to Whatspie. It is a REST API: you send JSON over HTTPS and get JSON back.

With it you can send text, images, files, and locations, work with groups, check whether numbers use WhatsApp, and manage your connected devices.

:::info[New here?]
Follow the [Quickstart](./quickstart.md): get a token, connect a WhatsApp number, and send your first message in about 5 minutes.
:::

:::info[Prefer not to write code?]
Connect Claude to Whatspie and send WhatsApp messages by asking in plain language. See the [MCP Quickstart](./mcp/quickstart.md).
:::

## Base URL

```
https://api.whatspie.com
```

## Authentication

Send your API token in the `Authorization` header of every request:

```
Authorization: Bearer YOUR_API_TOKEN
```

See [Authentication](./authentication.md) for where to find your token.

## Response format

Every response is a JSON object with the same top-level fields:

| Field | Type | Description |
|---|---|---|
| `status` | number | HTTP status code, repeated in the body. |
| `message` | string | `OK` on success, or a description of the error. |
| `data` | object, array, or null | The result. `null` or left out on errors. |

An error looks like this:

```json
{
  "status": 403,
  "message": "Invalid Authentication Token"
}
```

## What you can do

| Area | Pages |
|---|---|
| Messaging | [Send text](./messaging/send-text.md), [image](./messaging/send-image.md), [file](./messaging/send-file.md), [video](./messaging/send-video.md), [location](./messaging/send-location.md), [reaction](./messaging/send-reaction.md); [get a message](./messaging/get-message.md); [code examples](./messaging/guide.md) |
| Groups | [List](./groups/list-groups.md), [get](./groups/get-group.md), [refresh](./groups/refresh-groups.md), [send messages](./groups/send-group-messages.md), [add members](./groups/add-members.md), [update](./groups/update-group.md) |
| Contacts | [Check whether numbers use WhatsApp](./contacts/check-contacts.md) |
| Devices | [Manage devices](./device-management.md) |
| Webhooks | [Receive events from Whatspie](./webhooks.md): Whatspie sends incoming messages and status changes to a URL on your server |
| AI assistants | [Connect Claude to Whatspie with MCP](./mcp/quickstart.md) |

Deprecated: [interactive buttons and lists](./messaging/send-list.md) and [template messages](./messaging/send-template.md). These pages remain for existing integrations.

## Rate limits

WhatsApp limits how many messages a number can send. Sending too many messages too quickly can get the number blocked.

- **Group messages:** the safe rate depends on group size and how often you send.
- **QR code requests:** limited to prevent abuse.
