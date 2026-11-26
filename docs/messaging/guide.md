---
title: Messaging guide
description: JavaScript helpers, validation, batch sending, retries, and message templates for the send endpoints.
---

# Messaging guide

Code examples for the send endpoints: helpers, checks before sending, sending many messages, retries, and message templates. For the request and response of each endpoint, see its reference page: [text](./send-text.md), [image](./send-image.md), [video](./send-video.md), [file](./send-file.md), and [location](./send-location.md).

:::tip[Start here]
1. Copy the [Text helper](#text-helper) into your project.
2. Send one message with it.
3. Then read [Sending many messages](#sending-many-messages) and [Error handling and retries](#error-handling-and-retries) before you send in bulk.

You don't need the rest of this page to get started.
:::

## Helpers

Each example below uses one of these helpers. They send one message and throw an error with `status` set when the API returns an error.

### Text helper

```javascript
async function sendTextMessage(token, device, receiver, message) {
  const res = await fetch('https://api.whatspie.com/messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ device, receiver, type: 'chat', params: { text: message } }),
  });
  const body = await res.json();
  if (!res.ok) {
    const error = new Error(body.message);
    error.status = res.status;
    throw error;
  }
  return body;
}
```

### Image helper

```javascript
async function sendImageMessage(token, device, receiver, imageUrl, caption) {
  const params = { image: { url: imageUrl } };
  if (caption) params.caption = caption;

  const res = await fetch('https://api.whatspie.com/messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ device, receiver, type: 'image', params }),
  });
  const body = await res.json();
  if (!res.ok) {
    const error = new Error(body.message);
    error.status = res.status;
    throw error;
  }
  return body;
}
```

### Video helper

```javascript
async function sendVideoMessage(token, device, receiver, videoUrl, caption, mimetype = 'video/mp4') {
  const params = { video: { url: videoUrl }, mimetype };
  if (caption) params.caption = caption;

  const res = await fetch('https://api.whatspie.com/messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ device, receiver, type: 'file', params }),
  });
  const body = await res.json();
  if (!res.ok) {
    const error = new Error(body.message);
    error.status = res.status;
    throw error;
  }
  return body;
}
```

### File helper

```javascript
async function sendFileMessage(token, device, receiver, fileUrl, fileName, caption) {
  const params = { document: { url: fileUrl }, fileName };
  if (caption) params.caption = caption;

  const res = await fetch('https://api.whatspie.com/messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ device, receiver, type: 'file', params }),
  });
  const body = await res.json();
  if (!res.ok) {
    const error = new Error(body.message);
    error.status = res.status;
    throw error;
  }
  return body;
}
```

### Location helper

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

## Validate before sending

The API accepts most values without checking them. These checks catch mistakes in your own app before you send.

### Text: Validate phone numbers

Check numbers before you send, so typos fail early instead of reaching the API:

```javascript
function isValidPhoneNumber(phoneNumber) {
  // Country code + number, digits only, no leading zero
  return /^[1-9]\d{10,14}$/.test(phoneNumber);
}

function validateWhatspieRequest(device, receiver, message) {
  if (!isValidPhoneNumber(device)) throw new Error('Invalid device phone number format');
  if (!isValidPhoneNumber(receiver)) throw new Error('Invalid receiver phone number format');
  if (!message) throw new Error('Message is empty');
  return true;
}

try {
  validateWhatspieRequest('6281234567890', '6289876543210', 'Hello World!');
  await sendTextMessage(token, '6281234567890', '6289876543210', 'Hello World!');
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

### Text: Message length

The API does not enforce a maximum length. Long messages are harder to read on a phone, so keep them short. If you want a limit in your own app, check it before sending:

```javascript
function validateMessage(message, maxLength = 4096) {
  if (message.length > maxLength) {
    throw new Error(`Message too long. Maximum ${maxLength} characters allowed.`);
  }
  return true;
}
```

### Image: URL validation

Check the URL before sending, because the API accepts any URL:

```javascript
function isValidImageUrl(url) {
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) return false;

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some((ext) => urlObj.pathname.toLowerCase().endsWith(ext));
  } catch {
    return false;
  }
}

