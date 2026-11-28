---
title: Send file message
description: Send a document or other file from a public URL with POST /messages.
---

# Send file message

Send a document or any other file from a public URL to a phone number. The recipient receives it as a WhatsApp document they can open or save.

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
| `type` | string | Yes | `file`. |
| `params` | object | Yes | Message content. |
| `params.document.url` | string | Yes | Direct, public URL of the file. |
| `params.fileName` | string | No, recommended | File name shown to the recipient, with extension, for example `invoice.pdf`. Without it, the recipient may see an unclear name. |
| `params.mimetype` | string | No, recommended | MIME type, for example `application/pdf`. Helps WhatsApp show the right icon and open the file with the right app. |
| `params.caption` | string | No | Text shown with the file. |

Write phone numbers in international format without `+`. See [Phone number format](./send-text.md#phone-number-format).

`params` accepts only these keys: `text`, `caption`, `fileName`, `mimetype`, `location`, `image`, `document`, `video`. Any other key is rejected with `400`.

## Examples

### Basic file message

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
      "document": {
        "url": "https://example.com/documents/report.pdf"
      },
      "fileName": "Monthly_Sales_Report_Q4_2024.pdf",
      "mimetype": "application/pdf"
    }
  }'
```

In these examples, `6281234567890` is your device (the `phone` from [List devices](../devices/list.md)) and `6289876543210` is the receiver. Replace both with your own numbers.

### Presentation with a caption

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
      "document": {
        "url": "https://cdn.example.com/files/presentation.pptx"
      },
      "fileName": "Product_Launch_Presentation_Q1.pptx",
      "mimetype": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "caption": "Slides for Monday'\''s launch meeting"
    }
  }'
```

### Technical document (legacy format)

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "file",
    "file_url": "https://docs.example.com/api/documentation.pdf",
    "message": "📚 API Documentation v2.1\n\nLatest version with new endpoints and examples."
  }'
```

The recipient gets `documentation.pdf` with the text from `message` as its caption.

## Supported file formats

The API does not download or check the file when it accepts your request. WhatsApp applies its own limits when the file is delivered. Commonly sent formats:

| Category | Formats |
|---|---|
| Documents | PDF (`.pdf`), Word (`.doc`, `.docx`), Excel (`.xls`, `.xlsx`), PowerPoint (`.ppt`, `.pptx`), text (`.txt`) |
| Archives | ZIP (`.zip`), RAR (`.rar`), 7-Zip (`.7z`), TAR (`.tar`, `.tar.gz`) |
| Development | JavaScript (`.js`, `.jsx`), Python (`.py`), Java (`.java`), C/C++ (`.c`, `.cpp`, `.h`), HTML/CSS (`.html`, `.css`) |
| Media | Audio (`.mp3`, `.wav`, `.ogg`), video (`.mp4`, `.avi`, `.mov`), images (`.jpg`, `.png`, `.gif`), eBooks (`.epub`, `.mobi`) |

Media files sent this way arrive as documents, not as photos or playable videos. To send a photo, use [Send image](./send-image.md).

Maximum file size: 100 MB.

## Response

A successful request returns HTTP `200` with the queued message. The fields are the same as for [text messages](./send-text.md#response-fields). For a file sent with `params`:

- `body` holds the caption, or the file name if there is no caption.
- `params` holds the document URL, file name, MIME type, and caption.
- `file_url`, `file_name`, and `file_mime` are `null`.

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "id": 36259784,
    "device_id": 12,
    "from_number": "6281234567890",
    "to_number": "6289876543210",
    "type": "file",
    "msg_type": "outgoing",
    "body": "Monthly_Sales_Report_Q4_2024.pdf",
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
      "fileName": "Monthly_Sales_Report_Q4_2024.pdf",
      "mimetype": "application/pdf",
      "document": { "url": "https://example.com/documents/report.pdf" }
    },
    "is_group": false,
    "created_at": "2025-08-22T03:36:02Z",
    "updated_at": "2025-08-22T03:36:02Z"
  }
}
```

With the legacy format, `body` holds `message`, `file_url` holds the URL, `file_name` holds the name taken from the URL, `file_mime` holds the guessed MIME type, and `file_caption` holds `file_caption` if you sent it.

## Errors

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid message params: ...` | `params` contains a key that is not allowed, or `document` is not an object with only `url`. |
| `400` | `File URL is required for file type` | Legacy format without `file_url`, or a request with neither `params` nor `file_url`. |
| `400` | `File name is required in message field for file type` | Legacy format without `message`. Despite the wording, `message` is used as the caption. |
| `400` | `Invalid request body: ...` | The body is not valid JSON, or `device`, `receiver`, or `type` is missing. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `403` | `Device not found or access denied` | `device` is not a device on your account. |
| `403` | Quota or subscription message | Your package has no messages left. |
| `500` | Error description | Internal error, for example the message could not be saved. Try again later. |

Problems with the file itself, such as a dead link, a private URL, or a file that is too large, do not cause an error response because the API accepts the request first and sends it in the background. The same goes for sending failures, such as a disconnected device or a number that is not on WhatsApp. They show up later as status `ERROR` with a `failed_reason`. Check them with [Get message](./get-message.md); see [Status values](./get-message.md#status-values).

## Legacy format

The older format, without `params`, is still accepted for backward compatibility. It behaves differently from what the field names suggest:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `file_url` | string | Yes | Direct, public URL of the file. |
| `message` | string | Yes | Used as the **caption**, not as the file name. |
| `file_caption` | string | No | If set, used as the caption instead of `message`. |

In this format the file name is taken from the end of the URL (`.../report.pdf` → `report.pdf`) and the MIME type is guessed from the file extension. To choose the file name yourself, use `params`.

## Code examples

JavaScript helpers, validation, batch sending, retries, and use cases for file messages are in the [Messaging guide](./guide.md).

## Limitations

- **File size:** up to 100 MB per file (WhatsApp limit).
- **File URL:** must be public and reachable over HTTP or HTTPS. The API does not check it; see [Errors](#errors).
- **File types:** WhatsApp may refuse some file types.
- **Large files:** take longer to deliver.
- **Retention:** files may be cached temporarily for delivery.

## Related

- [Send image](./send-image.md): send photos that display inline
- [Send text](./send-text.md): plain text messages
- [Get message](./get-message.md): check a message's delivery status
