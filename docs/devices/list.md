---
title: List devices
description: List all WhatsApp devices on your account with GET /devices, and the meaning of each device field.
---

# List devices

List all devices on your account.

```
GET https://api.whatspie.com/devices
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Request example

```bash
curl -L -X GET 'https://api.whatspie.com/devices' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

## Success response

Fields trimmed; see [Device fields](#device-fields) for the full list.

```json
{
  "status": 200,
  "message": "OK",
  "data": [
    {
      "id": 2076,
      "phone": "6289510154496",
      "webhook_url": "https://your-webhook-url.com",
      "status": "ACTIVE",
      "version": "multidevice",
      "paired_status": "UNPAIRED",
      "created_at": "2022-03-15T00:32:13Z",
      "updated_at": "2025-08-14T23:26:01Z",
      "server": {
        "name": "EUR (DEU1)",
        "status": "ACTIVE"
      },
      "package": {
        "code": "STARTUP240K",
        "name": "Startup"
      },
      "subscription": {
        "quote_available": "-1",
        "quote_used": "522"
      }
    }
  ]
}
```

## Device fields

| Field | Type | Description |
|---|---|---|
| `id` | integer | Device ID. Use it in `/devices/{id}`. |
| `phone` | string or null | The device's WhatsApp number. `null` until the device is connected. Use it as `device` when sending messages. |
| `webhook_url` | string or null | URL that receives [webhooks](../webhooks.md). |
| `status` | string | Device status, `ACTIVE` by default. |
| `version` | string | Device version label. |
| `paired_status` | string | `PAIRED` (connected to WhatsApp) or `UNPAIRED`. See [Paired status values](#paired-status-values). |
| `device_name_mobile` | string or null | Device name. |
| `node_url` | string or null | Internal connection server URL. |
| `image_url` | string or null | Profile picture URL. |
| `notify_is_connected` | boolean | Notification setting for connect events. |
| `notify_is_disconnected` | boolean | Notification setting for disconnect events. |
| `notify_updates` | boolean | Notification setting for updates. |
| `is_store_incoming_message` | boolean | Whether incoming messages are stored in Whatspie. |
| `is_proxy_enable` | boolean | Whether the connection uses a proxy. |
| `created_at`, `updated_at` | string | Timestamps, ISO 8601. |
| `server` | object | Connection server: `name`, `status`. |
| `package` | object | Package: `code`, `name`. |
| `subscription` | object | Message quota: `quote_available` (`-1` means unlimited) and `quote_used`, both strings. The API spells these fields `quote`; they mean quota. |

## Paired status values

| `paired_status` | Description |
|---|---|
| `UNPAIRED` | Not connected to WhatsApp. Scan the [QR code](./qr.md) to connect. |
| `PAIRED` | Connected to WhatsApp and ready to send. |

A device changes back to `UNPAIRED` when its WhatsApp session ends, for example when it is logged out from the phone.