async function sendValidatedImage(token, device, receiver, imageUrl, caption) {
  if (!isValidImageUrl(imageUrl)) throw new Error('Invalid image URL format');
  return sendImageMessage(token, device, receiver, imageUrl, caption);
}
```

### Image: Size

Check the size before sending, so oversized images fail early:

```javascript
async function getImageSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength, 10) : null;
  } catch {
    return null;
  }
}

async function sendOptimizedImage(token, device, receiver, imageUrl, caption) {
  const size = await getImageSize(imageUrl);
  const maxSize = 16 * 1024 * 1024; // 16 MB, WhatsApp's image limit

  if (size && size > maxSize) {
    throw new Error(`Image too large: ${size} bytes. Maximum allowed: ${maxSize} bytes`);
  }
  return sendImageMessage(token, device, receiver, imageUrl, caption);
}
```

### Video: URL validation

Check the URL before sending, because the API accepts any URL:

```javascript
function isValidVideoUrl(url) {
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) return false;

    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv'];
    return videoExtensions.some((ext) => urlObj.pathname.toLowerCase().endsWith(ext));
  } catch {
    return false;
  }
}

async function sendValidatedVideo(token, device, receiver, videoUrl, caption) {
  if (!isValidVideoUrl(videoUrl)) throw new Error('Invalid video URL format');
  return sendVideoMessage(token, device, receiver, videoUrl, caption);
}
```

### Video: Size checker

```javascript
async function getVideoSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength, 10) : null;
  } catch {
    return null;
  }
}

async function sendOptimizedVideo(token, device, receiver, videoUrl, caption) {
  const size = await getVideoSize(videoUrl);
  const maxSize = 64 * 1024 * 1024; // 64 MB, WhatsApp's video limit

  if (size && size > maxSize) {
    throw new Error(`Video too large: ${(size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 64MB`);
  }
  if (size) console.log(`Video size: ${(size / 1024 / 1024).toFixed(2)}MB`);

  return sendVideoMessage(token, device, receiver, videoUrl, caption);
}
```

### Video: Optimization

```javascript
const VIDEO_RECOMMENDATIONS = {
  maxSize: 64 * 1024 * 1024, // 64 MB
  maxDuration: 90, // seconds
  recommendedFormats: ['mp4', 'mov'],
  recommendedCodec: 'H.264',
  recommendedResolution: '1280x720', // 720p
};

async function validateVideoForWhatsApp(videoUrl) {
  const size = await getVideoSize(videoUrl);

  if (size && size > VIDEO_RECOMMENDATIONS.maxSize) {
    return { valid: false, message: 'Video exceeds 64MB limit. Please compress or reduce quality.' };
  }
  return { valid: true, message: 'Video meets WhatsApp requirements' };
}
```

### File: URL validation

Check the URL before sending, because the API accepts any URL:

```javascript
function validateFileUrl(url) {
  let pathname;
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('File URL must use HTTP or HTTPS protocol');
    }
    pathname = urlObj.pathname; // ignores ?query and #hash
  } catch (error) {
    throw new Error(`Invalid file URL: ${error.message}`);
  }

  const allowedExtensions = [
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'txt', 'csv', 'zip', 'rar', '7z', 'tar', 'gz',
    'jpg', 'jpeg', 'png', 'gif', 'mp3', 'mp4', 'avi',
  ];

  const extension = pathname.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    throw new Error(`File type .${extension} is not supported`);
  }

  return true;
}
```

### Location: Coordinate validation

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

## Formatting and content

### Text: Emoji and special characters

Emoji and other Unicode characters are sent as-is:

```javascript
const messages = [
  'Hello! 👋 How are you today?',
  "Thanks for your order! ✅ We'll process it soon.",
  '🎉 Congratulations on your achievement!',
  '❗ Important: Please reply to this message.',
  '🚨 *URGENT NOTICE* 🚨\n\nYour account will expire in 3 days.\n\n✅ Renew now: https://example.com\n💳 Questions? Reply to this message',
];

