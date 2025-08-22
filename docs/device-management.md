---
sidebar_position: 3
---

# Device Management

Device management is crucial for connecting your WhatsApp account to the Whatspie API. This involves QR code scanning, monitoring connection status, and managing your device session.

## Overview

The Whatspie API acts as a WhatsApp Web client. To establish connection, you need to:
1. Generate a QR code
2. Scan it with your WhatsApp mobile app
3. Monitor the connection status
4. Manage the session lifecycle

## Get QR Code for Login

### Endpoint
```
POST /api/v1/whatsapp/login
```

### Authentication
Bearer token required.

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `output` | string | No | Response format: `json` (default) or `base64` |
| `timeout` | number | No | QR code timeout in seconds (default: 5) |

### Request Example

```bash
curl -X POST "https://your-api-domain.com/api/v1/whatsapp/login" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "output=json" \
  -d "timeout=5"
```

### Response

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "status": "waiting",
    "expires_at": "2024-12-20T10:30:00Z"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `qr_code` | string | Base64 encoded QR code image |
| `status` | string | Current connection status |
| `expires_at` | string | QR code expiration timestamp |

## Connection Status

The connection status can have the following values:

| Status | Description |
|--------|-------------|
| `waiting` | QR code generated, waiting for scan |
| `scanning` | QR code scanned, establishing connection |
| `connected` | Successfully connected to WhatsApp |
| `disconnected` | Connection lost or terminated |
| `expired` | QR code expired, need to generate new one |

## Check Connection Status

### Endpoint
```
POST /api/v1/whatsapp/ping
```

### Authentication
Bearer token required.

### Request Example

```bash
curl -X POST "https://your-api-domain.com/api/v1/whatsapp/ping" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response (Connected)

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "status": "connected",
    "phone_number": "1234567890",
    "device_info": {
      "platform": "web",
      "version": "2.2449.4"
    },
    "last_seen": "2024-12-20T10:25:00Z"
  }
}
```

### Response (Disconnected)

```json
{
  "code": 400,
  "message": "Device not connected",
  "data": {
    "status": "disconnected"
  }
}
```

## Device Logout

### Endpoint
```
POST /api/v1/whatsapp/logout
```

### Authentication
Bearer token required.

### Request Example

```bash
curl -X POST "https://your-api-domain.com/api/v1/whatsapp/logout" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response

```json
{
  "code": 200,
  "message": "Device logged out successfully",
  "data": {
    "status": "disconnected"
  }
}
```

## Device Reload

### Endpoint
```
POST /api/v1/whatsapp/devices/reload
```

### Authentication
Bearer token required.

### Request Example

```bash
curl -X POST "https://your-api-domain.com/api/v1/whatsapp/devices/reload" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response

```json
{
  "code": 200,
  "message": "Device reloaded successfully",
  "data": {
    "status": "reloading"
  }
}
```

## QR Code Integration Examples

