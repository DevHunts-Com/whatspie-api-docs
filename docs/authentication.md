---
sidebar_position: 2
---

# 🔐 Authentication

The Whatspie API uses **Bearer Token Authentication** for secure access to all endpoints. This streamlined authentication system is designed for enterprise applications with enhanced security features.

<div style={{background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0"}}>🛡️ Security First</h3>
  <p style={{margin: "0"}}>All API requests are authenticated using Bearer tokens with automatic rate limiting and request validation to ensure your application's security.</p>
</div>

## 🎯 Authentication Overview

Whatspie API uses a simple yet secure authentication method:

1. **Get your API Token** from your Whatspie dashboard -> Developers or this link [https://app.whatspie.com/profile?tab=developer](https://app.whatspie.com/profile?tab=developer)
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
    "params": {
      "text": "Hello World!"
    },
    "simulate_typing": 1
  }'
```

## 🔑 Getting Your API Token

### From Whatspie Dashboard

To obtain your API token, follow these steps:

1. **Login** to your Whatspie dashboard at [https://app.whatspie.com](https://app.whatspie.com)
2. **Navigate** to the **Developers** section in the sidebar, or go directly to your **Profile** → **Developer** tab: [https://app.whatspie.com/profile?tab=developer](https://app.whatspie.com/profile?tab=developer)
3. **Copy** your API Token from the Developer credentials section
4. **Use** this token in all API requests

<div style={{background: "#f0f9ff", border: "1px solid #0ea5e9", borderRadius: "8px", padding: "1rem", margin: "1rem 0"}}>
  <strong>📍 Quick Access:</strong> You can find your API token in the sidebar under <strong>Developers</strong> or by visiting your Profile → Developer tab.
</div>

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
  "message": "Unauthorized"
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
  "message": "Forbidden"
}
```

**Solutions:**
- Verify your account has the required permissions
- Check if your subscription plan supports the requested feature
- Ensure your account is active and in good standing


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
    "params": {
      "text": "Test message from API! 🧪"
    },
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
  -d '{"device":"6281234567890","receiver":"6289876543210","type":"chat","params":{"text":"Hello World!"}}'
```

## Next Steps

Once you have successfully authenticated, you can:
- [Connect your WhatsApp device](./device-management) using QR codes
- [Send messages](./messaging/send-text) to contacts
- [Manage groups](./groups/create-group) and participants

Remember to handle token expiration gracefully in your application and implement proper error handling for authentication failures.