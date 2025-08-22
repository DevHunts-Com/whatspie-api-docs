---
sidebar_position: 1
---

# 💬 Send Text Messages

Send rich text messages to WhatsApp contacts using the Whatspie API V2 with advanced features like typing simulation, message formatting, and real-time delivery tracking.

<div style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>✨ V2 Enhanced Features</h3>
  <p style={{margin: "0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>Support for typing simulation, WhatsApp text formatting, emoji support, and improved delivery tracking with comprehensive error handling.</p>
</div>

## 🌐 Endpoint

```
POST https://api.whatspie.com/messages
```

## 🔐 Authentication

Bearer token required in the `Authorization` header with proper content headers.

## 📋 Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `device` | string | ✅ | Your registered WhatsApp device number |
| `receiver` | string | ✅ | Recipient's phone number (international format) |
| `type` | string | ✅ | Message type: `"chat"` for text messages |
| `message` | string | ✅ | Text message content (supports WhatsApp formatting) |
| `simulate_typing` | integer | ❌ | Show typing indicator: `1` (yes) or `0` (no) |

## 🚀 Request Examples

### Basic Text Message

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210", 
    "type": "chat",
    "message": "Hello! Welcome to Whatspie API V2 🚀",
    "simulate_typing": 1
  }'
```

### Text Message with Formatting

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat", 
    "message": "*Bold Text* _Italic Text_ ~Strikethrough~ `Monospace`\n\nNew paragraph with emojis! 🎉✨",
    "simulate_typing": 1
  }'
```

### Node.js

```javascript
const axios = require('axios');

async function sendTextMessage(token, device, receiver, message, simulateTyping = true) {
  try {
    const response = await axios.post(
      'https://api.whatspie.com/messages',
      {
        device: device,
        receiver: receiver,
        type: 'chat',
        message: message,
        simulate_typing: simulateTyping ? 1 : 0
      },
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
    console.error('Error sending message:', error.response?.data || error.message);
    throw error;
  }
}

// Usage examples
async function examples() {
  const token = 'YOUR_API_TOKEN';
  const device = '6281234567890';
  const receiver = '6289876543210';

  // Basic text message
  await sendTextMessage(token, device, receiver, 'Hello from Whatspie API V2! 🚀');

  // Message with rich formatting
  const formattedMessage = `*Welcome to Whatspie!* 🎉

_Your message was sent successfully._

~Old text~ New text

Code: \`console.log('Hello')\``;
  
  await sendTextMessage(token, device, receiver, formattedMessage);

  // Business notification
  const businessMsg = `📋 *Order Update #12345*

✅ Order confirmed
📦 Processing started
🚚 Expected delivery: Tomorrow

Track: https://track.example.com/12345`;
  
  await sendTextMessage(token, device, receiver, businessMsg);
}

examples().then(() => console.log('All messages sent!'));
```

### Python

```python
import requests

def send_text_message(token, device, receiver, message, simulate_typing=True):
    url = "https://api.whatspie.com/messages"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    data = {
        'device': device,
        'receiver': receiver,
        'type': 'chat',
        'message': message,
        'simulate_typing': 1 if simulate_typing else 0
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

# Usage examples
try:
    token = 'YOUR_API_TOKEN'
    device = '6281234567890'
    receiver = '6289876543210'

    # Simple text message
    result = send_text_message(token, device, receiver, 'Hello from Python! 🐍')
    print(f"Message sent: {result}")
    
    # Formatted business message
    business_msg = """🏪 *Welcome to Our Store!*

📱 Browse our products online
🚚 Free delivery on orders $50+
💳 Secure payment options

_Visit: shop.example.com_

Use code: *WELCOME10* for 10% off!"""
    
    result = send_text_message(token, device, receiver, business_msg)
    print(f"Business message sent: {result}")
    
except requests.RequestException as e:
    print(f"Error: {e}")
```

### PHP

```php
<?php
function sendTextMessage($token, $device, $receiver, $message, $simulateTyping = true) {
    $url = 'https://api.whatspie.com/messages';
    
    $data = [
        'device' => $device,
        'receiver' => $receiver,
        'type' => 'chat',
        'message' => $message,
        'simulate_typing' => $simulateTyping ? 1 : 0
    ];
    
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
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    } else {
        throw new Exception("HTTP $httpCode: $response");
    }
}

