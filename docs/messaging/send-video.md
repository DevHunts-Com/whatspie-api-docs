---
sidebar_position: 3
---

# 🎥 Send Video Messages

Send engaging video messages with captions to WhatsApp contacts using the enhanced Whatspie API with support for various formats and advanced delivery options.

<div style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>🎬 Video Content Support</h3>
  <p style={{margin: "0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>Upload videos directly from URLs with automatic optimization, caption support, and typing simulation for a natural conversation experience.</p>
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
| `type` | string | ✅ | Message type: `"file"` for video messages |
| `params` | object | ✅ | Message parameters containing video data |
| `params.video` | object | ✅ | video object with video URL |
| `params.video.url` | string | ✅ | Direct URL to the video file |
| `params.mimetype` | string | ✅ | Video MIME type (e.g., "video/mp4") |
| `params.caption` | string | ❌ | Video caption text (supports formatting) |
| `params.viewOnce` | boolean | ❌ | Whether video should be viewable only once |
| `simulate_typing` | integer | ❌ | Show typing indicator: `1` (yes) or `0` (no) |

## 🎨 Supported Video Formats

<div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", margin: "1.5rem 0"}}>
  <div style={{background: "#f8f9ff", border: "1px solid #e1e5e9", borderRadius: "6px", padding: "1rem", textAlign: "center"}}>
    <strong style={{color: "#4f46e5"}}>🎬 MP4</strong><br/>
    <small>Most compatible format</small>
  </div>
  <div style={{background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "6px", padding: "1rem", textAlign: "center"}}>
    <strong style={{color: "#059669"}}>📹 MOV</strong><br/>
    <small>Apple QuickTime</small>
  </div>
  <div style={{background: "#fef3c7", border: "1px solid #fed7aa", borderRadius: "6px", padding: "1rem", textAlign: "center"}}>
    <strong style={{color: "#d97706"}}>🎞️ AVI</strong><br/>
    <small>Windows format</small>
  </div>
  <div style={{background: "#fdf2f8", border: "1px solid #fce7f3", borderRadius: "6px", padding: "1rem", textAlign: "center"}}>
    <strong style={{color: "#be185d"}}>🚀 WebM</strong><br/>
    <small>Modern web format</small>
  </div>
</div>

## 📝 Common Video MIME Types

| Format | MIME Type | Extension |
|--------|-----------|-----------|
| MP4 | `video/mp4` | .mp4 |
| MOV | `video/quicktime` | .mov |
| AVI | `video/x-msvideo` | .avi |
| WebM | `video/webm` | .webm |
| MKV | `video/x-matroska` | .mkv |

## 📏 Video Requirements

- **Maximum file size**: 64MB
- **Recommended duration**: Up to 90 seconds for optimal delivery
- **File accessibility**: Must be publicly accessible via direct URL
- **Upload time**: Videos are automatically optimized for WhatsApp

## 🚀 Request Examples

### Basic Video Message

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "file",
    "params": {
      "video": {
        "url": "https://example.com/videos/demo.mp4"
      },
      "mimetype": "video/mp4",
      "caption": "Check out this amazing video! 🎥✨"
    },
    "simulate_typing": 1
  }'
```

### Video with Rich Caption

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "file",
    "params": {
      "video": {
        "url": "https://example.com/videos/product-demo.mp4"
      },
      "mimetype": "video/mp4",
      "caption": "🎉 *NEW PRODUCT DEMO* 🎉\n\n_Watch our latest innovation in action_\n\n✅ Easy to Use\n✅ Powerful Features\n✅ Lightning Fast\n\n*Available Now!*\n\nOrder today: https://shop.example.com"
    },
    "simulate_typing": 1
  }'
```

### Video Without Caption

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "file",
    "params": {
      "video": {
        "url": "https://example.com/videos/tutorial.mp4"
      },
      "mimetype": "video/mp4"
    },
    "simulate_typing": 1
  }'
