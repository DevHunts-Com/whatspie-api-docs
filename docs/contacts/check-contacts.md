---
sidebar_position: 1
---

# Check WhatsApp Contacts

Verify if phone numbers are registered on WhatsApp before sending messages.

## Endpoint

```
POST /api/v1/whatsapp/contacts/check
```

## Authentication

Bearer token required in the `Authorization` header.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | string | ✅ | Comma-separated list of phone numbers to check |

## Request Examples

### Single Contact Check

```bash
curl -X POST "https://your-api-domain.com/api/v1/whatsapp/contacts/check" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "ids=1234567890"
```

### Multiple Contacts Check

```bash
curl -X POST "https://your-api-domain.com/api/v1/whatsapp/contacts/check" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "ids=1234567890,0987654321,1122334455"
```

## Code Examples

### Node.js

```javascript
const axios = require('axios');

async function checkWhatsAppContacts(token, phoneNumbers) {
  try {
    const ids = Array.isArray(phoneNumbers) ? phoneNumbers.join(',') : phoneNumbers;
    
    const response = await axios.post(
      'https://your-api-domain.com/api/v1/whatsapp/contacts/check',
      `ids=${ids}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error checking contacts:', error.response?.data || error.message);
    throw error;
  }
}

// Usage examples
async function examples() {
  const token = 'YOUR_JWT_TOKEN';
  
  // Check single contact
  const singleResult = await checkWhatsAppContacts(token, '1234567890');
  console.log('Single contact check:', singleResult);
  
  // Check multiple contacts
  const multipleResult = await checkWhatsAppContacts(
    token, 
    ['1234567890', '0987654321', '1122334455']
  );
  console.log('Multiple contacts check:', multipleResult);
}
```

### Python

```python
import requests

def check_whatsapp_contacts(token, phone_numbers):
    url = "https://your-api-domain.com/api/v1/whatsapp/contacts/check"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    # Handle both single number and list of numbers
    if isinstance(phone_numbers, list):
        ids = ','.join(phone_numbers)
    else:
        ids = phone_numbers
    
    data = {'ids': ids}
    
    response = requests.post(url, headers=headers, data=data)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

# Usage examples
try:
    # Check single contact
    single_result = check_whatsapp_contacts('YOUR_JWT_TOKEN', '1234567890')
    print(f"Single contact check: {single_result}")
    
    # Check multiple contacts
    multiple_result = check_whatsapp_contacts(
        'YOUR_JWT_TOKEN',
        ['1234567890', '0987654321', '1122334455']
    )
    print(f"Multiple contacts check: {multiple_result}")

except requests.RequestException as e:
    print(f"Error: {e}")
```

### PHP

```php
<?php
function checkWhatsAppContacts($token, $phoneNumbers) {
    $url = 'https://your-api-domain.com/api/v1/whatsapp/contacts/check';
    
    // Handle both single number and array of numbers
    if (is_array($phoneNumbers)) {
        $ids = implode(',', $phoneNumbers);
    } else {
        $ids = $phoneNumbers;
    }
    
    $data = ['ids' => $ids];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/x-www-form-urlencoded'
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
    // Check single contact
    $singleResult = checkWhatsAppContacts('YOUR_JWT_TOKEN', '1234567890');
    echo "Single contact check: " . json_encode($singleResult) . "\n";
    
    // Check multiple contacts
    $multipleResult = checkWhatsAppContacts(
        'YOUR_JWT_TOKEN',
        ['1234567890', '0987654321', '1122334455']
    );
    echo "Multiple contacts check: " . json_encode($multipleResult) . "\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
```

## Response

### Success Response

```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "phone": "1234567890",
      "exists": true,
      "jid": "1234567890@s.whatsapp.net",
      "name": "John Doe"
    },
    {
      "phone": "0987654321",
      "exists": true,
      "jid": "0987654321@s.whatsapp.net",
      "name": null
    },
    {
      "phone": "1122334455",
      "exists": false,
      "jid": null,
      "name": null
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `phone` | string | The phone number that was checked |
| `exists` | boolean | Whether the number is registered on WhatsApp |
| `jid` | string | WhatsApp JID (Jabber ID) if contact exists |
| `name` | string | Contact's display name (if available) |

## Advanced Examples

### Bulk Contact Validation

```javascript
class ContactValidator {
  constructor(token, batchSize = 10) {
    this.token = token;
    this.batchSize = batchSize;
  }

  async validateContacts(phoneNumbers) {
    const results = [];
    const batches = this.createBatches(phoneNumbers, this.batchSize);
    
    for (const batch of batches) {
      try {
        const batchResult = await checkWhatsAppContacts(this.token, batch);
        results.push(...batchResult.data);
        
        // Add delay between batches to avoid rate limiting
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error validating batch ${batch}:`, error.message);
        
        // Add failed contacts with error status
        batch.forEach(phone => {
          results.push({
            phone,
            exists: false,
            error: error.message
          });
        });
      }
    }
    
    return this.processResults(results);
  }

  createBatches(array, size) {
    const batches = [];
    for (let i = 0; i < array.length; i += size) {
      batches.push(array.slice(i, i + size));
    }
    return batches;
  }

  processResults(results) {
    const summary = {
      total: results.length,
      valid: results.filter(r => r.exists).length,
      invalid: results.filter(r => !r.exists).length,
      errors: results.filter(r => r.error).length
    };

    return {
      summary,
      contacts: results,
      validContacts: results.filter(r => r.exists),
      invalidContacts: results.filter(r => !r.exists && !r.error),
      errorContacts: results.filter(r => r.error)
    };
  }
}

