---
sidebar_position: 6
---

# 🔍 Get Message by ID

Retrieve the details, delivery status, and parameters of a specific message by its unique database ID.

<div style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>🔍 Message Tracking</h3>
  <p style={{margin: "0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>Look up detailed logs, WhatsApp Message IDs (WAID), timestamps, retry counts, failure reasons, and payload parameters for any message sent or received.</p>
</div>

## 🌐 Endpoint

```
GET https://api.whatspie.com/messages/{id}
```

## 🔐 Authentication

Bearer token required in the `Authorization` header with proper content headers.

```bash
Authorization: Bearer <YOUR_API_TOKEN>
```

## 📋 Path Parameters

| Parameter | Type    | Required | Description                           |
| --------- | ------- | -------- | ------------------------------------- |
| `id`      | integer | ✅       | The unique database ID of the message |

## 🚀 Request Example

```bash
curl -X GET "https://api.whatspie.com/messages/12345" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

## 📊 Response Format

### Success Response

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
    "status": "sent",
    "wa_id": "true_6289876543210@c.us_3EB0C5D3",
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

### Response Fields

| Field           | Type            | Description                                                                        |
| --------------- | --------------- | ---------------------------------------------------------------------------------- |
| `id`            | integer         | Unique database ID of the message                                                  |
| `device_id`     | integer         | The ID of the WhatsApp device that processed the message                           |
| `from_number`   | string          | Sender phone number (international format)                                         |
| `to_number`     | string          | Recipient phone number or group ID                                                 |
| `type`          | string          | Message type (`chat`, `image`, `video`, `file`, `location`, etc.)                  |
| `msg_type`      | string          | Message direction: `"outgoing"` or `"incoming"`                                    |
| `body`          | string          | Text content or caption of the message                                             |
| `status`        | string          | Delivery status: `"PENDING"`, `"sent"`, `"delivered"`, `"failed"`, etc.            |
| `wa_id`         | string \| null  | The native WhatsApp message ID (used for callbacks/replies)                        |
| `retry`         | integer         | Number of retry attempts made for sending the message                              |
| `failed_reason` | string \| null  | Error message detailing why the message failed to send                             |
| `file_url`      | string \| null  | URL of the media file (if message type is `image`, `video`, or `file`)             |
| `file_name`     | string \| null  | Original filename of the sent file                                                 |
| `file_caption`  | string \| null  | Caption text attached to the media file                                            |
| `file_size`     | integer \| null | Size of the media file in bytes                                                    |
| `file_mime`     | string \| null  | Mimetype of the media file (e.g., `image/jpeg`, `application/pdf`)                 |
| `params`        | object \| null  | Raw JSON parameters sent to/received from the WhatsApp gateway                     |
| `is_group`      | boolean         | Indicates if the message was sent to a group (`true`) or private contact (`false`) |
| `created_at`    | string          | Message creation timestamp (ISO 8601)                                              |
| `updated_at`    | string          | Message last updated timestamp (ISO 8601)                                          |

## Error Responses

### Invalid Message ID

```json
{
  "status": 400,
  "message": "Invalid message ID"
}
```

### Unauthorized

```json
{
  "status": 401,
  "message": "User not authenticated"
}
```

### Message Not Found / Access Denied

```json
{
  "status": 404,
  "message": "Message not found or access denied"
}
```
