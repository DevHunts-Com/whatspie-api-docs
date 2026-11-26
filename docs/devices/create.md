---
title: Create device
description: Create a new WhatsApp device on a package with POST /devices. Reseller accounts only.
---

# Create device

Create a new device on a package plan. The package price is deducted from your balance.

```
POST https://api.whatspie.com/devices
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `package` | string | Yes | Package code, for example `STARTUP240K`. See [Package types](../device-management.md#package-types). |
| `name` | string | Yes | Display name for the device. |

Requirements:

- Your account must be a reseller account. Other accounts create devices in the [Whatspie dashboard](https://app.whatspie.com).
- Your balance must cover the package price.
- You can have only one device on the `BETA` package.

## Request example

```bash
curl -L -X POST 'https://api.whatspie.com/devices' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "package": "STARTUP240K",
    "name": "Customer Service"
  }'
```

## Success response

HTTP `201`. The new device has no phone number and is `UNPAIRED` until you connect it with the [QR code](./qr.md):

```json
{
  "status": 200,
  "message": "Device created successfully",
  "data": {
    "id": 2077,
    "phone": null,
    "webhook_url": null,
    "status": "ACTIVE",
    "version": "default",
    "paired_status": "UNPAIRED",
    "device_name_mobile": "Customer Service",
    "created_at": "2026-11-26T03:00:00Z",
    "updated_at": "2026-11-26T03:00:00Z",
    "server": { "name": "ASIA (IDN1)", "status": "ACTIVE" },
    "package": { "code": "STARTUP240K", "name": "Startup" },
    "subscription": { "quote_available": "-1", "quote_used": "0" }
  }
}
```

The response also includes the other device fields; see [Device fields](./list.md#device-fields).

## Error response

Every failure returns the same message. The cause is not shown: the account is not a reseller, the package code does not exist, the balance is too low, or the `BETA` limit is reached.

```json
{
  "status": 400,
  "message": "Failed to create device",
  "data": null
}
```
