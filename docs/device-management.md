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

## 💻 Code Examples

### Node.js Device Management

```javascript
const axios = require('axios');

class WhatspieDeviceManager {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseURL = 'https://api.whatspie.com';
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${this.apiToken}`
    };
  }

  async createDevice(packageType, name) {
    try {
      const response = await axios.post(
        `${this.baseURL}/devices`,
        {
          package: packageType,
          name: name
        },
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Create device failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async listDevices() {
    try {
      const response = await axios.get(
        `${this.baseURL}/devices`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      throw new Error(`List devices failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async getDevice(deviceId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/devices/${deviceId}`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Get device failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async getQRCode(deviceId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/devices/${deviceId}/qr?response_type=url`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Get QR code failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async monitorDeviceConnection(deviceId, onStatusChange) {
    const checkInterval = setInterval(async () => {
      try {
        const deviceInfo = await this.getDevice(deviceId);
        const status = deviceInfo.data.paired_status;
        
        onStatusChange(status, deviceInfo.data);
        
        if (status === 'PAIRED') {
          console.log(`✅ Device ${deviceId} connected successfully!`);
          console.log(`📱 Phone: ${deviceInfo.data.phone}`);
          clearInterval(checkInterval);
        }
      } catch (error) {
        console.error('Error checking device status:', error.message);
      }
    }, 3000);

    // Stop monitoring after 10 minutes
    setTimeout(() => {
      clearInterval(checkInterval);
      console.log('⏰ Monitoring timeout reached');
    }, 600000);

    return checkInterval;
  }
}

// Usage Examples
async function examples() {
  const deviceManager = new WhatspieDeviceManager('YOUR_API_TOKEN');

  try {
    // Create a new device
    const newDevice = await deviceManager.createDevice('STARTUP240K', 'Support Bot');
    console.log('Device created:', newDevice.data);

    // Get QR code for connection
    const qrResponse = await deviceManager.getQRCode(newDevice.data.id);
    console.log('QR Code generated. Scan with WhatsApp mobile app.');
    
    // You can display the QR code in your app
    const qrCode = qrResponse.data.qr;
    
    // Monitor connection status
    deviceManager.monitorDeviceConnection(newDevice.data.id, (status, deviceData) => {
      console.log(`Device status: ${status}`);
      
      if (status === 'PAIRED') {
        console.log('Device is now ready for messaging!');
      }
    });

    // List all devices
    const allDevices = await deviceManager.listDevices();
    console.log('All devices:', allDevices.data);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

examples();
```

### Python Device Management

```python
import requests
import time
import base64
from PIL import Image
from io import BytesIO

class WhatspieDeviceManager:
    def __init__(self, api_token):
        self.api_token = api_token
        self.base_url = 'https://api.whatspie.com'
    
    def get_headers(self):
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json; charset=utf-8',
            'Authorization': f'Bearer {self.api_token}'
        }
    
    def create_device(self, package_type, name):
        url = f"{self.base_url}/devices"
        data = {
            'package': package_type,
            'name': name
        }
        
        response = requests.post(url, json=data, headers=self.get_headers())
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Create device failed: {response.text}")
    
    def list_devices(self):
        url = f"{self.base_url}/devices"
        response = requests.get(url, headers=self.get_headers())
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"List devices failed: {response.text}")
    
    def get_device(self, device_id):
        url = f"{self.base_url}/devices/{device_id}"
        response = requests.get(url, headers=self.get_headers())
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Get device failed: {response.text}")
    
    def get_qr_code(self, device_id):
        url = f"{self.base_url}/devices/{device_id}/qr?response_type=url"
        response = requests.get(url, headers=self.get_headers())
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Get QR code failed: {response.text}")
    
    def save_qr_code(self, qr_data, filename='qr_code.png'):
        # Extract base64 data
        base64_data = qr_data.split(',')[1]
        
        # Convert to image
        img_data = base64.b64decode(base64_data)
        img = Image.open(BytesIO(img_data))
        
        # Save QR code
        img.save(filename)
        print(f"QR code saved as {filename}")
        return filename
    
    def monitor_device_connection(self, device_id, timeout=600):
        """Monitor device connection for up to 10 minutes"""
        start_time = time.time()
        
        print(f"Monitoring device {device_id} connection...")
        
        while time.time() - start_time < timeout:
            try:
                device_info = self.get_device(device_id)
                status = device_info['data']['paired_status']
                
                print(f"Device status: {status}")
                
                if status == 'PAIRED':
                    print(f"✅ Device {device_id} connected successfully!")
                    phone = device_info['data'].get('phone')
                    if phone:
                        print(f"📱 Phone: {phone}")
                    return True
                
                time.sleep(3)
                
            except Exception as e:
                print(f"Error checking device status: {e}")
                time.sleep(3)
        
        print("⏰ Monitoring timeout reached")
        return False

# Usage Examples
def main():
    device_manager = WhatspieDeviceManager('YOUR_API_TOKEN')
    
    try:
        # Create a new device
        new_device = device_manager.create_device('BUSINESS', 'Marketing Bot')
        print(f"Device created: {new_device['data']}")
        
        device_id = new_device['data']['id']
        
        # Get QR code
        qr_response = device_manager.get_qr_code(device_id)
        qr_code = qr_response['data']['qr']
        
        # Save QR code as image
        device_manager.save_qr_code(qr_code, f'device_{device_id}_qr.png')
        print("Scan the QR code with your WhatsApp mobile app")
        
        # Monitor connection
        connected = device_manager.monitor_device_connection(device_id)
        
        if connected:
            print("Device is ready for messaging!")
            
            # List all devices
            all_devices = device_manager.list_devices()
            print("All devices:")
            for device in all_devices['data']:
                package_name = device.get('package', {}).get('name', 'Unknown')
                print(f"- ID {device['id']}: {package_name} package ({device['paired_status']})")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
```

### PHP Device Management

```php
<?php

class WhatspieDeviceManager {
    private $apiToken;
    private $baseURL;

    public function __construct($apiToken) {
        $this->apiToken = $apiToken;
        $this->baseURL = 'https://api.whatspie.com';
    }

    private function getHeaders() {
        return [
            'Content-Type: application/json',
            'Accept: application/json; charset=utf-8',
            'Authorization: Bearer ' . $this->apiToken
        ];
    }

    public function createDevice($packageType, $name) {
        $url = $this->baseURL . '/devices';
        $data = json_encode([
            'package' => $packageType,
            'name' => $name
        ]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            return json_decode($response, true);
        } else {
            throw new Exception("Create device failed: HTTP $httpCode: $response");
        }
    }

    public function listDevices() {
        $url = $this->baseURL . '/devices';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            return json_decode($response, true);
        } else {
            throw new Exception("List devices failed: HTTP $httpCode: $response");
        }
    }

    public function getDevice($deviceId) {
        $url = $this->baseURL . '/devices/' . $deviceId;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            return json_decode($response, true);
        } else {
            throw new Exception("Get device failed: HTTP $httpCode: $response");
        }
    }

    public function getQRCode($deviceId) {
        $url = $this->baseURL . '/devices/' . $deviceId . '/qr?response_type=url';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            return json_decode($response, true);
        } else {
            throw new Exception("Get QR code failed: HTTP $httpCode: $response");
        }
    }

    public function saveQRCode($qrData, $filename = 'qr_code.png') {
        // Extract base64 data
        $base64Data = explode(',', $qrData)[1];
        
        // Decode and save
        $imageData = base64_decode($base64Data);
        file_put_contents($filename, $imageData);
        
        echo "QR code saved as $filename\n";
        return $filename;
    }

    public function monitorDeviceConnection($deviceId, $timeout = 600) {
        $startTime = time();
        echo "Monitoring device $deviceId connection...\n";

        while (time() - $startTime < $timeout) {
            try {
                $deviceInfo = $this->getDevice($deviceId);
                $status = $deviceInfo['data']['paired_status'];
                
                echo "Device status: $status\n";
                
                if ($status === 'PAIRED') {
                    echo "✅ Device $deviceId connected successfully!\n";
                    $phone = $deviceInfo['data']['phone'] ?? 'Unknown';
                    echo "📱 Phone: $phone\n";
                    return true;
                }
                
                sleep(3);
                
            } catch (Exception $e) {
                echo "Error checking device status: " . $e->getMessage() . "\n";
                sleep(3);
            }
        }
        
        echo "⏰ Monitoring timeout reached\n";
        return false;
    }
}

// Usage Examples
try {
    $deviceManager = new WhatspieDeviceManager('YOUR_API_TOKEN');
    
    // Create a new device
    $newDevice = $deviceManager->createDevice('STARTER60K', 'Sales Bot');
    echo "Device created: " . json_encode($newDevice['data']) . "\n";
    
    $deviceId = $newDevice['data']['id'];
    
    // Get QR code
    $qrResponse = $deviceManager->getQRCode($deviceId);
    $qrCode = $qrResponse['data']['qr'];
    
    // Save QR code
    $deviceManager->saveQRCode($qrCode, "device_{$deviceId}_qr.png");
    echo "Scan the QR code with your WhatsApp mobile app\n";
    
    // Monitor connection
    $connected = $deviceManager->monitorDeviceConnection($deviceId);
    
    if ($connected) {
        echo "Device is ready for messaging!\n";
        
        // List all devices
        $allDevices = $deviceManager->listDevices();
        echo "All devices:\n";
        foreach ($allDevices['data'] as $device) {
            $packageName = $device['package']['name'] ?? 'Unknown';
            echo "- ID {$device['id']}: {$packageName} package ({$device['paired_status']})\n";
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
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