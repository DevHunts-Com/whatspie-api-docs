---
sidebar_position: 2
---

# 🔐 Authentication

The Whatspie SaaS API V2 uses **Bearer Token Authentication** for secure access to all endpoints. This streamlined authentication system is designed for enterprise applications with enhanced security features.

<div style={{background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0"}}>🛡️ Security First</h3>
  <p style={{margin: "0"}}>All API requests are authenticated using Bearer tokens with automatic rate limiting and request validation to ensure your application's security.</p>
</div>

## 🎯 Authentication Overview

Whatspie API V2 uses a simple yet secure authentication method:

1. **Get your API Token** from your Whatspie dashboard Profile section
2. **Include the token** in the `Authorization` header for all requests  
3. **Start using the API** immediately with full access to all features

## 📋 Required Headers

Every API request must include these headers:

| Header | Value | Description |
|--------|-------|-------------|
| `Authorization` | `Bearer YOUR_API_TOKEN` | Your unique API authentication token |
| `Content-Type` | `application/json` | Request content type |
| `Accept` | `application/json` | Expected response format |

## 🚀 Authentication Example

### Basic Request Structure

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat",
    "message": "Hello World!",
    "simulate_typing": 1
  }'
```

## 🔑 Getting Your API Token

### From Whatspie Dashboard
1. **Login** to your Whatspie dashboard
2. **Navigate** to your Profile section
3. **Copy** your API Token from the credentials area
4. **Use** this token in all API requests

### Token Storage
- Store tokens securely in your application
- **Never expose tokens** in client-side code or logs
- Use environment variables for production deployments

### 🛡️ Security Best Practices

1. **Secure Storage**: Store API tokens securely using environment variables
2. **HTTPS Only**: Always use HTTPS in production environments
3. **Token Protection**: Never expose tokens in client-side code or logs
4. **Rate Limiting**: Respect API rate limits to avoid temporary blocks
5. **IP Restrictions**: Consider restricting API access to specific IP addresses

## Error Handling

### Common Authentication Errors

#### 401 Unauthorized
```json
{
  "code": 401,
  "message": "Unauthorized",
  "error": "Invalid API token"
}
```

**Solutions:**
- Verify your API token is correct
- Ensure the token is properly formatted in the Authorization header
- Check if your token has been revoked or expired

#### 403 Forbidden
```json
{
  "code": 403,
  "message": "Forbidden",
  "error": "Insufficient permissions"
}
```

**Solutions:**
- Verify your account has the required permissions
- Check if your subscription plan supports the requested feature
- Ensure your account is active and in good standing

## 💻 Code Examples

### Node.js (axios)

```javascript
const axios = require('axios');

class WhatspieClient {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseURL = 'https://api.whatspie.com';
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async sendMessage(device, receiver, type, message, options = {}) {
    try {
      const payload = {
        device,
        receiver,
        type,
        message,
        simulate_typing: 1,
        ...options
      };

      const response = await axios.post(
        `${this.baseURL}/messages`,
        payload,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      throw new Error(`API request failed: ${error.response?.data?.message || error.message}`);
    }
  }
}

// Usage
const client = new WhatspieClient('YOUR_API_TOKEN');
const result = await client.sendMessage(
  '6281234567890',
  '6289876543210', 
  'chat',
  'Hello from Whatspie API V2! 🚀'
);
```

### Python (requests)

```python
import requests

class WhatspieClient:
    def __init__(self, api_token):
        self.api_token = api_token
        self.base_url = 'https://api.whatspie.com'
    
    def get_auth_headers(self):
        return {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    
    def send_message(self, device, receiver, message_type, message, **options):
        url = f"{self.base_url}/messages"
        
        payload = {
            'device': device,
            'receiver': receiver,
            'type': message_type,
            'message': message,
            'simulate_typing': 1,
            **options
        }
        
        response = requests.post(
            url, 
            headers=self.get_auth_headers(),
            json=payload
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            response.raise_for_status()

# Usage
client = WhatspieClient('YOUR_API_TOKEN')
result = client.send_message(
    '6281234567890',
    '6289876543210',
    'chat',
    'Hello from Python! 🐍'
)
print(f"Message sent: {result}")
```

### PHP (cURL)

```php
<?php

class WhatspieClient {
    private $apiToken;
    private $baseURL;

    public function __construct($apiToken) {
        $this->apiToken = $apiToken;
        $this->baseURL = 'https://api.whatspie.com';
    }

    public function getAuthHeaders() {
        return [
            'Authorization: Bearer ' . $this->apiToken,
            'Content-Type: application/json',
            'Accept: application/json'
        ];
    }

    public function sendMessage($device, $receiver, $type, $message, $options = []) {
        $url = $this->baseURL . '/messages';
        
        $payload = array_merge([
            'device' => $device,
            'receiver' => $receiver,
            'type' => $type,
            'message' => $message,
            'simulate_typing' => 1
        ], $options);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getAuthHeaders());
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            return json_decode($response, true);
        } else {
            throw new Exception("API request failed: HTTP $httpCode: $response");
        }
    }
}

// Usage
$client = new WhatspieClient('YOUR_API_TOKEN');
$result = $client->sendMessage(
    '6281234567890',
    '6289876543210',
    'chat',
    'Hello from PHP! 🔥'
);
echo "Message sent: " . json_encode($result) . "\n";
?>
```

## 🧪 Testing Authentication

You can test your authentication setup using curl:

```bash
# Test with your API token
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat",
    "message": "Test message from API! 🧪",
    "simulate_typing": 1
  }'
```

### Environment Variable Setup

```bash
# Set your API token as environment variable
export WHATSPIE_API_TOKEN="your_actual_token_here"

# Use in curl request
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer $WHATSPIE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"device":"6281234567890","receiver":"6289876543210","type":"chat","message":"Hello World!"}'
```

## Next Steps

Once you have successfully authenticated, you can:
- [Connect your WhatsApp device](./device-management) using QR codes
- [Send messages](./messaging/send-text) to contacts
- [Manage groups](./groups/create-group) and participants

Remember to handle token expiration gracefully in your application and implement proper error handling for authentication failures.