// Usage
const validator = new ContactValidator('YOUR_JWT_TOKEN');
const phoneNumbers = [
  '1234567890', '0987654321', '1122334455', 
  '4444555666', '7777888999', '1010101010'
];

validator.validateContacts(phoneNumbers)
  .then(result => {
    console.log('Validation Summary:', result.summary);
    console.log(`✅ Valid contacts: ${result.validContacts.length}`);
    console.log(`❌ Invalid contacts: ${result.invalidContacts.length}`);
    console.log(`⚠️ Errors: ${result.errorContacts.length}`);
  });
```

### Contact Cache Management

```javascript
class ContactCache {
  constructor(token, cacheTTL = 24 * 60 * 60 * 1000) { // 24 hours
    this.token = token;
    this.cache = new Map();
    this.cacheTTL = cacheTTL;
  }

  async checkContact(phoneNumber) {
    const cacheKey = phoneNumber;
    const cached = this.cache.get(cacheKey);
    
    // Return cached result if valid
    if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) {
      return cached.data;
    }
    
    // Check with API
    try {
      const result = await checkWhatsAppContacts(this.token, phoneNumber);
      const contactData = result.data[0];
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: contactData,
        timestamp: Date.now()
      });
      
      return contactData;
    } catch (error) {
      console.error(`Error checking contact ${phoneNumber}:`, error);
      return null;
    }
  }

  async checkMultipleContacts(phoneNumbers) {
    const results = [];
    const uncachedNumbers = [];
    
    // Check cache first
    for (const phone of phoneNumbers) {
      const cached = this.cache.get(phone);
      if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) {
        results.push(cached.data);
      } else {
        uncachedNumbers.push(phone);
      }
    }
    
    // Check uncached numbers
    if (uncachedNumbers.length > 0) {
      try {
        const apiResult = await checkWhatsAppContacts(this.token, uncachedNumbers);
        
        // Cache new results
        apiResult.data.forEach(contact => {
          this.cache.set(contact.phone, {
            data: contact,
            timestamp: Date.now()
          });
          results.push(contact);
        });
      } catch (error) {
        console.error('Error checking uncached contacts:', error);
      }
    }
    
    return results;
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    return {
      total: entries.length,
      valid: entries.filter(([_, value]) => (now - value.timestamp) < this.cacheTTL).length,
      expired: entries.filter(([_, value]) => (now - value.timestamp) >= this.cacheTTL).length
    };
  }
}

// Usage
const contactCache = new ContactCache('YOUR_JWT_TOKEN');

// Check single contact (with caching)
const contact = await contactCache.checkContact('1234567890');
console.log('Contact info:', contact);

// Check multiple contacts (with caching)
const contacts = await contactCache.checkMultipleContacts([
  '1234567890', '0987654321', '1122334455'
]);
console.log('Contacts info:', contacts);

// Get cache statistics
console.log('Cache stats:', contactCache.getCacheStats());
```

### CSV Contact Validation

```javascript
const fs = require('fs');

async function validateContactsFromCSV(token, csvFilePath, outputPath) {
  try {
    // Read CSV file
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    const contacts = [];
    const phoneNumbers = [];
    
    // Parse CSV
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const contact = {};
      
      headers.forEach((header, index) => {
        contact[header.trim()] = values[index]?.trim();
      });
      
      if (contact.phone) {
        contacts.push(contact);
        phoneNumbers.push(contact.phone);
      }
    }
    
    console.log(`Found ${phoneNumbers.length} phone numbers to validate`);
    
    // Validate contacts
    const validator = new ContactValidator(token);
    const validationResult = await validator.validateContacts(phoneNumbers);
    
    // Merge with original contact data
    const enhancedContacts = contacts.map(contact => {
      const validation = validationResult.contacts.find(v => v.phone === contact.phone);
      return {
        ...contact,
        whatsapp_exists: validation?.exists || false,
        whatsapp_jid: validation?.jid || null,
        whatsapp_name: validation?.name || null
      };
    });
    
    // Generate output CSV
    const outputHeaders = Object.keys(enhancedContacts[0]);
    const outputLines = [outputHeaders.join(',')];
    
    enhancedContacts.forEach(contact => {
      const values = outputHeaders.map(header => contact[header] || '');
      outputLines.push(values.join(','));
    });
    
    fs.writeFileSync(outputPath, outputLines.join('\n'));
    
    // Generate report
    const report = {
      total_contacts: contacts.length,
      whatsapp_contacts: enhancedContacts.filter(c => c.whatsapp_exists).length,
      non_whatsapp_contacts: enhancedContacts.filter(c => !c.whatsapp_exists).length,
      validation_summary: validationResult.summary,
      output_file: outputPath
    };
    
    console.log('Validation Report:', report);
    return report;
    
  } catch (error) {
    console.error('Error processing CSV:', error);
    throw error;
  }
}

