---
title: Reference
description: Authentication, endpoint, tools, pagination, and errors of the Whatspie MCP server.
---

# MCP Reference

## Authentication

The Whatspie MCP server is hosted by Whatspie. On this page its URL is written as `MCP_SERVER_URL`.

Every request must include your Whatspie API token, from **Profile → Developer** in the dashboard:

```
Authorization: Bearer YOUR_API_TOKEN
```

- The value must start with `Bearer` (capital B) followed by one space.
- A missing header, or a value without `Bearer `, returns HTTP `401`.
- The server does not store tokens. It forwards the token to the Whatspie API on each request.
- The server does not support OAuth.

## Endpoint

| Method and URL | Auth | Description |
|---|---|---|
| `POST MCP_SERVER_URL` | Yes | MCP endpoint, Streamable HTTP transport, stateless (no sessions). |

Requests must send `Accept: application/json, text/event-stream`, or the server returns `406`. Responses use server-sent events format.

## Tools

Conventions for all tools:

- Phone numbers are strings in international format without `+` or a leading zero, for example `6281234567890`. Bare numbers are accepted too. The server does not check or convert numbers: `+62…` or `08…` is passed on to WhatsApp exactly as written.
- `device` is the phone number of one of your paired devices. It is the sender.
- IDs such as `group_id`, `device_id`, and `id` are the numeric IDs used by the Whatspie API, not phone numbers. `list_groups` and `get_group` return `id` as a string, for example `"18"`. The tools accept it as a number or as that string.
- File URLs must be public, direct links that the Whatspie servers can download.
- Send tools return the queued message, with its `id` and `status: PENDING`. Sending happens in the background; check the status later with [`get_message`](#get_message).

### Messages

#### `send_text_message`

Send a text message.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Sender device number. |
| `receiver` | string | Yes | Recipient phone number. |
| `message` | string | Yes | Message text. |

#### `send_image_message`

Send an image from a URL. JPEG, PNG, GIF, or WebP, up to 16 MB.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Sender device number. |
| `receiver` | string | Yes | Recipient phone number. |
| `file_url` | string | Yes | Public URL of the image. |
| `caption` | string | No | Caption shown with the image. |

#### `send_document_message`

Send a file from a URL, up to 100 MB.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Sender device number. |
| `receiver` | string | Yes | Recipient phone number. |
| `file_url` | string | Yes | Public URL of the file. |
| `file_name` | string | Yes | File name shown to the recipient, with extension, for example `invoice.pdf`. |
| `mimetype` | string | No | MIME type, for example `application/pdf`. |

#### `send_reaction`

React to a message with an emoji.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Sender device number. |
| `msisdn` | string | Yes | Recipient phone number, or group JID when `is_group` is `true`. |
| `message_id` | string | Yes | WhatsApp message ID (`wa_id`) to react to. |
| `emoji` | string | No | Emoji. Default `""`, which removes the reaction. |
| `is_group` | boolean | No | `true` if `msisdn` is a group. Default `false`. |

Returns `{"id": "..."}`, the WhatsApp ID of the reaction. It does not confirm that the reaction is shown.

#### `get_message`

Get one message, including its delivery status.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | number | Yes | Message ID. |

#### `list_messages`

List a device's messages, newest first by creation time. [Paginated](#pagination). Each message has `msg_type`: `outgoing` for messages you sent, `ingoing` for messages you received.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Device number. |
| `from` | string | No | Only messages from this sender number (exact match), for example `6281234567890`. |
| `to` | string | No | Only messages to this recipient number (exact match). |
| `status` | string | No | Delivery status in uppercase: `PENDING`, `SENT`, `RECEIVED`, `READ`, `PLAYED`, or `ERROR`. See [Status values](../messaging/get-message.md#status-values). Lowercase values match nothing. |
| `limit` | number | No | Messages fetched from the API before paging. Default `200`. |
| `page` | number | No | Page number, from 1. Default `1`. |
| `page_size` | number | No | Messages per page. Default `20`. |

### Groups

#### `list_groups`

List synced groups. [Paginated](#pagination).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | No | Only groups of this device. |
| `page` | number | No | Page number, from 1. Default `1`. |
| `page_size` | number | No | Groups per page. Default `20`. |

#### `get_group`

Get one group.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `group_id` | number | Yes | Group ID. |

#### `refresh_groups`

Re-sync a device's group list from WhatsApp.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Device number. |

#### `send_group_message`

Send text, an image, or a file to a group. The message is always sent from the device that owns the group (its `device_id` in `list_groups`), so there is no `device` parameter.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `group_id` | number | Yes | Group ID. |
| `type` | `chat`, `image`, or `file` | No | Message type. Default `chat`. |
| `message` | string | For `chat` | Message text. |
| `file_url` | string | For `image` and `file` | Public URL of the media. |
| `caption` | string | No | Caption, for `image`. |
| `file_name` | string | For `file` | File name with extension. |
| `mimetype` | string | No | MIME type, for `file`. |

The server does not enforce `message` for `chat`, `file_url` for `image` and `file`, or `file_name` for `file`. Without them the request is still accepted, but the message can end as `ERROR`; a `chat` message with no text always does. Always send them.

#### `add_group_members`

Add members to a group. The device must be a group admin.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `group_id` | number | Yes | Group ID. |
| `participants` | string[] | Yes | Phone numbers to add. |

Returns `{"group_id": 18, "members_added": [...]}`. `members_added` repeats your input, even for numbers that are not on WhatsApp. It does not confirm who joined; check the group in WhatsApp.

#### `update_group`

Change a group's details. The device must be a group admin.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `group_id` | number | Yes | Group ID. |
| `subject` | string | No | Group name. The server does not check the length. |
| `description` | string | No | Group description. The server does not check the length. |
| `profile_url` | string | No | URL of the new group picture. |

### Contacts

#### `check_contacts`

Check whether phone numbers are registered on WhatsApp.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Device number used for the check. |
| `phones` | string[] | Yes | Phone numbers to check. |

Returns one entry per number, in the same order: `[{"phone": "6281234567890", "is_on_whatsapp": true}]`.

### Devices

#### `list_devices`

List the devices on your account. No parameters.

#### `get_device`

Get one device.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device_id` | number | Yes | Device ID. |

#### `get_device_qr`

Get the QR code to pair a device. Returns an image. If the device is already paired, the request currently fails with an error. The code expires after about 20 seconds. See [Pair a device with a QR code](./guides.md#pair-a-device-with-a-qr-code).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device_id` | number | Yes | Device ID. |

#### `create_device`

Create a device. Uses quota and may be billed.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Device name. |
| `package` | string | Yes | Package code from your account. |

#### `update_device`

Change a device. Can interrupt message delivery.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device_id` | number | Yes | Device ID. |
| `phone` | string | No | New phone number. |
| `status` | string | No | New status. |
| `webhook_url` | string | No | New webhook URL. |

#### `delete_device`

Delete a device permanently. Cannot be undone.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device_id` | number | Yes | Device ID. |

The descriptions of `create_device`, `update_device`, and `delete_device` tell the assistant to confirm with the user before calling them.

## Pagination

The Whatspie API has no page parameters for groups and messages. `list_groups` and `list_messages` fetch the list and return one page of it:

```json
{
  "data": [],
  "page": 2,
  "page_size": 20,
  "total": 143,
  "total_pages": 8
}
```

| Field | Description |
|---|---|
| `data` | Items on this page. |
| `page` | Current page, from 1. |
| `page_size` | Items per page. |
| `total` | Items fetched in total. |
| `total_pages` | Number of pages. `0` when there are no items. |

`list_groups` fetches all groups of the device on every call. `list_messages` fetches at most `limit` messages; `total` counts only those.

## Errors

Tool errors are returned as MCP tool results with `isError: true`:

| Message | Meaning |
|---|---|
| `Whatspie API error (<status>): <message>` | The Whatspie API returned an error. `<status>` is its HTTP status, `<message>` its error message. |
| `Unexpected error: <message>` | Anything else, for example the MCP server could not reach the Whatspie API (`fetch failed`). |
| `MCP error -32602: Input validation error: ...` | A required parameter is missing or has the wrong type. The tool did not run. Exceptions: phone-number parameters (`device`, `receiver`, `msisdn`, `from`, `to`, `phones`, `participants`) accept a number or a string, and IDs (`group_id`, `device_id`, `id`) accept a number or a numeric string. |

A validation error lists each bad parameter on its own line, after `at`:

```
MCP error -32602: Input validation error: Invalid arguments for tool send_text_message: Invalid input: expected nonoptional, received undefined at receiver
Invalid input: expected string, received undefined at message
```

HTTP errors from the server itself:

| Status | Meaning |
|---|---|
| `401` | Missing or malformed `Authorization` header. |
| `406` | `Accept` header does not include both `application/json` and `text/event-stream`. |
