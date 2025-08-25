---
sidebar_position: 5
---

# ✏️ Update Group Information

Update WhatsApp group settings including name, description, profile picture, and permissions using the Whatspie API.

<div style={{background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", padding: "1.5rem", borderRadius: "8px", color: "#8b4513", margin: "1.5rem 0"}}>
  <h3 style={{color: "#8b4513", margin: "0 0 1rem 0"}}>⚙️ Group Management</h3>
  <p style={{margin: "0"}}>Modify group settings, update information, change permissions, and customize your WhatsApp group appearance and behavior.</p>
</div>

## 🌐 Endpoint

```
PUT https://api.whatspie.com/groups/{group_id}
```

Where `{group_id}` is the numeric ID of the WhatsApp group.

## 🔐 Authentication

Bearer token required in the `Authorization` header.

## 📋 Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `subject` | string | ❌ | Group name (max 25 characters) |
| `description` | string | ❌ | Group description (max 500 characters) |
| `profile_url` | string | ❌ | URL to group profile picture |
| `permissions` | object | ❌ | Group permissions settings |
| `permissions.allow_send` | boolean | ❌ | Allow members to send messages |
| `permissions.only_admins_can_send` | boolean | ❌ | Only admins can send messages |
| `permissions.only_admins_can_edit` | boolean | ❌ | Only admins can edit group info |
| `disappearing_messages` | object | ❌ | Disappearing messages settings |
| `disappearing_messages.enabled` | boolean | ❌ | Enable/disable disappearing messages |
| `disappearing_messages.duration` | string | ❌ | Duration: "24h", "7d", "90d" |

:::info Admin Required
You must be a group administrator to update group information. Some settings may require creator privileges.
:::

## 🚀 Request Examples

### Update Group Name and Description

```bash
curl -L -X PUT 'https://api.whatspie.com/groups/1' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "subject": "Keluarga Bahagia",
    "description": "Ini deskripsi keluarga yang bahagia dan harmonis"
  }'
```

### Update Group with Profile Picture

```bash
curl -L -X PUT 'https://api.whatspie.com/groups/1' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "subject": "Keluarga Bahagia",
    "description": "Ini deskripsi keluarga yang bahagia dan harmonis",
    "profile_url": "https://wonder-day.com/wp-content/uploads/2020/10/wonder-day-among-us-21.png"
  }'
```

### Update Group Permissions

```bash
curl -L -X PUT 'https://api.whatspie.com/groups/1' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "subject": "Keluarga Bahagia",
    "description": "Ini deskripsi",
    "profile_url": "https://wonder-day.com/wp-content/uploads/2020/10/wonder-day-among-us-21.png",
    "permissions": {
      "allow_send": true,
      "only_admins_can_send": false,
      "only_admins_can_edit": true
    }
  }'
```

### Enable Disappearing Messages

```bash
curl -L -X PUT 'https://api.whatspie.com/groups/1' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "subject": "Private Discussion",
    "disappearing_messages": {
      "enabled": true,
      "duration": "24h"
    }
  }'
```

### Restrict Group to Admin-Only Messages

```bash
curl -L -X PUT 'https://api.whatspie.com/groups/1' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "subject": "Announcements Only",
    "description": "Official announcements - Admin messages only",
    "permissions": {
      "allow_send": true,
      "only_admins_can_send": true,
      "only_admins_can_edit": true
    }
  }'
```

### Update Only Description

```bash
curl -L -X PUT 'https://api.whatspie.com/groups/1' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "description": "Updated group description with new information and guidelines"
  }'
```

## 📊 Response Format

### Success Response

```json
{
  "code": 200,
  "message": "Group updated successfully",
  "data": {
    "id": 1,
    "subject": "Keluarga Bahagia",
    "description": "Ini deskripsi keluarga yang bahagia dan harmonis",
    "participant_count": 8,
    "updated_at": "2024-12-20T15:30:00Z",
    "profile_url": "https://wonder-day.com/wp-content/uploads/2020/10/wonder-day-among-us-21.png",
    "permissions": {
      "allow_send": true,
      "only_admins_can_send": false,
      "only_admins_can_edit": true
    },
    "disappearing_messages": {
      "enabled": false,
      "duration": null
    },
    "changes": [
      "subject",
      "description",
      "profile_url",
      "permissions"
    ]
  }
}
```

### Error Response - Unauthorized

```json
{
  "code": 403,
  "message": "Access denied",
  "error": "You must be a group administrator to update group information"
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

### Error Response - Invalid Data

```json
{
  "code": 400,
  "message": "Validation failed",
  "errors": {
    "subject": ["Group name cannot exceed 25 characters"],
    "description": ["Description cannot exceed 500 characters"],
    "profile_url": ["Invalid URL format"]
  }
}
```

### Error Response - Permission Denied

```json
{
  "code": 403,
  "message": "Permission denied",
  "error": "Only group creator can modify these settings"
}
```

## 🔍 Update Fields Explanation

### Group Subject (Name)

- **Maximum length**: 25 characters
- **Restrictions**: Cannot be empty, special characters allowed
- **Unicode support**: Full emoji and international character support

### Group Description

- **Maximum length**: 500 characters
- **Format**: Plain text with line breaks allowed
- **Unicode support**: Full emoji and international character support

### Profile Picture

- **Format**: Must be a publicly accessible URL
- **Image formats**: JPEG, PNG, WebP recommended
- **Size**: Recommended maximum 640x640 pixels
- **File size**: Maximum 16MB

### Permissions Object

| Permission | Type | Description |
|------------|------|-------------|
| `allow_send` | boolean | Enable/disable messaging in group |
| `only_admins_can_send` | boolean | Restrict messaging to admins only |
| `only_admins_can_edit` | boolean | Restrict group info editing to admins |

### Disappearing Messages

| Setting | Type | Values | Description |
|---------|------|--------|-------------|
| `enabled` | boolean | true/false | Enable disappearing messages |
| `duration` | string | "24h", "7d", "90d" | How long messages remain |

## 💡 Usage Examples

### Update Group with Validation

```javascript
async function updateGroup(groupId, updates) {
  try {
    // Validate updates before sending
    if (updates.subject && updates.subject.length > 25) {
      throw new Error('Group name cannot exceed 25 characters');
    }
    
    if (updates.description && updates.description.length > 500) {
      throw new Error('Description cannot exceed 500 characters');
    }
    
    if (updates.profile_url && !isValidUrl(updates.profile_url)) {
      throw new Error('Invalid profile URL format');
    }
    
    const response = await fetch(`https://api.whatspie.com/groups/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`${errorData.code}: ${errorData.message}`);
    }
    
    const result = await response.json();
    
    console.log(`Group "${result.data.subject}" updated successfully`);
    console.log(`Changes applied: ${result.data.changes.join(', ')}`);
    
    return result.data;
  } catch (error) {
    console.error('Error updating group:', error.message);
    throw error;
  }
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Usage examples
updateGroup(1, {
  subject: "Updated Team Name",
  description: "New description with updated information"
});
```

### Batch Update Multiple Groups

```javascript
async function batchUpdateGroups(updates) {
  const results = [];
  
  for (const update of updates) {
    try {
      const response = await fetch(`https://api.whatspie.com/groups/${update.groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer YOUR_API_TOKEN'
        },
        body: JSON.stringify(update.data)
      });
      
      const result = await response.json();
      
      results.push({
        groupId: update.groupId,
        success: true,
        changes: result.data.changes,
        updatedName: result.data.subject
      });
      
      // Delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      results.push({
        groupId: update.groupId,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

// Usage
const groupUpdates = [
  {
    groupId: 1,
    data: {
      description: "Updated description for group 1"
    }
  },
  {
    groupId: 2,
    data: {
      subject: "New Group Name",
      description: "Updated description for group 2"
    }
  }
];

batchUpdateGroups(groupUpdates).then(results => {
  console.log('Batch update completed:', results);
});
```

### Set Group Permissions Dynamically

```javascript
async function setGroupPermissions(groupId, permissionLevel) {
  const permissionConfigs = {
    'open': {
      allow_send: true,
      only_admins_can_send: false,
      only_admins_can_edit: false
    },
    'restricted': {
      allow_send: true,
      only_admins_can_send: false,
      only_admins_can_edit: true
    },
    'admin_only': {
      allow_send: true,
      only_admins_can_send: true,
      only_admins_can_edit: true
    },
    'read_only': {
      allow_send: false,
      only_admins_can_send: false,
      only_admins_can_edit: true
    }
  };
  
  if (!permissionConfigs[permissionLevel]) {
    throw new Error('Invalid permission level. Use: open, restricted, admin_only, or read_only');
  }
  
  try {
    const response = await fetch(`https://api.whatspie.com/groups/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      },
      body: JSON.stringify({
        permissions: permissionConfigs[permissionLevel]
      })
    });
    
    const result = await response.json();
    
    console.log(`Group permissions set to "${permissionLevel}"`);
    return result.data;
  } catch (error) {
    console.error('Error setting permissions:', error);
    throw error;
  }
}

// Usage examples
setGroupPermissions(1, 'admin_only'); // Only admins can send messages
setGroupPermissions(2, 'restricted');  // Everyone can send, only admins edit
setGroupPermissions(3, 'open');        // Everyone can send and edit
```

### Update Group Profile Picture

```javascript
async function updateGroupProfilePicture(groupId, imageUrl) {
  try {
    // Validate image URL
    if (!imageUrl.match(/\.(jpg|jpeg|png|webp)(\?|$)/i)) {
      throw new Error('Invalid image format. Use JPG, PNG, or WebP');
    }
    
    const response = await fetch(`https://api.whatspie.com/groups/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      },
      body: JSON.stringify({
        profile_url: imageUrl
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    console.log(`Profile picture updated for group "${result.data.subject}"`);
    console.log(`New profile URL: ${result.data.profile_url}`);
    
    return result.data;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
}

// Usage
updateGroupProfilePicture(1, 'https://example.com/new-group-avatar.jpg');
```

### Toggle Disappearing Messages

```javascript
async function toggleDisappearingMessages(groupId, enabled, duration = '24h') {
  const validDurations = ['24h', '7d', '90d'];
  
  if (enabled && !validDurations.includes(duration)) {
    throw new Error('Invalid duration. Use: 24h, 7d, or 90d');
  }
  
  try {
    const response = await fetch(`https://api.whatspie.com/groups/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      },
      body: JSON.stringify({
        disappearing_messages: {
          enabled: enabled,
          duration: enabled ? duration : null
        }
      })
    });
    
    const result = await response.json();
    
    if (enabled) {
      console.log(`Disappearing messages enabled for ${duration}`);
    } else {
      console.log('Disappearing messages disabled');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error toggling disappearing messages:', error);
    throw error;
  }
}

// Usage examples
toggleDisappearingMessages(1, true, '24h');  // Enable for 24 hours
toggleDisappearingMessages(1, true, '7d');   // Enable for 7 days
toggleDisappearingMessages(1, false);        // Disable
```

### Create Group Update Template

```javascript
class GroupUpdateManager {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseUrl = 'https://api.whatspie.com/groups';
  }
  
  async updateGroup(groupId, updates) {
    const response = await fetch(`${this.baseUrl}/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.apiToken}`
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.code}: ${error.message}`);
    }
    
    return await response.json();
  }
  
  // Predefined update templates
  async makePublicGroup(groupId) {
    return this.updateGroup(groupId, {
      permissions: {
        allow_send: true,
        only_admins_can_send: false,
        only_admins_can_edit: false
      }
    });
  }
  
  async makeAnnouncementGroup(groupId) {
    return this.updateGroup(groupId, {
      permissions: {
        allow_send: true,
        only_admins_can_send: true,
        only_admins_can_edit: true
      }
    });
  }
  
  async enablePrivacyMode(groupId, duration = '24h') {
    return this.updateGroup(groupId, {
      disappearing_messages: {
        enabled: true,
        duration: duration
      },
      permissions: {
        allow_send: true,
        only_admins_can_send: false,
        only_admins_can_edit: true
      }
    });
  }
  
  async rebrandGroup(groupId, newName, newDescription, newImage) {
    return this.updateGroup(groupId, {
      subject: newName,
      description: newDescription,
      profile_url: newImage
    });
  }
}

// Usage
const groupManager = new GroupUpdateManager('YOUR_API_TOKEN');

// Make group admin-only for announcements
await groupManager.makeAnnouncementGroup(1);

// Rebrand a group
await groupManager.rebrandGroup(2, 
  'New Team Name', 
  'Updated team description', 
  'https://example.com/new-logo.jpg'
);

// Enable privacy mode
await groupManager.enablePrivacyMode(3, '7d');
```

## ⚠️ Limitations and Considerations

### Permission Requirements

- **Admin required**: Most updates require admin privileges
- **Creator only**: Some settings may require group creator status
- **Member verification**: You must be a group member to update

### Rate Limiting

- **Update frequency**: Maximum 10 updates per group per hour
- **Profile picture**: Maximum 3 profile picture changes per day
- **Burst limit**: Maximum 5 updates per minute across all groups

### Validation Rules

- **Subject length**: Maximum 25 characters
- **Description length**: Maximum 500 characters  
- **Profile URL**: Must be publicly accessible
- **Image format**: JPEG, PNG, WebP recommended
- **File size**: Maximum 16MB for profile pictures

### WhatsApp Restrictions

- **Disappearing messages**: May not be available in all regions
- **Group settings**: Some restrictions may apply based on WhatsApp version
- **Profile pictures**: WhatsApp may compress or resize images

## 🔗 Related Endpoints

- [Get Group By ID](./get-group) - Get current group information
- [Get Groups List](./list-groups) - List all groups
- [Add Members to Group](./add-members) - Add participants
- [Send Group Messages](./send-group-messages) - Send messages after updates
- [Create WhatsApp Groups](./create-group) - Create new groups

## 📞 Support

Need help with group updates?
- 📖 [Group Management Guide](../guides/group-management)
- 🛠️ [Troubleshooting Guide](../troubleshooting)
- 💬 [Community Forum](https://community.whatspie.com)