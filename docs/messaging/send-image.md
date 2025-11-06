---
sidebar_position: 2
---

# 🖼️ Send Image Messages

Send stunning images with captions to WhatsApp contacts using the enhanced Whatspie API with support for various formats and advanced delivery options.

<div style={{background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>📸 Rich Media Support</h3>
  <p style={{margin: "0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>Upload images directly from URLs with automatic optimization, caption support, and typing simulation for a natural conversation experience.</p>
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
| `type` | string | ✅ | Message type: `"image"` for image messages |
| `params` | object | ✅ | Message parameters containing image data |
| `params.image` | object | ✅ | Image object with URL |
| `params.image.url` | string | ✅ | Direct URL to the image file |
| `params.caption` | string | ❌ | Image caption text (supports formatting) |
| `params.viewOnce` | boolean | ❌ | Whether image should be viewable only once |
| `simulate_typing` | integer | ❌ | Show typing indicator: `1` (yes) or `0` (no) |

## 🎨 Supported Image Formats

<div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", margin: "1.5rem 0"}}>
  <div style={{background: "#f8f9ff", border: "1px solid #e1e5e9", borderRadius: "6px", padding: "1rem", textAlign: "center"}}>
    <strong style={{color: "#4f46e5"}}>📷 JPEG/JPG</strong><br/>
    <small>Most compatible format</small>
  </div>
  <div style={{background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "6px", padding: "1rem", textAlign: "center"}}>
    <strong style={{color: "#059669"}}>🖼️ PNG</strong><br/>
    <small>Transparency support</small>
  </div>
  <div style={{background: "#fef3c7", border: "1px solid #fed7aa", borderRadius: "6px", padding: "1rem", textAlign: "center"}}>
    <strong style={{color: "#d97706"}}>🎞️ GIF</strong><br/>
    <small>Animated images</small>
  </div>
  <div style={{background: "#fdf2f8", border: "1px solid #fce7f3", borderRadius: "6px", padding: "1rem", textAlign: "center"}}>
    <strong style={{color: "#be185d"}}>🚀 WebP</strong><br/>
    <small>Modern format</small>
  </div>
</div>

## 📏 Image Requirements

- **Maximum file size**: 16MB
- **Recommended dimensions**: Up to 1600x1600 pixels  
- **File accessibility**: Must be publicly accessible via direct URL
- **Upload time**: Images are automatically optimized for WhatsApp

## 🚀 Request Examples

### Basic Image Message

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "image",
    "params": {
      "image": {
        "url": "https://example.com/images/photo.jpg"
      },
      "caption": "Check out this amazing photo! 📸✨"
    },
    "simulate_typing": 1
  }'
```

### Image with Rich Caption

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890", 
    "receiver": "6289876543210",
    "type": "image",
    "params": {
      "image": {
        "url": "https://example.com/products/headphones.jpg"
      },
      "caption": "🎉 *NEW PRODUCT ALERT* 🎉\n\n_Premium Quality Headphones_\n\n✅ Noise Cancellation\n✅ 30h Battery Life\n✅ Fast Charging\n\n*Special Price: $199*\n~~Original: $299~~"
    },
    "simulate_typing": 1
  }'
```

### Image Without Caption

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "image",
    "params": {
      "image": {
        "url": "https://example.com/images/screenshot.png"
      }
    },
    "simulate_typing": 1
  }'
```


## 📊 Response Format

### Success Response

```json
{
  "code": 200,
  "message": "Image sent successfully",
  "data": {
    "id": "msg_image_12345",
    "status": "pending",
    "type": "image",
    "device": "6281234567890",
    "receiver": "6289876543210",
    "file_url": "https://example.com/images/photo.jpg",
    "message": "Check out this amazing photo! 📸✨",
    "simulate_typing": 1,
    "timestamp": "2024-12-20T10:30:00Z"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique message identifier |
| `status` | string | Message status (`pending`, `sent`, `delivered`, `failed`) |
| `type` | string | Message type (`image`) |
| `device` | string | Sender device number |
| `receiver` | string | Recipient's phone number |
| `file_url` | string | URL of the sent image |
| `message` | string | Image caption (if provided) |
| `simulate_typing` | integer | Typing simulation setting (1 or 0) |
| `timestamp` | string | Message sent timestamp (ISO 8601) |

## Error Responses

### Invalid Image URL

```json
{
  "code": 400,
  "message": "Invalid image URL",
  "error": "The provided image URL is not accessible or invalid"
}
```

### Unsupported Image Format

```json
{
  "code": 400,
  "message": "Unsupported file format",
  "error": "Only JPEG, PNG, GIF, and WebP images are supported"
}
```

### Image Too Large

```json
{
  "code": 400,
  "message": "File too large",
  "error": "Image size exceeds 16MB limit"
}
```

### URL Not Accessible

```json
{
  "code": 400,
  "message": "Unable to download image",
  "error": "The image URL is not publicly accessible"
}
```

## Advanced Examples

### Image with Formatting in Caption

```javascript
async function sendProductImage() {
  const caption = `🎉 *NEW PRODUCT ALERT* 🎉

_Premium Wireless Headphones_

✅ Noise Cancellation
✅ 30-hour Battery Life  
✅ Fast Charging
✅ Premium Sound Quality

~~$299~~ *$199* (33% OFF)

Use code: *SAVE100*
Valid until: December 31st

Order now: https://shop.example.com`;

  await sendImageMessage(
    'YOUR_JWT_TOKEN',
    '1234567890',
    'https://example.com/headphones.jpg',
    caption,
    'headphones-promo.jpg'
  );
}
```

### Batch Image Sending

```javascript
async function sendImageCatalog(token, phoneNumber, products) {
  const results = [];
  
  for (const product of products) {
    try {
      const caption = `${product.name}\nPrice: $${product.price}\n${product.description}`;
      
      const result = await sendImageMessage(
        token,
        phoneNumber,
        product.imageUrl,
        caption,
        `${product.id}.jpg`
      );
      
      results.push({ 
        product: product.name, 
        success: true, 
        messageId: result.data.id 
      });
      
      // Delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      results.push({ 
        product: product.name, 
        success: false, 
        error: error.message 
      });
    }
  }
  
  return results;
}

// Usage
const products = [
  {
    id: 'p001',
    name: 'Wireless Headphones',
    price: 199,
    description: 'Premium quality with noise cancellation',
    imageUrl: 'https://example.com/headphones.jpg'
  },
  {
    id: 'p002',
    name: 'Smart Watch',
    price: 299,
    description: 'Track your fitness and stay connected',
    imageUrl: 'https://example.com/smartwatch.jpg'
  }
];

const results = await sendImageCatalog('YOUR_JWT_TOKEN', '1234567890', products);
console.log('Catalog sent:', results);
```

### Image URL Validation

```javascript
function isValidImageUrl(url) {
  try {
    const urlObj = new URL(url);
    
    // Check if it's HTTP/HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Check for common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasImageExtension = imageExtensions.some(ext => 
      urlObj.pathname.toLowerCase().includes(ext)
    );
    
    return hasImageExtension;
  } catch {
    return false;
  }
}

