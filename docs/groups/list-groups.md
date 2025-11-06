---
sidebar_position: 3
---

# 📋 Get Groups List

Retrieve a list of all WhatsApp groups associated with your device using the Whatspie API.

<div style={{background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>📱 Group Management</h3>
  <p style={{margin: "0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>Get comprehensive information about all WhatsApp groups your device is a member of, including group details, member counts, and permissions.</p>
</div>

## 🌐 Endpoint

```
GET https://api.whatspie.com/groups
```

## 🔐 Authentication

Bearer token required in the `Authorization` header.

## 📋 Request Parameters

This endpoint does not require any request parameters. Simply make a GET request with proper authentication.

## 🚀 Request Example

### Basic Groups List Request

```bash
curl -L -X GET 'https://api.whatspie.com/groups' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### With Custom Headers

```bash
curl -L -X GET 'https://api.whatspie.com/groups' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'User-Agent: MyApp/1.0'
```

## 📊 Response Format

### Success Response

```json
{
  "code": 200,
  "message": "Groups retrieved successfully",
  "data": [
    {
      "id": "15378",
      "device_id": "5",
      "jid": "120363022368688477@g.us",
      "title": "Www.sss-universe.co.id",
      "description": null,
      "image_url": null,
      "muted": false,
      "spam": false,
      "group_created_at": "2022-02-03T07:19:12Z",
      "created_at": "2024-02-12T04:14:21Z",
      "updated_at": "2024-02-12T04:14:21Z"
    },
    {
      "id": "15379",
      "device_id": "5",
      "jid": "120363055789123456@g.us",
      "title": "Project Team Alpha",
      "description": "Development team for Project Alpha",
      "image_url": "https://example.com/group-avatar-1.jpg",
      "muted": false,
      "spam": false,
      "group_created_at": "2024-11-15T09:00:00Z",
      "created_at": "2024-11-15T09:05:00Z",
      "updated_at": "2024-12-18T14:30:00Z"
    },
    {
      "id": "15380",
      "device_id": "5",
      "jid": "120363078912345678@g.us",
      "title": "Marketing Team",
      "description": "Marketing campaigns and strategies",
      "image_url": "https://example.com/group-avatar-2.jpg",
      "muted": false,
      "spam": false,
      "group_created_at": "2024-10-20T11:15:00Z",
      "created_at": "2024-10-20T11:20:00Z",
      "updated_at": "2024-12-19T16:20:00Z"
    },
    {
      "id": "15381",
      "device_id": "5",
      "jid": "120363091234567890@g.us",
      "title": "Family Group",
      "description": "Our lovely family chat",
      "image_url": null,
      "muted": true,
      "spam": false,
      "group_created_at": "2024-09-05T18:00:00Z",
      "created_at": "2024-09-05T18:05:00Z",
      "updated_at": "2024-12-20T07:15:00Z"
    },
    {
      "id": "15382",
      "device_id": "5",
      "jid": "120363098765432109@g.us",
      "title": "Study Group - JavaScript",
      "description": "Learning JavaScript together",
      "image_url": "https://example.com/group-avatar-4.jpg",
      "muted": false,
      "spam": false,
      "group_created_at": "2024-11-01T14:30:00Z",
      "created_at": "2024-11-01T14:35:00Z",
      "updated_at": "2024-12-19T20:45:00Z"
    }
  ]
}
```

### Error Response - Unauthorized

```json
{
  "code": 401,
  "message": "Unauthorized",
  "error": "Invalid or missing authentication token"
}
```

### Error Response - Device Not Found

```json
{
  "code": 404,
  "message": "Device not found",
  "error": "The specified device is not registered or not connected"
}
```

## 🔍 Response Fields Explained

### Group Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique group identifier |
| `device_id` | string | ID of the device associated with this group |
| `jid` | string | WhatsApp Group JID (Jabber ID) identifier |
| `title` | string | Group name/title |
| `description` | string/null | Group description (can be null) |
| `image_url` | string/null | Group profile picture URL (can be null) |
| `muted` | boolean | Whether the group is muted for your device |
| `spam` | boolean | Whether the group is marked as spam |
| `group_created_at` | string | When the group was created on WhatsApp (ISO 8601) |
| `created_at` | string | When the group was first synced to your device (ISO 8601) |
| `updated_at` | string | Last update timestamp (ISO 8601) |

### Field Descriptions

**JID (Jabber ID)**: The WhatsApp-specific identifier for groups, always ends with `@g.us` for groups.

**Timestamps**:
- `group_created_at`: Original WhatsApp group creation time
- `created_at`: When your device first joined/synced the group  
- `updated_at`: Last time group information was updated locally

**Status Fields**:
- `muted`: Group notifications are disabled
- `spam`: Group is marked as spam/unwanted

## 💡 Usage Examples

### Filter Groups by Status

```javascript
async function getFilteredGroups() {
  try {
    const response = await fetch('https://api.whatspie.com/groups', {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      }
    });
    
    const result = await response.json();
    const groups = result.data;
    
    // Filter unmuted groups (active groups)
    const activeGroups = groups.filter(group => !group.muted);
    
    // Filter groups created in the last 30 days
    const recentGroups = groups.filter(group => {
      const groupDate = new Date(group.group_created_at);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return groupDate > thirtyDaysAgo;
    });
    
    console.log(`Active groups (unmuted): ${activeGroups.length}`);
    activeGroups.forEach(group => {
      console.log(`- ${group.title} (ID: ${group.id})`);
    });
    
    console.log(`\nRecent groups (last 30 days): ${recentGroups.length}`);
    recentGroups.forEach(group => {
      const createdDate = new Date(group.group_created_at).toLocaleDateString();
      console.log(`- ${group.title} (Created: ${createdDate})`);
    });
    
    return { activeGroups, recentGroups };
  } catch (error) {
    console.error('Error fetching groups:', error);
  }
}
```

### Get Recently Updated Groups

```javascript
async function getRecentlyUpdatedGroups(hoursAgo = 24) {
  try {
    const response = await fetch('https://api.whatspie.com/groups', {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      }
    });
    
    const result = await response.json();
    const cutoffTime = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
    
    // Filter groups updated recently
    const recentlyUpdated = result.data.filter(group => {
      return new Date(group.updated_at) > cutoffTime;
    });
    
    // Sort by most recent update
    recentlyUpdated.sort((a, b) => 
      new Date(b.updated_at) - new Date(a.updated_at)
    );
    
    console.log(`${recentlyUpdated.length} groups updated in last ${hoursAgo} hours:`);
    recentlyUpdated.forEach(group => {
      const lastUpdate = new Date(group.updated_at).toLocaleString();
      const mutedStatus = group.muted ? ' (Muted)' : '';
      console.log(`- ${group.title}: ${lastUpdate}${mutedStatus}`);
    });
    
    return recentlyUpdated;
  } catch (error) {
    console.error('Error fetching recently updated groups:', error);
  }
}
```

### Export Groups Data

```javascript
async function exportGroupsData() {
  try {
    const response = await fetch('https://api.whatspie.com/groups', {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      }
    });
    
    const result = await response.json();
    
    // Prepare data for export
    const exportData = result.data.map(group => ({
      ID: group.id,
      'Device ID': group.device_id,
      JID: group.jid,
      Title: group.title,
      Description: group.description || 'No description',
      'Has Image': group.image_url ? 'Yes' : 'No',
      Muted: group.muted ? 'Yes' : 'No',
      Spam: group.spam ? 'Yes' : 'No',
      'Group Created': new Date(group.group_created_at).toLocaleDateString(),
      'First Synced': new Date(group.created_at).toLocaleDateString(),
      'Last Updated': new Date(group.updated_at).toLocaleDateString()
    }));
    
    // Convert to CSV
    const csvHeaders = Object.keys(exportData[0]).join(',');
    const csvRows = exportData.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
    
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    
    console.log('Groups export ready:');
    console.log(csvContent);
    
    return csvContent;
  } catch (error) {
    console.error('Error exporting groups:', error);
  }
}
```

### Monitor Group Changes

```javascript
class GroupMonitor {
  constructor(apiToken, checkInterval = 30000) { // 30 seconds
    this.apiToken = apiToken;
    this.checkInterval = checkInterval;
    this.previousGroups = new Map();
    this.isMonitoring = false;
  }
  
  async fetchGroups() {
    const response = await fetch('https://api.whatspie.com/groups', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.apiToken}`
      }
    });
    
    const result = await response.json();
    return result.data.groups;
  }
  
  detectChanges(currentGroups) {
    const changes = [];
    
    currentGroups.forEach(group => {
      const previous = this.previousGroups.get(group.id);
      
      if (!previous) {
        changes.push({
          type: 'new_group',
          group: group,
          message: `New group joined: ${group.subject}`
        });
      } else {
        // Check for changes
        if (group.subject !== previous.subject) {
          changes.push({
            type: 'name_changed',
            group: group,
            message: `Group name changed: ${previous.subject} → ${group.subject}`
          });
        }
        
        if (group.participant_count !== previous.participant_count) {
          const diff = group.participant_count - previous.participant_count;
          changes.push({
            type: 'member_count_changed',
            group: group,
            message: `${group.subject}: ${diff > 0 ? '+' : ''}${diff} members`
          });
        }
        
        if (group.last_message && previous.last_message) {
          if (group.last_message.timestamp !== previous.last_message.timestamp) {
            changes.push({
              type: 'new_message',
              group: group,
              message: `New message in ${group.subject}`
            });
          }
        }
      }
    });
    
    // Check for removed groups
    this.previousGroups.forEach((previous, id) => {
      if (!currentGroups.find(g => g.id === id)) {
        changes.push({
          type: 'group_left',
          group: previous,
          message: `Left group: ${previous.subject}`
        });
      }
    });
    
    return changes;
  }
  
  async startMonitoring(onChanges = null) {
    this.isMonitoring = true;
    
    // Initial fetch
    const initialGroups = await this.fetchGroups();
    initialGroups.forEach(group => {
      this.previousGroups.set(group.id, group);
    });
    
    console.log(`Monitoring ${initialGroups.length} groups...`);
    
    const monitor = async () => {
      if (!this.isMonitoring) return;
      
      try {
        const currentGroups = await this.fetchGroups();
        const changes = this.detectChanges(currentGroups);
        
        if (changes.length > 0) {
          console.log(`Detected ${changes.length} changes:`);
          changes.forEach(change => {
            console.log(`- ${change.message}`);
          });
          
          if (onChanges) {
            onChanges(changes);
          }
        }
        
        // Update previous groups
        this.previousGroups.clear();
        currentGroups.forEach(group => {
          this.previousGroups.set(group.id, group);
        });
        
      } catch (error) {
        console.error('Error monitoring groups:', error);
      }
      
      setTimeout(monitor, this.checkInterval);
    };
    
    setTimeout(monitor, this.checkInterval);
  }
  
  stopMonitoring() {
    this.isMonitoring = false;
    console.log('Group monitoring stopped');
  }
}

// Usage
const monitor = new GroupMonitor('YOUR_API_TOKEN', 30000);
monitor.startMonitoring((changes) => {
  // Custom handler for changes
  changes.forEach(change => {
    if (change.type === 'new_message') {
      console.log(`🔔 ${change.message}`);
    }
  });
});

// Stop monitoring after 10 minutes
setTimeout(() => monitor.stopMonitoring(), 600000);
```

## ⚠️ Rate Limiting

- **Recommended frequency**: Don't call this endpoint more than once every 30 seconds
- **Burst limit**: Maximum 10 requests per minute
- **Daily limit**: Up to 2,000 requests per day

## 🔗 Related Endpoints

- [Get Group By ID](./get-group) - Get detailed information about a specific group
- [Send Group Messages](./send-group-messages) - Send messages to groups
- [Create WhatsApp Groups](./create-group) - Create new groups
- [Update Group Information](./update-group) - Modify group settings
- [Add Members to Group](./add-members) - Add participants to groups
