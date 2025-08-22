---
sidebar_position: 1
---

# Create WhatsApp Groups

Create new WhatsApp groups with multiple participants using the Whatspie API.

## Endpoint

```
POST /api/v1/whatsapp/group
```

## Authentication

Bearer token required in the `Authorization` header.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | ✅ | Group name (max 25 characters) |
| `participants` | array | ✅ | Array of phone numbers to add as participants |

## Request Format

The request should be sent as JSON in the request body.

## Request Examples

### Basic Group Creation

```bash
curl -X POST "https://your-api-domain.com/api/v1/whatsapp/group" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project Team",
    "participants": ["1234567890", "0987654321", "1122334455"]
  }'
```

### cURL with Escaped JSON

```bash
curl -X POST "https://your-api-domain.com/api/v1/whatsapp/group" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Marketing Team\", \"participants\": [\"1234567890\", \"0987654321\"]}"
```

## Code Examples

### Node.js

```javascript
const axios = require('axios');

async function createGroup(token, groupName, participants) {
  try {
    const response = await axios.post(
      'https://your-api-domain.com/api/v1/whatsapp/group',
      {
        name: groupName,
        participants: participants
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating group:', error.response?.data || error.message);
    throw error;
  }
}

// Usage examples
async function examples() {
  const token = 'YOUR_JWT_TOKEN';
  
  // Create a work group
  const workGroup = await createGroup(
    token,
    'Development Team',
    ['1234567890', '0987654321', '5555666777']
  );
  console.log('Work group created:', workGroup);
  
  // Create a family group
  const familyGroup = await createGroup(
    token,
    'Family Chat 👨‍👩‍👧‍👦',
    ['1111222333', '4444555666', '7777888999', '1010101010']
  );
  console.log('Family group created:', familyGroup);
}
```

### Python

```python
import requests
import json

def create_group(token, group_name, participants):
    url = "https://your-api-domain.com/api/v1/whatsapp/group"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    data = {
        'name': group_name,
        'participants': participants
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

# Usage examples
try:
    # Create a study group
    study_group = create_group(
        'YOUR_JWT_TOKEN',
        'Study Group 📚',
        ['1234567890', '0987654321', '1111222333']
    )
    print(f"Study group created: {study_group}")
    
    # Create a sports team group
    sports_group = create_group(
        'YOUR_JWT_TOKEN',
        'Basketball Team 🏀',
        ['4444555666', '7777888999', '1010101010', '2020202020']
    )
    print(f"Sports group created: {sports_group}")

except requests.RequestException as e:
    print(f"Error: {e}")
```

### PHP

```php
<?php
function createGroup($token, $groupName, $participants) {
    $url = 'https://your-api-domain.com/api/v1/whatsapp/group';
    
    $data = [
        'name' => $groupName,
        'participants' => $participants
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json'
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
    // Create a business group
    $businessGroup = createGroup(
        'YOUR_JWT_TOKEN',
        'Sales Team',
        ['1234567890', '0987654321', '1111222333', '4444555666']
    );
    echo "Business group created: " . json_encode($businessGroup) . "\n";
    
    // Create a hobby group
    $hobbyGroup = createGroup(
        'YOUR_JWT_TOKEN',
        'Photography Club 📸',
        ['7777888999', '1010101010', '2020202020']
    );
    echo "Hobby group created: " . json_encode($hobbyGroup) . "\n";

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
  "data": {
    "group_id": "6285156055377-1607992695@g.us",
    "name": "Project Team",
    "participants_added": [
      {
        "phone": "1234567890",
        "status": "added",
        "jid": "1234567890@s.whatsapp.net"
      },
      {
        "phone": "0987654321",
        "status": "added", 
        "jid": "0987654321@s.whatsapp.net"
      },
      {
        "phone": "1122334455",
        "status": "failed",
        "error": "Contact not found on WhatsApp"
      }
    ],
    "created_at": "2024-12-20T10:30:00Z",
    "invite_link": "https://chat.whatsapp.com/ABC123DEF456",
    "creator": "1234567890@c.us"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `group_id` | string | Unique group identifier (use this for other group operations) |
| `name` | string | Group name as created |
| `participants_added` | array | Status of each participant addition attempt |
| `created_at` | string | Group creation timestamp (ISO 8601) |
| `invite_link` | string | WhatsApp group invite link |
| `creator` | string | Creator's WhatsApp ID |

### Participant Status Values

| Status | Description |
|--------|-------------|
| `added` | Participant successfully added to group |
| `failed` | Failed to add participant (not on WhatsApp or other error) |
| `pending` | Participant addition is pending |

## Error Responses

### Invalid Group Name

```json
{
  "code": 400,
  "message": "Invalid group name",
  "error": "Group name cannot be empty or exceed 25 characters"
}
```

### No Participants Provided

```json
{
  "code": 400,
  "message": "No participants provided",
  "error": "At least one participant is required to create a group"
}
```

### Invalid Participant Phone Number

```json
{
  "code": 400,
  "message": "Invalid participant phone number",
  "error": "Phone number '123abc' is not in valid format"
}
```

### Device Not Connected

```json
{
  "code": 400,
  "message": "Device not connected",
  "error": "WhatsApp device is not connected. Please connect first."
}
```

### Group Creation Failed

```json
{
  "code": 500,
  "message": "Group creation failed",
  "error": "Unable to create group due to WhatsApp limitations"
}
```

## Advanced Examples

### Create Group with Validation

```javascript
class GroupManager {
  constructor(token) {
    this.token = token;
  }

