---
sidebar_position: 2
---

# 👥 Send Messages to Groups

Send text, images, files, and other message types to WhatsApp groups using the Whatspie API with all the same features available for individual messaging.

<div style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>🎯 Group Messaging</h3>
  <p style={{margin: "0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>Send messages to WhatsApp groups using the same message format as individual messages. Perfect for broadcasting announcements, sharing files, and engaging with group members.</p>
</div>

## 🌐 Endpoint

```
POST https://api.whatspie.com/groups/{group_id}/send
```

Where `{group_id}` is the numeric ID of the WhatsApp group.

## 🔐 Authentication

Bearer token required with proper JSON content headers.

## 📋 Request Parameters

The request parameters are **identical** to individual messaging, with the key difference being the endpoint URL:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `device` | string | ✅ | Your registered WhatsApp device number |
| `type` | string | ✅ | Message type: `"text"`, `"image"`, `"file"`, `"location"`, `"template"`, `"list"` |
| `params` | object | ✅ | Message parameters (varies by message type) |
| `simulate_typing` | integer | ❌ | Show typing indicator: `1` (yes) or `0` (no) |

:::info Group ID
The group ID can be obtained from the group creation response or by listing your groups. It's the numeric identifier for the WhatsApp group.
:::

## 📝 Message Types

All message types supported for individual messaging are available for groups:

<div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", margin: "1.5rem 0"}}>
  <div style={{background: "#f8f9ff", border: "1px solid #e1e5e9", borderRadius: "8px", padding: "1rem"}}>
    <h4 style={{color: "#4f46e5", marginTop: 0}}>📝 Text Messages</h4>
    <ul style={{margin: 0, fontSize: "0.9rem"}}>
      <li>Plain text</li>
      <li>Formatted text (*bold*, _italic_)</li>
      <li>Emojis and symbols</li>
      <li>Line breaks</li>
    </ul>
  </div>
  
  <div style={{background: "#fdf2f8", border: "1px solid #fce7f3", borderRadius: "8px", padding: "1rem"}}>
    <h4 style={{color: "#be185d", marginTop: 0}}>🖼️ Media Messages</h4>
    <ul style={{margin: 0, fontSize: "0.9rem"}}>
      <li>Images with captions</li>
      <li>Documents and files</li>
      <li>Audio files</li>
      <li>Video files</li>
    </ul>
  </div>
  
  <div style={{background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "8px", padding: "1rem"}}>
    <h4 style={{color: "#059669", marginTop: 0}}>🎯 Interactive</h4>
    <ul style={{margin: 0, fontSize: "0.9rem"}}>
      <li>Location sharing</li>
      <li>Template messages</li>
      <li>List messages</li>
      <li>Contact cards</li>
    </ul>
  </div>
</div>

## 🚀 Request Examples

### Text Message to Group

```bash
curl -X POST "https://api.whatspie.com/groups/495/send" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "type": "text",
    "params": {
      "text": "🎉 *Team Update* 🎉\n\nGreat news everyone! Our project milestone has been completed successfully.\n\n✅ All features tested\n✅ Documentation updated\n✅ Ready for deployment\n\nThanks for your hard work! 👏"
    },
    "simulate_typing": 1
  }'
```

### Image Message to Group

```bash
curl -X POST "https://api.whatspie.com/groups/495/send" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "type": "image",
    "params": {
      "image": {
        "url": "https://example.com/team-photo.jpg"
      },
      "caption": "📸 Team lunch today! Great job everyone on completing the sprint goals. 🍽️✨"
    },
    "simulate_typing": 1
  }'
```

### File Message to Group

```bash
curl -X POST "https://api.whatspie.com/groups/495/send" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "type": "file",
    "params": {
      "document": {
        "url": "https://example.com/project-report.pdf"
      },
      "fileName": "Project_Report_Q4_2024.pdf",
      "mimetype": "application/pdf"
    },
    "simulate_typing": 1
  }'
```

### Location Message to Group

```bash
curl -X POST "https://api.whatspie.com/groups/495/send" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "type": "location",
    "params": {
      "location": {
        "degreesLatitude": -6.2088,
        "degreesLongitude": 106.8456
      }
    },
    "simulate_typing": 1
  }'
```

### Template Message to Group

```bash
curl -X POST "https://api.whatspie.com/groups/495/send" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "type": "template",
    "params": {
      "templateName": "team_meeting_reminder",
      "templateParams": [
        "Project Review",
        "Tomorrow",
        "2:00 PM",
        "Conference Room A"
      ]
    },
    "simulate_typing": 1
  }'
```

### List Message to Group

```bash
curl -X POST "https://api.whatspie.com/groups/495/send" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "type": "list",
    "params": {
      "body": "📋 *Project Tasks* 📋\n\nPlease select a task to view details:",
      "buttonText": "View Tasks",
      "sections": [
        {
          "title": "High Priority",
          "rows": [
            {
              "id": "task_1",
              "title": "API Documentation",
              "description": "Complete API documentation review"
            },
            {
              "id": "task_2", 
              "title": "Testing Phase",
              "description": "Execute comprehensive testing"
            }
          ]
        },
        {
          "title": "Medium Priority",
          "rows": [
            {
              "id": "task_3",
              "title": "UI Polish",
              "description": "Final UI improvements"
            }
          ]
        }
      ]
    },
    "simulate_typing": 1
  }'
```

## 📊 Response Format

### Success Response

```json
{
  "code": 200,
  "message": "Group message sent successfully",
  "data": {
    "id": "msg_group_12345",
    "status": "pending",
    "type": "text",
    "device": "6281234567890",
    "group_id": "15378",
    "group_jid": "120363022368688477@g.us",
    "group_title": "Project Team",
    "message": "Team Update: Project milestone completed!",
    "timestamp": "2024-12-20T10:30:00Z"
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

### Error Response - Not a Group Member

```json
{
  "code": 403,
  "message": "Access denied",
  "error": "Your device is not a member of this group"
}
```

## 🎯 Group-Specific Features

### Mention Group Members

```bash
curl -X POST "https://api.whatspie.com/groups/495/send" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "device": "6281234567890",
    "type": "text",
    "params": {
      "text": "Hey @6289876543210 and @6281122334455, can you review the latest changes? 🔍",
      "mentions": ["6289876543210", "6281122334455"]
    }
  }'
```

### Reply to Group Message

```bash
curl -X POST "https://api.whatspie.com/groups/495/send" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "device": "6281234567890",
    "type": "text",
    "params": {
      "text": "Great point! Let me add some details to that.",
      "quotedMessageId": "msg_group_12344"
    }
  }'
