---
title: Get device
description: Get one WhatsApp device by its id with GET /devices/{id}, including its paired status.
---

# Get device

Get one device by its ID, including whether it is connected to WhatsApp.

```
GET https://api.whatspie.com/devices/{id}
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

`{id}` is the numeric device `id` from [List devices](./list.md), not the phone number. The phone number goes in the `device` field when you send messages.

## Request example

```bash
curl -L -X GET 'https://api.whatspie.com/devices/5' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

## Success response

Fields trimmed; see [Device fields](./list.md#device-fields).

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "id": 5,
    "phone": "62895383079050",
    "webhook_url": "https://your-webhook-url.com",
    "status": "ACTIVE",
    "version": "multidevice",
    "paired_status": "PAIRED",
    "created_at": "2020-02-26T07:06:47Z",
    "updated_at": "2025-08-11T21:30:42Z",
    "server": {
      "name": "ASIA (IDN1)",
      "status": "ACTIVE"
    },
    "package": {
      "code": "STARTUP240K",
      "name": "Startup"
    },
    "subscription": {
      "quote_available": "-1",
      "quote_used": "62755"
    }
  }
}
```

## Error responses

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid device ID` | `{id}` is not a number. |
| `404` | `Device not found` | No device with this ID. |
| `403` | `Access denied` | The device belongs to another account. |

```json
{
  "status": 404,
  "message": "Device not found",
  "data": null
}
```
