---
title: Send template message (deprecated)
description: Deprecated. Template and button messages cannot be sent through the current Whatspie API.
---

# Send template message (deprecated)

:::warning[Deprecated: not available in the current API]
Template messages with buttons cannot be sent through the current Whatspie API. A template request is rejected with `400`. This page documents the former request format for existing integrations that need to migrate.

To offer actions today, send a [text message](./send-text.md) with the links, phone number, or numbered options written in the text.
:::

## Why template messages fail

`POST /messages` still accepts `type: "template"`, but the template content cannot pass validation:

- With `params`: `params` accepts only `text`, `caption`, `fileName`, `mimetype`, `location`, `image`, `document`, and `video`. The template keys `footer`, `templateButtons`, and `buttons` are rejected with `400 Invalid message params: unknown parameter ...`.
- Without `params`: the request is rejected with `400 Params are required for message type: template`.
- With `params` that contain only allowed keys, for example `{"text": "..."}`, the message is accepted but delivered as a plain text message without buttons.

The same rules apply to [group messages](../groups/send-group-messages.md).

WhatsApp has also limited button messages for unofficial clients, so they may not display even where they could be sent.

## Former request format

This is the format the earlier API accepted. The current API rejects it.

```
POST https://api.whatspie.com/messages
```

| Parameter | Type | Description |
|---|---|---|
| `device` | string | Your sending device number. |
| `receiver` | string | Recipient's phone number. |
| `type` | string | `template`. |
| `params.text` | string | Main message text. |
| `params.footer` | string | Footer text. Optional. |
| `params.templateButtons` | array | Action buttons: URL, call, or quick reply. Optional. |
| `params.buttons` | array | Simple reply buttons. Optional. |

### Former button types

| Button | Key in `templateButtons[]` | Fields | Action |
|---|---|---|---|
| URL | `urlButton` | `displayText`, `url` | Opens a link. |
| Call | `callButton` | `displayText`, `phoneNumber` | Starts a phone call. |
| Quick reply | `quickReplyButton` | `displayText` | Sends a reply. |

Each `templateButtons[]` entry also had an `index` (1, 2, 3). Simple reply buttons in `buttons[]` had `buttonId`, `buttonText.displayText`, and `type: 1`.

### Example (former format)

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "template",
    "params": {
      "text": "Welcome to Whatspie! Thanks for choosing our service.",
      "footer": "Powered by Whatspie API",
      "templateButtons": [
        { "index": 1, "urlButton": { "displayText": "Visit Whatspie", "url": "https://whatspie.com" } },
        { "index": 2, "callButton": { "displayText": "Call Support", "phoneNumber": "+6285603051722" } },
        { "index": 3, "quickReplyButton": { "displayText": "Quick Help" } }
      ]
    }
  }'
```

### Response from the current API

```json
{
  "status": 400,
  "message": "Invalid message params: unknown parameter 'footer'. Allowed parameters: text, caption, fileName, mimetype, location, image, document"
}
```

The rejected key named in the message can be any of the template keys.

## Former limits

These were WhatsApp's limits for button messages. They are kept for reference only.

- Up to 3 template buttons or 10 reply buttons per message.
- Main text: up to 1024 characters. Footer: up to 60 characters.
- Button text: up to about 20 characters.
- URLs had to be valid; call-button numbers in international format.

## Migrating to text messages

Put the actions in the text. WhatsApp turns links and phone numbers into tappable links:

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat",
    "params": {
      "text": "Welcome to Whatspie! Thanks for choosing our service.\n\nVisit: https://whatspie.com\nSupport: +6285603051722\n\nReply *HELP* for quick help."
    }
  }'
```

## Related

- [Send text](./send-text.md): plain text messages
- [Send list (deprecated)](./send-list.md): list messages, also unavailable
- [Send image](./send-image.md): images with captions
- [Get message](./get-message.md#status-values): check a message's delivery status