const token = 'YOUR_API_TOKEN';
const device = '6281234567890';
const receiver = '6289876543210';

for (const [index, msg] of messages.entries()) {
  try {
    const result = await sendTextMessage(token, device, receiver, msg);
    console.log(`Message ${index + 1} queued:`, result.data.id);
  } catch (error) {
    console.error(`Message ${index + 1} failed:`, error.message);
  }
  await new Promise((resolve) => setTimeout(resolve, 1000)); // pause between messages
}
```

### Image: With formatting in the caption

```javascript
async function sendProductImage(token, device, receiver) {
  const caption = `🎉 *NEW PRODUCT ALERT* 🎉

_Premium Wireless Headphones_

✅ Noise Cancellation
✅ 30-hour Battery Life
✅ Fast Charging
✅ Premium Sound Quality

~$299~ *$199* (33% OFF)

Use code: *SAVE100*
Valid until: December 31st

Order now: https://shop.example.com`;

  return sendImageMessage(token, device, receiver, 'https://example.com/headphones.jpg', caption);
}
```

### Video: With formatting in the caption

```javascript
async function sendProductVideo(token, device, receiver) {
  const caption = `🎥 *PRODUCT DEMO* 🎥

_See our new product in action_

✅ Feature 1: Lightning Fast
✅ Feature 2: User Friendly
✅ Feature 3: Secure & Reliable

~$499~ *$399* (20% OFF)

Use code: *VIDEO20*
Valid until: December 31st

Order now: https://shop.example.com`;

  return sendVideoMessage(token, device, receiver, 'https://example.com/videos/product-demo.mp4', caption);
}
```

### File: Descriptions

Put a short description in the caption so the recipient knows what the file is before opening it:

```javascript
function formatFileCaption(fileName, description, fileSize = null) {
  const extension = fileName.split('.').pop().toLowerCase();
  const fileEmojis = {
    pdf: '📄',
    doc: '📝', docx: '📝',
    xls: '📊', xlsx: '📊',
    ppt: '📽️', pptx: '📽️',
    zip: '📦', rar: '📦',
    jpg: '🖼️', png: '🖼️',
    mp3: '🎵', mp4: '🎬',
  };

  let caption = `${fileEmojis[extension] || '📎'} ${fileName}`;
  if (fileSize) caption += ` (${fileSize})`;
  if (description) caption += `\n\n${description}`;
  return caption;
}

const caption = formatFileCaption('quarterly-report.pdf', 'Q3 financial results and market analysis', '3.2MB');
// "📄 quarterly-report.pdf (3.2MB)\n\nQ3 financial results and market analysis"
```

### Location: With address lookup

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

### Location: With a custom map preview

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

### Location: Name formatting

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

### Location: Distance calculation

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

## Sending many messages

The API sends one message per request. Space requests out to avoid WhatsApp blocks.

### Text: Rate limiting

Sending many messages quickly can get your number blocked by WhatsApp. Space your messages out:

```javascript
class MessageSender {
  constructor(token, device, minIntervalMs = 1000) {
    this.token = token;
    this.device = device;
    this.minIntervalMs = minIntervalMs;
    this.lastSent = 0;
  }

  async sendMessage(receiver, message) {
    const wait = this.minIntervalMs - (Date.now() - this.lastSent);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));

    const result = await sendTextMessage(this.token, this.device, receiver, message);
    this.lastSent = Date.now();
    return result;
  }
}
```

### Text: Bulk messaging

The API sends one message per request. To message many recipients, loop with a delay:

```javascript
async function sendBulkMessages(token, device, recipients, message, options = {}) {
  const { delayMs = 2000, onProgress = null, onError = null } = options;
  const results = [];
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i++) {
    const receiver = recipients[i];
    try {
      const result = await sendTextMessage(token, device, receiver, message);
      results.push({ receiver, success: true, messageId: result.data.id, createdAt: result.data.created_at });
      sent++;
      onProgress?.({ sent, failed, total: recipients.length, current: receiver });
    } catch (error) {
      results.push({ receiver, success: false, error: error.message });
      failed++;
      onError?.(receiver, error.message);
    }
    if (i < recipients.length - 1) await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return { results, summary: { sent, failed, total: recipients.length } };
}

