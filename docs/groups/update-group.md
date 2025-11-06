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