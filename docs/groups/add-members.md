---
sidebar_position: 6
---

# 👥 Add Members to Group

Add new participants to WhatsApp groups using the Whatspie API with support for bulk member addition and invitation management.

<div style={{background: "linear-gradient(135deg, #a2facf 0%, #64b3f4 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>🎯 Group Expansion</h3>
  <p style={{margin: "0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>Easily add new members to WhatsApp groups with support for multiple participants, validation, and automatic invitation handling.</p>
</div>

## 🌐 Endpoint

```
POST https://api.whatspie.com/api/groups/{group_id}/members/add
```

Where `{group_id}` is the numeric ID of the WhatsApp group.

## 🔐 Authentication

Bearer token required in the `Authorization` header.

## 📋 Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `participants` | array | ✅ | Array of phone numbers to add as participants |

### Phone Number Format

- **Format**: International format without leading zeros
- **Example**: `"6287830605729"` (not `"087830605729"` or `"+6287830605729"`)
- **Validation**: Must be valid WhatsApp numbers

:::info Admin Permission Required
You must be a group administrator to add new members to the group.
:::

## 🚀 Request Examples

### Add Single Member

```bash
curl -L -X POST 'https://api.whatspie.com/api/groups/2/members/add' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "participants": [
      "6287830605729"
    ]
  }'
```

### Add Multiple Members

```bash
curl -L -X POST 'https://api.whatspie.com/api/groups/2/members/add' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "participants": [
      "6287830605729",
      "6281234567890",
      "6289876543210",
      "6285544332211"
    ]
  }'
```

### Add Members from Different Countries

```bash
curl -L -X POST 'https://api.whatspie.com/api/groups/2/members/add' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "participants": [
      "6287830605729",
      "60123456789",
      "65123456789",
      "91123456789",
      "1234567890"
    ]
  }'
```

## 📊 Response Format

### Success Response

```json
{
  "code": 200,
  "message": "Members added successfully",
  "data": {
    "group_id": "15378",
    "group_name": "Project Team",
    "added_members": [
      {
        "phone": "6287830605729",
        "status": "added",
        "name": "John Doe",
        "added_at": "2024-12-20T15:30:00Z"
      },
      {
        "phone": "6281234567890",
        "status": "added",
        "name": "Jane Smith",
        "added_at": "2024-12-20T15:30:00Z"
      }
    ],
    "failed_members": [],
    "total_added": 2,
    "total_failed": 0,
    "new_participant_count": 12
  }
}
```

### Partial Success Response

```json
{
  "code": 200,
  "message": "Some members added successfully",
  "data": {
    "group_id": "15378",
    "group_name": "Project Team",
    "added_members": [
      {
        "phone": "6287830605729",
        "status": "added",
        "name": "John Doe",
        "added_at": "2024-12-20T15:30:00Z"
      }
    ],
    "failed_members": [
      {
        "phone": "6281234567890",
        "status": "failed",
        "error": "User not found on WhatsApp",
        "error_code": "USER_NOT_FOUND"
      },
      {
        "phone": "6289876543210", 
        "status": "failed",
        "error": "User has blocked your device",
        "error_code": "USER_BLOCKED"
      },
      {
        "phone": "6285544332211",
        "status": "failed", 
        "error": "User is already a group member",
        "error_code": "ALREADY_MEMBER"
      }
    ],
    "total_added": 1,
    "total_failed": 3,
    "new_participant_count": 11
  }
}
```

### Error Response - Unauthorized

```json
{
  "code": 403,
  "message": "Access denied",
  "error": "You must be a group administrator to add members"
}
```

### Error Response - Group Not Found

```json
{
  "code": 404,
  "message": "Group not found",
  "error": "The specified group ID does not exist or you don't have access to it"
}
```

### Error Response - Invalid Request

```json
{
  "code": 400,
  "message": "Validation failed",
  "errors": {
    "participants": [
      "Participants array is required",
      "At least one participant must be specified",
      "Maximum 20 participants per request"
    ]
  }
}
```

### Error Response - Group Full

```json
{
  "code": 400,
  "message": "Group capacity exceeded",
  "error": "WhatsApp group member limit reached (maximum 1024 members)"
}
```

## 🔍 Response Fields Explained

### Added Members Object

| Field | Type | Description |
|-------|------|-------------|
| `phone` | string | Member's phone number |
| `status` | string | "added" - successfully added to group |
| `name` | string | Member's display name (if available) |
| `added_at` | string | Timestamp when member was added (ISO 8601) |

### Failed Members Object

| Field | Type | Description |
|-------|------|-------------|
| `phone` | string | Member's phone number |
| `status` | string | "failed" - addition failed |
| `error` | string | Human-readable error message |
| `error_code` | string | Error code for programmatic handling |

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `USER_NOT_FOUND` | Phone number not registered on WhatsApp |
| `USER_BLOCKED` | User has blocked your device |
| `ALREADY_MEMBER` | User is already a group member |
| `PRIVACY_SETTINGS` | User's privacy settings prevent adding |
| `GROUP_FULL` | Group has reached maximum member limit |
| `RATE_LIMITED` | Too many addition requests |
| `INVALID_NUMBER` | Phone number format is invalid |

## 💡 Usage Examples

### Add Members with Error Handling

```javascript
async function addGroupMembers(groupId, phoneNumbers) {
  try {
    const response = await fetch(`https://api.whatspie.com/api/groups/${groupId}/members/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      },
      body: JSON.stringify({
        participants: phoneNumbers
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`${errorData.code}: ${errorData.message}`);
    }
    
    const result = await response.json();
    
    console.log(`✅ Added ${result.data.total_added} members to "${result.data.group_name}"`);
    
    if (result.data.failed_members.length > 0) {
      console.log(`❌ Failed to add ${result.data.total_failed} members:`);
      result.data.failed_members.forEach(member => {
        console.log(`  - ${member.phone}: ${member.error}`);
      });
    }
    
    result.data.added_members.forEach(member => {
      console.log(`  + ${member.name || member.phone} added successfully`);
    });
    
    return result.data;
  } catch (error) {
    console.error('Error adding members:', error.message);
    throw error;
  }
}

// Usage
const phoneNumbers = ['6287830605729', '6281234567890', '6289876543210'];
addGroupMembers(2, phoneNumbers);
```

### Bulk Member Addition with Validation

```javascript
function validatePhoneNumbers(phoneNumbers) {
  const validNumbers = [];
  const invalidNumbers = [];
  
  phoneNumbers.forEach(phone => {
    // Remove any non-numeric characters
    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    // Check if it's a valid international format
    if (cleanPhone.length >= 10 && cleanPhone.length <= 15) {
      validNumbers.push(cleanPhone);
    } else {
      invalidNumbers.push(phone);
    }
  });
  
  return { validNumbers, invalidNumbers };
}

async function bulkAddMembers(groupId, phoneNumbers) {
  // Validate phone numbers first
  const { validNumbers, invalidNumbers } = validatePhoneNumbers(phoneNumbers);
  
  if (invalidNumbers.length > 0) {
    console.warn(`Invalid phone numbers detected:`, invalidNumbers);
  }
  
  if (validNumbers.length === 0) {
    throw new Error('No valid phone numbers provided');
  }
  
  // Split into batches of 20 (API limit)
  const batchSize = 20;
  const batches = [];
  
  for (let i = 0; i < validNumbers.length; i += batchSize) {
    batches.push(validNumbers.slice(i, i + batchSize));
  }
  
  const results = [];
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    
    try {
      console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} members)...`);
      
      const result = await addGroupMembers(groupId, batch);
      results.push(result);
      
      // Delay between batches to avoid rate limiting
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`Batch ${i + 1} failed:`, error.message);
      results.push({ error: error.message, batch: batch });
    }
  }
  
  // Summarize results
  const totalAdded = results.reduce((sum, result) => 
    sum + (result.total_added || 0), 0
  );
  const totalFailed = results.reduce((sum, result) => 
    sum + (result.total_failed || 0), 0
  );
  
  console.log(`\n📊 Bulk Addition Summary:`);
  console.log(`✅ Total Added: ${totalAdded}`);
  console.log(`❌ Total Failed: ${totalFailed}`);
  console.log(`📋 Invalid Numbers: ${invalidNumbers.length}`);
  
  return results;
}

// Usage
const membersList = [
  '6287830605729', '6281234567890', '6289876543210',
  '+62855-4433-2211', '628-1122-334455', // These will be cleaned
  'invalid-number', // This will be rejected
  '6287766554433', '6281987654321'
];

bulkAddMembers(2, membersList);
```

### Add Members from CSV File

```javascript
async function addMembersFromCSV(groupId, csvData) {
  // Parse CSV data
  const lines = csvData.trim().split('\n');
  const headers = lines[0].toLowerCase().split(',');
  
  const phoneIndex = headers.findIndex(h => 
    h.includes('phone') || h.includes('number') || h.includes('mobile')
  );
  const nameIndex = headers.findIndex(h => 
    h.includes('name') || h.includes('nama')
  );
  
  if (phoneIndex === -1) {
    throw new Error('No phone number column found in CSV');
  }
  
  const members = [];
  
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    const phone = row[phoneIndex]?.trim();
    const name = nameIndex !== -1 ? row[nameIndex]?.trim() : '';
    
    if (phone) {
      members.push({ phone, name });
    }
  }
  
  console.log(`📋 Found ${members.length} members in CSV`);
  
  // Extract phone numbers
  const phoneNumbers = members.map(m => m.phone);
  
  // Add members
  const result = await bulkAddMembers(groupId, phoneNumbers);
  
  // Create report
  const report = {
    csvMembers: members.length,
    addedMembers: result.reduce((sum, r) => sum + (r.total_added || 0), 0),
    failedMembers: result.reduce((sum, r) => sum + (r.total_failed || 0), 0),
    details: result
  };
  
  console.log(`\n📊 CSV Import Report:`);
  console.log(`📋 CSV Records: ${report.csvMembers}`);
  console.log(`✅ Added: ${report.addedMembers}`);
  console.log(`❌ Failed: ${report.failedMembers}`);
  
  return report;
}

// Usage with sample CSV
const sampleCSV = `name,phone,email
John Doe,6287830605729,john@example.com
Jane Smith,6281234567890,jane@example.com
Mike Wilson,6289876543210,mike@example.com`;

addMembersFromCSV(2, sampleCSV);
```

### Smart Member Addition with Retry

```javascript
class GroupMemberManager {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseUrl = 'https://api.whatspie.com/api/groups';
    this.retryAttempts = 3;
    this.retryDelay = 5000; // 5 seconds
  }
  
  async addMembers(groupId, phoneNumbers, attempt = 1) {
    try {
      const response = await fetch(`${this.baseUrl}/${groupId}/members/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.apiToken}`
        },
        body: JSON.stringify({
          participants: phoneNumbers
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`${result.code}: ${result.message}`);
      }
      
      return result.data;
    } catch (error) {
      if (attempt < this.retryAttempts && error.message.includes('rate limit')) {
        console.log(`Rate limited. Retrying in ${this.retryDelay / 1000}s (attempt ${attempt + 1}/${this.retryAttempts})`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.addMembers(groupId, phoneNumbers, attempt + 1);
      }
      throw error;
    }
  }
  
  async addMembersWithRetry(groupId, phoneNumbers) {
    const maxRetries = 3;
    let attempt = 0;
    let failedNumbers = phoneNumbers;
    const results = [];
    
    while (attempt < maxRetries && failedNumbers.length > 0) {
      attempt++;
      console.log(`\nAttempt ${attempt}: Adding ${failedNumbers.length} members...`);
      
      try {
        const result = await this.addMembers(groupId, failedNumbers);
        results.push(result);
        
        // Only retry numbers that failed due to retryable errors
        failedNumbers = result.failed_members
          .filter(member => this.isRetryableError(member.error_code))
          .map(member => member.phone);
        
        if (failedNumbers.length > 0) {
          console.log(`${failedNumbers.length} members failed with retryable errors`);
          await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        }
        
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error.message);
        if (attempt >= maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 15000)); // Wait 15 seconds
      }
    }
    
    return this.consolidateResults(results);
  }
  
  isRetryableError(errorCode) {
    const retryableErrors = ['RATE_LIMITED', 'TEMPORARY_ERROR', 'NETWORK_ERROR'];
    return retryableErrors.includes(errorCode);
  }
  
  consolidateResults(results) {
    const consolidated = {
      total_added: 0,
      total_failed: 0,
      added_members: [],
      failed_members: [],
      attempts: results.length
    };
    
    results.forEach(result => {
      consolidated.total_added += result.total_added || 0;
      consolidated.added_members.push(...(result.added_members || []));
      consolidated.failed_members.push(...(result.failed_members || []));
    });
    
    // Remove duplicates from failed members (keep only final failure)
    const uniqueFailures = new Map();
    consolidated.failed_members.forEach(member => {
      uniqueFailures.set(member.phone, member);
    });
    consolidated.failed_members = Array.from(uniqueFailures.values());
    consolidated.total_failed = consolidated.failed_members.length;
    
    return consolidated;
  }
}

// Usage
const memberManager = new GroupMemberManager('YOUR_API_TOKEN');

const phoneNumbers = ['6287830605729', '6281234567890', '6289876543210'];
memberManager.addMembersWithRetry(2, phoneNumbers)
  .then(result => {
    console.log('\n✅ Final Result:');
    console.log(`Added: ${result.total_added}`);
    console.log(`Failed: ${result.total_failed}`);
    console.log(`Attempts: ${result.attempts}`);
  })
  .catch(error => {
    console.error('Final error:', error.message);
  });
```

### Monitor Member Addition Progress

```javascript
async function addMembersWithProgress(groupId, phoneNumbers, onProgress) {
  const batchSize = 5; // Smaller batches for better progress tracking
  const batches = [];
  
  for (let i = 0; i < phoneNumbers.length; i += batchSize) {
    batches.push(phoneNumbers.slice(i, i + batchSize));
  }
  
  const results = {
    total_members: phoneNumbers.length,
    processed: 0,
    added: 0,
    failed: 0,
    added_members: [],
    failed_members: [],
    progress: 0
  };
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    
    try {
      // Update progress
      results.progress = Math.round((i / batches.length) * 100);
      if (onProgress) {
        onProgress({
          ...results,
          currentBatch: i + 1,
          totalBatches: batches.length,
          status: `Processing batch ${i + 1}/${batches.length}...`
        });
      }
      
      const response = await fetch(`https://api.whatspie.com/api/groups/${groupId}/members/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer YOUR_API_TOKEN'
        },
        body: JSON.stringify({
          participants: batch
        })
      });
      
      const batchResult = await response.json();
      
      if (response.ok) {
        results.added += batchResult.data.total_added || 0;
        results.failed += batchResult.data.total_failed || 0;
        results.processed += batch.length;
        
        if (batchResult.data.added_members) {
          results.added_members.push(...batchResult.data.added_members);
        }
        if (batchResult.data.failed_members) {
          results.failed_members.push(...batchResult.data.failed_members);
        }
      } else {
        // Entire batch failed
        results.failed += batch.length;
        results.processed += batch.length;
        
        batch.forEach(phone => {
          results.failed_members.push({
            phone: phone,
            status: 'failed',
            error: batchResult.message || 'Batch processing failed',
            error_code: 'BATCH_FAILED'
          });
        });
      }
      
      // Delay between batches
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`Batch ${i + 1} error:`, error.message);
      
      // Mark entire batch as failed
      results.failed += batch.length;
      results.processed += batch.length;
      
      batch.forEach(phone => {
        results.failed_members.push({
          phone: phone,
          status: 'failed',
          error: error.message,
          error_code: 'NETWORK_ERROR'
        });
      });
    }
  }
  
  // Final progress update
  results.progress = 100;
  if (onProgress) {
    onProgress({
      ...results,
      status: 'Completed'
    });
  }
  
  return results;
}

