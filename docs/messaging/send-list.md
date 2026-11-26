---
title: Send list message (deprecated)
description: Deprecated. Interactive list messages cannot be sent through the current Whatspie API.
---

# Send list message (deprecated)

:::warning[Deprecated: not available in the current API]
Interactive list messages cannot be sent through the current Whatspie API. A list request is rejected with `400`. This page documents the former request format for existing integrations that need to migrate.

To offer choices today, send a [text message](./send-text.md) with numbered options and ask the recipient to reply with a number.
:::

## Why list messages fail

`POST /messages` still accepts `type: "list"`, but the list content cannot pass validation:

- With `params`: `params` accepts only `text`, `caption`, `fileName`, `mimetype`, `location`, `image`, `document`, and `video`. The list keys `title`, `footer`, `buttonText`, and `sections` are rejected with `400 Invalid message params: unknown parameter ...`.
- Without `params`: the request is rejected with `400 Params are required for message type: list`.
- With `params` that contain only allowed keys, for example `{"text": "..."}`, the message is accepted but delivered as a plain text message, not as a list.

The same rules apply to [group messages](../groups/send-group-messages.md).

WhatsApp has also limited interactive list and button messages for unofficial clients, so they may not display even where they could be sent.

## Former request format

This is the format the earlier API accepted. The current API rejects it.

```
POST https://api.whatspie.com/messages
```

| Parameter | Type | Description |
|---|---|---|
| `device` | string | Your sending device number. |
| `receiver` | string | Recipient's phone number. |
| `type` | string | `list`. |
| `params.title` | string | List title. |
| `params.text` | string | List description text. |
| `params.footer` | string | Footer text. Optional. |
| `params.buttonText` | string | Text on the button that opens the list. |
| `params.sections` | array | Sections, each with a `title` and `rows`. |
| `params.sections[].rows[].title` | string | Row title. |
| `params.sections[].rows[].rowId` | string | Unique ID of the row. |
| `params.sections[].rows[].description` | string | Row description. Optional. |

### Example (former format)

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "list",
    "params": {
      "title": "Tony'\''s Pizza Menu",
      "text": "Choose from our menu.",
      "footer": "Free delivery on orders over $25",
      "buttonText": "View Menu",
      "sections": [
        {
          "title": "Pizzas",
          "rows": [
            { "title": "Margherita Pizza", "rowId": "pizza_margherita", "description": "Tomato, mozzarella, basil - $12" },
            { "title": "Pepperoni Pizza", "rowId": "pizza_pepperoni", "description": "Pepperoni, mozzarella - $15" }
          ]
        },
        {
          "title": "Salads",
          "rows": [
            { "title": "Caesar Salad", "rowId": "salad_caesar", "description": "Lettuce, parmesan, croutons - $8" }
          ]
        }
      ]
    }
  }'
```

### Response from the current API

```json
{
  "status": 400,
  "message": "Invalid message params: unknown parameter 'title'. Allowed parameters: text, caption, fileName, mimetype, location, image, document"
}
```

The rejected key named in the message can be any of the list keys.

## Former limits

These were WhatsApp's limits for list messages. They are kept for reference only.

- Up to 10 sections per list and 10 rows per section, 100 items in total.
- List title: up to 24 characters. Description text: up to 1024 characters.
- Button text: up to 20 characters.
- Row title: up to 24 characters. Row description: up to 72 characters.

## Migrating to text messages

Send the options as numbered text:

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat",
    "params": {
      "text": "*Tony'\''s Pizza Menu*\n\n1. Margherita Pizza - $12\n2. Pepperoni Pizza - $15\n3. Caesar Salad - $8\n\nReply with a number to order."
    }
  }'
```

## Related

- [Send text](./send-text.md): plain text messages
- [Send template (deprecated)](./send-template.md): button messages, also unavailable
- [Send image](./send-image.md): images with captions
- [Get message](./get-message.md#status-values): check a message's delivery status
