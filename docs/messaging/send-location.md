---
title: Send location message
description: Send a location pin with latitude and longitude with POST /messages.
---

# Send location message

Send a location pin to a phone number. The recipient sees a map preview and can open it in their map app.

A location message carries only the coordinates. It has no name or address. To tell the recipient what the place is, send the name as a separate [text message](./send-text.md); see [Location with a name](#location-with-a-name).

## Endpoint

```
POST https://api.whatspie.com/messages
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Phone number of your sending device: the `phone` field from [List devices](../devices/list.md), not the numeric device `id`. |
| `receiver` | string | Yes | Recipient's phone number. Up to 35 characters. |
| `type` | string | Yes | `location`. |
| `params` | object | Yes | Message content. |
| `params.location.degreesLatitude` | number | Yes | Latitude, -90 to 90. |
| `params.location.degreesLongitude` | number | Yes | Longitude, -180 to 180. |

Write phone numbers in international format without `+`. See [Phone number format](./send-text.md#phone-number-format).

`params.location` accepts only `degreesLatitude` and `degreesLongitude`. Other keys, such as `name` or `address`, are rejected with `400`. Send coordinates as JSON numbers, not strings.

Location messages have no legacy format: a request without `params` is rejected.

## Coordinate system

Coordinates use WGS84, the same system as GPS.

| | Latitude | Longitude |
|---|---|---|
| Range | -90 to +90 | -180 to +180 |
| Positive values | North | East |
| Negative values | South | West |
| Example (San Francisco) | `37.7749` | `-122.4194` |
| Example (Jakarta) | `-6.2088` | `106.8456` |

The API does not check the range. Validate coordinates yourself; see [Coordinate validation](./guide.md#location-coordinate-validation).

## Examples

### Basic location message

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "location",
    "params": {
      "location": {
        "degreesLatitude": -6.2088,
        "degreesLongitude": 106.8456
      }
    }
  }'
```

In these examples, `6281234567890` is your device (the `phone` from [List devices](../devices/list.md)) and `6289876543210` is the receiver. Replace both with your own numbers.

### Location with a name

Send the location, then send the name as a text message right after it:

```bash
# 1. The location pin
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "location",
    "params": {
      "location": { "degreesLatitude": -6.1751, "degreesLongitude": 106.8650 }
    }
  }'

# 2. The name, as a text message
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat",
    "params": { "text": "📍 Monas - National Monument Jakarta" }
  }'
```

### Business location

```bash
# 1. The office location
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "location",
    "params": {
      "location": { "degreesLatitude": 37.7749, "degreesLongitude": -122.4194 }
    }
  }'

# 2. The office name and address
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat",
    "params": { "text": "🏢 Our Office - 123 Business St, San Francisco, CA" }
  }'
```

## Response

A successful request returns HTTP `200` with the queued message. The fields are the same as for [text messages](./send-text.md#response-fields). For a location, `body` is an empty string and `params.location` holds the coordinates:

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "id": 36259785,
    "device_id": 12,
    "from_number": "6281234567890",
    "to_number": "6289876543210",
    "type": "location",
    "msg_type": "outgoing",
    "body": "",
    "status": "PENDING",
    "wa_id": null,
    "retry": 0,
    "failed_reason": null,
    "file_url": null,
    "file_name": null,
    "file_caption": null,
    "file_size": null,
    "file_mime": null,
    "params": {
      "location": { "degreesLatitude": -6.2088, "degreesLongitude": 106.8456 }
    },
    "is_group": false,
    "created_at": "2025-08-22T03:36:02Z",
    "updated_at": "2025-08-22T03:36:02Z"
  }
}
```

## Errors

```json
{
  "status": 400,
  "message": "Invalid message params: unknown location parameter 'name'. Allowed location parameters: degreesLatitude, degreesLongitude"
}
```

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid message params: unknown location parameter ...` | `params.location` contains a key other than `degreesLatitude` and `degreesLongitude`. |
| `400` | `Invalid message params: params validation failed: ...` | A coordinate is not a number, for example a string. |
| `400` | `Invalid message params: location parameter must be an object ...` | `params.location` is not an object. |
| `400` | `Params are required for message type: location` | The request has no `params`. |
| `400` | `Invalid request body: ...` | The body is not valid JSON, or `device`, `receiver`, or `type` is missing. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `403` | `Device not found or access denied` | `device` is not a device on your account. |
| `403` | Quota or subscription message | Your package has no messages left. |
| `500` | Error description | Internal error, for example the message could not be saved. Try again later. |

Coordinates outside the valid range are not rejected. Check them before sending.

Sending failures, such as a disconnected device or a number that is not on WhatsApp, do not cause an error response either: the API accepts the message first and sends it in the background. They show up later as status `ERROR` with a `failed_reason`. Check them with [Get message](./get-message.md); see [Status values](./get-message.md#status-values).

## Code examples

JavaScript helpers, validation, batch sending, retries, and use cases for location messages are in the [Messaging guide](./guide.md).

## Limitations

- **No name or address:** a location message carries only coordinates. Send the name as a separate text message.
- **Coordinate precision:** up to 6 decimal places is enough for accuracy.
- **Map providers:** how the location displays depends on the recipient's map app.
- **Real-time tracking:** static location only, no live location.
- **Offline access:** recipients need internet to view map details.

## Related

- [Send text](./send-text.md): send the place name or directions
- [Send image](./send-image.md): send map screenshots
- [Get message](./get-message.md): check a message's delivery status

## Map integration services

For address lookup and map images, consider:

- **Google Maps API:** address lookup and static maps
- **OpenStreetMap:** open source mapping
- **Mapbox:** custom map styling
- **HERE Maps:** enterprise mapping