// Usage examples
try {
    $token = 'YOUR_API_TOKEN';
    $device = '6281234567890';
    $receiver = '6289876543210';
    
    // Simple greeting
    $result = sendTextMessage($token, $device, $receiver, 'Hello from PHP! 🔥');
    echo "Message sent: " . json_encode($result) . "\n";
    
    // Customer service message
    $serviceMsg = "👋 *Hi there!*\n\nThanks for contacting us. Our team will respond within 24 hours.\n\n📞 Urgent? Call: +1-234-567-8900\n💬 Live chat: help.example.com\n\n_We're here to help!_ ✨";
    
    $result = sendTextMessage($token, $device, $receiver, $serviceMsg);
    echo "Service message sent: " . json_encode($result) . "\n";
    
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
  "message": "Message sent successfully",
  "data": {
    "id": "msg_chat_12345",
    "status": "pending",
    "type": "chat",
    "device": "6281234567890",
    "receiver": "6289876543210",
    "message": "Hello World!",
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
| `type` | string | Message type (`chat`) |
| `device` | string | Sender device number |
| `receiver` | string | Recipient's phone number |
| `message` | string | Sent message content |
| `simulate_typing` | integer | Typing simulation setting (1 or 0) |
| `timestamp` | string | Message sent timestamp (ISO 8601) |

## Error Responses

### Invalid Phone Number

```json
{
  "code": 400,
  "message": "Invalid phone number format",
  "error": "Receiver phone number must be in international format without +"
}
```

### Message Too Long

```json
{
  "code": 400,
  "message": "Message too long",
  "error": "Message exceeds maximum length of 4096 characters"
}
```

### Device Not Connected

```json
{
  "code": 400,
  "message": "Device not connected",
  "error": "WhatsApp device is offline or not connected. Please check device status."
}
```

### Invalid Message Type

```json
{
  "code": 400,
  "message": "Invalid message type",
  "error": "Message type 'chat' is required for text messages"
}
```

## 📱 Phone Number Format

The `device` and `receiver` parameters should be in international format without the plus (+) sign:

<div style={{background: "#f8f9ff", border: "1px solid #e1e5e9", borderRadius: "8px", padding: "1rem", margin: "1rem 0"}}>

| Country | Format | Example | Valid |
|---------|--------|---------|-------|
| 🇺🇸 USA | 1XXXXXXXXXX | 11234567890 | ✅ |
| 🇬🇧 UK | 44XXXXXXXXXX | 441234567890 | ✅ |
| 🇮🇳 India | 91XXXXXXXXXX | 911234567890 | ✅ |
| 🇮🇩 Indonesia | 62XXXXXXXXXXX | 6281234567890 | ✅ |
| 🇧🇷 Brazil | 55XXXXXXXXXXX | 5511987654321 | ✅ |
| 🇩🇪 Germany | 49XXXXXXXXXX | 491234567890 | ✅ |

</div>

### ❌ Invalid Formats
- `+6281234567890` (contains +)
- `081234567890` (missing country code)
- `6281-234-567-890` (contains hyphens)
- `62 81234567890` (contains spaces)

## ✨ Message Formatting

### WhatsApp Text Formatting

Whatspie API V2 supports all WhatsApp text formatting options:

<div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", margin: "1.5rem 0"}}>
  <div style={{background: "#fef3c7", border: "1px solid #fed7aa", borderRadius: "8px", padding: "1rem"}}>
    <h4 style={{color: "#d97706", marginTop: "0"}}>**Bold Text**</h4>
    <code>*Your text here*</code>
    <small>Wraps text with asterisks</small>
  </div>
  
  <div style={{background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "8px", padding: "1rem"}}>
    <h4 style={{color: "#059669", marginTop: "0"}}><em>Italic Text</em></h4>
    <code>_Your text here_</code>
    <small>Wraps text with underscores</small>
  </div>
  
  <div style={{background: "#fdf2f8", border: "1px solid #fce7f3", borderRadius: "8px", padding: "1rem"}}>
    <h4 style={{color: "#be185d", marginTop: "0"}}><del>Strikethrough</del></h4>
    <code>~Your text here~</code>
    <small>Wraps text with tildes</small>
  </div>
  
  <div style={{background: "#f8f9ff", border: "1px solid #e1e5e9", borderRadius: "8px", padding: "1rem"}}>
    <h4 style={{color: "#4f46e5", marginTop: "0"}}><code>Monospace</code></h4>
    <code>\`Your text here\`</code>
    <small>Wraps text with backticks</small>
  </div>
</div>

### Formatting Examples

```bash
# Bold text example
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat",
    "message": "This is *bold text* in WhatsApp",
    "simulate_typing": 1
  }'

# Mixed formatting
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "device": "6281234567890", 
    "receiver": "6289876543210",
    "type": "chat",
    "message": "*Bold* _italic_ ~strike~ \`code\` text combined!",
    "simulate_typing": 1
  }'
