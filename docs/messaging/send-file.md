---
sidebar_position: 3
---

# 📄 Send File Messages

Send documents, PDFs, and other files to WhatsApp contacts using the Whatspie API V2 with support for various file formats and automatic file type detection.

<div style={{background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', padding: '1.5rem', borderRadius: '8px', color: '#1a202c', margin: '1.5rem 0'}}>
  <h3 style={{color: '#1a202c', margin: '0 0 1rem 0'}}>📎 Universal File Support</h3>
  <p style={{margin: 0}}>Send any document type with automatic file detection, preview generation, and intelligent compression for optimal delivery.</p>
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
| `type` | string | ✅ | Message type: `"file"` for file messages |
| `message` | string | ❌ | File description or filename |
| `file_url` | string | ✅ | Direct URL to the file |
| `simulate_typing` | integer | ❌ | Show typing indicator: `1` (yes) or `0` (no) |

## 📁 Supported File Formats

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '1.5rem 0'}}>
  <div style={{background: '#fef5e7', border: '1px solid #fed7aa', borderRadius: '8px', padding: '1rem'}}>
    <h4 style={{color: '#d97706', marginTop: 0}}>📋 Documents</h4>
    <ul style={{margin: 0, fontSize: '0.9rem'}}>
      <li>PDF (.pdf)</li>
      <li>Word (.doc, .docx)</li>
      <li>Excel (.xls, .xlsx)</li>
      <li>PowerPoint (.ppt, .pptx)</li>
      <li>Text files (.txt)</li>
    </ul>
  </div>
  
  <div style={{background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '1rem'}}>
    <h4 style={{color: '#0284c7', marginTop: 0}}>🗜️ Archives</h4>
    <ul style={{margin: 0, fontSize: '0.9rem'}}>
      <li>ZIP (.zip)</li>
      <li>RAR (.rar)</li>
      <li>7-Zip (.7z)</li>
      <li>TAR (.tar, .tar.gz)</li>
    </ul>
  </div>
  
  <div style={{background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '8px', padding: '1rem'}}>
    <h4 style={{color: '#059669', marginTop: 0}}>💻 Development</h4>
    <ul style={{margin: 0, fontSize: '0.9rem'}}>
      <li>JavaScript (.js, .jsx)</li>
      <li>Python (.py)</li>
      <li>Java (.java)</li>
      <li>C/C++ (.c, .cpp, .h)</li>
      <li>HTML/CSS (.html, .css)</li>
    </ul>
  </div>
  
  <div style={{background: '#fdf2f8', border: '1px solid #fce7f3', borderRadius: '8px', padding: '1rem'}}>
    <h4 style={{color: '#be185d', marginTop: 0}}>🎵 Media Files</h4>
    <ul style={{margin: 0, fontSize: '0.9rem'}}>
      <li>Audio (.mp3, .wav, .ogg)</li>
      <li>Video (.mp4, .avi, .mov)</li>
      <li>Images (.jpg, .png, .gif)</li>
      <li>eBooks (.epub, .mobi)</li>
    </ul>
  </div>
</div>

## 🚀 Request Examples

### Basic File Message

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "file",
    "file_url": "https://example.com/documents/report.pdf",
    "message": "📄 Monthly Sales Report - Q4 2024",
    "simulate_typing": 1
  }'
```

### File with Description

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "file",
    "file_url": "https://cdn.example.com/files/presentation.pptx",
    "message": "🎯 Product Launch Presentation\n\nPlease review before tomorrow'\''s meeting. Contains Q1 strategy and roadmap.",
    "simulate_typing": 1
  }'
```

### Technical Document

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210", 
    "type": "file",
    "file_url": "https://docs.example.com/api/documentation.pdf",
    "message": "📚 API Documentation v2.1\n\nLatest version with new endpoints and examples.",
    "simulate_typing": 1
  }'
```

## 🔥 Code Examples

### Node.js

```javascript
const axios = require('axios');

