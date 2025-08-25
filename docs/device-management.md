---
sidebar_position: 3
---

# 📱 Device Management

Manage your WhatsApp devices with the Whatspie API. Create, monitor, and control your WhatsApp Business connections with comprehensive device lifecycle management.

<div style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>🔗 Device Connection</h3>
  <p style={{margin: "0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>Complete device management including creation, QR code generation, connection monitoring, and package management for your WhatsApp Business integration.</p>
</div>

## 🌐 Base URL

```
https://api.whatspie.com
```

## 🔐 Authentication

All device management endpoints require Bearer token authentication:

```bash
Authorization: Bearer <YOUR_API_TOKEN>
```

## 📋 Device Operations Overview

| Operation | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| Create Device | `POST` | `/devices` | Create a new WhatsApp device |
| List Devices | `GET` | `/devices` | Get all your devices |
| Get Device Info | `GET` | `/devices/{id}` | Get specific device details |
| Get QR Code | `GET` | `/devices/{id}/qr` | Get QR code for device connection |

## 🆕 Create Device

Create a new WhatsApp device with a specific package plan.

### Endpoint
```
POST https://api.whatspie.com/devices
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `package` | string | ✅ | Package plan (e.g., "STARTUP240K") |
| `name` | string | ✅ | Display name for the device |

### Request Example

```bash
curl -L -X POST 'https://api.whatspie.com/devices' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer <TOKEN>' \
  --data-raw '{
    "package": "STARTUP240K",
    "name": "Customer Service"
  }'
```

### Success Response

```json
TBA
```

### Error Response

```json
{
  "code": 400,
  "message": "Invalid package type"
}
```

## 📋 List Devices

Get all devices associated with your account.

### Endpoint
```
GET https://api.whatspie.com/devices
```

### Request Example

```bash
curl -L -X GET 'https://api.whatspie.com/devices' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer <TOKEN>'
```

### Success Response

```json
{
    "status": 200,
    "message": "OK",
    "data": [
        {
            "id": 2076,
            "phone": "6289510154496",
            "webhook_url": "https://your-webhook-url.com",
            "status": "ACTIVE",
            "version": "multidevice",
            "paired_status": "UNPAIRED",
            "created_at": "2022-03-15T00:32:13Z",
            "updated_at": "2025-08-14T23:26:01Z",
            "server": {
                "name": "EUR (DEU1)",
                "status": "ACTIVE"
            },
            "package": {
                "code": "STARTUP240K",
                "name": "Startup"
            },
            "subscription": {
                "quote_available": "-1",
                "quote_used": "522"
            }
        }
    ]
}
```

### Device Status Values

| Status | Description |
|--------|-------------|
| `UNPAIRED` | Device not connected to WhatsApp |
| `PAIRED` | Device successfully connected |
| `EXPIRED` | QR code expired, need to reconnect |
| `SUSPENDED` | Device temporarily suspended |

## 📱 Get Device Information

Get detailed information about a specific device.

### Endpoint
```
GET https://api.whatspie.com/devices/{id}
```

### Request Example

```bash
curl -L -X GET 'https://api.whatspie.com/devices/6' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer <TOKEN>'
```

### Success Response

```json
{
    "status": 200,
    "message": "OK",
    "data": {
        "id": 5,
        "phone": "62895383079050",
        "webhook_url": "https://your-webhook-url.com",
        "status": "ACTIVE",
        "version": "multidevice",
        "paired_status": "PAIRED",
        "created_at": "2020-02-26T07:06:47Z",
        "updated_at": "2025-08-11T21:30:42Z",
        "server": {
            "name": "ASIA (IDN1)",
            "status": "ACTIVE"
        },
        "package": {
            "code": "STARTUP240K",
            "name": "Startup"
        },
        "subscription": {
            "quote_available": "-1",
            "quote_used": "62755"
        }
    }
}
```

### Error Response (Device Not Found)

```json
{
  "code": 404,
  "message": "Device not found"
}
```

## 📱 Get QR Code

Generate or retrieve the QR code for device connection.

### Endpoint
```
GET https://api.whatspie.com/devices/{id}/qr
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `response_type` | string | ✅ | `url` |


### Request Example

```bash
curl -L -X GET 'https://api.whatspie.com/devices/5/qr?response_type=url' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer <TOKEN>'
```

### Success Response

```json
{
    "status": 200,
    "message": "OK",
    "data": {
        "qr": "data:image/png;base64,json-image"
    }
}
```

### Error Response (Device Already Connected)

```json
{
  "code": 200,
  "message": "Device connected"
}
```

### Error Response (QR Code Generation Failed)

```json
{
  "code": 500,
  "message": "QR code generation failed"
}
```


## 📦 Package Types

Available package codes for device creation:

| ID | Package Code | Name |
|----|-------------|------|
| 1 | `BETA` | Beta Tester |
| 2 | `STARTER60K` | Starter |
| 3 | `STARTUP240K` | Startup |
| 4 | `BUSINESS` | Business |

### Package Selection Examples

```bash
# Create device with Starter package
curl -L -X POST 'https://api.whatspie.com/devices' \
  -H 'Authorization: Bearer <TOKEN>' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "package": "STARTER60K",
    "name": "Basic Bot"
  }'

# Create device with Business package
curl -L -X POST 'https://api.whatspie.com/devices' \
  -H 'Authorization: Bearer <TOKEN>' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "package": "BUSINESS",
    "name": "Enterprise Bot"
  }'
```

## 🔧 Best Practices

### Device Creation
1. **Meaningful Names**: Use descriptive names for easy identification
2. **Package Selection**: Choose appropriate package based on usage needs
3. **Monitoring**: Implement connection monitoring for critical devices

### QR Code Management
1. **Secure Display**: Only show QR codes in secure environments
2. **Expiry Handling**: Handle QR code expiration gracefully
3. **Auto-refresh**: Implement automatic QR code refresh when expired

### Connection Monitoring
1. **Regular Checks**: Monitor device status every 3-5 seconds during connection
2. **Timeout Handling**: Set reasonable timeouts for connection attempts
3. **Error Recovery**: Implement retry logic for failed connections

## 🚨 Common Errors

### Package Not Available
```json
{
  "code": 400,
  "message": "Invalid package type",
  "error": "Package 'INVALID_PACKAGE' is not available"
}
```

### Device Limit Reached
```json
{
  "code": 403,
  "message": "Device limit exceeded",
  "error": "Maximum number of devices reached for your plan"
}
```

### Device Not Found
```json
{
  "code": 404,
  "message": "Device not found",
  "error": "Device with ID 999 does not exist"
}
```

## 🔗 Next Steps

Once your device is connected:
- [Understand message parameters](./params-structure) for proper formatting
- [Send text messages](./messaging/send-text) to contacts
- [Send media messages](./messaging/send-image) with images and files
- [Manage groups](./groups/create-group) and group messaging

Your WhatsApp Business device is now ready for automated messaging!