```

### 😀 Emojis and Special Characters

```javascript
const messages = [
  "Hello! 👋 How are you today?",
  "Thanks for your order! ✅ We'll process it soon.",
  "🎉 Congratulations on your achievement!",
  "❗ Important: Please reply to this message.",
  "🚨 *URGENT NOTICE* 🚨\n\nYour account will expire in 3 days.\n\n✅ Renew now: https://example.com\n💳 Questions? Reply to this message"
];

// Send each message with proper V2 API
const token = 'YOUR_API_TOKEN';
const device = '6281234567890';
const receiver = '6289876543210';

messages.forEach(async (msg, index) => {
  try {
    const result = await sendTextMessage(token, device, receiver, msg);
    console.log(`Message ${index + 1} sent:`, result.data.id);
    
    // Small delay between messages
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error(`Failed to send message ${index + 1}:`, error.message);
  }
});
```

## Best Practices

### 1. Phone Number Validation

Always validate phone numbers before sending messages:

```javascript
function isValidPhoneNumber(phoneNumber) {
  // Validation for international format (country code + number)
  const phoneRegex = /^[1-9]\d{10,14}$/;
  return phoneRegex.test(phoneNumber);
}

function validateWhatspieRequest(device, receiver, message) {
  // Validate device number
  if (!isValidPhoneNumber(device)) {
    throw new Error('Invalid device phone number format');
  }
  
  // Validate receiver number
  if (!isValidPhoneNumber(receiver)) {
    throw new Error('Invalid receiver phone number format');
  }
  
  // Validate message length
  if (message.length > 4096) {
    throw new Error('Message exceeds 4096 character limit');
  }
  
  return true;
}

// Usage
const device = '6281234567890';
const receiver = '6289876543210';
const message = 'Hello World!';