```

## 📊 Response Format

### Success Response

```json
{
  "code": 200,
  "message": "Video sent successfully",
  "data": {
    "id": "msg_video_12345",
    "status": "pending",
    "type": "file",
    "device": "6281234567890",
    "receiver": "6289876543210",
    "file_url": "https://example.com/videos/demo.mp4",
    "message": "Check out this amazing video! 🎥✨",
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
| `type` | string | Message type (`file`) |
| `device` | string | Sender device number |
| `receiver` | string | Recipient's phone number |
| `file_url` | string | URL of the sent video |
| `message` | string | Video caption (if provided) |
| `simulate_typing` | integer | Typing simulation setting (1 or 0) |
| `timestamp` | string | Message sent timestamp (ISO 8601) |

## Error Responses

### Invalid Video URL

```json
{
  "code": 400,
  "message": "Invalid video URL",
  "error": "The provided video URL is not accessible or invalid"
}
```

### Unsupported Video Format

```json
{
  "code": 400,
  "message": "Unsupported file format",
  "error": "Only MP4, MOV, AVI, and WebM videos are supported"
}
```

### Video Too Large

```json
{
  "code": 400,
  "message": "File too large",
  "error": "Video size exceeds 64MB limit"
}
```

### URL Not Accessible

```json
{
  "code": 400,
  "message": "Unable to download video",
  "error": "The video URL is not publicly accessible"
}
```

## Advanced Examples

### Video with Formatting in Caption

```javascript
async function sendProductVideo() {
  const caption = `🎥 *PRODUCT DEMO* 🎥

_See our new product in action_

✅ Feature 1: Lightning Fast
✅ Feature 2: User Friendly
✅ Feature 3: Secure & Reliable

~~$499~~ *$399* (20% OFF)

Use code: *VIDEO20*
Valid until: December 31st

Order now: https://shop.example.com`;

  const response = await fetch('https://api.whatspie.com/messages', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      device: '6281234567890',
      receiver: '6289876543210',
      type: 'file',
      params: {
        video: {
          url: 'https://example.com/videos/product-demo.mp4'
        },
        mimetype: 'video/mp4',
        caption: caption
      },
      simulate_typing: 1
    })
  });

  return await response.json();
}
```

### Batch Video Sending

```javascript
async function sendVideoToMultipleContacts(videoUrl, caption, contacts) {
  const results = [];

  for (const contact of contacts) {
    try {
      const response = await fetch('https://api.whatspie.com/messages', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_TOKEN',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          device: '6281234567890',
          receiver: contact.phone,
          type: 'file',
          params: {
            video: {
              url: videoUrl
            },
            mimetype: 'video/mp4',
            caption: caption
          },
          simulate_typing: 1
        })
      });

      const result = await response.json();
      results.push({
        contact: contact.name,
        success: true,
        messageId: result.data.id
      });

      // Delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error) {
      results.push({
        contact: contact.name,
        success: false,
        error: error.message
      });
    }
  }

  return results;
}

// Usage
const contacts = [
  { name: 'John Doe', phone: '6289876543210' },
  { name: 'Jane Smith', phone: '6281122334455' }
];

const results = await sendVideoToMultipleContacts(
  'https://example.com/videos/announcement.mp4',
  '🎉 Important company announcement! Please watch. 🎥',
  contacts
);
console.log('Videos sent:', results);
```

### Video URL Validation

```javascript
function isValidVideoUrl(url) {
  try {
    const urlObj = new URL(url);

    // Check if it's HTTP/HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // Check for common video extensions
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv'];
    const hasVideoExtension = videoExtensions.some(ext =>
      urlObj.pathname.toLowerCase().includes(ext)
    );

    return hasVideoExtension;
  } catch {
    return false;
  }
}

async function sendValidatedVideo(token, receiver, videoUrl, caption) {
  if (!isValidVideoUrl(videoUrl)) {
    throw new Error('Invalid video URL format');
  }

  const response = await fetch('https://api.whatspie.com/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      device: '6281234567890',
      receiver: receiver,
      type: 'file',
      params: {
        video: {
          url: videoUrl
        },
        mimetype: 'video/mp4',
        caption: caption
      },
      simulate_typing: 1
    })
  });

  return await response.json();
}
```

### Video Size Checker

```javascript
// Check video size before sending
async function getVideoSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength) : null;
  } catch {
    return null;
  }
}

async function sendOptimizedVideo(token, receiver, videoUrl, caption) {
  const size = await getVideoSize(videoUrl);
  const maxSize = 64 * 1024 * 1024; // 64MB

  if (size && size > maxSize) {
    throw new Error(`Video too large: ${(size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 64MB`);
  }

  console.log(`Video size: ${(size / 1024 / 1024).toFixed(2)}MB`);

  const response = await fetch('https://api.whatspie.com/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      device: '6281234567890',
      receiver: receiver,
      type: 'file',
      params: {
        video: {
          url: videoUrl
        },
        mimetype: 'video/mp4',
        caption: caption
      },
      simulate_typing: 1
    })
  });

  return await response.json();
}
```

## Best Practices

### 1. Video Optimization

```javascript
// Recommend optimal video settings
const VIDEO_RECOMMENDATIONS = {
  maxSize: 64 * 1024 * 1024, // 64MB
  maxDuration: 90, // seconds
  recommendedFormats: ['mp4', 'mov'],
  recommendedCodec: 'H.264',
  recommendedResolution: '1280x720' // 720p
};