const bulkResults = await sendBulkMessages(
  'YOUR_API_TOKEN',
  '6281234567890',
  ['6289876543210', '6287654321098', '6285432109876'],
  '📢 *Important Update*\n\nOur services will be updated tonight from 2-4 AM.\n\nSorry for any inconvenience! 🙏',
  {
    delayMs: 3000,
    onProgress: (p) => console.log(`Progress: ${p.sent}/${p.total} sent (${p.failed} failed)`),
    onError: (receiver, error) => console.warn(`Failed to send to ${receiver}: ${error}`),
  },
);
console.log('Bulk messaging completed:', bulkResults.summary);
```

Personalized messages work the same way, with the text built per contact:

```javascript
async function sendPersonalizedMessages(token, device, contacts) {
  const results = [];
  for (const contact of contacts) {
    const text = `Hi ${contact.name}! 👋\n\nThanks for being a valued customer. Your account status: ${contact.status}\n\nQuestions? Just reply! 💬`;
    try {
      const result = await sendTextMessage(token, device, contact.phone, text);
      results.push({ ...contact, success: true, messageId: result.data.id });
    } catch (error) {
      results.push({ ...contact, success: false, error: error.message });
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return results;
}

const personalizedResults = await sendPersonalizedMessages('YOUR_API_TOKEN', '6281234567890', [
  { name: 'John Doe', phone: '6289876543210', status: 'Active' },
  { name: 'Jane Smith', phone: '6287654321098', status: 'Premium' },
]);
console.log('Personalized messages sent:', personalizedResults);
```

### Image: Batch image sending

```javascript
async function sendImageCatalog(token, device, receiver, products) {
  const results = [];

  for (const product of products) {
    try {
      const caption = `${product.name}\nPrice: $${product.price}\n${product.description}`;
      const result = await sendImageMessage(token, device, receiver, product.imageUrl, caption);
      results.push({ product: product.name, success: true, messageId: result.data.id });
    } catch (error) {
      results.push({ product: product.name, success: false, error: error.message });
    }
    await new Promise((resolve) => setTimeout(resolve, 2000)); // pause between messages
  }

  return results;
}

const products = [
  {
    id: 'p001',
    name: 'Wireless Headphones',
    price: 199,
    description: 'Premium quality with noise cancellation',
    imageUrl: 'https://example.com/headphones.jpg',
  },
  {
    id: 'p002',
    name: 'Smart Watch',
    price: 299,
    description: 'Track your fitness and stay connected',
    imageUrl: 'https://example.com/smartwatch.jpg',
  },
];

const results = await sendImageCatalog('YOUR_API_TOKEN', '6281234567890', '6289876543210', products);
console.log('Catalog sent:', results);
```

### Video: Batch video sending

```javascript
async function sendVideoToMultipleContacts(token, device, videoUrl, caption, contacts) {
  const results = [];

  for (const contact of contacts) {
    try {
      const result = await sendVideoMessage(token, device, contact.phone, videoUrl, caption);
      results.push({ contact: contact.name, success: true, messageId: result.data.id });
    } catch (error) {
      results.push({ contact: contact.name, success: false, error: error.message });
    }
    await new Promise((resolve) => setTimeout(resolve, 3000)); // pause between messages
  }

  return results;
}

const contacts = [
  { name: 'John Doe', phone: '6289876543210' },
  { name: 'Jane Smith', phone: '6281122334455' },
];

const results = await sendVideoToMultipleContacts(
  'YOUR_API_TOKEN',
  '6281234567890',
  'https://example.com/videos/announcement.mp4',
  '🎉 Important company announcement! Please watch. 🎥',
  contacts,
);
console.log('Videos sent:', results);
```

### File: Batch file sending

```javascript
async function sendMultipleFiles(token, device, receiver, files, delayMs = 2000) {
  const results = [];

  for (const file of files) {
    try {
      const result = await sendFileMessage(token, device, receiver, file.url, file.name, file.caption);
      results.push({ file: file.name, success: true, messageId: result.data.id });
    } catch (error) {
      results.push({ file: file.name, success: false, error: error.message });
    }
    if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs)); // pause between files
  }

  return results;
}