async function sendFileMessage(token, device, receiver, fileUrl, message = null) {
  try {
    const payload = {
      device: device,
      receiver: receiver,
      type: 'file',
      file_url: fileUrl,
      simulate_typing: 1
    };

    // Add message if provided
    if (message) {
      payload.message = message;
    }

    const response = await axios.post(
      'https://api.whatspie.com/messages',
      payload,
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
    console.error('Error sending file:', error.response?.data || error.message);
    throw error;
  }
}

// Usage examples
async function examples() {
  const token = 'YOUR_API_TOKEN';
  const device = '6281234567890';
  const receiver = '6289876543210';

  // Send PDF document
  await sendFileMessage(
    token,
    device,
    receiver,
    'https://example.com/contract.pdf',
    '📋 Service Agreement Contract\n\nPlease review and sign digitally.'
  );

  // Send Excel spreadsheet
  await sendFileMessage(
    token,
    device,
    receiver,
    'https://files.example.com/budget-2024.xlsx',
    '💰 Annual Budget 2024\n\nDetailed breakdown by departments and quarters.'
  );

  // Send archive file
  await sendFileMessage(
    token,
    device,
    receiver,
    'https://downloads.example.com/project-files.zip',
    '📦 Project Source Code\n\nComplete project with documentation and examples.'
  );
}

examples().then(() => console.log('All files sent!'));
```

### Python

```python
import requests

def send_file_message(token, device, receiver, file_url, message=None):
    url = "https://api.whatspie.com/messages"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    data = {
        'device': device,
        'receiver': receiver,
        'type': 'file',
        'file_url': file_url,
        'simulate_typing': 1
    }
    
    # Add message if provided
    if message:
        data['message'] = message
    
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
    
    # Send presentation file
    result = send_file_message(
        token,
        device,
        receiver,
        'https://slides.example.com/presentation.pptx',
        '🎯 Marketing Strategy 2024\n\nNew customer acquisition and retention strategies.'
    )
    print(f"Presentation sent: {result['data']['id']}")
    
    # Send code repository
    result = send_file_message(
        token,
        device,
        receiver,
        'https://github.com/example/project/archive/main.zip',
        '💻 Latest Code Release\n\nVersion 3.2.1 with bug fixes and new features.'
    )
    print(f"Code archive sent: {result['data']['id']}")
    
except requests.RequestException as e:
    print(f"Error: {e}")
```

### PHP

```php
<?php
function sendFileMessage($token, $device, $receiver, $fileUrl, $message = null) {
    $url = 'https://api.whatspie.com/messages';
    
    $data = [
        'device' => $device,
        'receiver' => $receiver,
        'type' => 'file',
        'file_url' => $fileUrl,
        'simulate_typing' => 1
    ];
    
    // Add message if provided
    if ($message) {
        $data['message'] = $message;
    }
    
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
    
    // Send invoice PDF
    $result = sendFileMessage(
        $token,
        $device,
        $receiver,
        'https://invoices.example.com/invoice-001.pdf',
        '💳 Invoice #001\n\nPayment due within 30 days. Thank you for your business!'
    );
    echo "Invoice sent: " . $result['data']['id'] . "\n";
    
    // Send employee handbook
    $result = sendFileMessage(
        $token,
        $device,
        $receiver,
        'https://hr.example.com/handbook-2024.pdf',
        '📖 Employee Handbook 2024\n\nUpdated policies and procedures. Please read carefully.'
    );
    echo "Handbook sent: " . $result['data']['id'] . "\n";
    
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
  "message": "File sent successfully",
  "data": {
    "id": "msg_file_12345",
    "status": "pending",
    "type": "file",
    "device": "6281234567890",
    "receiver": "6289876543210",
    "file_url": "https://example.com/document.pdf",
    "message": "📄 Important Document",
    "file_info": {
      "name": "document.pdf",
      "size": "2.5MB",
      "type": "application/pdf"
    },
    "timestamp": "2024-12-20T10:30:00Z"
  }
}
```

### Error Response - Invalid File URL

```json
{
  "code": 400,
  "message": "Invalid file URL",
  "error": "File URL is not accessible or file too large (max 100MB)"
}
```

## 💡 Best Practices

### 1. File URL Validation

```javascript
function validateFileUrl(url) {
  const urlPattern = /^https?:\/\/.+/;
  
  if (!urlPattern.test(url)) {
    throw new Error('File URL must use HTTP or HTTPS protocol');
  }
  
  // Check file extension
  const allowedExtensions = [
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'txt', 'csv', 'zip', 'rar', '7z', 'tar', 'gz',
    'jpg', 'jpeg', 'png', 'gif', 'mp3', 'mp4', 'avi'
  ];
  
  const extension = url.split('.').pop().toLowerCase();
  
  if (!allowedExtensions.includes(extension)) {
    throw new Error(`File type .${extension} is not supported`);
  }
  
  return true;
}
```

### 2. File Description Best Practices

```javascript
function formatFileMessage(fileName, description, fileSize = null) {
  let message = '';
  
  // Add appropriate emoji based on file type
  const extension = fileName.split('.').pop().toLowerCase();
  const fileEmojis = {
    'pdf': '📄',
    'doc': '📝', 'docx': '📝',
    'xls': '📊', 'xlsx': '📊',
    'ppt': '📽️', 'pptx': '📽️',
    'zip': '📦', 'rar': '📦',
    'jpg': '🖼️', 'png': '🖼️',
    'mp3': '🎵', 'mp4': '🎬'
  };
  
  const emoji = fileEmojis[extension] || '📎';
  message += `${emoji} ${fileName}`;
  
  if (fileSize) {
    message += ` (${fileSize})`;
  }
  
  if (description) {
    message += `\n\n${description}`;
  }
  
  return message;
}

// Usage
const message = formatFileMessage(
  'quarterly-report.pdf',
  'Q3 financial results and market analysis',
  '3.2MB'
);
// Result: "📄 quarterly-report.pdf (3.2MB)\n\nQ3 financial results and market analysis"
```

### 3. Batch File Sending

```javascript
async function sendMultipleFiles(token, device, receiver, files, delay = 2000) {
  const results = [];
  
  for (const file of files) {
    try {
      const result = await sendFileMessage(
        token,
        device,
        receiver,
        file.url,
        file.message
      );
      
      results.push({
        file: file.name,
        success: true,
        messageId: result.data.id
      });
      
      // Delay between files to avoid rate limiting
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
    } catch (error) {
      results.push({
        file: file.name,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

// Usage
const files = [
  {
    name: 'contract.pdf',
    url: 'https://docs.example.com/contract.pdf',
    message: '📋 Service Contract\n\nPlease review and sign.'
  },
  {
    name: 'invoice.pdf', 
    url: 'https://billing.example.com/invoice.pdf',
    message: '💳 Invoice #12345\n\nPayment due: Dec 30, 2024'
  }
];

const results = await sendMultipleFiles('YOUR_TOKEN', '6281234567890', '6289876543210', files);
console.log('Batch send results:', results);
```

## ⚠️ Limitations

- **File size**: Maximum 100MB per file
- **File URL**: Must be publicly accessible via HTTP/HTTPS
- **File types**: Limited to supported formats only
- **Upload time**: Large files may take longer to process
- **Retention**: Files cached temporarily for delivery optimization

## 🔗 Related Endpoints

- [Send Image Messages](./send-image) - For image-specific messaging
- [Send Text Messages](./send-text) - For file descriptions
- [Get Message Status](../messages/get-messages) - Check delivery status

## 📞 Support

Need help with file messaging?
- 📖 [File Formats Guide](../guides/file-formats)
- 🛠️ [Troubleshooting Guide](../troubleshooting)
- 💬 [Community Forum](https://community.whatspie.com)