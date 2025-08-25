---
sidebar_position: 3
---

# 📄 Send File Messages

Send documents, PDFs, and other files to WhatsApp contacts using the Whatspie API with support for various file formats and automatic file type detection.

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
| `params` | object | ✅ | Message parameters containing file data |
| `params.document` | object | ✅ | Document object with URL |
| `params.document.url` | string | ✅ | Direct URL to the file |
| `params.fileName` | string | ✅ | Display filename with extension |
| `params.mimetype` | string | ✅ | MIME type of the file |
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
    "params": {
      "document": {
        "url": "https://example.com/documents/report.pdf"
      },
      "fileName": "Monthly_Sales_Report_Q4_2024.pdf",
      "mimetype": "application/pdf"
    },
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
    "params": {
      "document": {
        "url": "https://cdn.example.com/files/presentation.pptx"
      },
      "fileName": "Product_Launch_Presentation_Q1.pptx",
      "mimetype": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    },
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
