---
title: Webhooks
description: Receive incoming WhatsApp messages and delivery events at your own URL, and reply automatically.
---

# Webhooks

Webhooks send events from your WhatsApp device to your application. When your device receives a message, Whatspie sends it to your webhook URL as an HTTP `POST` with a JSON body. Your endpoint can reply to the message by returning JSON.

## Base URL

```
https://api.whatspie.com
```

## Webhook configuration

Set the webhook URL in your device settings:

1. **Open device configuration:** go to **Devices → Configuration** in the [Whatspie dashboard](https://app.whatspie.com).
2. **Add the webhook URL:** enter your endpoint URL.
3. **Save the configuration:** your endpoint must accept `POST` requests with a JSON body.

When you save, the device connection reloads its configuration, so the new settings apply right away.

The device's current `webhook_url` is shown by [Get device](./devices/get.md).

### Request format

Every webhook is an HTTP `POST` with these headers:

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |
| `User-Agent` | `WhatsPie-Webhook/1.0` |

### Webhook URL requirements

- Use HTTPS.
- Respond within 10 seconds. Whatspie stops waiting after 10 seconds.
- Respond with an HTTP `2xx` status.
- Failed deliveries are not retried. If your endpoint is down or slow, the event is lost.

### Webhook version (v1 / v2)

In **Device Configuration → Webhook**, choose the webhook version:

- **v1** (default): only incoming messages are sent, in the format shown in [Incoming message formats](#incoming-message-formats).
- **v2**: every event uses the envelope `{ "type": "<event_type>", "data": { ... } }`, and you choose which events to receive. See [Webhook v2 events](#webhook-v2-events).

## Incoming message types

Incoming messages are sent for personal chats and groups. Messages you send yourself, status updates, and channel (newsletter) posts are not sent.

| Message | `type` in the payload | Packages |
|---|---|---|
| Text | `text` | All |
| Reaction | `reaction` | All |
| Contact card | `contactMessage` or `contactsArrayMessage` | All |
| Image | `imageMessage` | All except `BETA` |
| Document | `documentMessage` | All except `BETA` |
| Audio and voice notes | `audioMessage` | All except `BETA` |

Other message types, such as video, stickers, and locations, are not sent to the webhook. On the `BETA` package, images, documents, and audio are not sent either.

## Incoming message formats

All incoming messages share these fields:

| Field | Type | Description |
|---|---|---|
| `type` | string | Message type; see the table above. |
| `from` | string | Sender's phone number. For a group message, the chat the message came from. |
| `participant` | string or null | In a group, the member who sent the message. `null` in personal chats. |
| `timestamp` | integer | Unix timestamp of the message. |
| `message_id` | string | WhatsApp message ID. Use it as `message_id` in [Send reaction](./messaging/send-reaction.md). |
| `from_user.name` | string | Sender's WhatsApp display name. |
| `from_user.jid` | string | WhatsApp ID of the chat. May be in WhatsApp's newer `@lid` format instead of a phone number. |
| `key` | object | WhatsApp's raw message key. When `key.remoteJid` is in the `@lid` format, the sender's number is in `key.remoteJidAlt` (`<number>@s.whatsapp.net`). |
| `is_forwared` | boolean | Always `false`. Note the spelling: the field is named `is_forwared`. |
| `is_broadcast` | boolean | Always `false`. |
| `is_group` | boolean | `true` for a group message. |
| `created_at` | string | When Whatspie processed the message, ISO 8601. |

### Text message

```json
{
  "type": "text",
  "message": "Hello, I need help with my order",
  "from": "62856123456",
  "participant": null,
  "timestamp": 1581651709,
  "message_id": "3219EDE2131",
  "from_user": {
    "name": "John Doe",
    "jid": "123456789012345@lid"
  },
  "key": {
    "remoteJid": "123456789012345@lid",
    "remoteJidAlt": "62856123456@s.whatsapp.net",
    "fromMe": false,
    "id": "3219EDE2131",
    "participant": "",
    "addressingMode": "lid"
  },
  "is_forwared": false,
  "is_broadcast": false,
  "is_group": false,
  "created_at": "2026-02-03T10:00:00.000Z"
}
```

| Field | Type | Description |
|---|---|---|
| `message` | string | The text of the message. |

### Document message

Not sent on the `BETA` package. The examples below show only the fields specific to each type; the common fields above are always included.

```json
{
  "type": "documentMessage",
  "file": {
    "url": "https://storage.example.com/users/12/messages/2026/02/03/2313213F3213.pdf?X-Amz-Expires=86400&...",
    "caption": "Please review this document",
    "fileName": "contract_agreement.pdf"
  },
  "from": "62856123456",
  "participant": null,
  "timestamp": 1664933170,
  "message_id": "2313213F3213",
  "from_user": {
    "name": "Jane Smith",
    "jid": "62856123456@s.whatsapp.net"
  },
  "is_forwared": false,
  "is_broadcast": false,
  "is_group": false
}
```

| Field | Type | Description |
|---|---|---|
| `file.url` | string | Download link for the file. It expires after 24 hours. |
| `file.caption` | string or null | Caption text. |
| `file.fileName` | string or null | Original file name. |

### Image message

Not sent on the `BETA` package.

```json
{
  "type": "imageMessage",
  "file": {
    "url": "https://storage.example.com/users/12/messages/2026/02/03/3EB0237E918896635AD3.jpeg?X-Amz-Expires=86400&...",
    "caption": "Check out this product!",
    "fileName": null
  },
  "from": "628561234456",
  "participant": null,
  "timestamp": 1664932915,
  "message_id": "3EB0237E918896635AD3",
  "from_user": {
    "name": "Mike Johnson",
    "jid": "628561234456@s.whatsapp.net"
  },
  "is_forwared": false,
  "is_broadcast": false,
  "is_group": false
}
```

### Contact message

```json
{
  "type": "contactMessage",
  "contacts": [
    {
      "displayName": "Tech Support",
      "vcard": "BEGIN:VCARD\nVERSION:3.0\nN:;Tech Support;;;\nFN:Tech Support\nTEL;type=CELL;waid=6285846255569:+62 858-4625-5569\nEND:VCARD"
    }
  ],
  "from": "628561234456",
  "participant": null,
  "timestamp": 1664933238,
  "message_id": "3EB0E9CAAA9BBC8C1081",
  "from_user": {
    "name": "Sarah Wilson",
    "jid": "628561234456@s.whatsapp.net"
  },
  "is_forwared": false,
  "is_broadcast": false,
  "is_group": false
}
```

When several contacts are shared at once, `type` is `contactsArrayMessage` and `contacts` holds all of them.

### Audio message

Not sent on the `BETA` package.

```json
{
  "type": "audioMessage",
  "file": {
    "url": "https://storage.example.com/users/12/messages/2026/02/03/3EB0E9CAAA9BBC8C1081.oga?X-Amz-Expires=86400&...",
    "caption": null,
    "fileName": null,
    "seconds": 15
  },
  "from": "628561234456",
  "participant": null,
  "timestamp": 1664932741,
  "message_id": "3EB0E9CAAA9BBC8C1081",
  "from_user": {
    "name": "David Brown",
    "jid": "628561234456@s.whatsapp.net"
  },
  "is_forwared": false,
  "is_broadcast": false,
  "is_group": false
}
```

| Field | Type | Description |
|---|---|---|
| `file.seconds` | integer | Length of the audio in seconds. |

### Reaction message

Sent when someone reacts to a message:

```json
{
  "type": "reaction",
  "message": "👍",
  "params": {
    "key": { "remoteJid": "628561234456@s.whatsapp.net", "fromMe": true, "id": "3EB0C767D26A1D8B12A3" },
    "text": "👍"
  },
  "from": "628561234456",
  "message_id": "3EB0F1A2B3C4D5E6F708"
}
```

| Field | Type | Description |
|---|---|---|
| `message` | string | The emoji. Empty when a reaction is removed. |
| `params.key.id` | string | ID of the message that was reacted to. |

## Webhook v2 events

With **Webhook version** set to **v2**, every request body has:

- **`type`**: the event type.
- **`data`**: the event payload.

| `type` | Sent when | Default |
|---|---|---|
| `message_incoming` | Your device receives a message. | On, unless you turn it off |
| `message_sent` | A message you sent reaches WhatsApp's servers. | Off, unless you turn it on |
| `message_read` | The recipient reads a message you sent. | Off, unless you turn it on |
| `message_failed` | A message you sent fails. | Off, unless you turn it on |
| `device_connected` | The device connects to WhatsApp. | Off, unless you turn it on |
| `device_disconnected` | The device session ends, for example logged out or replaced. Not sent for short reconnections. | Off, unless you turn it on |

Turn events on or off in the device webhook settings.

In the message events below, `message_id` is WhatsApp's message ID: the same value as `wa_id` in [Get message](./messaging/get-message.md#response-fields), not the numeric Whatspie `id`.

### v2: Incoming message (`message_incoming`)

The same content as a v1 incoming message, wrapped in `data`:

```json
{
  "type": "message_incoming",
  "data": {
    "type": "text",
    "message": "Hello, I need help with my order",
    "from": "62856123456",
    "participant": null,
    "timestamp": 1581651709,
    "message_id": "3219EDE2131",
    "from_user": {
      "name": "John Doe",
      "jid": "62856123456@s.whatsapp.net"
    },
    "is_forwared": false,
    "is_broadcast": false,
    "is_group": false
  }
}
```

### v2: Message sent (`message_sent`)

```json
{
  "type": "message_sent",
  "data": {
    "message_id": "3EB0C767D26A1D8B12A3",
    "wa_message_id": "3EB0C767D26A1D8B12A3",
    "status": "SENT",
    "sent_at": "2026-02-03T10:00:00.000Z"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `message_id` | string | WhatsApp message ID. |
| `wa_message_id` | string | Same value as `message_id`. |
| `status` | string | `SENT`. |
| `sent_at` | string | When the event was sent, ISO 8601. |

### v2: Message read (`message_read`)

```json
{
  "type": "message_read",
  "data": {
    "message_id": "3EB0C767D26A1D8B12A3",
    "wa_message_id": "3EB0C767D26A1D8B12A3",
    "read_at": "2026-02-03T10:00:00.000Z"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `message_id` | string | WhatsApp message ID. |
| `wa_message_id` | string | Same value as `message_id`. |
| `read_at` | string | When the read receipt arrived, ISO 8601. |

### v2: Message failed (`message_failed`)

```json
{
  "type": "message_failed",
  "data": {
    "message_id": "3EB0C767D26A1D8B12A3",
    "status": "ERROR",
    "reason": "Invalid WhatsApp Number"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `message_id` | string | WhatsApp message ID. |
| `status` | string | `ERROR`. |
| `reason` | string | Why the message failed. |

### v2: Device connected (`device_connected`)

```json
{
  "type": "device_connected",
  "data": {
    "device_id": "2076",
    "status": "PAIRED",
    "reason": "Connected"
  }
}
```

### v2: Device disconnected (`device_disconnected`)

```json
{
  "type": "device_disconnected",
  "data": {
    "device_id": "2076",
    "status": "UNPAIRED",
    "reason": "Conflict"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `device_id` | string | Whatspie device ID, the same as `id` in [Device management](./device-management.md). |
| `status` | string | `PAIRED` for connected, `UNPAIRED` for disconnected. |
| `reason` | string | Why the connection changed, for example `Conflict` or `Logged out`. |

## Replying to incoming messages

Your endpoint can reply to an incoming message by returning JSON in the response body. Replies work only for incoming messages, not for the other v2 events. If you do not want to reply, return any `2xx` response; an empty or non-JSON body sends nothing.

Replies go to the chat the message came from, including groups. Each reply counts toward your message quota and is skipped when the quota is used up.

### Single text reply

```json
{
  "type": "chat",
  "body": "Thank you for your message! We'll get back to you shortly."
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | Yes | `chat` to send a message, `reaction` to react. |
| `body` | string | Yes, without `params` | Reply text. |
| `params` | object | No | Message content for media replies. When set, `params` is sent instead of `body`. |

### Image reply

When `params` is set, only `params` is sent; `body` is not sent as a separate message. Put any text in `caption`:

```json
{
  "type": "chat",
  "body": "Here's the information you requested:",
  "params": {
    "image": {
      "url": "https://images.unsplash.com/photo-1653764982079-c7c5e4fd682a"
    },
    "caption": "Product catalog 2024"
  }
}
```

### Document reply

```json
{
  "type": "chat",
  "body": "Please find the requested document attached:",
  "params": {
    "document": {
      "url": "https://example.com/files/sample.pdf"
    },
    "fileName": "price_list.pdf",
    "mimetype": "application/pdf"
  }
}
```

### Reaction reply

React to the incoming message with an emoji:

```json
{
  "type": "reaction",
  "body": "👍"
}
```

### Multiple messages

Return an array to send several replies in order:

```json
[
  {
    "type": "chat",
    "body": "Thank you for your inquiry!"
  },
  {
    "type": "chat",
    "body": "Our team will contact you within 24 hours."
  }
]
```

## Deprecated message types

These message types are deprecated and should not be used in new integrations:

- **Button messages:** use regular text messages instead.
- **Template messages:** use regular text with images instead.
- **List messages:** use regular text with structured formatting instead.

## Implementation best practices

### Security

1. **Verify the origin:** Whatspie does not sign webhook requests. Use a long, hard-to-guess URL, for example with a secret token in the path, and reject requests to other paths.
2. **Use HTTPS:** always use TLS for your endpoint.
3. **Validate input:** treat every field as untrusted data.

### Performance

1. **Quick response:** respond within 10 seconds.
2. **Async processing:** put slow work in a queue and respond right away.
3. **Status codes:** return `2xx` once you have accepted the event.

### Message handling

1. **Duplicate detection:** use `message_id` to avoid processing the same message twice.
2. **Message types:** handle every `type` you may receive, and ignore the rest.
3. **Fallback responses:** decide what to do with messages you cannot handle.

## Example implementation

A basic webhook handler in Node.js with Express:

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  // v2 wraps every event; v1 sends the incoming message directly
  const event = req.body.type && req.body.data ? req.body : { type: 'message_incoming', data: req.body };

  if (event.type !== 'message_incoming') {
    console.log('Event:', event.type, event.data);
    return res.sendStatus(200); // no reply for non-message events
  }

  const message = event.data;

  if (message.type === 'documentMessage') {
    return res.json({
      type: 'chat',
      body: "Thank you for the document. We'll review it shortly.",
    });
  }

  if (message.type === 'text') {
    return res.json({
      type: 'chat',
      body: processTextMessage(message.message),
    });
  }

  res.json({
    type: 'chat',
    body: 'Message received successfully!',
  });
});

function processTextMessage(text) {
  if (text.toLowerCase().includes('help')) {
    return 'How can I assist you today?';
  }
  return 'Thanks for your message!';
}

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

## Common issues

### Webhook not receiving messages

- Check that the webhook URL is set in the device configuration.
- Check that your endpoint is reachable from the internet over HTTPS.
- Check that the device is connected (`paired_status` is `PAIRED`).
- Check the message type: video, stickers, and locations are not sent, and files are not sent on the `BETA` package.

### Replies not being sent

- Return a JSON body with `type` set to `chat` or `reaction`.
- Respond within 10 seconds.
- Check that your message quota is not used up.
- Check that the device is connected and active.

### File downloads failing

- File URLs expire after 24 hours. Download files as soon as you receive them.
- Handle failed downloads and retry them.
- Consider a queue for reliable file processing.
