---
title: Get QR code
description: Get the QR code that connects a device to WhatsApp with GET /devices/{id}/qr.
---

# Get QR code

Get the QR code that connects the device to WhatsApp. On your phone, open WhatsApp, go to **Linked devices**, tap **Link a device**, and scan the code.

```
GET https://api.whatspie.com/devices/{id}/qr
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

`{id}` is the numeric device `id` from [List devices](./list.md), not the phone number. The phone number goes in the `device` field when you send messages.

Calling this endpoint starts a login session for the device: Whatspie starts a new WhatsApp connection and waits for a phone to scan the code.

## Request parameters

`response_type` must always be `url`. The name says `url`, but you do not get a link. You get the QR picture itself, as text.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `response_type` | string | Yes | Always `url`. Other values return `400`. |

## Request example

```bash
curl -L -X GET 'https://api.whatspie.com/devices/5/qr?response_type=url' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

## Success response

`data.qr` is the QR picture as text: a base64 data URL that starts with `data:image/png;base64,`. Show it in an `<img src="...">` tag:

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

## Error responses

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid response_type. Only 'url' is supported` | `response_type` is missing or not `url`. |
| `400` | `Invalid device ID` | `{id}` is not a number. |
| `404` | `Device not found` | No device with this ID. |
| `403` | `Access denied` | The device belongs to another account. |
| `500` | `Failed to get QR code` | The QR code could not be generated. Try again. |

If the device is already connected (`paired_status` is `PAIRED`), there is no QR code to return. Check `paired_status` with [Get device](./get.md) before asking for a QR code.
