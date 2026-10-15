---
sidebar_position: 7
---

# 🔄 Refresh Groups

Force-sync your device's WhatsApp group list from the live connection into Whatspie, using the Whatspie API.

<div style={{background: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", padding: "1.5rem", borderRadius: "8px", color: "white", margin: "1.5rem 0"}}>
  <h3 style={{color: "white", margin: "0 0 1rem 0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>🔄 Stay In Sync</h3>
  <p style={{margin: "0", textShadow: "1px 1px 2px rgba(0,0,0,0.3)"}}>Pull the latest group list directly from WhatsApp and sync it into Whatspie — useful right after joining a new group, or whenever your stored group list looks stale.</p>
</div>

## 🌐 Endpoint

```
POST https://api.whatspie.com/groups/refresh
```

## 🔐 Authentication

Bearer token required in the `Authorization` header.

## 📋 Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `device` | string | ✅ | Your registered WhatsApp device number |

## 🚀 Request Example

```bash
curl -X POST "https://api.whatspie.com/groups/refresh?device=6281234567890" \
  -H "Authorization: Bearer ***" \
  -H "Accept: application/json"
```

## 📊 Response Format

### Success Response

```json
{
  "status": 200,
  "message": "Groups refreshed successfully",
  "data": [
    {
      "id": "15378",
      "device_id": "5",
      "jid": "120363022368688477@g.us",
      "title": "Project Team Alpha",
      "description": null,
      "image_url": null,
      "muted": false,
      "spam": false,
      "group_created_at": "2024-11-15T09:00:00Z",
      "created_at": "2024-11-15T09:05:00Z",
      "updated_at": "2026-10-13T12:00:00Z"
    },
    {
      "id": "15379",
      "device_id": "5",
      "jid": "120363055789123456@g.us",
      "title": "Marketing Team",
      "description": null,
      "image_url": null,
      "muted": false,
      "spam": false,
      "group_created_at": "2024-10-20T11:15:00Z",
      "created_at": "2024-10-20T11:20:00Z",
      "updated_at": "2026-10-13T12:00:00Z"
    }
  ]
}
```

### Response Fields

Same shape as [List Groups](./list-groups) — see that page for a full field reference. `updated_at` will reflect the time of this refresh call for every group that was successfully synced.

## Error Responses

### Missing Device Parameter

```json
{
  "status": 400,
  "message": "Device parameter is required"
}
```

### Device Not Found or Access Denied

```json
{
  "status": 403,
  "message": "Device not found or access denied"
}
```

### Device Disconnected

```json
{
  "status": 403,
  "message": "failed to fetch group list from whatspie node: Disconnected"
}
```

Your device must be connected (paired and online) for the refresh to succeed, since the group list is fetched live from the active WhatsApp connection.

## 💡 How It Works

1. Whatspie fetches the current, live group list directly from your device's active WhatsApp connection.
2. Each group is **upserted** into your stored group list — matched by group JID, so existing groups are updated in place and newly joined groups are added.
3. Groups you've left on WhatsApp are **not automatically removed** from your stored list by this endpoint.
4. The response returns the freshly synced groups, reflecting their latest title, description, image, and mute/spam status.

:::tip When to use this
Call this endpoint after creating or joining a new group, or periodically if you rely on [List Groups](./list-groups) for up-to-date group metadata and don't want to wait for the next automatic sync.
:::

## 🔗 Related Endpoints

- [Get Groups List](./list-groups) — Retrieve your currently stored group list (no live fetch)
- [Get Group By ID](./get-group) — Get detailed information about a specific group
- [Send Group Messages](./send-group-messages) — Send messages to groups
