---
title: Device management
description: Create, list, get, update, and delete WhatsApp devices, and get the QR code to connect them.
---

# Device management

A device is one WhatsApp number connected to Whatspie. Every message you send goes through a device. These endpoints create, list, update, and delete devices, and return the QR code that connects a device to WhatsApp.

## Base URL

```
https://api.whatspie.com
```

## Authentication

All device endpoints need your API token:

```
Authorization: Bearer YOUR_API_TOKEN
```

See [Authentication](./authentication.md).

## Device operations overview

| Operation | Method | Endpoint | Description |
|---|---|---|---|
| Create device | `POST` | `/devices` | Create a new device on a package. Reseller accounts only. |
| List devices | `GET` | `/devices` | All devices on your account. |
| Get device | `GET` | `/devices/{id}` | One device. |
| Get QR code | `GET` | `/devices/{id}/qr` | QR code to connect the device to WhatsApp. |
| Update device | `PUT` | `/devices/{id}` | Change the phone number, status, or webhook URL. See the warning before using it. |
| Delete device | `DELETE` | `/devices/{id}` | Delete a device. |

`{id}` is the numeric device `id` from List devices, not the phone number.

## Create device

Create a new device on a package plan. The package price is deducted from your balance.

```
POST https://api.whatspie.com/devices
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `package` | string | Yes | Package code, for example `STARTUP240K`. See [Package types](#package-types). |
| `name` | string | Yes | Display name for the device. |

Requirements:

- Your account must be a reseller account. Other accounts create devices in the [Whatspie dashboard](https://app.whatspie.com).
- Your balance must cover the package price.
- You can have only one device on the `BETA` package.

### Request example

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

### Success response

HTTP `201`. The new device has no phone number and is `UNPAIRED` until you connect it with the [QR code](#get-qr-code):

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

The response also includes the other device fields; see [Device fields](#device-fields).

### Error response

Every failure returns the same message. The cause is not shown: the account is not a reseller, the package code does not exist, the balance is too low, or the `BETA` limit is reached.

```json
{
  "status": 400,
  "message": "Failed to create device",
  "data": null
}
```

## List devices

```
GET https://api.whatspie.com/devices
```

### Request example

```bash
curl -L -X GET 'https://api.whatspie.com/devices' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### Success response

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

### Device fields

| Field | Type | Description |
|---|---|---|
| `id` | integer | Device ID. Use it in `/devices/{id}`. |
| `phone` | string or null | The device's WhatsApp number. `null` until the device is connected. Use it as `device` when sending messages. |
| `webhook_url` | string or null | URL that receives [webhooks](./webhooks.md). |
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
| `subscription` | object | Message quota: `quote_available` (`-1` means unlimited) and `quote_used`, both strings. |

### Paired status values

