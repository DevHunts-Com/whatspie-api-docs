---
title: Send text message
description: Send a WhatsApp text message to a phone number with POST /messages.
---

# Send text message

Send a text message from one of your devices to a phone number. The text supports WhatsApp formatting and emoji.

## Endpoint

```
POST https://api.whatspie.com/messages
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Phone number of your sending device: the `phone` field from [List devices](../devices/list.md), not the numeric device `id`. |
| `receiver` | string | Yes | Recipient's phone number. Up to 35 characters. |
| `type` | string | Yes | `chat` for a text message. |
| `params` | object | Yes | Message content. |
| `params.text` | string | Yes | The text to send. Supports [WhatsApp formatting](#text-formatting). |

Write phone numbers in international format without `+`. See [Phone number format](#phone-number-format).

`params` accepts only these keys: `text`, `caption`, `fileName`, `mimetype`, `location`, `image`, `document`, `video`. Any other key is rejected.

### Example

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat",
    "params": {
      "text": "*Bold* _italic_ ~strikethrough~ ```monospace```\n\nNew paragraph with emoji 🎉"
    }
  }'
```

In these examples, `6281234567890` is your device (the `phone` from [List devices](../devices/list.md)) and `6289876543210` is the receiver. Replace both with your own numbers.

## Response

A successful request returns HTTP `200` with the queued message:

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "id": 36259782,
    "device_id": 12,
    "from_number": "6281234567890",
    "to_number": "6289876543210",
    "type": "chat",
    "msg_type": "outgoing",
    "body": "Hello World!",
    "status": "PENDING",
    "wa_id": null,
    "retry": 0,
    "failed_reason": null,
    "file_url": null,
    "file_name": null,
    "file_caption": null,
    "file_size": null,
    "file_mime": null,
    "params": { "text": "Hello World!" },
    "is_group": false,
    "created_at": "2025-08-22T03:36:02Z",
    "updated_at": "2025-08-22T03:36:02Z"
  }
}
```

:::warning[200 OK does not mean delivered]
The API queues the message and sends it in the background. If the device is disconnected or the number is not on WhatsApp, you still get `200`. The status changes to `ERROR` later. Check it with [Get message](./get-message.md#status-values).
:::

### Response fields

| Field | Type | Description |
|---|---|---|
| `id` | number | Message ID. Use it with [Get message](./get-message.md) to check the message later. |
| `device_id` | number | ID of the sending device. |
| `from_number` | string | Sender device number. |
| `to_number` | string | Recipient's phone number. |
| `type` | string | `chat`. |
| `msg_type` | string | `outgoing` for messages you send. |
| `body` | string | The text that was sent. |
| `status` | string | Delivery status. `PENDING` right after the request: the message is queued, not yet delivered. It changes as delivery progresses; see [Status values](./get-message.md#status-values). |
| `wa_id` | string or null | WhatsApp's own message ID. `null` while the message is `PENDING`; filled in after WhatsApp accepts it. |
| `retry` | number | Number of send retries. |
| `failed_reason` | string or null | Why sending failed, if it did. |
| `file_url`, `file_name`, `file_caption`, `file_size`, `file_mime` | null | Not used for text messages. |
| `params` | object | Stored message parameters: `{ "text": "..." }`. |
| `is_group` | boolean | `false` for messages to a phone number. |
| `created_at`, `updated_at` | string | Timestamps, ISO 8601. |

## Errors

Errors return the HTTP status in `status` and a description in `message`:

```json
{
  "status": 400,
  "message": "Invalid message params: unknown parameter 'body'. Allowed parameters: text, caption, fileName, mimetype, location, image, document"
}
```

Note: this error message leaves out `video`. All allowed keys are listed under [Request](#request).

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid message params: ...` | `params` contains a key that is not allowed, or a nested value has the wrong shape. |
| `400` | `Message text is required for chat type` | The request has neither `params` nor a legacy `message` field. |
| `400` | `Invalid request body: ...` | The body is not valid JSON, or `device`, `receiver`, or `type` is missing. |
| `400` | `Invalid message type. Must be one of: ...` | `type` is not a supported message type. |
| `403` | `Missing Authorization header` | No `Authorization` header. |
| `403` | `Missing token in Authorization header` | The header has no token after `Bearer `. |
| `403` | `Invalid Authentication Token` | The token is wrong or revoked. |
| `403` | `Device not found or access denied` | `device` is not a device on your account. |
| `403` | Quota or subscription message | Your package has no messages left. |
| `500` | Error description | Internal error, for example the message could not be saved. Try again later. |

Sending failures, such as a disconnected device or a number that is not on WhatsApp, do not cause an error response either: the API accepts the message first and sends it in the background. They show up later as status `ERROR` with a `failed_reason`. Check them with [Get message](./get-message.md); see [Status values](./get-message.md#status-values).

## Phone number format

Write `device` and `receiver` in international format: country code followed by the number, without `+`, spaces, or hyphens.

| Country | Format | Example |
|---|---|---|
| USA | `1XXXXXXXXXX` | `11234567890` |
| UK | `44XXXXXXXXXX` | `441234567890` |
| India | `91XXXXXXXXXX` | `911234567890` |
| Indonesia | `62XXXXXXXXXXX` | `6281234567890` |
| Brazil | `55XXXXXXXXXXX` | `5511987654321` |
| Germany | `49XXXXXXXXXX` | `491234567890` |

Invalid formats:

- `+6281234567890`: contains `+`
- `081234567890`: missing country code
- `6281-234-567-890`: contains hyphens
- `62 81234567890`: contains spaces

## Text formatting

WhatsApp formatting works in `params.text`:

| Style | Syntax | Example |
|---|---|---|
| Bold | `*text*` | `*Order confirmed*` |
| Italic | `_text_` | `_optional_` |
| Strikethrough | `~text~` | `~old price~` |
| Monospace | ` ```text``` ` | ` ```ABC-123``` ` |

Use `\n` in JSON for a line break. Emoji and other Unicode characters are sent as-is.

### Formatting examples

```bash
# Bold text
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat",
    "params": { "text": "This is *bold text* in WhatsApp" }
  }'

# Mixed formatting
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat",
    "params": { "text": "*Bold* _italic_ ~strike~ text combined!" }
  }'
```

## Legacy format

The older format, with the text in a top-level `message` field and no `params`, is still accepted for backward compatibility. New integrations should use `params`.

## Code examples

JavaScript helpers, validation, batch sending, retries, and use cases for text messages are in the [Messaging guide](./guide.md).

## Limitations and guidelines

- **Message length:** the API sets no limit. Keep messages readable on a phone.
- **Sending rate:** about 1–2 messages per second is a common safe rate to avoid temporary blocks.
- **Recipients:** must have an active WhatsApp account. Use [Check contacts](../contacts/check-contacts.md) to verify numbers first.
- **Sending device:** must be connected to WhatsApp. A disconnected device cannot deliver messages. See [Device management](../device-management.md).
- **WhatsApp policies:** follow WhatsApp's business messaging policies and terms.
- **International numbers:** always include the country code.

## Related

- [Send image](./send-image.md): images with captions
- [Send file](./send-file.md): documents and other files
- [Send location](./send-location.md): location coordinates
- [Get message](./get-message.md): check a message's delivery status
- [Device management](../device-management.md): check that your device is connected
- [Authentication](../authentication.md): API tokens