async function sendValidatedImage(token, phoneNumber, imageUrl, caption) {
  if (!isValidImageUrl(imageUrl)) {
    throw new Error('Invalid image URL format');
  }
  
  return await sendImageMessage(token, phoneNumber, imageUrl, caption);
}
```

### Download and Upload Helper

If you need to upload images from your local server:

```javascript
const fs = require('fs');
const FormData = require('form-data');

// Example function to upload image to your CDN/storage
async function uploadImageToCDN(filePath) {
  // This is pseudo-code - implement according to your storage solution
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  
  const response = await axios.post('https://your-cdn.com/upload', formData, {
    headers: formData.getHeaders()
  });
  
  return response.data.url; // Returns public URL
}

// Send local image
async function sendLocalImage(token, phoneNumber, localFilePath, caption) {
  try {
    // Upload to CDN first
    const publicUrl = await uploadImageToCDN(localFilePath);
    
    // Send via WhatsApp
    return await sendImageMessage(token, phoneNumber, publicUrl, caption);
  } catch (error) {
    console.error('Error sending local image:', error);
    throw error;
  }
}
```

## Best Practices

### 1. Image Optimization

```javascript
// Check image size before sending
async function getImageSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength) : null;
  } catch {
    return null;
  }
}

async function sendOptimizedImage(token, phoneNumber, imageUrl, caption) {
  const size = await getImageSize(imageUrl);
  const maxSize = 16 * 1024 * 1024; // 16MB
  
  if (size && size > maxSize) {
    throw new Error(`Image too large: ${size} bytes. Maximum allowed: ${maxSize} bytes`);
  }
  
  return await sendImageMessage(token, phoneNumber, imageUrl, caption);
}
```

### 2. CDN Usage

Use a reliable CDN for hosting images:

```javascript
const CDN_BASE_URL = 'https://your-cdn.com/images/';

function getCDNImageUrl(fileName) {
  return `${CDN_BASE_URL}${fileName}`;
}

async function sendCDNImage(token, phoneNumber, fileName, caption) {
  const imageUrl = getCDNImageUrl(fileName);
  return await sendImageMessage(token, phoneNumber, imageUrl, caption);
}
```

### 3. Error Handling and Retries

```javascript
async function sendImageWithRetry(token, phoneNumber, imageUrl, caption, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendImageMessage(token, phoneNumber, imageUrl, caption);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.includes('URL')) {
        // Don't retry URL-related errors
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## Common Use Cases

### E-commerce Product Images

```javascript
async function sendProductUpdate(token, customerPhone, product) {
  const caption = `🛍️ *${product.name}*
  
💰 Price: $${product.price}
📦 Stock: ${product.stock > 0 ? 'Available' : 'Out of Stock'}
⭐ Rating: ${product.rating}/5

${product.description}

🛒 Order: ${product.orderUrl}`;

  return await sendImageMessage(
    token,
    customerPhone,
    product.imageUrl,
    caption,
    `${product.sku}.jpg`
  );
}
```

### Event Invitations

```javascript
async function sendEventInvitation(token, guestPhone, event) {
  const caption = `🎉 You're Invited! 🎉

*${event.title}*

📅 Date: ${event.date}
⏰ Time: ${event.time}
📍 Venue: ${event.venue}

${event.description}

RSVP: ${event.rsvpUrl}`;

  return await sendImageMessage(
    token,
    guestPhone,
    event.bannerUrl,
    caption,
    'event-invitation.jpg'
  );
}
```

## Limitations

- **File size**: Maximum 16MB per image
- **Formats**: JPEG, PNG, GIF, WebP only
- **URL accessibility**: Images must be publicly accessible
- **Rate limits**: Follow WhatsApp's messaging limits

## Next Steps

- Learn about [sending text messages](./send-text) to contacts
- Explore [contact verification](../contacts/check-contacts) before sending
- Check out [group management](../groups/create-group) for group messaging