// Usage
// Input CSV: name,email,phone
// Output CSV: name,email,phone,whatsapp_exists,whatsapp_jid,whatsapp_name

validateContactsFromCSV(
  'YOUR_JWT_TOKEN',
  'contacts.csv',
  'validated_contacts.csv'
).then(report => {
  console.log('CSV validation completed:', report);
});
```

## Error Responses

### Invalid Phone Numbers

```json
{
  "code": 400,
  "message": "Invalid phone number format",
  "error": "Phone numbers must be in international format without +"
}
```

### Too Many Numbers

```json
{
  "code": 400,
  "message": "Too many phone numbers",
  "error": "Maximum 50 phone numbers allowed per request"
}
```

### Rate Limit Exceeded

```json
{
  "code": 429,
  "message": "Rate limit exceeded",
  "error": "Too many requests. Please try again later."
}
```

## Best Practices

### 1. Batch Processing

```javascript
// Process contacts in batches to avoid overwhelming the API
const BATCH_SIZE = 10;
const DELAY_BETWEEN_BATCHES = 1000; // 1 second

async function processBatches(phoneNumbers) {
  const batches = [];
  for (let i = 0; i < phoneNumbers.length; i += BATCH_SIZE) {
    batches.push(phoneNumbers.slice(i, i + BATCH_SIZE));
  }
  
  const results = [];
  for (const batch of batches) {
    const batchResult = await checkWhatsAppContacts(token, batch);
    results.push(...batchResult.data);
    
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }
  
  return results;
}
```

### 2. Error Handling

```javascript
async function safeContactCheck(token, phoneNumbers) {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await checkWhatsAppContacts(token, phoneNumbers);
    } catch (error) {
      attempt++;
      
      if (error.response?.status === 429) {
        // Rate limited - wait longer
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited. Waiting ${waitTime}ms before retry ${attempt}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else if (attempt >= maxRetries) {
        throw error;
      } else {
        // Other error - shorter wait
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}
```

### 3. Phone Number Validation

```javascript
function validatePhoneNumber(phone) {
  // Remove any non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Remove leading + if present
  const normalized = cleaned.startsWith('+') ? cleaned.substring(1) : cleaned;
  
  // Basic validation: 10-15 digits, starting with non-zero
  const phoneRegex = /^[1-9]\d{9,14}$/;
  
  if (!phoneRegex.test(normalized)) {
    throw new Error(`Invalid phone number format: ${phone}`);
  }
  
  return normalized;
}

function validatePhoneNumbers(phoneNumbers) {
  return phoneNumbers.map(phone => {
    try {
      return validatePhoneNumber(phone);
    } catch (error) {
      console.warn(`Skipping invalid phone number: ${phone}`);
      return null;
    }
  }).filter(phone => phone !== null);
}
```

## Use Cases

### Pre-send Validation

```javascript
async function sendMessageWithValidation(token, phoneNumber, message) {
  // Validate contact first
  const contactCheck = await checkWhatsAppContacts(token, phoneNumber);
  const contact = contactCheck.data[0];
  
  if (!contact.exists) {
    throw new Error(`Contact ${phoneNumber} is not on WhatsApp`);
  }
  
  // Proceed with sending message
  return await sendTextMessage(token, phoneNumber, message);
}
```

### Contact List Cleanup

```javascript
async function cleanContactList(token, contacts) {
  const phoneNumbers = contacts.map(c => c.phone);
  const validation = await checkWhatsAppContacts(token, phoneNumbers);
  
  return contacts.filter(contact => {
    const validation_result = validation.data.find(v => v.phone === contact.phone);
    return validation_result?.exists;
  });
}
```

## Rate Limits

- **Maximum 50 phone numbers** per request
- **Rate limiting** applies - space out requests
- **Caching recommended** to reduce API calls

## Next Steps

- Learn about [sending messages](../messaging/send-text) to verified contacts
- Explore [group management](../groups/create-group) with validated participants
- Check out [device management](../device-management) for connection status