  validateGroupName(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Group name is required and must be a string');
    }
    
    if (name.length > 25) {
      throw new Error('Group name cannot exceed 25 characters');
    }
    
    if (name.trim().length === 0) {
      throw new Error('Group name cannot be empty');
    }
    
    return name.trim();
  }

  validateParticipants(participants) {
    if (!Array.isArray(participants) || participants.length === 0) {
      throw new Error('At least one participant is required');
    }
    
    if (participants.length > 256) {
      throw new Error('Maximum 256 participants allowed in a group');
    }
    
    // Validate phone number format
    const phoneRegex = /^[1-9]\d{10,14}$/;
    const invalidNumbers = participants.filter(phone => !phoneRegex.test(phone));
    
    if (invalidNumbers.length > 0) {
      throw new Error(`Invalid phone numbers: ${invalidNumbers.join(', ')}`);
    }
    
    // Remove duplicates
    return [...new Set(participants)];
  }

  async createGroup(name, participants) {
    const validName = this.validateGroupName(name);
    const validParticipants = this.validateParticipants(participants);
    
    return await createGroup(this.token, validName, validParticipants);
  }
}

// Usage
const groupManager = new GroupManager('YOUR_JWT_TOKEN');

try {
  const result = await groupManager.createGroup(
    'Product Launch Team',
    ['1234567890', '0987654321', '1111222333']
  );
  console.log('Group created successfully:', result.data.group_id);
} catch (error) {
  console.error('Validation error:', error.message);
}
```

### Bulk Group Creation

```javascript
async function createMultipleGroups(token, groupsData) {
  const results = [];
  
  for (const groupData of groupsData) {
    try {
      const result = await createGroup(
        token,
        groupData.name,
        groupData.participants
      );
      
      results.push({
        name: groupData.name,
        success: true,
        group_id: result.data.group_id,
        participants_added: result.data.participants_added.length
      });
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      results.push({
        name: groupData.name,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

// Usage
const groupsToCreate = [
  {
    name: 'Marketing Team',
    participants: ['1111111111', '2222222222', '3333333333']
  },
  {
    name: 'Development Team', 
    participants: ['4444444444', '5555555555', '6666666666']
  },
  {
    name: 'Support Team',
    participants: ['7777777777', '8888888888', '9999999999']
  }
];

const results = await createMultipleGroups('YOUR_JWT_TOKEN', groupsToCreate);
console.log('Bulk group creation results:', results);
```

### Create Group with CSV Import

```javascript
const fs = require('fs');

function parseCSVContacts(csvFilePath) {
  const csvContent = fs.readFileSync(csvFilePath, 'utf8');
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  const contacts = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const contact = {};
    
    headers.forEach((header, index) => {
      contact[header.trim()] = values[index]?.trim();
    });
    
    if (contact.phone) {
      contacts.push(contact);
    }
  }
  
  return contacts;
}

async function createGroupFromCSV(token, groupName, csvFilePath) {
  try {
    const contacts = parseCSVContacts(csvFilePath);
    const phoneNumbers = contacts.map(contact => contact.phone);
    
    console.log(`Creating group "${groupName}" with ${phoneNumbers.length} participants`);
    
    const result = await createGroup(token, groupName, phoneNumbers);
    
    // Generate report
    const report = {
      group_id: result.data.group_id,
      group_name: result.data.name,
      total_contacts: phoneNumbers.length,
      successfully_added: result.data.participants_added.filter(p => p.status === 'added').length,
      failed_additions: result.data.participants_added.filter(p => p.status === 'failed'),
      invite_link: result.data.invite_link
    };
    
    return report;
  } catch (error) {
    console.error('Error creating group from CSV:', error);
    throw error;
  }
}

// Usage
// CSV format: name,phone,email
// John Doe,1234567890,john@example.com
// Jane Smith,0987654321,jane@example.com

createGroupFromCSV('YOUR_JWT_TOKEN', 'Customer Support', 'contacts.csv')
  .then(report => {
    console.log('Group creation report:', report);
  })
  .catch(error => {
    console.error('Failed to create group:', error.message);
  });
```

## Best Practices

### 1. Group Name Guidelines

```javascript
const GROUP_NAME_RULES = {
  maxLength: 25,
  minLength: 1,
  allowedChars: /^[a-zA-Z0-9\s\u00C0-\u017F\u0100-\u017F\u1E00-\u1EFF\u2010-\u2015\u2018-\u201D\u2190-\u2199\u21B6-\u21B7\u21BA-\u21BB\u21C4-\u21C6\u21E4-\u21E5\u21E6-\u21E9\u21F1-\u21F2\u21F4-\u21F7\u21F9-\u21FA\u2600-\u26FF\u2700-\u27BF\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF\u1F1E0-\u1F1FF]+$/
};

function validateGroupName(name) {
  if (!name || name.length < GROUP_NAME_RULES.minLength) {
    throw new Error('Group name is required');
  }
  
  if (name.length > GROUP_NAME_RULES.maxLength) {
    throw new Error(`Group name cannot exceed ${GROUP_NAME_RULES.maxLength} characters`);
  }
  
  // Optional: Check for appropriate content
  const inappropriateWords = ['spam', 'hack', 'bot']; // Add your list
  const nameWords = name.toLowerCase().split(' ');
  const hasInappropriateContent = inappropriateWords.some(word => 
    nameWords.includes(word)
  );
  
  if (hasInappropriateContent) {
    throw new Error('Group name contains inappropriate content');
  }
  
  return true;
}
```

### 2. Participant Management

```javascript
async function verifyParticipants(token, participants) {
  const verificationResults = [];
  
  // Check if contacts exist on WhatsApp (if you have contact verification endpoint)
  for (const phone of participants) {
    try {
      // This would be a hypothetical contact verification call
      const exists = await checkWhatsAppContact(token, phone);
      verificationResults.push({ phone, exists });
    } catch (error) {
      verificationResults.push({ phone, exists: false, error: error.message });
    }
  }
  
  return verificationResults;
}

async function createGroupWithVerification(token, groupName, participants) {
  console.log('Verifying participants...');
  const verificationResults = await verifyParticipants(token, participants);
  
  const validParticipants = verificationResults
    .filter(result => result.exists)
    .map(result => result.phone);
  
  const invalidParticipants = verificationResults
    .filter(result => !result.exists)
    .map(result => result.phone);
  
  if (invalidParticipants.length > 0) {
    console.warn('Invalid participants found:', invalidParticipants);
  }
  
  if (validParticipants.length === 0) {
    throw new Error('No valid participants found');
  }
  
  return await createGroup(token, groupName, validParticipants);
}
```

### 3. Error Handling and Logging

```javascript
class GroupCreationLogger {
  static logGroupCreation(groupName, participants, result) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'GROUP_CREATION',
      group_name: groupName,
      participants_count: participants.length,
      success: true,
      group_id: result.data.group_id,
      participants_added: result.data.participants_added.filter(p => p.status === 'added').length,
      participants_failed: result.data.participants_added.filter(p => p.status === 'failed').length
    };
    
    console.log('Group Creation Log:', JSON.stringify(logEntry, null, 2));
    
    // Save to file or database
    // fs.appendFileSync('group-creation.log', JSON.stringify(logEntry) + '\n');
  }
  
  static logGroupCreationError(groupName, participants, error) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'GROUP_CREATION',
      group_name: groupName,
      participants_count: participants.length,
      success: false,
      error: error.message
    };
    
    console.error('Group Creation Error:', JSON.stringify(logEntry, null, 2));
  }
}

