---
sidebar_position: 4
---

# 🔍 Get Group By ID

Retrieve detailed information about a specific WhatsApp group using its ID.

<div style={{background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", padding: "1.5rem", borderRadius: "8px", color: "#1a202c", margin: "1.5rem 0"}}>
  <h3 style={{color: "#1a202c", margin: "0 0 1rem 0"}}>🎯 Detailed Group Info</h3>
  <p style={{margin: "0"}}>Get comprehensive information about a specific group including member details, permissions, recent activity, and group settings.</p>
</div>

## 🌐 Endpoint

```
GET https://api.whatspie.com/groups/{group_id}
```

Where `{group_id}` is the numeric ID of the WhatsApp group.

## 🔐 Authentication

Bearer token required in the `Authorization` header.

## 📋 Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `group_id` | integer | ✅ | The unique identifier of the group |

## 🚀 Request Examples

### Basic Group Info Request

```bash
curl -L -X GET 'https://api.whatspie.com/groups/482' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### With Detailed Response

```bash
curl -L -X GET 'https://api.whatspie.com/groups/482' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'X-Include-Members: true'
```

## 📊 Response Format

### Success Response

```json
{
  "code": 200,
  "message": "Group information retrieved successfully",
  "data": {
    "id": "15378",
    "device_id": "5",
    "jid": "120363022368688477@g.us",
    "title": "Project Team Alpha",
    "description": "Development team for Project Alpha - Sprint planning and daily updates",
    "image_url": "https://example.com/group-avatar-482.jpg",
    "muted": false,
    "spam": false,
    "group_created_at": "2024-11-15T09:00:00Z",
    "created_at": "2024-11-15T09:05:00Z",
    "updated_at": "2024-12-20T14:30:00Z",
    "permissions": {
      "can_send_messages": true,
      "can_add_members": true,
      "can_edit_info": true,
      "can_remove_members": true,
      "allow_send": true,
      "only_admins_can_send": false,
      "only_admins_can_edit": false
    },
    "settings": {
      "disappearing_messages": {
        "enabled": false,
        "duration": null
      },
      "group_invite_link": "https://chat.whatsapp.com/ABC123DEF456GHI789",
      "invite_link_revoked": false
    },
    "admins": [
      {
        "phone": "6281234567890",
        "name": "John Smith",
        "is_creator": true
      },
      {
        "phone": "6289876543210",
        "name": "Sarah Johnson",
        "is_creator": false
      }
    ],
    "participants": [
      {
        "phone": "6281234567890",
        "name": "John Smith",
        "is_admin": true,
        "joined_at": "2024-11-15T09:00:00Z",
        "last_seen": "2024-12-20T14:25:00Z"
      },
      {
        "phone": "6289876543210",
        "name": "Sarah Johnson", 
        "is_admin": true,
        "joined_at": "2024-11-15T09:05:00Z",
        "last_seen": "2024-12-20T14:20:00Z"
      },
      {
        "phone": "6281122334455",
        "name": "Mike Wilson",
        "is_admin": false,
        "joined_at": "2024-11-16T10:30:00Z",
        "last_seen": "2024-12-20T13:45:00Z"
      },
      {
        "phone": "6285544332211",
        "name": "Lisa Davis",
        "is_admin": false,
        "joined_at": "2024-11-18T14:15:00Z",
        "last_seen": "2024-12-20T12:30:00Z"
      }
    ],
    "recent_messages": [
      {
        "id": "msg_group_789123",
        "type": "text",
        "sender": {
          "phone": "6281234567890",
          "name": "John Smith"
        },
        "content": "Great work on the sprint everyone! 🎉",
        "timestamp": "2024-12-20T14:30:00Z",
        "mentions": []
      },
      {
        "id": "msg_group_789122",
        "type": "image",
        "sender": {
          "phone": "6289876543210",
          "name": "Sarah Johnson"
        },
        "content": "Sprint retrospective results",
        "image_url": "https://example.com/message-image-123.jpg",
        "timestamp": "2024-12-20T14:15:00Z",
        "mentions": []
      },
      {
        "id": "msg_group_789121",
        "type": "text",
        "sender": {
          "phone": "6281122334455",
          "name": "Mike Wilson"
        },
        "content": "The API integration is complete @6281234567890 @6289876543210",
        "timestamp": "2024-12-20T13:45:00Z",
        "mentions": ["6281234567890", "6289876543210"]
      }
    ],
    "statistics": {
      "total_messages": 1247,
      "messages_today": 23,
      "messages_this_week": 156,
      "most_active_member": {
        "phone": "6281234567890",
        "name": "John Smith",
        "message_count": 387
      },
      "media_messages": 89,
      "text_messages": 1158
    }
  }
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

### Error Response - Access Denied

```json
{
  "code": 403,
  "message": "Access denied",
  "error": "You are not a member of this group"
}
```

### Error Response - Invalid Group ID

```json
{
  "code": 400,
  "message": "Invalid group ID",
  "error": "Group ID must be a positive integer"
}
```

## 🔍 Response Fields Explained

### Main Group Object

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

### Permissions Object

| Field | Type | Description |
|-------|------|-------------|
| `can_send_messages` | boolean | Can send messages to group |
| `can_add_members` | boolean | Can add new members |
| `can_edit_info` | boolean | Can edit group information |
| `can_remove_members` | boolean | Can remove group members |
| `allow_send` | boolean | Group allows message sending |
| `only_admins_can_send` | boolean | Only admins can send messages |
| `only_admins_can_edit` | boolean | Only admins can edit group info |

### Settings Object

| Field | Type | Description |
|-------|------|-------------|
| `disappearing_messages.enabled` | boolean | Disappearing messages feature status |
| `disappearing_messages.duration` | string/null | Duration for disappearing messages |
| `group_invite_link` | string | WhatsApp group invite link |
| `invite_link_revoked` | boolean | Whether invite link is revoked |

### Participant Object

| Field | Type | Description |
|-------|------|-------------|
| `phone` | string | Member's phone number |
| `name` | string | Member's display name |
| `is_admin` | boolean | Whether member is an admin |
| `joined_at` | string | When member joined (ISO 8601) |
| `last_seen` | string | Last activity timestamp (ISO 8601) |

### Recent Message Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique message identifier |
| `type` | string | Message type (text, image, file, etc.) |
| `sender.phone` | string | Sender's phone number |
| `sender.name` | string | Sender's display name |
| `content` | string | Message content/caption |
| `timestamp` | string | Message timestamp (ISO 8601) |
| `mentions` | array | Array of mentioned phone numbers |

## 💡 Usage Examples

### Get Group Details with Error Handling

```javascript
async function getGroupDetails(groupId) {
  try {
    const response = await fetch(`https://api.whatspie.com/groups/${groupId}`, {
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`${errorData.code}: ${errorData.message}`);
    }
    
    const result = await response.json();
    const group = result.data;
    
    console.log(`Group: ${group.subject}`);
    console.log(`Members: ${group.participant_count}`);
    console.log(`Admin: ${group.is_admin ? 'Yes' : 'No'}`);
    console.log(`Can send messages: ${group.permissions.can_send_messages ? 'Yes' : 'No'}`);
    
    return group;
  } catch (error) {
    console.error('Error fetching group details:', error.message);
    throw error;
  }
}

