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

The API does not check the range. Validate coordinates yourself; see [Coordinate validation](#1-coordinate-validation).

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

## Advanced examples

The JavaScript examples on this page use this helper, plus `sendTextMessage` from [Send text](./send-text.md#example) and `sendImageMessage` from [Send image](./send-image.md#advanced-examples):

```javascript
async function sendLocationMessage(token, device, receiver, latitude, longitude) {
  const res = await fetch('https://api.whatspie.com/messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      device,
      receiver,
      type: 'location',
      params: { location: { degreesLatitude: latitude, degreesLongitude: longitude } },
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    const error = new Error(body.message);
    error.status = res.status;
    throw error;
  }
  return body;
}

// Location pin followed by a text message with its name
async function sendNamedLocation(token, device, receiver, latitude, longitude, name) {
  const location = await sendLocationMessage(token, device, receiver, latitude, longitude);
  const label = name ? await sendTextMessage(token, device, receiver, name) : null;
  return { location, label };
}
```

### Location with address lookup

```javascript
// Reverse geocoding: get an address from coordinates, then send it with the pin
async function sendLocationWithAddress(token, device, receiver, latitude, longitude) {
  let name = null;
  try {
    const address = await reverseGeocode(latitude, longitude);
    name = `📍 ${address.name}\n${address.street}, ${address.city}`;
  } catch {
    // Address lookup failed: send the pin without a name
  }
  return sendNamedLocation(token, device, receiver, latitude, longitude, name);
}

// Mock reverse geocoding function
async function reverseGeocode(lat, lng) {
  // In a real implementation, use Google Maps, OpenStreetMap, etc.
  return {
    name: 'Business Center',
    street: 'Jl. Sudirman No. 123',
    city: 'Jakarta',
  };
}
```

### Batch location sharing

```javascript
async function sendMultipleLocations(token, device, receiver, locations) {
  const results = [];

  for (const location of locations) {
    try {
      const result = await sendNamedLocation(
        token, device, receiver, location.latitude, location.longitude, location.name,
      );
      results.push({ location: location.name, success: true, messageId: result.location.data.id });
    } catch (error) {
      results.push({ location: location.name, success: false, error: error.message });
    }
    await new Promise((resolve) => setTimeout(resolve, 2000)); // pause between locations
  }

  return results;
}

const touristSpots = [
  { name: '🗿 Monas Jakarta', latitude: -6.1751, longitude: 106.865 },
  { name: '🏛️ National Museum', latitude: -6.1717, longitude: 106.8219 },
  { name: '🌊 Ancol Beach', latitude: -6.126, longitude: 106.8421 },
];

await sendMultipleLocations('YOUR_API_TOKEN', '6281234567890', '6289876543210', touristSpots);
```

### Location with a custom map preview

```javascript
// Static map image URL for a location
function generateMapPreview(latitude, longitude, zoom = 15) {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=400x300&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=YOUR_MAPS_API_KEY`;
}

async function sendLocationWithPreview(token, device, receiver, latitude, longitude, locationName) {
  // 1. The location pin and its name
  const locationResult = await sendNamedLocation(token, device, receiver, latitude, longitude, locationName);

  // 2. A map image (optional)
  const mapUrl = generateMapPreview(latitude, longitude);
  const imageResult = await sendImageMessage(token, device, receiver, mapUrl, '🗺️ Map Preview');

  return { location: locationResult, preview: imageResult };
}
```

## Best practices

### 1. Coordinate validation

```javascript
function validateCoordinates(latitude, longitude) {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    throw new Error('Invalid latitude. Must be between -90 and 90');
  }
  if (isNaN(lng) || lng < -180 || lng > 180) {
    throw new Error('Invalid longitude. Must be between -180 and 180');
  }

  return { latitude: lat, longitude: lng }; // numbers, ready for params.location
}
```

### 2. Location name formatting

Format the text you send after the pin:

```javascript
function formatLocationName(name, address = null, category = null) {
  const categoryEmojis = {
    restaurant: '🍽️',
    hotel: '🏨',
    office: '🏢',
    hospital: '🏥',
    school: '🏫',
    shopping: '🛍️',
    gas_station: '⛽',
    bank: '🏦',
  };

  let formattedName = `${categoryEmojis[category] || '📍'} ${name}`;
  if (address) formattedName += `\n${address}`;
  return formattedName;
}

const locationName = formatLocationName('Central Park Mall', 'Jl. Letjen S. Parman, Jakarta Barat', 'shopping');
// "🛍️ Central Park Mall\nJl. Letjen S. Parman, Jakarta Barat"
```

### 3. Distance calculation

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100; // kilometers, 2 decimals
}

const distance = calculateDistance(-6.2088, 106.8456, -6.1751, 106.865);
console.log(`Distance: ${distance} km`);
```

## Common locations

### Famous landmarks

```javascript
const landmarks = {
  // Indonesia
  monas: { lat: -6.1751, lng: 106.865, name: '🗿 Monas - National Monument' },
  borobudur: { lat: -7.6079, lng: 110.2038, name: '🏛️ Borobudur Temple' },

  // International
  eiffel_tower: { lat: 48.8584, lng: 2.2945, name: '🗼 Eiffel Tower, Paris' },
  statue_liberty: { lat: 40.6892, lng: -74.0445, name: '🗽 Statue of Liberty, NYC' },
  big_ben: { lat: 51.4994, lng: -0.1245, name: '🕰️ Big Ben, London' },
};

await sendNamedLocation(
  'YOUR_API_TOKEN',
  '6281234567890',
  '6289876543210',
  landmarks.monas.lat,
  landmarks.monas.lng,
  landmarks.monas.name,
);
```

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
