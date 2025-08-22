---
sidebar_position: 4
---

# 📍 Send Location Messages

Share precise location coordinates with WhatsApp contacts using the Whatspie API with support for custom location names and interactive maps.

<div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem', borderRadius: '8px', color: 'white', margin: '1.5rem 0'}}>
  <h3 style={{color: 'white', margin: '0 0 1rem 0'}}>🗺️ Interactive Location Sharing</h3>
  <p style={{margin: '0'}}>Send precise GPS coordinates with automatic map preview, custom location names, and one-tap navigation for recipients.</p>
</div>

## 🌐 Endpoint

```
POST https://api.whatspie.com/messages
```

## 🔐 Authentication

Bearer token required with proper JSON content headers.

## 📋 Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `device` | string | ✅ | Your registered WhatsApp device number |
| `receiver` | string | ✅ | Recipient's phone number (international format) |
| `type` | string | ✅ | Message type: `"location"` for location messages |
| `latitude` | number | ✅ | Location latitude coordinate (-90 to 90) |
| `longitude` | number | ✅ | Location longitude coordinate (-180 to 180) |
| `location_name` | string | ❌ | Custom location name/address |
| `simulate_typing` | integer | ❌ | Show typing indicator: `1` (yes) or `0` (no) |

## 🗺️ Coordinate System

Whatspie API uses the **WGS84** coordinate system (same as GPS):