// Usage
getGroupDetails(482)
  .then(group => console.log('Group loaded successfully'))
  .catch(error => console.error('Failed to load group'));
```

### Check Group Permissions

```javascript
async function checkGroupPermissions(groupId) {
  try {
    const response = await fetch(`https://api.whatspie.com/groups/${groupId}`, {
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      }
    });
    
    const result = await response.json();
    const group = result.data;
    
    const permissions = {
      canSendMessages: group.permissions.can_send_messages,
      canAddMembers: group.permissions.can_add_members,
      canEditInfo: group.permissions.can_edit_info,
      canRemoveMembers: group.permissions.can_remove_members,
      isAdmin: group.is_admin,
      isRestricted: group.permissions.only_admins_can_send && !group.is_admin
    };
    
    console.log(`Permissions for "${group.subject}":`);
    Object.entries(permissions).forEach(([key, value]) => {
      console.log(`- ${key}: ${value ? '✅' : '❌'}`);
    });
    
    return permissions;
  } catch (error) {
    console.error('Error checking permissions:', error);
    return null;
  }
}
```

### Get Active Members

```javascript
async function getActiveMembers(groupId, hoursAgo = 24) {
  try {
    const response = await fetch(`https://api.whatspie.com/groups/${groupId}`, {
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      }
    });
    
    const result = await response.json();
    const group = result.data;
    const cutoffTime = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
    
    const activeMembers = group.participants.filter(member => {
      return member.last_seen && new Date(member.last_seen) > cutoffTime;
    });
    
    const activeMembersWithActivity = activeMembers.map(member => {
      const lastSeenDate = new Date(member.last_seen);
      const hoursAgo = Math.floor((Date.now() - lastSeenDate.getTime()) / (1000 * 60 * 60));
      
      return {
        name: member.name,
        phone: member.phone,
        isAdmin: member.is_admin,
        lastSeen: lastSeenDate.toLocaleString(),
        hoursAgo: hoursAgo
      };
    });
    
    // Sort by most recent activity
    activeMembersWithActivity.sort((a, b) => a.hoursAgo - b.hoursAgo);
    
    console.log(`Active members in "${group.subject}" (last ${hoursAgo} hours):`);
    activeMembersWithActivity.forEach(member => {
      const adminFlag = member.isAdmin ? ' 👑' : '';
      console.log(`- ${member.name}${adminFlag} (${member.hoursAgo}h ago)`);
    });
    
    return activeMembersWithActivity;
  } catch (error) {
    console.error('Error getting active members:', error);
    return [];
  }
}
```

### Analyze Group Activity

```javascript
async function analyzeGroupActivity(groupId) {
  try {
    const response = await fetch(`https://api.whatspie.com/groups/${groupId}`, {
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      }
    });
    
    const result = await response.json();
    const group = result.data;
    const stats = group.statistics;
    
    const analysis = {
      groupName: group.subject,
      totalMembers: group.participant_count,
      totalMessages: stats.total_messages,
      dailyAverage: Math.round(stats.total_messages / 30), // Assuming 30-day period
      todayMessages: stats.messages_today,
      weeklyMessages: stats.messages_this_week,
      mostActiveUser: stats.most_active_member.name,
      mediaPercentage: Math.round((stats.media_messages / stats.total_messages) * 100),
      textPercentage: Math.round((stats.text_messages / stats.total_messages) * 100),
      messagesPerMember: Math.round(stats.total_messages / group.participant_count),
      activityLevel: getActivityLevel(stats.messages_today, group.participant_count)
    };
    
    console.log(`📊 Activity Analysis for "${analysis.groupName}":`);
    console.log(`👥 Members: ${analysis.totalMembers}`);
    console.log(`💬 Total Messages: ${analysis.totalMessages}`);
    console.log(`📈 Daily Average: ${analysis.dailyAverage}`);
    console.log(`📅 Today: ${analysis.todayMessages} messages`);
    console.log(`📅 This Week: ${analysis.weeklyMessages} messages`);
    console.log(`🏆 Most Active: ${analysis.mostActiveUser}`);
    console.log(`📸 Media: ${analysis.mediaPercentage}%`);
    console.log(`📝 Text: ${analysis.textPercentage}%`);
    console.log(`⚡ Activity Level: ${analysis.activityLevel}`);
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing group activity:', error);
    return null;
  }
}