### HTML + JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <title>WhatsApp QR Login</title>
</head>
<body>
    <div id="qr-container">
        <h2>Scan QR Code with WhatsApp</h2>
        <img id="qr-image" style={{display: "none"}} />
        <button id="generate-qr">Generate QR Code</button>
        <div id="status"></div>
    </div>

    <script>
        const API_BASE = 'https://your-api-domain.com/api/v1/whatsapp';
        const TOKEN = 'YOUR_JWT_TOKEN';

        async function generateQR() {
            try {
                const response = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'output=json&timeout=30'
                });

                const data = await response.json();
                
                if (data.code === 200) {
                    document.getElementById('qr-image').src = data.data.qr_code;
                    document.getElementById('qr-image').style.display = 'block';
                    document.getElementById('status').textContent = 'Waiting for scan...';
                    
                    // Start checking connection status
                    checkStatus();
                } else {
                    document.getElementById('status').textContent = `Error: ${data.message}`;
                }
            } catch (error) {
                console.error('Error generating QR:', error);
                document.getElementById('status').textContent = 'Failed to generate QR code';
            }
        }

        async function checkStatus() {
            try {
                const response = await fetch(`${API_BASE}/ping`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`
                    }
                });

                const data = await response.json();
                
                if (data.code === 200 && data.data.status === 'connected') {
                    document.getElementById('status').textContent = 'Connected successfully!';
                    document.getElementById('qr-image').style.display = 'none';
                } else {
                    // Continue checking if not connected
                    setTimeout(checkStatus, 2000);
                }
            } catch (error) {
                console.error('Error checking status:', error);
                setTimeout(checkStatus, 2000);
            }
        }

        document.getElementById('generate-qr').addEventListener('click', generateQR);
    </script>
</body>
</html>
```

### Node.js Example

```javascript
const axios = require('axios');
const fs = require('fs');

class WhatsAppDevice {
    constructor(baseURL, token) {
        this.baseURL = baseURL;
        this.token = token;
        this.connected = false;
    }

    async generateQR() {
        try {
            const response = await axios.post(
                `${this.baseURL}/api/v1/whatsapp/login`,
                'output=json&timeout=30',
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.data.code === 200) {
                const qrData = response.data.data.qr_code;
                
                // Save QR code to file (optional)
                const base64Data = qrData.replace(/^data:image\/png;base64,/, '');
                fs.writeFileSync('qr-code.png', base64Data, 'base64');
                
                console.log('QR code generated! Scan with your WhatsApp mobile app.');
                console.log('QR code saved as qr-code.png');
                
                // Start monitoring connection
                this.monitorConnection();
                
                return qrData;
            } else {
                throw new Error(`Failed to generate QR: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error generating QR:', error.message);
            throw error;
        }
    }

    async checkStatus() {
        try {
            const response = await axios.post(
                `${this.baseURL}/api/v1/whatsapp/ping`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }
            );

            return response.data;
        } catch (error) {
            return { code: 400, data: { status: 'disconnected' } };
        }
    }

    async monitorConnection() {
        const checkInterval = setInterval(async () => {
            const status = await this.checkStatus();
            
            if (status.code === 200 && status.data.status === 'connected') {
                console.log('✅ WhatsApp connected successfully!');
                console.log(`📱 Phone: ${status.data.phone_number}`);
                this.connected = true;
                clearInterval(checkInterval);
            } else {
                console.log('⏳ Waiting for connection...');
            }
        }, 2000);

        // Stop checking after 5 minutes
        setTimeout(() => {
            if (!this.connected) {
                console.log('❌ Connection timeout. Please try again.');
                clearInterval(checkInterval);
            }
        }, 300000);
    }

    async logout() {
        try {
            const response = await axios.post(
                `${this.baseURL}/api/v1/whatsapp/logout`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }
            );

            if (response.data.code === 200) {
                console.log('📱 Device logged out successfully');
                this.connected = false;
                return true;
            } else {
                throw new Error(`Logout failed: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error during logout:', error.message);
            return false;
        }
    }
}

// Usage
async function main() {
    const device = new WhatsAppDevice('https://your-api-domain.com', 'YOUR_JWT_TOKEN');
    
    try {
        await device.generateQR();
        
        // Wait for connection (or implement your own logic)
        // ...
        
    } catch (error) {
        console.error('Setup failed:', error.message);
    }
}

main();
```

### Python Example

```python
import requests
import base64
import time
from PIL import Image
from io import BytesIO

class WhatsAppDevice:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.token = token
        self.connected = False

    def generate_qr(self):
        url = f"{self.base_url}/api/v1/whatsapp/login"
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        data = 'output=json&timeout=30'
        
        response = requests.post(url, headers=headers, data=data)
        
        if response.status_code == 200:
            result = response.json()
            if result['code'] == 200:
                qr_data = result['data']['qr_code']
                
                # Display QR code (optional)
                self.display_qr(qr_data)
                
                print("QR code generated! Scan with your WhatsApp mobile app.")
                
                # Start monitoring connection
                self.monitor_connection()
                
                return qr_data
            else:
                raise Exception(f"Failed to generate QR: {result['message']}")
        else:
            raise Exception(f"HTTP Error: {response.status_code}")

    def display_qr(self, qr_data):
        # Extract base64 data
        base64_data = qr_data.split(',')[1]
        
        # Convert to image
        img_data = base64.b64decode(base64_data)
        img = Image.open(BytesIO(img_data))
        
        # Save QR code
        img.save('qr_code.png')
        print("QR code saved as qr_code.png")

    def check_status(self):
        url = f"{self.base_url}/api/v1/whatsapp/ping"
        headers = {'Authorization': f'Bearer {self.token}'}
        
        try:
            response = requests.post(url, headers=headers)
            return response.json()
        except:
            return {'code': 400, 'data': {'status': 'disconnected'}}

    def monitor_connection(self):
        print("Monitoring connection status...")
        timeout = time.time() + 300  # 5 minutes timeout
        
        while time.time() < timeout:
            status = self.check_status()
            
            if status['code'] == 200 and status['data']['status'] == 'connected':
                print("✅ WhatsApp connected successfully!")
                print(f"📱 Phone: {status['data'].get('phone_number', 'Unknown')}")
                self.connected = True
                break
            else:
                print("⏳ Waiting for connection...")
                time.sleep(2)
        
        if not self.connected:
            print("❌ Connection timeout. Please try again.")

    def logout(self):
        url = f"{self.base_url}/api/v1/whatsapp/logout"
        headers = {'Authorization': f'Bearer {self.token}'}
        
        response = requests.post(url, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            if result['code'] == 200:
                print("📱 Device logged out successfully")
                self.connected = False
                return True
        
        print("❌ Logout failed")
        return False

# Usage
if __name__ == "__main__":
    device = WhatsAppDevice('https://your-api-domain.com', 'YOUR_JWT_TOKEN')
    
    try:
        device.generate_qr()
    except Exception as e:
        print(f"Error: {e}")
```

## Best Practices

### Connection Management
1. **Monitor Status**: Regularly check connection status using the ping endpoint
2. **Handle Reconnection**: Implement automatic reconnection logic for dropped connections
3. **QR Expiry**: Generate new QR codes when they expire
4. **Graceful Logout**: Always logout properly when shutting down your application

### Security
1. **Secure QR Display**: Only show QR codes in secure environments
2. **Session Management**: Implement proper session lifecycle management
3. **Token Security**: Never expose JWT tokens in client-side code

### Error Handling
1. **Network Errors**: Handle network connectivity issues
2. **Timeout Management**: Set appropriate timeouts for QR generation and status checks
3. **Rate Limiting**: Respect API rate limits for status checks

## Troubleshooting

### Common Issues

#### QR Code Not Generating
- Check if your JWT token is valid and not expired
- Ensure your device ID and credentials are correct
- Verify the API endpoint URL

#### Connection Not Established
- Make sure QR code is scanned with the correct WhatsApp account
- Check if WhatsApp Web is already connected on another browser/device
- Verify network connectivity on both server and mobile device

#### Frequent Disconnections
- Monitor your server's network stability
- Implement automatic reconnection logic
- Check WhatsApp's usage policies and limits

## Next Steps

Once your device is connected, you can start:
- [Sending messages](./messaging/send-text) to individual contacts
- [Managing groups](./groups/create-group) and sending group messages
- [Verifying contacts](./contacts/check-contacts) before sending messages