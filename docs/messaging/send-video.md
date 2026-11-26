---
title: Send video message
description: Send a playable video from a public URL, with an optional caption, with POST /messages.
---

# Send video message

Send a video from a public URL to a phone number, with an optional caption. The recipient can play it inline in WhatsApp.

Videos use `type: "file"` with a `params.video` object. In Whatspie, `type` is a label for the message; what WhatsApp receives is decided by `params`. With `params.video` the recipient gets a playable video, while `params.document` (see [Send file](./send-file.md)) would deliver the same file as a document.

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
| `type` | string | Yes | `file`. There is no `video` type; it is rejected with `400`. |
| `params` | object | Yes | Message content. |
| `params.video.url` | string | Yes | Direct, public URL of the video file. |
| `params.mimetype` | string | No, recommended | Video MIME type, for example `video/mp4`. See [Common video MIME types](#common-video-mime-types). |
| `params.caption` | string | No | Caption shown under the video. Supports [WhatsApp formatting](./send-text.md#text-formatting). |

Write phone numbers in international format without `+`. See [Phone number format](./send-text.md#phone-number-format).

`params` accepts only these keys: `text`, `caption`, `fileName`, `mimetype`, `location`, `image`, `document`, `video`. Any other key, such as `viewOnce`, is rejected with `400`.

Videos have no legacy format. A top-level `file_url` field sends the file as a document, not as a playable video.

## Supported video formats

The API does not download or check the video when it accepts your request. WhatsApp applies its own limits when the video is delivered:

| Format | Notes |
|---|---|
| MP4 | Most compatible format. |
| MOV | Apple QuickTime. |
| AVI | Windows format. |
| WebM | Modern web format. |

## Common video MIME types

| Format | MIME type | Extension |
|---|---|---|
| MP4 | `video/mp4` | `.mp4` |
| MOV | `video/quicktime` | `.mov` |
| AVI | `video/x-msvideo` | `.avi` |
| WebM | `video/webm` | `.webm` |
| MKV | `video/x-matroska` | `.mkv` |

## Video requirements

- **Maximum file size:** 64 MB.
- **Recommended duration:** up to 90 seconds for reliable delivery.
- **Accessibility:** the URL must be public and point directly to the video file.
- **Processing:** WhatsApp may compress the video when it is delivered.

## Examples

### Basic video message

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "file",
    "params": {
      "video": {
        "url": "https://example.com/videos/demo.mp4"
      },
      "mimetype": "video/mp4",
      "caption": "Check out this amazing video! 🎥✨"
    }
  }'
```

In these examples, `6281234567890` is your device (the `phone` from [List devices](../devices/list.md)) and `6289876543210` is the receiver. Replace both with your own numbers.

### Video with a formatted caption

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "file",
    "params": {
      "video": {
        "url": "https://example.com/videos/product-demo.mp4"
      },
      "mimetype": "video/mp4",
      "caption": "🎉 *NEW PRODUCT DEMO* 🎉\n\n_Watch our latest innovation in action_\n\n✅ Easy to Use\n✅ Powerful Features\n✅ Lightning Fast\n\n*Available Now!*\n\nOrder today: https://shop.example.com"
    }
  }'
```

### Video without a caption

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "file",
    "params": {
      "video": {
        "url": "https://example.com/videos/tutorial.mp4"
      },
      "mimetype": "video/mp4"
    }
  }'
```

## Response

A successful request returns HTTP `200` with the queued message. The fields are the same as for [text messages](./send-text.md#response-fields). For a video:

- `type` is `file`.
- `body` holds the caption, or an empty string without one.
- `params` holds the video URL, MIME type, and caption.
- `file_url`, `file_name`, and `file_mime` are `null`.

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "id": 36259786,
    "device_id": 12,
    "from_number": "6281234567890",
    "to_number": "6289876543210",
    "type": "file",
    "msg_type": "outgoing",
    "body": "Check out this amazing video! 🎥✨",
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
      "caption": "Check out this amazing video! 🎥✨",
      "mimetype": "video/mp4",
      "video": { "url": "https://example.com/videos/demo.mp4" }
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
  "message": "Invalid message type. Must be one of: chat, image, file, location, template, list"
}
```

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid message type. Must be one of: ...` | `type` is `video` or another unsupported value. Use `file`. |
| `400` | `Invalid message params: ...` | `params` contains a key that is not allowed, or `video` is not an object with only `url`. |
| `400` | `Invalid request body: ...` | The body is not valid JSON, or `device`, `receiver`, or `type` is missing. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `403` | `Device not found or access denied` | `device` is not a device on your account. |
| `403` | Quota or subscription message | Your package has no messages left. |
| `500` | Error description | Internal error, for example the message could not be saved. Try again later. |

The API accepts the message first and sends it in the background. Problems with the video, such as a dead link or a file that is too large, and sending failures, such as a disconnected device or a number that is not on WhatsApp, do not cause an error response. They show up later as status `ERROR` with a `failed_reason`. Check them with [Get message](./get-message.md); see [Status values](./get-message.md#status-values).

## Code examples

JavaScript helpers, validation, batch sending, retries, and use cases for video messages are in the [Messaging guide](./guide.md).

## Limitations

- **File size:** up to 64 MB per video (WhatsApp limit).
- **Duration:** up to 90 seconds is recommended for reliable delivery.
- **Formats:** MP4, MOV, AVI, WebM (WhatsApp limit).
- **URL:** must be public and direct. The API does not check it; see [Errors](#errors).
- **Sending rate:** space out your messages to avoid WhatsApp blocks.
- **Compression:** WhatsApp may compress large videos.

## Next steps

- [Send text messages](./send-text.md) to contacts
- [Send images](./send-image.md) for photo sharing
- [Check contacts](../contacts/check-contacts.md) before sending
- [Send videos to a group](../groups/send-group-messages.md)
