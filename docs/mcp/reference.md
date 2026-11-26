---
title: Reference
description: Authentication, endpoints, configuration, tools, pagination, and errors of the Whatspie MCP server.
---

# MCP Reference

## Authentication

Every request to `/mcp` must include your Whatspie API token:

```
Authorization: Bearer YOUR_API_TOKEN
```

- The value must start with `Bearer` (capital B) followed by one space.
- A missing header, or a value without `Bearer `, returns HTTP `401`.
- The server does not store tokens. It forwards the token to the Whatspie API on each request.
- The server does not support OAuth.

## Endpoints

| Method and path | Auth | Description |
|---|---|---|
| `GET /health` | No | Returns `{"status":"ok"}`. |
| `POST /mcp` | Yes | MCP endpoint, Streamable HTTP transport, stateless (no sessions). |

Requests to `/mcp` must send `Accept: application/json, text/event-stream`, or the server returns `406`. Responses use server-sent events format.

## Configuration

Environment variables:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | HTTP port. |
| `WHATSPIE_API_BASE_URL` | `https://api.whatspie.com` | Whatspie API to call. Host and port only; a path is ignored. |
| `LOG_LEVEL` | `info` | Log level. |

## Tools

Conventions for all tools:

- Phone numbers are strings in international format without `+` or a leading zero, for example `6281234567890`. Bare numbers are accepted too.
- `device` is the phone number of one of your paired devices. It is the sender.
- IDs such as `group_id`, `device_id`, and `id` are the numeric IDs used by the Whatspie API, not phone numbers.
- File URLs must be public, direct links that the Whatspie servers can download.

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

#### `get_message`

Get one message, including its delivery status.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | number | Yes | Message ID. |

#### `list_messages`

List a device's messages, newest first. [Paginated](#pagination).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Device number. |
| `from` | string | No | Start date, ISO 8601. |
| `to` | string | No | End date, ISO 8601. |
| `status` | string | No | Delivery status, for example `sent`, `delivered`, `failed`. |
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

#### `add_group_members`

Add members to a group. The device must be a group admin.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `group_id` | number | Yes | Group ID. |
| `participants` | string[] | Yes | Phone numbers to add. |

#### `update_group`

Change a group's details. The device must be a group admin.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `group_id` | number | Yes | Group ID. |
| `subject` | string | No | Group name, up to 25 characters. |
| `description` | string | No | Group description, up to 500 characters. |
| `profile_url` | string | No | URL of the new group picture. |

### Contacts

#### `check_contacts`

Check whether phone numbers are registered on WhatsApp.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Device number used for the check. |
| `phones` | string[] | Yes | Phone numbers to check. |

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
| `Unexpected error: <message>` | Anything else, for example the API could not be reached (`fetch failed`). |

HTTP errors from the server itself:

| Status | Meaning |
|---|---|
| `401` | Missing or malformed `Authorization` header. |
| `406` | `Accept` header does not include both `application/json` and `text/event-stream`. |