try {
  validateWhatspieRequest(device, receiver, message);
  await sendTextMessage(token, device, receiver, message);
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

### 2. Message Length Limits

Keep messages under 4096 characters:

```javascript
function validateMessage(message) {
  const maxLength = 4096;
  
  if (message.length > maxLength) {
    throw new Error(`Message too long. Maximum ${maxLength} characters allowed.`);
  }
  
  return true;
}
```

### 3. Rate Limiting

Implement rate limiting to avoid being blocked:

```javascript
class MessageSender {
  constructor(token, rateLimit = 1000) { // 1 message per second
    this.token = token;
    this.rateLimit = rateLimit;
    this.lastSent = 0;
  }

  async sendMessage(phoneNumber, message) {
    const now = Date.now();
    const timeSinceLastSent = now - this.lastSent;
    
    if (timeSinceLastSent < this.rateLimit) {
      await new Promise(resolve => 
        setTimeout(resolve, this.rateLimit - timeSinceLastSent)
      );
    }
    
    const result = await sendTextMessage(this.token, phoneNumber, message);
    this.lastSent = Date.now();
    
    return result;
  }
}
```

### 4. Error Handling

Implement comprehensive error handling with V2 API structure:

```javascript
async function sendMessageWithRetry(token, device, receiver, message, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await sendTextMessage(token, device, receiver, message);
      return result;
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      // Don't retry on certain errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Authentication failed. Please check your API token.');
      }
      
      if (error.response?.status === 400 && error.response?.data?.error?.includes('phone')) {
        throw new Error('Invalid phone number format. Please check device and receiver numbers.');
      }
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Advanced error handling class
class WhatspieErrorHandler {
  static handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return `Bad Request: ${data.error || 'Invalid request format'}`;
        case 401:
          return 'Unauthorized: Please check your API token';
        case 403:
          return 'Forbidden: Insufficient permissions';
        case 429:
          return 'Rate Limited: Too many requests, please wait';
        case 500:
          return 'Server Error: Please try again later';
        default:
          return `HTTP ${status}: ${data.message || 'Unknown error'}`;
      }
    } else {
      return `Network Error: ${error.message}`;
    }
  }
}

// Usage with error handling
try {
  const result = await sendMessageWithRetry(
    'YOUR_API_TOKEN',
    '6281234567890',
    '6289876543210',
    'Hello with error handling!'
  );
  console.log('Message sent successfully:', result.data.id);
} catch (error) {
  const errorMessage = WhatspieErrorHandler.handleError(error);
  console.error('Failed to send message:', errorMessage);
}
```

### 5. Bulk Messaging

For sending messages to multiple recipients with V2 API:

```javascript
async function sendBulkMessages(token, device, recipients, message, options = {}) {
  const {
    delay = 2000,
    simulateTyping = true,
    onProgress = null,
    onError = null
  } = options;
  
  const results = [];
  let sent = 0;
  let failed = 0;
  
  for (let i = 0; i < recipients.length; i++) {
    const receiver = recipients[i];
    
    try {
      const result = await sendTextMessage(token, device, receiver, message, simulateTyping);
      
      results.push({ 
        receiver, 
        success: true, 
        messageId: result.data.id,
        timestamp: result.data.timestamp
      });
      
      sent++;
      onProgress?.({ sent, failed, total: recipients.length, current: receiver });
      
      // Add delay between messages to avoid rate limiting
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      results.push({ 
        receiver, 
        success: false, 
        error: errorMsg 
      });
      
      failed++;
      onError?.(receiver, errorMsg);
    }
  }
  
  return {
    results,
    summary: { sent, failed, total: recipients.length }
  };
}

// Usage with progress tracking
const recipients = [
  '6289876543210',
  '6287654321098', 
  '6285432109876'
];

const bulkResults = await sendBulkMessages(
  'YOUR_API_TOKEN',
  '6281234567890',
  recipients,
  '📢 *Important Update*\n\nOur services will be updated tonight from 2-4 AM.\n\nSorry for any inconvenience! 🙏',
  {
    delay: 3000, // 3 seconds between messages
    simulateTyping: true,
    onProgress: (progress) => {
      console.log(`Progress: ${progress.sent}/${progress.total} sent (${progress.failed} failed)`);
    },
    onError: (receiver, error) => {
      console.warn(`Failed to send to ${receiver}: ${error}`);
    }
  }
);

console.log('Bulk messaging completed:', bulkResults.summary);

// Send personalized messages
async function sendPersonalizedMessages(token, device, contacts) {
  const results = [];
  
  for (const contact of contacts) {
    const personalizedMsg = `Hi ${contact.name}! 👋\n\nThanks for being a valued customer. Your account status: ${contact.status}\n\nQuestions? Just reply! 💬`;
    
    try {
      const result = await sendTextMessage(token, device, contact.phone, personalizedMsg);
      results.push({ ...contact, success: true, messageId: result.data.id });
    } catch (error) {
      results.push({ ...contact, success: false, error: error.message });
    }
    
    // Wait 2 seconds between personalized messages
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return results;
}

// Usage
const contacts = [
  { name: 'John Doe', phone: '6289876543210', status: 'Active' },
  { name: 'Jane Smith', phone: '6287654321098', status: 'Premium' }
];

const personalizedResults = await sendPersonalizedMessages(
  'YOUR_API_TOKEN', 
  '6281234567890', 
  contacts
);
console.log('Personalized messages sent:', personalizedResults);
```

## ⚠️ Limitations & Guidelines

- **Message Length**: Maximum 4096 characters per message
- **Rate Limits**: Recommended 1-2 messages per second to avoid temporary blocks
- **Contact Verification**: Recipients must have WhatsApp installed and active
- **Device Connection**: Sender device must be online and connected to WhatsApp Web
- **Business Compliance**: Follow WhatsApp's business messaging policies and terms
- **International Messaging**: Ensure proper country code formatting for cross-border messages

## 🔗 Related Endpoints

- [Send Image Messages](./send-image) - Send images with captions  
- [Send File Messages](./send-file) - Send documents and files
- [Send Location Messages](./send-location) - Share location coordinates
- [Device Management](../devices/get-devices) - Check device connection status
- [Authentication](../authentication) - API token management

## 💡 Use Cases

### Customer Support
```javascript
const supportMsg = `👋 Hi! Thanks for contacting support.

🔍 *Issue*: ${customerIssue}
🎟️ *Ticket*: #${ticketNumber}
⏱️ *Response Time*: Within 2 hours

📞 Urgent? Call: +1-800-SUPPORT
💬 Questions? Just reply here!

_We're here to help!_ ✨`;
```

### Marketing Campaigns
```javascript
const campaignMsg = `🎉 *FLASH SALE ALERT* 🎉

⚡ *50% OFF* Everything!
⏰ Today only: ${new Date().toLocaleDateString()}
🛍️ Shop now: ${shopUrl}

💰 Use code: *FLASH50*
🚚 Free shipping on orders $75+

*Limited time offer!* ⏳`;
```

### Appointment Reminders
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