const files = [
  {
    name: 'contract.pdf',
    url: 'https://docs.example.com/contract.pdf',
    caption: '📋 Service Contract\n\nPlease review and sign.',
  },
  {
    name: 'invoice.pdf',
    url: 'https://billing.example.com/invoice.pdf',
    caption: '💳 Invoice #12345\n\nPayment due: Dec 30, 2024',
  },
];

const results = await sendMultipleFiles('YOUR_API_TOKEN', '6281234567890', '6289876543210', files);
console.log('Batch send results:', results);
```

### Location: Batch location sharing

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

## Error handling and retries

Retry only errors that can succeed on a second try. `400` and `403` fail the same way every time.

### Text: Error handling

Retry only errors that can succeed on a second try. Authentication and request errors fail the same way every time:

```javascript
async function sendMessageWithRetry(token, device, receiver, message, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendTextMessage(token, device, receiver, message);
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);

      // 400 and 403 will not succeed on retry
      if (error.status === 400 || error.status === 403) throw error;
      if (attempt === maxRetries) throw error;

      // Exponential backoff: 2 s, 4 s, ...
      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
    }
  }
}

function describeError(error) {
  switch (error.status) {
    case 400:
      return `Bad request: ${error.message}`;
    case 403:
      return `Forbidden: ${error.message}. Check your token, device, and quota.`;
    case 500:
      return 'Server error: please try again later';
    default:
      return error.status ? `HTTP ${error.status}: ${error.message}` : `Network error: ${error.message}`;
  }
}

