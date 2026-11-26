---
title: Send reaction
description: Add or remove an emoji reaction on a message in a personal chat or a group with POST /messages/reaction.
---

# Send reaction

Add an emoji reaction to a message in a personal chat or a group, or remove one.

## Endpoint

```
POST https://api.whatspie.com/messages/reaction
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Phone number of your sending device: the `phone` field from [List devices](../devices/list.md), not the numeric device `id`. |
| `msisdn` | string | Yes | The chat the message is in: the other person's phone number for a personal chat, or the group's `jid` when `is_group` is `true`. |
| `message_id` | string | Yes | The WhatsApp message ID (`wa_id`) of the message to react to. |
| `emoji` | string | No | The emoji, for example `👍`. An empty string `""` removes your reaction. |
| `is_group` | boolean | No | `true` for a message in a group. Default `false`. |

For groups, use the `jid` field from [List groups](../groups/list-groups.md), for example `120363022368688477@g.us`, not the numeric `id`. The `@g.us` suffix is added if you leave it out.

:::info[Finding the `message_id`]
The `message_id` is the message's `wa_id`.

- **Messages you sent:** `wa_id` is `null` right after sending. It is filled in once WhatsApp accepts the message. Read it with [Get message](./get-message.md#response-fields).
- **Messages you received:** `wa_id` comes with the incoming message, for example through [webhooks](../webhooks.md).

There is no endpoint to search messages yet, so keep the IDs in your own records.
:::

:::warning[Current limitation]
Reactions are currently sent as reactions to a message **you received** in a personal chat. A reaction to a message you sent yourself, or to another member's message in a group, may not appear in WhatsApp, even though the API returns `200`.
:::

## Examples

### React to a personal message

```bash
curl -X POST 'https://api.whatspie.com/messages/reaction' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "msisdn": "6289876543210",
    "message_id": "3EB0C767D26A1D8B12A3",
    "emoji": "👍"
  }'
```

### React to a group message

```bash
curl -X POST 'https://api.whatspie.com/messages/reaction' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "msisdn": "120363022368688477@g.us",
    "message_id": "3EB0C767D26A1D8B12A3",
    "emoji": "🎉",
    "is_group": true
  }'
```

### Remove a reaction

Send an empty `emoji` to remove a reaction you sent earlier:

```bash
curl -X POST 'https://api.whatspie.com/messages/reaction' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "msisdn": "6289876543210",
    "message_id": "3EB0C767D26A1D8B12A3",
    "emoji": ""
  }'
```

## Response

```json
{
  "status": 200,
  "message": "Reaction sent",
  "data": {
    "id": "3EB0A1F2C3D4E5F60718"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `id` | string | WhatsApp ID of the reaction itself. This is a new ID, not the `message_id` you reacted to. |

Reactions are sent straight to WhatsApp. They are not stored as messages in Whatspie, so you cannot look them up with Get message.

## Errors

### Missing required field

```json
{
  "status": 400,
  "message": "Invalid request body: Key: 'MSISDN' Error:Field validation for 'MSISDN' failed on the 'required' tag"
}
```

### Device not found or access denied

```json
{
  "status": 403,
  "message": "Device not found or access denied"
}
```

### Device disconnected

```json
{
  "status": 403,
  "message": "failed to send reaction via whatspie node: Disconnected"
}
```

### All errors

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid request body: ...` | The body is not valid JSON, or `device`, `msisdn`, or `message_id` is missing. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `403` | `Device not found or access denied` | `device` is not a device on your account. |
| `403` | `failed to send reaction via whatspie node: ...` containing `Disconnected` or `Connection issue` | The device is not connected to WhatsApp, or Whatspie could not reach it. Reconnect the device. |
| `500` | `failed to send reaction via whatspie node: ...` | Any other sending error. Try again later. |

## Notes and behavior

- **Fire-and-forget:** the API returns success once the reaction is sent to WhatsApp, even if `message_id` is wrong or the message no longer exists. WhatsApp ignores reactions that do not match a message, so there is no way to confirm that a reaction attached.
- **Emoji validation:** any string is accepted as `emoji`, but only a single valid emoji shows as a reaction in WhatsApp. Use an empty string to remove a reaction.
- **Group reactions:** set `is_group` to `true` and pass the group's `jid` from [List groups](../groups/list-groups.md) as `msisdn`.

## Related

- [Get message](./get-message.md#response-fields): read the `wa_id` of a message you sent
- [Send text](./send-text.md): send a message
- [List groups](../groups/list-groups.md): find a group's `jid` for `is_group: true`