<!-- <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '1.5rem 0'">
  <div style={{background: '#f8f9ff', border: '1px solid #e1e5e9', borderRadius: '8px', padding: '1rem'">
    <h4 style={{color: '#4f46e5', marginTop: '0'">🌍 Latitude</h4>
    <ul style={{margin: '0', fontSize: '0.9rem'}}>
      <li><strong>Range:</strong> -90 to +90</li>
      <li><strong>North:</strong> Positive values</li>
      <li><strong>South:</strong> Negative values</li>
      <li><strong>Example:</strong> 37.7749 (San Francisco)</li>
    </ul>
  </div>
  
  <div style={{background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '8px', padding: '1rem'">
    <h4 style={{color: '#059669', marginTop: '0'">🌏 Longitude</h4>
    <ul style={{margin: '0', fontSize: '0.9rem'}}>
      <li><strong>Range:</strong> -180 to +180</li>
      <li><strong>East:</strong> Positive values</li>
      <li><strong>West:</strong> Negative values</li>
      <li><strong>Example:</strong> -122.4194 (San Francisco)</li>
    </ul>
  </div>
</div> -->

## 🚀 Request Examples

### Basic Location Message

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "location",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "simulate_typing": 1
  }'
```

### Location with Custom Name

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "location",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "location_name": "Monas - National Monument Jakarta",
    "simulate_typing": 1
  }'
```

### Business Location

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210", 
    "type": "location",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "location_name": "🏢 Our Office - 123 Business St, San Francisco, CA",
    "simulate_typing": 1
  }'
```

## 🔥 Code Examples

### Node.js

```javascript
const axios = require('axios');

async function sendLocationMessage(token, device, receiver, latitude, longitude, locationName = null) {
  try {
    const payload = {
      device: device,
      receiver: receiver,
      type: 'location',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      simulate_typing: 1
    };

    // Add location name if provided
    if (locationName) {
      payload.location_name = locationName;
    }

    const response = await axios.post(
      'https://api.whatspie.com/messages',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error sending location:', error.response?.data || error.message);
    throw error;
  }
}

// Usage examples
async function examples() {
  const token = 'YOUR_API_TOKEN';
  const device = '6281234567890';
  const receiver = '6289876543210';

  // Send basic location
  await sendLocationMessage(token, device, receiver, -6.2088, 106.8456);

  // Send location with custom name
  await sendLocationMessage(
    token, 
    device, 
    receiver, 
    37.7749, 
    -122.4194, 
    '🏢 Apple Park - Cupertino, CA'
  );

  // Send restaurant location
  await sendLocationMessage(
    token,
    device,
    receiver,
    40.7580,
    -73.9855,
    '🍕 Tony\'s Pizza - Times Square, NYC'
  );
}
```

### Python

```python
import requests

def send_location_message(token, device, receiver, latitude, longitude, location_name=None):
    url = "https://api.whatspie.com/messages"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    data = {
        'device': device,
        'receiver': receiver,
        'type': 'location',
        'latitude': float(latitude),
        'longitude': float(longitude),
        'simulate_typing': 1
    }
    
    # Add location name if provided
    if location_name:
        data['location_name'] = location_name
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

# Usage examples
try:
    # Send coordinates for meeting point
    result = send_location_message(
        'YOUR_API_TOKEN',
        '6281234567890',
        '6289876543210',
        -6.1751,
        106.8650,
        '📍 Meeting Point - Grand Indonesia Mall'
    )
    print(f"Location sent: {result}")
    
    # Send office location
    result = send_location_message(
        'YOUR_API_TOKEN',
        '6281234567890',
        '6289876543210',
        -6.2088,
        106.8456,
        '🏢 Jakarta Office - Central Business District'
    )
    print(f"Office location sent: {result}")

except requests.RequestException as e:
    print(f"Error: {e}")
```

### PHP

```php
<?php
function sendLocationMessage($token, $device, $receiver, $latitude, $longitude, $locationName = null) {
    $url = 'https://api.whatspie.com/messages';
    
    $data = [
        'device' => $device,
        'receiver' => $receiver,
        'type' => 'location',
        'latitude' => (float)$latitude,
        'longitude' => (float)$longitude,
        'simulate_typing' => 1
    ];
    
    // Add location name if provided
    if ($locationName) {
        $data['location_name'] = $locationName;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLOPT_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    } else {
        throw new Exception("HTTP $httpCode: $response");
    }
}

// Usage examples
try {
    // Send restaurant location
    $result = sendLocationMessage(
        'YOUR_API_TOKEN',
        '6281234567890',
        '6289876543210',
        -6.2088,
        106.8456,
        '🍽️ Best Restaurant in Town - Jakarta'
    );
    echo "Location sent: " . json_encode($result) . "\n";
    
    // Send event location
    $result = sendLocationMessage(
        'YOUR_API_TOKEN',
        '6281234567890',
        '6289876543210',
        -6.1751,
        106.8650,
        '🎪 Tech Conference 2024 - Convention Center'
    );
    echo "Event location sent: " . json_encode($result) . "\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
```

## 📊 Response Format

### Success Response

```json
{
  "code": 200,
  "message": "Location sent successfully",
  "data": {
    "id": "msg_location_12345",
    "status": "pending",
    "type": "location",
    "coordinates": {
      "latitude": -6.2088,
      "longitude": 106.8456
    },
    "location_name": "Monas - National Monument Jakarta",
    "timestamp": "2024-12-20T10:30:00Z"
  }
}
```

### Error Response - Invalid Coordinates

```json
{
  "code": 400,
  "message": "Invalid coordinates",
  "error": "Latitude must be between -90 and 90, longitude must be between -180 and 180"
}
```

## 🌟 Advanced Examples

### Location with Address Lookup

```javascript
// Reverse geocoding to get address from coordinates
async function sendLocationWithAddress(token, device, receiver, latitude, longitude) {
  try {
    // Get address from coordinates (using a geocoding service)
    const address = await reverseGeocode(latitude, longitude);
    
    const locationName = `📍 ${address.name}\n${address.street}, ${address.city}`;
    
    return await sendLocationMessage(
      token,
      device, 
      receiver, 
      latitude, 
      longitude, 
      locationName
    );
  } catch (error) {
    // Fallback to coordinates only if address lookup fails
    return await sendLocationMessage(token, device, receiver, latitude, longitude);
  }
}

// Mock reverse geocoding function
async function reverseGeocode(lat, lng) {
  // In real implementation, use Google Maps API, OpenStreetMap, etc.
  return {
    name: "Business Center",
    street: "Jl. Sudirman No. 123",
    city: "Jakarta"
  };
}
```

### Batch Location Sharing

```javascript
async function sendMultipleLocations(token, device, receiver, locations) {
  const results = [];
  
  for (const location of locations) {
    try {
      const result = await sendLocationMessage(
        token,
        device,
        receiver,
        location.latitude,
        location.longitude,
        location.name
      );
      
      results.push({
        location: location.name,
        success: true,
        messageId: result.data.id
      });
      
      // Delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      results.push({
        location: location.name,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

// Usage
const touristSpots = [
  { name: '🗿 Monas Jakarta', latitude: -6.1751, longitude: 106.8650 },
  { name: '🏛️ National Museum', latitude: -6.1717, longitude: 106.8219 },
  { name: '🌊 Ancol Beach', latitude: -6.1260, longitude: 106.8421 }
];

sendMultipleLocations('YOUR_API_TOKEN', '6281234567890', '6289876543210', touristSpots);
```

### Location with Custom Map Preview

```javascript
// Generate custom map URL for location preview
function generateMapPreview(latitude, longitude, zoom = 15) {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=400x300&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=YOUR_MAPS_API_KEY`;
}

async function sendLocationWithPreview(token, device, receiver, latitude, longitude, locationName) {
  // First send the location
  const locationResult = await sendLocationMessage(
    token, 
    device, 
    receiver, 
    latitude, 
    longitude, 
    locationName
  );
  
  // Then send a map preview image (optional)
  const mapUrl = generateMapPreview(latitude, longitude);
  
  const imageResult = await sendImageMessage(
    token,
    device,
    receiver,
    mapUrl,
    '🗺️ Map Preview'
  );
  
  return {
    location: locationResult,
    preview: imageResult
  };
}
```

## 💡 Best Practices

### 1. Coordinate Validation

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
  
  return { latitude: lat, longitude: lng };
}
```

### 2. Location Name Formatting

```javascript
function formatLocationName(name, address = null, category = null) {
  let formattedName = '';
  
  // Add category emoji
  const categoryEmojis = {
    'restaurant': '🍽️',
    'hotel': '🏨',
    'office': '🏢',
    'hospital': '🏥',
    'school': '🏫',
    'shopping': '🛍️',
    'gas_station': '⛽',
    'bank': '🏦'
  };
  
  if (category && categoryEmojis[category]) {
    formattedName += categoryEmojis[category] + ' ';
  } else {
    formattedName += '📍 ';
  }
  
  formattedName += name;
  
  if (address) {
    formattedName += '\n' + address;
  }
  
  return formattedName;
}

// Usage
const locationName = formatLocationName(
  'Central Park Mall',
  'Jl. Letjen S. Parman, Jakarta Barat',
  'shopping'
);
// Result: "🛍️ Central Park Mall\nJl. Letjen S. Parman, Jakarta Barat"
```

### 3. Distance Calculation

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

// Usage
const distance = calculateDistance(-6.2088, 106.8456, -6.1751, 106.8650);
console.log(`Distance: ${distance} km`);
```

## 🌍 Common Locations

### Famous Landmarks

```javascript
const landmarks = {
  // Indonesia
  monas: { lat: -6.1751, lng: 106.8650, name: '🗿 Monas - National Monument' },
  borobudur: { lat: -7.6079, lng: 110.2038, name: '🏛️ Borobudur Temple' },
  
  // International
  eiffel_tower: { lat: 48.8584, lng: 2.2945, name: '🗼 Eiffel Tower, Paris' },
  statue_liberty: { lat: 40.6892, lng: -74.0445, name: '🗽 Statue of Liberty, NYC' },
  big_ben: { lat: 51.4994, lng: -0.1245, name: '🕰️ Big Ben, London' }
};

// Send landmark location
await sendLocationMessage(
  'YOUR_API_TOKEN',
  '6281234567890', 
  '6289876543210',
  landmarks.monas.lat,
  landmarks.monas.lng,
  landmarks.monas.name
);
```

## ⚠️ Limitations

- **Coordinate precision**: Up to 6 decimal places for accuracy
- **Location name**: Maximum 100 characters
- **Map providers**: Location display depends on recipient's map app
- **Real-time tracking**: Static location only, no live tracking
- **Offline access**: Recipients need internet to view map details

## 🔗 Related Endpoints

- [Send Text Messages](./send-text) - For location descriptions
- [Send Image Messages](./send-image) - For map screenshots
- [Get Message Status](../messages/get-messages) - Check delivery status

## 🗺️ Map Integration Services

For enhanced location features, consider integrating:
- **Google Maps API** - Address lookup and static maps
- **OpenStreetMap** - Open source mapping
- **Mapbox** - Custom map styling
- **Here Maps** - Enterprise mapping solutions

## 📞 Support

Need help with location messaging?
- 📖 [Coordinate Systems Guide](../guides/coordinates)
- 🛠️ [Troubleshooting](../troubleshooting)
- 💬 [Community Forum](https://community.whatspie.com)