---
title: Introduction
description: What the Whatspie API is, how to authenticate, and how to send your first WhatsApp message.
---

# Introduction

The Whatspie API lets your application send and manage WhatsApp messages through WhatsApp numbers you have connected to Whatspie. It is a REST API: you send JSON over HTTPS and get JSON back.

With it you can send text, images, files, and locations, work with groups, check whether numbers use WhatsApp, and manage your connected devices.

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

## Send your first message

You need two things:

1. **An API token.** See [Authentication](./authentication.md).
2. **A connected device**, which is a WhatsApp number linked to Whatspie. If you don't have one yet, follow [Connect your first device](./device-management.md#connect-your-first-device).

Then replace the token, the device number, and the receiver number below. Write numbers in international format without `+`, for example `6281234567890` (Indonesia: replace the first `0` with `62`).

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281111111111",
    "receiver": "6282222222222",
    "type": "chat",
    "params": {
      "text": "Hi!"
    }
  }'
```

A successful request returns the queued message:

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "id": 36259782,
    "device_id": 12,
    "from_number": "6281111111111",
    "to_number": "6282222222222",
    "type": "chat",
    "msg_type": "outgoing",
    "body": "Hi!",
    "status": "PENDING",
    "wa_id": null,
    "retry": 0,
    "failed_reason": null,
    "file_url": null,
    "file_name": null,
    "file_caption": null,
    "file_size": null,
    "file_mime": null,
    "params": { "text": "Hi!" },
    "is_group": false,
    "created_at": "2025-08-22T03:36:02Z",
    "updated_at": "2025-08-22T03:36:02Z"
  }
}
```

`PENDING` means the message is queued for sending. Use `data.id` with [Get message](./messaging/get-message.md) to check its delivery status later. See [Status values](./messaging/get-message.md#status-values).

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
| Messaging | [Send text](./messaging/send-text.md), [image](./messaging/send-image.md), [file](./messaging/send-file.md), [video](./messaging/send-video.md), [location](./messaging/send-location.md), [reaction](./messaging/send-reaction.md); [get a message](./messaging/get-message.md) |
| Groups | [List](./groups/list-groups.md), [get](./groups/get-group.md), [refresh](./groups/refresh-groups.md), [send messages](./groups/send-group-messages.md), [add members](./groups/add-members.md), [update](./groups/update-group.md) |
| Contacts | [Check whether numbers use WhatsApp](./contacts/check-contacts.md) |
| Devices | [Manage devices](./device-management.md) |
| Webhooks | [Receive events from Whatspie](./webhooks.md) |
| AI assistants | [Connect Claude to Whatspie with MCP](./mcp/quickstart.md) |

Deprecated: [interactive buttons and lists](./messaging/send-list.md) and [template messages](./messaging/send-template.md). These pages remain for existing integrations.

## Rate limits

WhatsApp limits how many messages a number can send. Sending too many messages too quickly can get the number blocked.

- **Group messages:** the safe rate depends on group size and how often you send.
- **QR code requests:** limited to prevent abuse.
