---
title: Device management
description: Overview of the device endpoints, package types, best practices, and common errors.
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
| [Create device](./devices/create.md) | `POST` | `/devices` | Create a new device on a package. Reseller accounts only. |
| [List devices](./devices/list.md) | `GET` | `/devices` | All devices on your account. |
| [Get device](./devices/get.md) | `GET` | `/devices/{id}` | One device. |
| [Get QR code](./devices/qr.md) | `GET` | `/devices/{id}/qr` | QR code to connect the device to WhatsApp. |
| [Update device](./devices/update.md) | `PUT` | `/devices/{id}` | Change the phone number, status, or webhook URL. See the warning before using it. |
| [Delete device](./devices/delete.md) | `DELETE` | `/devices/{id}` | Delete a device. |

`{id}` is the numeric device `id` from List devices, not the phone number.

## Package types

Package codes for [Create device](./devices/create.md). The packages available to your account may differ; check the dashboard.

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

1. **Regular checks:** during connection, check `paired_status` with [Get device](./devices/get.md) every 3–5 seconds until it is `PAIRED`.
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
