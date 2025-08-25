---
sidebar_position: 1
---

# 🔍 Check WhatsApp Contacts

Verify if phone numbers are registered on WhatsApp before sending messages using the Whatspie API with bulk contact validation support.

<div style={{background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>📱 Contact Verification</h3>
  <p style={{margin: "0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>Validate phone numbers before messaging to ensure delivery success and avoid errors. Perfect for contact list cleanup and pre-send validation.</p>
</div>

## 🌐 Endpoint

```
POST https://api.whatspie.com/contacts/check
```

## 🔐 Authentication

Bearer token required in the `Authorization` header.

## 📋 Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `device` | string | ✅ | Your registered WhatsApp device number |
| `phones` | array | ✅ | Array of phone numbers to verify (international format) |

### Phone Number Format

- **Format**: International format without leading zeros or + sign
- **Examples**: `"6281776521626"`, `"1234567890"`, `"447123456789"`
- **Invalid**: `"+6281776521626"`, `"081776521626"`, `"0081776521626"`

## 🚀 Request Examples

### Single Contact Check

```bash
curl -L -X POST 'https://api.whatspie.com/contacts/check' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "device": "6281776521626",
    "phones": [
      "6281776521626"
    ]
  }'
```

### Multiple Contacts Check

```bash
curl -L -X POST 'https://api.whatspie.com/contacts/check' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "device": "6281776521626",
    "phones": [
      "6281776521626",
      "6285603051722",
      "6281234567890",
      "6289876543210"
    ]
  }'
```

### International Numbers Check

```bash
curl -L -X POST 'https://api.whatspie.com/contacts/check' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "device": "6281776521626",
    "phones": [
      "6281776521626",
      "60123456789",
      "65123456789", 
      "91987654321",
      "1234567890",
      "447123456789"
    ]
  }'
```

## 📊 Response Format

### Success Response

```json
{
    "status": 200,
    "message": "OK",
    "data": [
        {
            "phone": "6281776521626",
            "is_on_whatsapp": false
        },
        {
            "phone": "6285603051722",
            "is_on_whatsapp": true
        },
        {
            "phone": "6281234567890",
            "is_on_whatsapp": false
        },
        {
            "phone": "6289876543210",
            "is_on_whatsapp": false
        }
    ]
}
```

### Error Response - Invalid Phone Format

```json
{
  "code": 400,
  "message": "Invalid phone number format"
}
```

### Error Response - Too Many Numbers

```json
{
  "code": 400,
  "message": "Too many phone numbers"
}
```

### Error Response - Device Not Connected

```json
{
  "code": 404,
  "message": "Device not found"
}
```

## 🔗 Related Endpoints

- [Send Text Messages](../messaging/send-text) - Send messages to verified contacts
- [Send Image Messages](../messaging/send-image) - Send media to validated numbers  
- [Device Management](../device-management) - Manage your WhatsApp devices
- [Group Management](../groups/create-group) - Add verified contacts to groups