// Usage with progress callback
const phoneNumbers = Array.from({ length: 50 }, (_, i) => `628${String(i).padStart(9, '0')}`);

addMembersWithProgress(2, phoneNumbers, (progress) => {
  console.clear();
  console.log(`📊 Adding Members Progress: ${progress.progress}%`);
  console.log(`Status: ${progress.status}`);
  console.log(`Processed: ${progress.processed}/${progress.total_members}`);
  console.log(`✅ Added: ${progress.added}`);
  console.log(`❌ Failed: ${progress.failed}`);
  
  if (progress.currentBatch) {
    console.log(`Batch: ${progress.currentBatch}/${progress.totalBatches}`);
  }
  
  // Simple progress bar
  const barLength = 30;
  const filledLength = Math.round((progress.progress / 100) * barLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  console.log(`[${bar}] ${progress.progress}%`);
});
```

## ⚠️ Limitations and Considerations

### WhatsApp Restrictions

- **Group member limit**: Maximum 1024 members per group
- **Privacy settings**: Users can block being added to groups
- **WhatsApp registration**: Phone numbers must be registered on WhatsApp
- **Admin requirement**: Only group admins can add members

### API Limitations

- **Batch size**: Maximum 20 participants per request
- **Rate limiting**: Maximum 10 requests per minute per group
- **Daily limit**: Maximum 500 member additions per group per day
- **Phone format**: International format required (no leading + or 00)

### Error Handling

- **Partial failures**: Some members may be added while others fail
- **Retry logic**: Implement retry for rate-limited requests
- **Validation**: Always validate phone numbers before sending
- **Logging**: Log failed additions for manual review

### Best Practices

- **Batch processing**: Split large member lists into smaller batches
- **Progress tracking**: Implement progress callbacks for bulk operations
- **Error reporting**: Provide detailed feedback on failures
- **User consent**: Ensure users consent to being added to groups

## 🔗 Related Endpoints

- [Get Group By ID](./get-group) - Check current group members
- [Get Groups List](./list-groups) - Find groups to add members to
- [Update Group Information](./update-group) - Modify group settings
- [Send Group Messages](./send-group-messages) - Welcome new members
- [Create WhatsApp Groups](./create-group) - Create groups with initial members