try {
  const result = await sendMessageWithRetry(
    'YOUR_API_TOKEN',
    '6281234567890',
    '6289876543210',
    'Hello with error handling!',
  );
  console.log('Message queued:', result.data.id);
} catch (error) {
  console.error('Failed to send message:', describeError(error));
}
```

### Image: Error handling and retries

Retry only errors that can succeed on a second try:

```javascript
async function sendImageWithRetry(token, device, receiver, imageUrl, caption, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendImageMessage(token, device, receiver, imageUrl, caption);
    } catch (error) {
      // 400 and 403 will not succeed on retry
      if (error.status === 400 || error.status === 403) throw error;
      if (attempt === maxRetries) throw error;

      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
    }
  }
}
```

### Video: Error handling and retries

Retry only errors that can succeed on a second try:

```javascript
async function sendVideoWithRetry(token, device, receiver, videoUrl, caption, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendVideoMessage(token, device, receiver, videoUrl, caption);
    } catch (error) {
      // 400 and 403 will not succeed on retry
      if (error.status === 400 || error.status === 403) throw error;
      if (attempt === maxRetries) throw error;

      const delay = 2 ** attempt * 1000;
      console.log(`Retry attempt ${attempt} after ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
```

## Hosting media files

Images, videos, and files are sent from a public URL. These examples show how to host them.

### Image: Sending an image from your own server

The API needs a public URL. To send a local file, upload it to your own storage or CDN first, then send its URL:

```javascript
// Pseudo-code: replace uploadImageToCDN with your storage provider's upload call
async function uploadImageToCDN(filePath) {
  const formData = new FormData();
  formData.append('file', new Blob([await fs.promises.readFile(filePath)]));

  const response = await fetch('https://your-cdn.com/upload', { method: 'POST', body: formData });
  const { url } = await response.json();
  return url; // public URL
}

async function sendLocalImage(token, device, receiver, localFilePath, caption) {
  const publicUrl = await uploadImageToCDN(localFilePath);
  return sendImageMessage(token, device, receiver, publicUrl, caption);
}
```

### Image: CDN usage

Host images on a reliable CDN, so WhatsApp can always download them:

```javascript
const CDN_BASE_URL = 'https://your-cdn.com/images/';

async function sendCDNImage(token, device, receiver, fileName, caption) {
  return sendImageMessage(token, device, receiver, `${CDN_BASE_URL}${fileName}`, caption);
}
```

### Video: CDN usage

Host videos on a reliable CDN, so WhatsApp can always download them:

```javascript
const CDN_BASE_URL = 'https://your-cdn.com/videos/';

async function sendCDNVideo(token, device, receiver, fileName, caption) {
  return sendVideoMessage(token, device, receiver, `${CDN_BASE_URL}${fileName}`, caption);
}
```

## Use cases

Message templates you can adapt.

### Text: Customer support

```javascript
const supportMsg = `👋 Hi! Thanks for contacting support.

🔍 *Issue*: ${customerIssue}
🎟️ *Ticket*: #${ticketNumber}
⏱️ *Response Time*: Within 2 hours

📞 Urgent? Call: +1-800-SUPPORT
💬 Questions? Just reply here!

_We're here to help!_ ✨`;
```

### Text: Marketing campaigns

```javascript
const campaignMsg = `🎉 *FLASH SALE ALERT* 🎉

⚡ *50% OFF* Everything!
⏰ Today only: ${new Date().toLocaleDateString()}
🛍️ Shop now: ${shopUrl}

💰 Use code: *FLASH50*
🚚 Free shipping on orders $75+

*Limited time offer!* ⏳`;
```

### Text: Appointment reminders

```javascript
const reminderMsg = `📅 *Appointment Reminder*

👤 *Patient*: ${patientName}
🏥 *Doctor*: Dr. ${doctorName}
📅 *Date*: ${appointmentDate}
⏰ *Time*: ${appointmentTime}
📍 *Location*: ${clinicAddress}

✅ Reply *CONFIRM* to confirm
❌ Reply *CANCEL* to reschedule

📞 Questions? Call: ${clinicPhone}`;
```

### Image: E-commerce product images

```javascript
async function sendProductUpdate(token, device, customerPhone, product) {
  const caption = `🛍️ *${product.name}*

💰 Price: $${product.price}
📦 Stock: ${product.stock > 0 ? 'Available' : 'Out of Stock'}
⭐ Rating: ${product.rating}/5

${product.description}

🛒 Order: ${product.orderUrl}`;

  return sendImageMessage(token, device, customerPhone, product.imageUrl, caption);
}
```

### Image: Event invitations

```javascript
async function sendEventInvitation(token, device, guestPhone, event) {
  const caption = `🎉 You're Invited! 🎉

*${event.title}*

📅 Date: ${event.date}
⏰ Time: ${event.time}
📍 Venue: ${event.venue}

${event.description}

RSVP: ${event.rsvpUrl}`;

  return sendImageMessage(token, device, guestPhone, event.bannerUrl, caption);
}
```

### Video: Training videos

```javascript
async function sendTrainingVideo(token, device, employeePhone, training) {
  const caption = `📚 *Training Module: ${training.title}*

⏱️ Duration: ${training.duration} minutes
📋 Category: ${training.category}
⭐ Level: ${training.level}

${training.description}

📝 Please watch and complete the quiz at: ${training.quizUrl}`;

  return sendVideoMessage(token, device, employeePhone, training.videoUrl, caption);
}
```

### Video: Product demonstrations

```javascript
async function sendProductDemo(token, device, customerPhone, product) {
  const caption = `🎥 *${product.name} - Live Demo*

💡 See how it works in action!

✨ Key Features:
${product.features.map((f) => `• ${f}`).join('\n')}

💰 Special Price: $${product.price}
📦 In Stock: ${product.inStock ? 'Yes' : 'No'}

🛒 Order Now: ${product.orderUrl}`;

  return sendVideoMessage(token, device, customerPhone, product.demoVideoUrl, caption);
}
```

### Video: Event highlights

```javascript
async function sendEventHighlights(token, device, attendeePhone, event) {
  const caption = `🎉 *${event.title} - Highlights*

📅 ${event.date}
📍 ${event.venue}

Thank you for attending! Here are the best moments captured.

📸 Full gallery: ${event.galleryUrl}`;

  return sendVideoMessage(token, device, attendeePhone, event.highlightVideoUrl, caption);
}
```

### Location: Famous landmarks

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
