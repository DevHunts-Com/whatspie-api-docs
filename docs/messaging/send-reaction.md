---
sidebar_position: 7
---

# 😀 Send Reaction

Send (or remove) an emoji reaction to a message in a personal chat or a group, using the Whatspie API.

<div style={{background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", padding: "1.5rem", borderRadius: "8px", color: "#1a202c", margin: "1.5rem 0"}}>
  <h3 style={{color: "#1a202c", margin: "0 0 1rem 0"}}>😀 Reactions</h3>
  <p style={{margin: "0"}}>React to any message with an emoji, just like the native WhatsApp app. Works for both 1-on-1 chats and group messages.</p>
</div>

## 🌐 Endpoint

```
POST https://api.whatspie.com/messages/reaction
```

## 🔐 Authentication

Bearer token required in the `Authorization` header.

## 📋 Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `device` | string | ✅ | Your registered WhatsApp device number |
| `msisdn` | string | ✅ | Target identifier: recipient's phone number for a personal chat, or the group JID/ID when `is_group` is `true` |
| `message_id` | string | ✅ | The WhatsApp message ID (`wa_id`) of the message being reacted to |
| `emoji` | string | ❌ | The emoji to react with (e.g. `👍`). Pass an empty string `""` to **remove** an existing reaction |
| `is_group` | boolean | ❌ | Set to `true` when reacting to a message in a group chat. Defaults to `false` |

:::info Finding the `message_id`
The `message_id` corresponds to the `wa_id` field returned when a message is sent (see [Send Text Messages](./send-text)) or received via [webhooks](../webhooks). You currently need to look this value up from your own message records — there isn't a dedicated "search messages" endpoint yet.
:::

## 🚀 Request Examples

### React to a Personal Message

```bash
curl -X POST "https://api.whatspie.com/messages/reaction" \
  -H "Authorization: Bearer ***" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "msisdn": "6289876543210",
    "message_id": "3EB0C767D26A1D8B12A3",
    "emoji": "👍"
  }'
```

### React to a Group Message

```bash
curl -X POST "https://api.whatspie.com/messages/reaction" \
  -H "Authorization: Bearer ***" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "msisdn": "120363022368688477@g.us",
    "message_id": "3EB0C767D26A1D8B12A3",
    "emoji": "🎉",
    "is_group": true
  }'
```

### Remove a Reaction

Pass an empty string as the `emoji` to remove a previously sent reaction:

```bash
curl -X POST "https://api.whatspie.com/messages/reaction" \
  -H "Authorization: Bearer ***" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "msisdn": "6289876543210",
    "message_id": "3EB0C767D26A1D8B12A3",
    "emoji": ""
  }'
```

## 📊 Response Format

### Success Response

```json
{
  "status": 200,
  "message": "Reaction sent",
  "data": {
    "id": "3EB0C767D26A1D8B12A3"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | The WhatsApp message ID the reaction was attached to |

## Error Responses

### Missing Required Field

```json
{
  "status": 400,
  "message": "Invalid request body: Key: 'MSISDN' Error:Field validation for 'MSISDN' failed on the 'required' tag"
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
  "message": "failed to send reaction via whatspie node: Disconnected"
}
```

## 💡 Notes & Behavior

- **Fire-and-forget**: Sending a reaction always returns a success response once it reaches WhatsApp, even if the target `message_id` is invalid or no longer exists — WhatsApp silently drops reactions that don't match a real message. There is no synchronous way to confirm the reaction actually attached.
- **Emoji validation**: Any string can technically be sent as `emoji`, but only valid emoji characters will render as a reaction on WhatsApp's side. Use an empty string to remove a reaction.
- **Group reactions**: When `is_group` is `true`, `msisdn` should be the group's JID (ending in `@g.us`) or group ID as returned by [List Groups](../groups/list-groups).

## 🔗 Related Endpoints

- [Send Text Messages](./send-text) — Send a message and capture its `message_id`/`wa_id` to react to later
- [Get Message by ID](./get-message) — Look up a message's details including its `wa_id`
- [List Groups](../groups/list-groups) — Find the group JID to use with `is_group: true`