async function createGroupWithLogging(token, groupName, participants) {
  try {
    const result = await createGroup(token, groupName, participants);
    GroupCreationLogger.logGroupCreation(groupName, participants, result);
    return result;
  } catch (error) {
    GroupCreationLogger.logGroupCreationError(groupName, participants, error);
    throw error;
  }
}
```

## Common Use Cases

### Team Collaboration

```javascript
async function createTeamGroups(token, teams) {
  const results = [];
  
  for (const team of teams) {
    try {
      const groupName = `${team.name} - ${team.project}`;
      const participants = team.members.map(member => member.phone);
      
      const result = await createGroup(token, groupName, participants);
      
      results.push({
        team: team.name,
        group_id: result.data.group_id,
        invite_link: result.data.invite_link,
        success: true
      });
      
    } catch (error) {
      results.push({
        team: team.name,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}
```

### Event Management

```javascript
async function createEventGroups(token, eventData) {
  const groups = [];
  
  // Create main event group
  const mainGroup = await createGroup(
    token,
    `${eventData.name} - Main`,
    eventData.allParticipants
  );
  groups.push({ type: 'main', ...mainGroup.data });
  
  // Create sub-groups by department/role
  for (const department of eventData.departments) {
    const deptGroup = await createGroup(
      token,
      `${eventData.name} - ${department.name}`,
      department.members
    );
    groups.push({ type: 'department', department: department.name, ...deptGroup.data });
    
    // Delay between group creations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return groups;
}
```

## Limitations

- **Group name**: Maximum 25 characters
- **Participants**: Maximum 256 participants per group
- **Rate limiting**: Avoid creating multiple groups rapidly
- **WhatsApp limits**: Some participants may not be addable due to privacy settings

## Next Steps

- Learn about [sending messages](../messaging/send-text) to individual contacts
- Explore [contact verification](../contacts/check-contacts) before adding to groups
- Check out [device management](../device-management) for maintaining connections