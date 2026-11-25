---
title: Send image message
description: Send an image from a public URL, with an optional caption, with POST /messages.
---

# Send image message

Send an image from a public URL to a phone number, with an optional caption. The caption supports WhatsApp formatting.

## Endpoint

```
POST https://api.whatspie.com/messages
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Phone number of your sending device, as registered in Whatspie. |
| `receiver` | string | Yes | Recipient's phone number. Up to 35 characters. |
| `type` | string | Yes | `image`. |
| `params` | object | Yes | Message content. |
| `params.image.url` | string | Yes | Direct, public URL of the image file. |
| `params.caption` | string | No | Caption shown under the image. Supports [WhatsApp formatting](./send-text.md#text-formatting). |

Write phone numbers in international format without `+`. See [Phone number format](./send-text.md#phone-number-format).

`params` accepts only these keys: `text`, `caption`, `fileName`, `mimetype`, `location`, `image`, `document`, `video`. Any other key, such as `viewOnce`, is rejected with `400`.

The older format, with the image URL in a top-level `file_url` field and the caption in a top-level `message` field, is still accepted for backward compatibility. New integrations should use `params`.

## Examples

### Basic image message

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "image",
    "params": {
      "image": {
        "url": "https://example.com/images/photo.jpg"
      },
      "caption": "Check out this amazing photo! 📸✨"
    }
  }'
```

### Image with a formatted caption

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "image",
    "params": {
      "image": {
        "url": "https://example.com/products/headphones.jpg"
      },
      "caption": "🎉 *NEW PRODUCT ALERT* 🎉\n\n_Premium Quality Headphones_\n\n✅ Noise Cancellation\n✅ 30h Battery Life\n✅ Fast Charging\n\n*Special Price: $199*\n~Original: $299~"
    }
  }'
```

### Image without a caption

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "image",
    "params": {
      "image": {
        "url": "https://example.com/images/screenshot.png"
      }
    }
  }'
```

## Image requirements

The API does not download or check the image when it accepts your request. WhatsApp applies its own limits when the image is delivered:

| Format | Notes |
|---|---|
| JPEG / JPG | Most compatible format. |
| PNG | Supports transparency. |
| GIF | Animated images. |
| WebP | Modern format. |

- **Maximum file size:** 16 MB.
- **Recommended dimensions:** up to 1600 × 1600 pixels.
- **Accessibility:** the URL must be public and point directly to the image file, not to a web page or a login-protected link.
- **Processing:** WhatsApp may compress the image when it is delivered.

## Response

A successful request returns HTTP `200` with the queued message. The fields are the same as for [text messages](./send-text.md#response-fields). For an image sent with `params`:

- `body` holds the caption, or an empty string without one.
- `params` holds the image URL and caption.
- `file_url`, `file_name`, and `file_mime` are `null`. They are filled only when you use the older top-level `file_url` format.

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "id": 36259783,
    "device_id": 12,
    "from_number": "6281234567890",
    "to_number": "6289876543210",
    "type": "image",
    "msg_type": "outgoing",
    "body": "Check out this amazing photo! 📸✨",
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
      "caption": "Check out this amazing photo! 📸✨",
      "image": { "url": "https://example.com/images/photo.jpg" }
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
  "message": "Invalid message params: unknown parameter 'viewOnce'. Allowed parameters: text, caption, fileName, mimetype, location, image, document"
}
```

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid message params: ...` | `params` contains a key that is not allowed, or `image` is not an object with only `url`. |
| `400` | `File URL is required for image type` | The request has neither `params` nor a legacy `file_url` field. |
| `400` | `Invalid request body: ...` | The body is not valid JSON, or `device`, `receiver`, or `type` is missing. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `403` | `Device not found or access denied` | `device` is not a device on your account. |
| `403` | Quota or subscription message | Your package has no messages left. |
| `500` | Error description | Internal error, for example the message could not be saved. Try again later. |

Problems with the image itself, such as a dead link, a private URL, a file that is too large, or an unsupported format, do not cause an error response because the API accepts the request first and sends it in the background. The same goes for sending failures, such as a disconnected device or a number that is not on WhatsApp. They show up later as status `ERROR` with a `failed_reason`. Check them with [Get message](./get-message.md); see [Status values](./get-message.md#status-values).

## Advanced examples

The JavaScript examples on this page use this helper:

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

### Image with formatting in the caption

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

### Batch image sending

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

### Image URL validation

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

### Sending an image from your own server

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

## Best practices

### 1. Image size

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

### 2. CDN usage

Host images on a reliable CDN, so WhatsApp can always download them:

```javascript
const CDN_BASE_URL = 'https://your-cdn.com/images/';

async function sendCDNImage(token, device, receiver, fileName, caption) {
  return sendImageMessage(token, device, receiver, `${CDN_BASE_URL}${fileName}`, caption);
}
```

### 3. Error handling and retries

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

## Use cases

### E-commerce product images

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

### Event invitations

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

## Limitations

- **File size:** up to 16 MB per image (WhatsApp limit).
- **Formats:** JPEG, PNG, GIF, WebP (WhatsApp limit).
- **URL:** must be public and direct. The API does not check it; see [Errors](#errors).
- **Sending rate:** space out your messages to avoid WhatsApp blocks.

## Next steps

- [Send text messages](./send-text.md) to contacts
- [Check contacts](../contacts/check-contacts.md) before sending
- [Send images to a group](../groups/send-group-messages.md)
