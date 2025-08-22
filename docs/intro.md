---
sidebar_position: 1
---

# 🚀 Introduction

Welcome to the **Whatspie** - The most powerful and developer-friendly WhatsApp Business API that enables seamless integration of WhatsApp messaging capabilities into your applications.

<div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem', borderRadius: '12px', color: 'white', margin: '2rem 0'}}>
  <h2 style={{color: 'white', marginTop: '0'}}>✨ What makes Whatspie V2 Special?</h2>
  <p style={{fontSize: '1.1rem', marginBottom: '0'}}>Enterprise-grade WhatsApp API with advanced features, real-time webhooks, and multi-device support designed for businesses of all sizes.</p>
</div>

## 🎯 Core Features

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', margin: '2rem 0'}}>
  <div style={{background: '#f8f9ff', border: '1px solid #e1e5e9', borderRadius: '8px', padding: '1.5rem'}}>
    <h3 style={{color: '#4f46e5', marginTop: '0'}}>📬 Rich Messaging</h3>
    <ul style={{margin: '0'}}>
      <li>Text messages with formatting</li>
      <li>Images with captions</li>
      <li>Documents and files</li>
      <li>Location sharing</li>
      <li style={{textDecoration: 'line-through'}}>Interactive buttons & lists (deprecated)</li>
      <li style={{textDecoration: 'line-through'}}>Template messages (deprecated)</li>
    </ul>
  </div>
  
  <div style={{background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '8px', padding: '1.5rem'}}>
    <h3 style={{color: '#059669', marginTop: '0'}}>📱 Multi-Device Support</h3>
    <ul style={{margin: '0'}}>
      <li>QR code authentication</li>
      <li>Device status monitoring</li>
      <li>Session management</li>
      <li>Auto-reconnection</li>
      <li>Device switching</li>
    </ul>
  </div>
  
  <!-- <div style={{background: '#fef3c7', border: '1px solid #fed7aa', borderRadius: '8px', padding: '1.5rem'}}>
    <h3 style={{color: '#d97706', marginTop: '0'}}>🔗 Real-time Webhooks</h3>
    <ul style={{margin: '0'}}>
      <li>Message delivery status</li>
      <li>Incoming message events</li>
      <li>Connection status updates</li>
      <li>Error notifications</li>
      <li>Custom event handling</li>
    </ul>
  </div> -->
  
  <div style={{background: '#fdf2f8', border: '1px solid #fce7f3', borderRadius: '8px', padding: '1.5rem'}}>
    <h3 style={{color: '#be185d', marginTop: '0'}}>🔐 Enterprise Security</h3>
    <ul style={{margin: '0'}}>
      <li>Bearer token authentication</li>
      <li>Rate limiting protection</li>
      <li>Secure webhook endpoints</li>
      <li>Data encryption</li>
      <li>Compliance ready</li>
    </ul>
  </div>
</div>

## 🌐 Base URL

```
https://api.whatspie.com
```

## 🚀 Quick Start

Get started with Whatspie API V2 in just a few steps:

### 1. Authentication

All API requests require a Bearer token in the Authorization header:

```bash
curl -H 'Authorization: Bearer YOUR_API_TOKEN' \
     -H 'Content-Type: application/json' \
     -H 'Accept: application/json'
```

### 2. Send Your First Message

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "62895383079050",
    "receiver": "6285603051722",
    "type": "chat",
    "params": {
      "text": "Hi!"
    },
    "simulate_typing": 1
}'
```

### 3. Handle Responses

```json
{
    "status": 200,
    "message": "OK",
    "data": {
        "id": 36259782,
        "from_number": "62895383079050",
        "to_number": "6285603051722",
        "type": "chat",
        "msg_type": "outgoing",
        "body": "Hi!",
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
            "text": "Hi!"
        },
        "is_group": false,
        "created_at": "2025-08-22T03:36:02.179279985Z",
        "updated_at": "2025-08-22T03:36:02.179280065Z"
    }
}
```

## API Features

### 📬 Messaging
- Send text messages
- Send images with captions
- Send documents and files
- Send location coordinates

### 👥 Group Management
- Add/remove participants
- Update group information

### 🔐 Authentication & Security
- JWT token-based authentication
- Basic authentication for initial setup
- Secure device connection management

### 📱 Device Management
- QR code generation for WhatsApp Web
- Device status monitoring
- Logout and session management
- Contact verification

## Response Format

All API responses follow a consistent format:

```json
{
  'code': 200,
  'message': 'OK',
  'data': {
    // Response data here
  }
}
```

## Rate Limits

Please be mindful of WhatsApp's rate limits to avoid being blocked:
<!-- - **Individual messages**: Up to 1000 messages per day for new business accounts -->
- **Group messages**: Depends on group size and message frequency
- **QR code requests**: Limited to prevent abuse

## Need Help?

- 📖 Explore the detailed API documentation in the sidebar
- 🐛 Report issues on our [GitHub repository](https://github.com/DevHunts-Com/whatspie-api-docs)
- 🌐 Visit our [website](https://whatspie.com) for more information

Let's get started with your WhatsApp integration! 🚀