| `paired_status` | Description |
|---|---|
| `UNPAIRED` | Not connected to WhatsApp. Scan the [QR code](#get-qr-code) to connect. |
| `PAIRED` | Connected to WhatsApp and ready to send. |

A device changes back to `UNPAIRED` when its WhatsApp session ends, for example when it is logged out from the phone.

## Get device information

```
GET https://api.whatspie.com/devices/{id}
```

### Request example

```bash
curl -L -X GET 'https://api.whatspie.com/devices/5' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### Success response

Fields trimmed; see [Device fields](#device-fields).

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

### Error responses

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

## Get QR code

Get the QR code that connects the device to WhatsApp. On your phone, open WhatsApp, go to **Linked devices**, tap **Link a device**, and scan the code.

```
GET https://api.whatspie.com/devices/{id}/qr
```

Calling this endpoint starts a login session for the device.

### Request parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `response_type` | string | Yes | `url`. Other values return `400`. |

### Request example

```bash
curl -L -X GET 'https://api.whatspie.com/devices/5/qr?response_type=url' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### Success response

`data.qr` is the QR code as a PNG image in a base64 data URL, not a web link. Show it as an image, for example in an `<img src="...">` tag:

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

WhatsApp replaces the QR code after about 20 seconds. If it expires before you scan it, call the endpoint again.

### Error responses

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid response_type. Only 'url' is supported` | `response_type` is missing or not `url`. |
| `400` | `Invalid device ID` | `{id}` is not a number. |
| `404` | `Device not found` | No device with this ID. |
| `403` | `Access denied` | The device belongs to another account. |
| `500` | `Failed to get QR code` | The QR code could not be generated. Try again. |

If the device is already connected (`paired_status` is `PAIRED`), there is no QR code to return. Check `paired_status` with [Get device](#get-device-information) before asking for a QR code.

## Update device

```
PUT https://api.whatspie.com/devices/{id}
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `phone` | string | No | Device phone number. |
| `status` | string | No | Device status. |
| `webhook_url` | string | No | URL that receives [webhooks](./webhooks.md). |

:::warning[Update replaces the device record]
This endpoint currently saves only the fields in your request and clears the rest of the device record, including fields you did not send. Change the webhook URL and other settings in the [Whatspie dashboard](https://app.whatspie.com) instead until this is fixed.
:::

### Request example

```bash
curl -L -X PUT 'https://api.whatspie.com/devices/5' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "phone": "62895383079050",
    "status": "ACTIVE",
    "webhook_url": "https://your-webhook-url.com"
  }'
```

### Responses

```json
{
  "status": 200,
  "message": "Device updated successfully",
  "data": null
}
```

Every failure returns `400` with `Failed to update device`, including a wrong or foreign device ID. A non-numeric `{id}` returns `400 Invalid device ID`.

## Delete device

```
DELETE https://api.whatspie.com/devices/{id}
```

Deleting a device removes it from your account. It cannot be undone.

### Request example

```bash
curl -L -X DELETE 'https://api.whatspie.com/devices/5' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### Responses

```json
{
  "status": 200,
  "message": "Device deleted successfully",
  "data": null
}
```

Every failure returns `400` with `Failed to delete device`, including a wrong or foreign device ID. A non-numeric `{id}` returns `400 Invalid device ID`.

## Package types

Package codes for [Create device](#create-device). The packages available to your account may differ; check the dashboard.

| ID | Package code | Name |
|---|---|---|
| 1 | `BETA` | Beta Tester |
| 2 | `STARTER60K` | Starter |
| 3 | `STARTUP240K` | Startup |
| 4 | `BUSINESS` | Business |

Devices on the `BETA` package do not receive image, document, or audio files in [webhooks](./webhooks.md).

### Package selection examples

```bash
# Create device with Starter package
curl -L -X POST 'https://api.whatspie.com/devices' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "package": "STARTER60K",
    "name": "Basic Bot"
  }'

# Create device with Business package
curl -L -X POST 'https://api.whatspie.com/devices' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "package": "BUSINESS",
    "name": "Enterprise Bot"
  }'
```

## Best practices

### Device creation

1. **Meaningful names:** use descriptive names so devices are easy to tell apart.
2. **Package selection:** choose a package that fits your message volume.
3. **Monitoring:** watch the connection of critical devices, for example with the `device_disconnected` [webhook](./webhooks.md).

### QR code management

1. **Secure display:** show QR codes only to the person who owns the phone. Anyone who scans it controls the device.
2. **Expiry handling:** the QR code expires after about 20 seconds; ask for a new one if needed.
3. **Auto-refresh:** while waiting for a scan, request a new QR code when the old one expires.

### Connection monitoring

1. **Regular checks:** during connection, check `paired_status` with Get device every 3–5 seconds until it is `PAIRED`.
2. **Timeout handling:** stop after a reasonable time and show the user a fresh QR code.
3. **Error recovery:** retry failed QR requests.

## Common errors

| HTTP status | `message` | Endpoint | Cause |
|---|---|---|---|
| `400` | `Failed to create device` | Create | Not a reseller, unknown package code, low balance, or `BETA` limit. |
| `400` | `Invalid device ID` | `/devices/{id}` endpoints | `{id}` is not a number. |
| `404` | `Device not found` | Get, Get QR code | No device with this ID. |
| `403` | `Access denied` | Get, Get QR code | The device belongs to another account. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | All | Token problem. See [Authentication](./authentication.md#errors). |
| `500` | `Internal server error` | List | Devices could not be read. Try again. |

## Next steps

Once your device is connected:

- [Understand the request format](./messaging/send-text.md#request) for sending messages
- [Send text messages](./messaging/send-text.md) to contacts
- [Send media messages](./messaging/send-image.md) with images and files
- [Manage groups](./groups/list-groups.md) and group messaging