function getActivityLevel(todayMessages, memberCount) {
  const messagesPerMember = todayMessages / memberCount;
  
  if (messagesPerMember > 5) return 'Very High 🔥';
  if (messagesPerMember > 2) return 'High ⚡';
  if (messagesPerMember > 1) return 'Medium 📊';
  if (messagesPerMember > 0.5) return 'Low 📉';
  return 'Very Low 😴';
}
```

### Export Group Report

```javascript
async function exportGroupReport(groupId) {
  try {
    const response = await fetch(`https://api.whatspie.com/groups/${groupId}`, {
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      }
    });
    
    const result = await response.json();
    const group = result.data;
    
    const report = {
      // Basic Info
      groupInfo: {
        name: group.subject,
        description: group.description,
        members: group.participant_count,
        created: new Date(group.created_at).toLocaleDateString(),
        updated: new Date(group.updated_at).toLocaleDateString()
      },
      
      // Permissions
      permissions: {
        isAdmin: group.is_admin,
        canSend: group.permissions.can_send_messages,
        canAddMembers: group.permissions.can_add_members,
        canEditInfo: group.permissions.can_edit_info
      },
      
      // Members Summary
      membersSummary: {
        total: group.participant_count,
        admins: group.admins.length,
        regular: group.participant_count - group.admins.length,
        adminsList: group.admins.map(admin => ({
          name: admin.name,
          phone: admin.phone,
          isCreator: admin.is_creator
        }))
      },
      
      // Activity Stats
      activity: group.statistics,
      
      // Recent Activity
      recentMessages: group.recent_messages.map(msg => ({
        timestamp: new Date(msg.timestamp).toLocaleString(),
        sender: msg.sender.name,
        type: msg.type,
        content: msg.content ? msg.content.substring(0, 50) + '...' : '[Media]'
      }))
    };
    
    // Generate report
    console.log(`📋 GROUP REPORT: ${report.groupInfo.name}`);
    console.log('='.repeat(50));
    console.log(`📅 Created: ${report.groupInfo.created}`);
    console.log(`📝 Description: ${report.groupInfo.description}`);
    console.log(`👥 Members: ${report.groupInfo.members}`);
    console.log(`👑 Admins: ${report.membersSummary.admins}`);
    console.log(`💬 Total Messages: ${report.activity.total_messages}`);
    console.log(`📊 Messages Today: ${report.activity.messages_today}`);
    console.log(`🏆 Most Active: ${report.activity.most_active_member.name}`);
    
    console.log('\n👑 ADMINS:');
    report.membersSummary.adminsList.forEach(admin => {
      const crown = admin.isCreator ? '👑' : '⭐';
      console.log(`${crown} ${admin.name} (${admin.phone})`);
    });
    
    console.log('\n💬 RECENT ACTIVITY:');
    report.recentMessages.forEach(msg => {
      console.log(`[${msg.timestamp}] ${msg.sender}: ${msg.content}`);
    });
    
    return report;
  } catch (error) {
    console.error('Error generating group report:', error);
    return null;
  }
}
```

## 🔗 Related Endpoints

- [Get Groups List](./list-groups) - List all groups
- [Send Group Messages](./send-group-messages) - Send messages to the group
- [Update Group Information](./update-group) - Modify group settings
- [Add Members to Group](./add-members) - Add participants to the group
- [Create WhatsApp Groups](./create-group) - Create new groups

## 📞 Support

Need help with group information retrieval?
- 📖 [Group Management Guide](../guides/group-management)
- 🛠️ [Troubleshooting Guide](../troubleshooting)
- 💬 [Community Forum](https://community.whatspie.com)