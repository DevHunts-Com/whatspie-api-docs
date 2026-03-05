---
sidebar_position: 4
---

# 🔔 Webhooks

Webhooks enable real-time communication between Whatspie and your application. When messages are received on your WhatsApp device, Whatspie will instantly send them to your configured webhook endpoint.

<div style={{background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>🎯 Real-time Message Handling</h3>
  <p style={{margin: "0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>Receive incoming messages instantly and respond automatically with your webhook endpoint configuration.</p>
</div>

## 🌐 Base URL

```
https://api.whatspie.com
```

## ⚙️ Webhook Configuration

To receive webhook messages, configure the webhook URL in your device settings:

1. **Navigate to Device Configuration**: Go to **Devices → Configuration**
2. **Add Webhook URL**: Enter your webhook endpoint URL
3. **Save Configuration**: Ensure your endpoint can handle POST requests

### Webhook URL Requirements

- Must be accessible via HTTPS
- Should respond with HTTP 200 status for successful processing
- Should handle POST requests with JSON payload
- Must be able to process webhook data within 5 seconds

### Webhook Version (v1 / v2)

In **Device Configuration → Webhook**, you can choose the webhook version:

- **v1** (default): Payloads are sent in the legacy format (see sections below). Only incoming messages are sent.
- **v2**: All events use a unified envelope `{ "type": "<event_type>", "data": { ... } }`. You can enable or disable each event type (incoming message, read receipt, message failed, device disconnected).

When you save the webhook configuration, the device connection is reloaded so the new version and event settings take effect immediately.

## 📨 Incoming Message Types

Your webhook will receive different message types based on your package plan. **Document, Image, Contact, and Audio messages are only available with the Startup package and above.**

## 📥 Webhook Message Formats

### Text Message

Basic text messages from contacts:

```json
{
    "message": "Hello, I need help with my order",
    "from": "62856123456",
    "timestamp": 1581651709,
    "message_id": "3219EDE2131",
    "from_user": {
        "name": "John Doe",
        "jid": "62856123456@s.whatsapp.net"
    },
    "is_forwarded": false,
    "is_broadcast": false
}
```

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | The text content of the message |
| `from` | string | Sender's phone number |
| `timestamp` | integer | Unix timestamp of when message was sent |
| `message_id` | string | Unique WhatsApp message identifier |
| `from_user.name` | string | Contact name from WhatsApp |
| `from_user.jid` | string | WhatsApp unique identifier |
| `is_forwarded` | boolean | Whether the message was forwarded |
| `is_broadcast` | boolean | Whether sent to a broadcast list |

### Document Message

Document and file attachments (Startup package required):

```json
{
    "type": "documentMessage",
    "file": {
        "url": "https://whatspie.is3.cloudhost.id/whatspie/messages/2022-10-05/2313213F3213.pdf",
        "caption": "Please review this document",
        "fileName": "contract_agreement.pdf"
    },
    "from": "62856123456",
    "participant": null,
    "timestamp": 1664933170,
    "message_id": "2313213F3213",
    "from_user": {
        "name": "Jane Smith",
        "jid": "62856123456@s.whatsapp.net"
    },
    "is_forwarded": false,
    "is_broadcast": false
}
```

| Field | Type | Description |
|-------|------|-------------|
| `file.url` | string | Direct download URL for the document |
| `file.caption` | string | Optional caption text |
| `file.fileName` | string | Original filename |

### Image Message

Image attachments with optional captions (Startup package required):

```json
{
    "type": "imageMessage",
    "file": {
        "url": "https://whatspie.is3.cloudhost.id/whatspie/messages/2022-10-05/3EB0237E918896635AD332133.jpeg",
        "caption": "Check out this product!",
        "fileName": null
    },
    "from": "628561234456",
    "participant": null,
    "timestamp": 1664932915,
    "message_id": "3EB0237E918896635AD3",
    "from_user": {
        "name": "Mike Johnson",
        "jid": "628561234456@s.whatsapp.net"
    },
    "is_forwarded": false,
    "is_broadcast": false
}
```

### Contact Message

Shared contact information (Startup package required):

```json
{
    "type": "contactMessage",
    "contacts": [
        {
            "displayName": "Tech Support",
            "vcard": "BEGIN:VCARD\nVERSION:3.0\nN:;Tech Support;;;\nFN:Tech Support\nTEL;type=CELL;waid=6285846255569:+62 858-4625-5569\nEND:VCARD"
        }
    ],
    "from": "628561234456",
    "participant": null,
    "timestamp": 1664933238,
    "message_id": "3EB0E9CAAA9BBC8C1081",
    "from_user": {
        "name": "Sarah Wilson",
        "jid": "628561234456@s.whatsapp.net"
    },
    "is_forwarded": false,
    "is_broadcast": false
}
```

### Audio Message

Voice notes and audio files (Startup package required):

```json
{
    "type": "audioMessage",
    "file": {
        "url": "https://whatspie.is3.cloudhost.id/whatspie/messages/2022-10-05/3EB0E9CAAA9BBC8C1081.oga",
        "caption": null,
        "fileName": null,
        "seconds": 15
    },
    "from": "628561234456",
    "participant": null,
    "timestamp": 1664932741,
    "message_id": "3EB0E9CAAA9BBC8C1081",
    "from_user": {
        "name": "David Brown",
        "jid": "628561234456@s.whatsapp.net"
    },
    "is_forwarded": false,
    "is_broadcast": false
}
```

| Field | Type | Description |
|-------|------|-------------|
| `file.seconds` | integer | Duration of audio in seconds |

## 📬 Webhook v2 event format

When **Webhook version** is set to **v2**, every request body is an object with:

- **`type`**: Event type string (e.g. `message_incoming`, `message_read`, `message_failed`, `device_disconnected`).
- **`data`**: Event-specific payload (same structure as v1 for messages, or as defined below for other events).

You can enable or disable each event in the device webhook settings. Only enabled events are sent.

### v2: Incoming message (`message_incoming`)

Same content as v1 incoming messages, wrapped in `data`:

```json
{
    "type": "message_incoming",
    "data": {
        "message": "Hello, I need help with my order",
        "from": "62856123456",
        "timestamp": 1581651709,
        "message_id": "3219EDE2131",
        "from_user": {
            "name": "John Doe",
            "jid": "62856123456@s.whatsapp.net"
        },
        "is_forwarded": false,
        "is_broadcast": false
    }
}
```

### v2: Message read (`message_read`)

Sent when the recipient has read the message (read receipt).

```json
{
    "type": "message_read",
    "data": {
        "message_id": "3219EDE2131",
        "wa_message_id": "xxxxxxx",
        "read_at": "2026-02-03T10:00:00.000Z"
    }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `message_id` | string | Your message identifier |
| `wa_message_id` | string | WhatsApp message ID |
| `read_at` | string | ISO 8601 datetime when the message was read |

### v2: Message failed (`message_failed`)

Sent when a message you sent fails to be delivered.

```json
{
    "type": "message_failed",
    "data": {
        "message_id": "3219EDE2131",
        "status": "ERROR",
        "reason": "Invalid WhatsApp Number"
    }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `message_id` | string | Your message identifier |
| `status` | string | e.g. `ERROR` |
| `reason` | string | Failure reason from WhatsApp or system |

### v2: Device disconnected (`device_disconnected`)

Sent when the device session is actually disconnected (logged out, conflict, connection replaced, etc.), not on temporary reconnection or max-connection events.

```json
{
    "type": "device_disconnected",
    "data": {
        "device_Id": "3219EDE2131",
        "status": "UNPAIRED",
        "reason": "Conflict"
    }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_Id` | string | Device ID (session identifier) |
| `status` | string | e.g. `UNPAIRED` |
| `reason` | string | Disconnect reason (e.g. Conflict, Logged out) |

## 📤 Webhook Response Formats

<div style={{background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>⚠️ Critical Requirement</h3>
  <p style={{margin: "0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>Your webhook MUST return one of the valid JSON response formats shown below. If your webhook doesn't return properly formatted JSON, Whatspie will not send any reply and the webhook will not function correctly.</p>
</div>

To reply to incoming messages, return a properly formatted JSON response from your webhook endpoint using one of the formats below:

### Single Text Reply

Respond with a simple text message:

```json
{
    "type": "chat",
    "body": "Thank you for your message! We'll get back to you shortly.",
    "simulation": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Must be "chat" for text messages |
| `body` | string | ✅ | Reply message content |
| `simulation` | boolean | ❌ | Enable typing simulation (default: false) |

### Image Reply

Send an image with caption:

```json
{
    "type": "chat",
    "body": "Here's the information you requested:",
    "params": {
        "image": {
            "url": "https://images.unsplash.com/photo-1653764982079-c7c5e4fd682a"
        },
        "caption": "Product catalog 2024"
    }
}
```

### Document Reply

Send a file or document:

```json
{
    "type": "chat",
    "body": "Please find the requested document attached:",
    "params": {
        "document": {
            "url": "https://example.com/files/sample.pdf"
        },
        "fileName": "price_list.pdf",
        "mimeType": "application/pdf"
    }
}
```

### Reaction Reply

React to a message with an emoji:

```json
{
    "type": "reaction",
    "body": "👍"
}
```

### Multiple Messages

Send multiple messages in sequence:

```json
[
    {
        "type": "chat",
        "body": "Thank you for your inquiry!",
        "simulation": true
    },
    {
        "type": "chat",
        "body": "Our team will contact you within 24 hours.",
        "simulation": true
    }
]
```

## 🚫 Deprecated Message Types

The following message types are deprecated and should not be used for new implementations:

- **Button Messages** - Use regular text messages instead
- **Template Messages** - Use regular text with images instead  
- **List Messages** - Use regular text with structured formatting instead

## 🔧 Implementation Best Practices

### Security
1. **Verify Webhook Origin**: Validate that requests are coming from Whatspie servers
2. **Use HTTPS**: Always use SSL/TLS for webhook endpoints
3. **Input Validation**: Sanitize and validate all incoming data

### Performance
1. **Quick Response**: Process webhooks within 5 seconds
2. **Async Processing**: Use queues for time-consuming operations
3. **Error Handling**: Return appropriate HTTP status codes

### Message Handling
1. **Duplicate Detection**: Use `message_id` to prevent duplicate processing
2. **Message Types**: Handle all supported message types gracefully
3. **Fallback Responses**: Provide meaningful responses for unhandled cases

## 💡 Example Implementation

Here's a basic webhook handler example in Node.js:

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
    const message = req.body;
    
    // Handle different message types
    if (message.type === 'documentMessage') {
        return res.json({
            type: "chat",
            body: "Thank you for the document. We'll review it shortly.",
            simulation: true
        });
    }
    
    // Handle text messages
    if (message.message) {
        const response = processTextMessage(message.message);
        return res.json({
            type: "chat",
            body: response,
            simulation: true
        });
    }
    
    // Default response
    res.json({
        type: "chat",
        body: "Message received successfully!",
        simulation: true
    });
});

function processTextMessage(text) {
    // Your business logic here
    if (text.toLowerCase().includes('help')) {
        return "How can I assist you today?";
    }
    return "Thanks for your message!";
}

app.listen(3000, () => {
    console.log('Webhook server running on port 3000');
});
```

## 🚨 Common Issues

### Webhook Not Receiving Messages
- Check that webhook URL is correctly configured in device settings
- Verify your endpoint is accessible via HTTPS
- Ensure your server responds with HTTP 200 status

### Messages Not Being Sent
- Confirm your webhook returns valid JSON response
- Check that response format matches the expected structure
- Verify device is connected and active

### File Downloads Failing
- File URLs are temporary and should be downloaded immediately
- Implement proper error handling for failed downloads
- Consider using a queue system for reliable file processing

Your webhook integration is now ready to handle real-time WhatsApp messages! 🎉