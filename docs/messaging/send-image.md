---
title: Send image message
description: Send an image from a public URL, with an optional caption, with POST /messages.
---

# Send image message

Send an image from a public URL to a phone number, with an optional caption. The caption supports WhatsApp formatting.

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
| `type` | string | Yes | `image`. |
| `params` | object | Yes | Message content. |
| `params.image.url` | string | Yes | Direct, public URL of the image file. |
| `params.caption` | string | No | Caption shown under the image. Supports [WhatsApp formatting](./send-text.md#text-formatting). |

Write phone numbers in international format without `+`. See [Phone number format](./send-text.md#phone-number-format).

`params` accepts only these keys: `text`, `caption`, `fileName`, `mimetype`, `location`, `image`, `document`, `video`. Any other key, such as `viewOnce`, is rejected with `400`.

## Examples

### Basic image message

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "image",
    "params": {
      "image": {
        "url": "https://example.com/images/photo.jpg"
      },
      "caption": "Check out this amazing photo! 📸✨"
    }
  }'
```

In these examples, `6281234567890` is your device (the `phone` from [List devices](../devices/list.md)) and `6289876543210` is the receiver. Replace both with your own numbers.

### Image with a formatted caption

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "image",
    "params": {
      "image": {
        "url": "https://example.com/products/headphones.jpg"
      },
      "caption": "🎉 *NEW PRODUCT ALERT* 🎉\n\n_Premium Quality Headphones_\n\n✅ Noise Cancellation\n✅ 30h Battery Life\n✅ Fast Charging\n\n*Special Price: $199*\n~Original: $299~"
    }
  }'
```

### Image without a caption

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "image",
    "params": {
      "image": {
        "url": "https://example.com/images/screenshot.png"
      }
    }
  }'
```

## Image requirements

The API does not download or check the image when it accepts your request. WhatsApp applies its own limits when the image is delivered:

| Format | Notes |
|---|---|
| JPEG / JPG | Most compatible format. |
| PNG | Supports transparency. |
| GIF | Animated images. |
| WebP | Modern format. |

- **Maximum file size:** 16 MB.
- **Recommended dimensions:** up to 1600 × 1600 pixels.
- **Accessibility:** the URL must be public and point directly to the image file, not to a web page or a login-protected link.
- **Processing:** WhatsApp may compress the image when it is delivered.

## Response

A successful request returns HTTP `200` with the queued message. The fields are the same as for [text messages](./send-text.md#response-fields). For an image sent with `params`:

- `body` holds the caption, or an empty string without one.
- `params` holds the image URL and caption.
- `file_url`, `file_name`, and `file_mime` are `null`. They are filled only when you use the older top-level `file_url` format.

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "id": 36259783,
    "device_id": 12,
    "from_number": "6281234567890",
    "to_number": "6289876543210",
    "type": "image",
    "msg_type": "outgoing",
    "body": "Check out this amazing photo! 📸✨",
    "status": "PENDING",
    "wa_id": null,
    "retry": 0,
    "failed_reason": null,
    "file_url": null,
    "file_name": null,
    "file_caption": null,
    "file_size": null,
    "file_mime": null,
    "params": {
      "caption": "Check out this amazing photo! 📸✨",
      "image": { "url": "https://example.com/images/photo.jpg" }
    },
    "is_group": false,
    "created_at": "2025-08-22T03:36:02Z",
    "updated_at": "2025-08-22T03:36:02Z"
  }
}
```

## Errors

```json
{
  "status": 400,
  "message": "Invalid message params: unknown parameter 'viewOnce'. Allowed parameters: text, caption, fileName, mimetype, location, image, document"
}
```

Note: this error message leaves out `video`. All allowed keys are listed under [Request](#request).

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid message params: ...` | `params` contains a key that is not allowed, or `image` is not an object with only `url`. |
| `400` | `File URL is required for image type` | The request has neither `params` nor a legacy `file_url` field. |
| `400` | `Invalid request body: ...` | The body is not valid JSON, or `device`, `receiver`, or `type` is missing. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `403` | `Device not found or access denied` | `device` is not a device on your account. |
| `403` | Quota or subscription message | Your package has no messages left. |
| `500` | Error description | Internal error, for example the message could not be saved. Try again later. |

Problems with the image itself, such as a dead link, a private URL, a file that is too large, or an unsupported format, do not cause an error response because the API accepts the request first and sends it in the background. The same goes for sending failures, such as a disconnected device or a number that is not on WhatsApp. They show up later as status `ERROR` with a `failed_reason`. Check them with [Get message](./get-message.md); see [Status values](./get-message.md#status-values).

## Legacy format

The older format, with the image URL in a top-level `file_url` field and the caption in a top-level `message` field, is still accepted for backward compatibility. New integrations should use `params`.

## Code examples

JavaScript helpers, validation, batch sending, retries, and use cases for image messages are in the [Messaging guide](./guide.md).

## Limitations

- **File size:** up to 16 MB per image (WhatsApp limit).
- **Formats:** JPEG, PNG, GIF, WebP (WhatsApp limit).
- **URL:** must be public and direct. The API does not check it; see [Errors](#errors).
- **Sending rate:** space out your messages to avoid WhatsApp blocks.

## Next steps

- [Send text messages](./send-text.md) to contacts
- [Check contacts](../contacts/check-contacts.md) before sending
- [Send images to a group](../groups/send-group-messages.md)