```

## 💡 Best Practices

### 1. Group Message Etiquette

```javascript
// Good: Clear, structured group messages
const groupMessage = {
  device: "6281234567890",
  type: "text",
  params: {
    text: "📢 *ANNOUNCEMENT* 📢\n\n" +
          "Subject: Weekly Standup\n" +
          "📅 When: Monday 10:00 AM\n" +
          "📍 Where: Conference Room B\n" +
          "⏱️ Duration: 30 minutes\n\n" +
          "Please bring your progress updates! 📊"
  },
  simulate_typing: 1
};
```

### 2. Batch Group Messaging

```javascript
async function sendToMultipleGroups(message, groupIds) {
  const results = [];
  
  for (const groupId of groupIds) {
    try {
      const response = await fetch(`https://api.whatspie.com/groups/${groupId}/send`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_TOKEN',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });
      
      const result = await response.json();
      results.push({ groupId, success: true, messageId: result.data.id });
      
      // Delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      results.push({ groupId, success: false, error: error.message });
    }
  }
  
  return results;
}

// Usage
const announcement = {
  device: "6281234567890",
  type: "text",
  params: {
    text: "🎉 Company Update: We've reached 10,000 users! Thank you all for your hard work! 🚀"
  }
};

const groupIds = [495, 496, 497];
const results = await sendToMultipleGroups(announcement, groupIds);
```

### 3. Group Message Scheduling

```javascript
function scheduleGroupMessage(groupId, message, scheduleTime) {
  const delay = scheduleTime.getTime() - Date.now();
  
  if (delay <= 0) {
    throw new Error('Schedule time must be in the future');
  }
  
  setTimeout(async () => {
    try {
      const response = await fetch(`https://api.whatspie.com/groups/${groupId}/send`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_TOKEN',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });
      
      console.log('Scheduled message sent:', await response.json());
    } catch (error) {
      console.error('Failed to send scheduled message:', error);
    }
  }, delay);
}

// Schedule a reminder for tomorrow at 9 AM
const tomorrow9AM = new Date();
tomorrow9AM.setDate(tomorrow9AM.getDate() + 1);
tomorrow9AM.setHours(9, 0, 0, 0);

const reminder = {
  device: "6281234567890",
  type: "text",
  params: {
    text: "⏰ Reminder: Daily standup in 1 hour! 👥"
  }
};

scheduleGroupMessage(495, reminder, tomorrow9AM);
```

## ⚠️ Limitations

- **Group membership**: Your device must be a member of the group to send messages
- **Message size**: Same limits apply as individual messaging (16MB for images, 100MB for files)
- **Rate limiting**: Groups may have stricter rate limits to prevent spam
- **Admin restrictions**: Some groups may restrict messaging to admins only
- **Delivery tracking**: Group message delivery status may be limited compared to individual messages

## 🔍 Getting Group Information

Before sending messages, you may want to get group details:

```bash
curl -X GET "https://api.whatspie.com/groups/495" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

Response:
```json
{
  "code": 200,
  "data": {
    "id": 495,
    "name": "Project Team",
    "description": "Development team coordination",
    "participant_count": 8,
    "created_at": "2024-11-15T09:00:00Z",
    "is_admin": false,
    "can_send_messages": true
  }
}
```

## 🔗 Related Endpoints

- [Create WhatsApp Groups](./create-group) - Create new groups
- [Send Text Messages](../messaging/send-text) - Text message format details
- [Send Image Messages](../messaging/send-image) - Image message parameters
- [Send File Messages](../messaging/send-file) - File message specifications
- [Send Location Messages](../messaging/send-location) - Location sharing
- [Send Template Messages](../messaging/send-template) - Template message format
- [Send List Messages](../messaging/send-list) - Interactive list messages

## 📞 Support

Need help with group messaging?
- 📖 [Group Management Guide](../guides/group-management)
- 🛠️ [Troubleshooting Guide](../troubleshooting)
- 💬 [Community Forum](https://community.whatspie.com)