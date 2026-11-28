---
title: Get message
description: Get a message's details and delivery status by its ID with GET /messages/{id}.
---

# Get message

Get the details and delivery status of one message by its ID. Use it to check a message you sent with any of the send endpoints.

## Endpoint

```
GET https://api.whatspie.com/messages/{id}
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Path parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | Yes | The message ID: `data.id` in the response of the send request. See [Response fields](./send-text.md#response-fields). |

## Request example

```bash
curl -X GET 'https://api.whatspie.com/messages/12345' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Accept: application/json'
```

## Response

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "id": 12345,
    "device_id": 5,
    "from_number": "6281234567890",
    "to_number": "6289876543210",
    "type": "chat",
    "msg_type": "outgoing",
    "body": "Hello World!",
    "status": "SENT",
    "wa_id": "3EB0C5D3A1B2C4D5E6F7",
    "retry": 0,
    "failed_reason": null,
    "file_url": null,
    "file_name": null,
    "file_caption": null,
    "file_size": null,
    "file_mime": null,
    "params": {
      "text": "Hello World!"
    },
    "is_group": false,
    "created_at": "2026-06-10T08:30:00Z",
    "updated_at": "2026-06-10T08:30:02Z"
  }
}
```

### Response fields

| Field | Type | Description |
|---|---|---|
| `id` | integer | Message ID. |
| `device_id` | integer | ID of the WhatsApp device that handled the message. |
| `from_number` | string | Sender phone number, international format. |
| `to_number` | string | Recipient phone number or group ID. |
| `type` | string | Message type, for example `chat`, `image`, `file`, `location`. |
| `msg_type` | string | Direction: `outgoing` for messages you sent, `ingoing` (spelled this way in the API) for messages you received. |
| `body` | string | Text, caption, or file name of the message. Empty for a location. |
| `status` | string | Delivery status. See [Status values](#status-values). |
| `wa_id` | string or null | WhatsApp's own message ID. `null` while the message is `PENDING`; filled in once WhatsApp accepts it. Used to [react to a message](./send-reaction.md). |
| `retry` | integer | Number of send retries. |
| `failed_reason` | string or null | Why sending failed, when `status` is `ERROR`. |
| `file_url` | string or null | File URL, when the message was sent with the legacy top-level `file_url` field. |
| `file_name` | string or null | File name, legacy format only. |
| `file_caption` | string or null | File caption, legacy format only. |
| `file_size` | integer or null | File size in bytes. |
| `file_mime` | string or null | MIME type, for example `image/jpeg` or `application/pdf`. Legacy format only. |
| `params` | object or null | The message parameters, for example `text`, `image.url`, `document.url`, or `location`. |
| `is_group` | boolean | `true` for a group message, `false` for a message to a phone number. |
| `created_at` | string | When the message was created, ISO 8601. |
| `updated_at` | string | When the message last changed, for example its status. ISO 8601. |

## Status values

| Status | Meaning |
|---|---|
| `PENDING` | Accepted by Whatspie and queued. Not yet handed to WhatsApp. |
| `SENT` | Sent to WhatsApp's servers (one grey tick). |
| `RECEIVED` | Delivered to the recipient's phone (two grey ticks). |
| `READ` | Opened by the recipient (two blue ticks). |
| `PLAYED` | A voice or video message was played. |
| `ERROR` | Sending failed. `failed_reason` says why. |

A status only moves forward, from `PENDING` toward `PLAYED`, or changes to `ERROR`. A message can stay at `RECEIVED` if the recipient has turned off read receipts.

## Errors

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid message ID` | `id` is not a number. |
| `404` | `Message not found or access denied` | No message with this ID, or it belongs to a device on another account. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `401` | `User not authenticated` | Internal authentication error. A missing or wrong token normally returns `403` first. |

```json
{
  "status": 404,
  "message": "Message not found or access denied"
}
```

## Related

- [Send text](./send-text.md), [Send image](./send-image.md), [Send file](./send-file.md), [Send location](./send-location.md): send messages and get their IDs
- [Send reaction](./send-reaction.md): react to a message by its `wa_id`