async function validateVideoForWhatsApp(videoUrl) {
  const size = await getVideoSize(videoUrl);

  if (size > VIDEO_RECOMMENDATIONS.maxSize) {
    return {
      valid: false,
      message: 'Video exceeds 64MB limit. Please compress or reduce quality.'
    };
  }

  return {
    valid: true,
    message: 'Video meets WhatsApp requirements'
  };
}
```

### 2. CDN Usage

Use a reliable CDN for hosting videos:

```javascript
const CDN_BASE_URL = 'https://your-cdn.com/videos/';

function getCDNVideoUrl(fileName) {
  return `${CDN_BASE_URL}${fileName}`;
}

async function sendCDNVideo(token, receiver, fileName, caption) {
  const videoUrl = getCDNVideoUrl(fileName);

  const response = await fetch('https://api.whatspie.com/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      device: '6281234567890',
      receiver: receiver,
      type: 'file',
      params: {
        video: {
          url: videoUrl
        },
        mimetype: 'video/mp4',
        caption: caption
      },
      simulate_typing: 1
    })
  });

  return await response.json();
}
```

### 3. Error Handling and Retries

```javascript
async function sendVideoWithRetry(token, receiver, videoUrl, caption, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://api.whatspie.com/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          device: '6281234567890',
          receiver: receiver,
          type: 'video',
          params: {
            video: {
              url: videoUrl
            },
            caption: caption
          },
          simulate_typing: 1
        })
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.code === 400 && error.error?.includes('URL')) {
          // Don't retry URL-related errors
          throw new Error(error.error);
        }
        throw new Error(error.message);
      }

      return await response.json();

    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retry attempt ${attempt} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## Common Use Cases

### Training Videos

```javascript
async function sendTrainingVideo(token, employeePhone, training) {
  const caption = `📚 *Training Module: ${training.title}*

⏱️ Duration: ${training.duration} minutes
📋 Category: ${training.category}
⭐ Level: ${training.level}

${training.description}

📝 Please watch and complete the quiz at: ${training.quizUrl}`;

  const response = await fetch('https://api.whatspie.com/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      device: '6281234567890',
      receiver: employeePhone,
      type: 'file',
      params: {
        video: {
          url: training.videoUrl
        },
        mimetype: 'video/mp4',
        caption: caption
      },
      simulate_typing: 1
    })
  });

  return await response.json();
}
```

### Product Demonstrations

```javascript
async function sendProductDemo(token, customerPhone, product) {
  const caption = `🎥 *${product.name} - Live Demo*

💡 See how it works in action!

✨ Key Features:
${product.features.map(f => `• ${f}`).join('\n')}

💰 Special Price: $${product.price}
📦 In Stock: ${product.inStock ? 'Yes' : 'No'}

🛒 Order Now: ${product.orderUrl}`;

  const response = await fetch('https://api.whatspie.com/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      device: '6281234567890',
      receiver: customerPhone,
      type: 'file',
      params: {
        video: {
          url: product.demoVideoUrl
        },
        mimetype: 'video/mp4',
        caption: caption
      },
      simulate_typing: 1
    })
  });

  return await response.json();
}
```

### Event Highlights

```javascript
async function sendEventHighlights(token, attendeePhone, event) {
  const caption = `🎉 *${event.title} - Highlights*

📅 ${event.date}
📍 ${event.venue}

Thank you for attending! Here are the best moments captured.

📸 Full gallery: ${event.galleryUrl}`;

  const response = await fetch('https://api.whatspie.com/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      device: '6281234567890',
      receiver: attendeePhone,
      type: 'file',
      params: {
        video: {
          url: event.highlightVideoUrl
        },
      
        mimetype: 'video/mp4',
        caption: caption
      },
      simulate_typing: 1
    })
  });

  return await response.json();
}
```

## Limitations

- **File size**: Maximum 64MB per video
- **Duration**: Recommended up to 90 seconds for optimal delivery
- **Formats**: MP4, MOV, AVI, WebM supported
- **URL accessibility**: Videos must be publicly accessible
- **Rate limits**: Follow WhatsApp's messaging limits
- **Compression**: Large videos may be compressed by WhatsApp

## Next Steps

- Learn about [sending text messages](./send-text) to contacts
- Explore [sending image messages](./send-image) for photo sharing
- Check out [contact verification](../contacts/check-contacts) before sending
- Discover [group messaging](../groups/send-group-messages) for video broadcasts
