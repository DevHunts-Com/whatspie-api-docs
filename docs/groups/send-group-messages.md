---
title: Send group messages
description: Send text, images, files, videos, and locations to a WhatsApp group with POST /groups/{id}/send.
---

# Send group messages

Send a message to a WhatsApp group. The message content uses the same `params` as messages to a phone number.

## Endpoint

```
POST https://api.whatspie.com/groups/{id}/send
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Path parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | Yes | The group's `id` from [List groups](./list-groups.md), for example `495`. Not the `jid`; see [Which ID to use](./list-groups.md#which-id-to-use). |

:::info[Group ID]
Get the group ID from [List groups](./list-groups.md). It is the numeric `id` of the group.
:::

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `type` | string | Yes | `chat`, `image`, `file`, or `location`. See [Message types](#message-types). |
| `params` | object | Yes | Message content. Same keys as for messages to a phone number. |

`params` accepts only these keys: `text`, `caption`, `fileName`, `mimetype`, `location`, `image`, `document`, `video`. Any other key is rejected with `400`.

There is no `device` or `receiver` field. The message is sent from the device that the group belongs to: each group `id` is tied to one device. A `device` field in the body is ignored.

The older format, with the text in a top-level `message` field and no `params`, is still accepted for text messages.

## Message types

| Content | `type` | `params` | Details |
|---|---|---|---|
| Text | `chat` | `text` | [Send text](../messaging/send-text.md) |
| Image | `image` | `image.url`, optional `caption` | [Send image](../messaging/send-image.md) |
| File | `file` | `document.url`, optional `fileName`, `mimetype`, `caption` | [Send file](../messaging/send-file.md) |
| Video | `file` | `video.url`, optional `mimetype`, `caption` | [Send video](../messaging/send-video.md) |
| Location | `location` | `location.degreesLatitude`, `location.degreesLongitude` | [Send location](../messaging/send-location.md) |

Text supports WhatsApp formatting (`*bold*`, `_italic_`), emoji, and line breaks (`\n`).

## Request examples

### Text message to a group

```bash
curl -X POST 'https://api.whatspie.com/groups/495/send' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "type": "chat",
    "params": {
      "text": "🎉 *Team Update* 🎉\n\nGreat news everyone! Our project milestone has been completed successfully.\n\n✅ All features tested\n✅ Documentation updated\n✅ Ready for deployment\n\nThanks for your hard work! 👏"
    }
  }'
```

### Image message to a group

```bash
curl -X POST 'https://api.whatspie.com/groups/495/send' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "type": "image",
    "params": {
      "image": {
        "url": "https://example.com/team-photo.jpg"
      },
      "caption": "📸 Team lunch today! Great job everyone on completing the sprint goals. 🍽️✨"
    }
  }'
```

### File message to a group

```bash
curl -X POST 'https://api.whatspie.com/groups/495/send' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "type": "file",
    "params": {
      "document": {
        "url": "https://example.com/project-report.pdf"
      },
      "fileName": "Project_Report_Q4_2024.pdf",
      "mimetype": "application/pdf"
    }
  }'
```

### Location message to a group

```bash
curl -X POST 'https://api.whatspie.com/groups/495/send' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "type": "location",
    "params": {
      "location": {
        "degreesLatitude": -6.2088,
        "degreesLongitude": 106.8456
      }
    }
  }'
```

## Response

A successful request returns HTTP `200` with the queued message. The fields are the same as for [text messages](../messaging/send-text.md#response-fields), with these differences:

- `is_group` is `true`.
- `to_number` is the group's JID without `@g.us`.
- `from_number` is the phone number of the group's device.

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "id": 36259790,
    "device_id": 5,
    "from_number": "6281234567890",
    "to_number": "120363022368688477",
    "type": "chat",
    "msg_type": "outgoing",
    "body": "Team Update: Project milestone completed!",
    "status": "PENDING",
    "wa_id": null,
    "retry": 0,
    "failed_reason": null,
    "file_url": null,
    "file_name": null,
    "file_caption": null,
    "file_size": null,
    "file_mime": null,
    "params": { "text": "Team Update: Project milestone completed!" },
    "is_group": true,
    "created_at": "2024-12-20T10:30:00Z",
    "updated_at": "2024-12-20T10:30:00Z"
  }
}
```

The message is sent in the background. Check it later with [Get message](../messaging/get-message.md); see [Status values](../messaging/get-message.md#status-values). A group message that WhatsApp accepts is set to `SENT`.

## Errors

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid group ID` | `id` is not a number, for example a `jid`. |
| `400` | `Invalid request body: ...` | The body is not valid JSON, or `type` is missing. |
| `400` | `Invalid message type. Must be one of: ...` | `type` is not supported, for example `text` instead of `chat`. |
| `400` | `Invalid message params: ...` | `params` contains a key that is not allowed. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `403` | Quota or subscription message | Your package has no messages left. |
| `500` | `group not found or access denied: ...` | No group with this `id`, or it belongs to another account. |
| `500` | Error description | Other internal error, for example the message could not be saved. |

```json
{
  "status": 500,
  "message": "group not found or access denied: failed to get group: record not found"
}
```

Sending failures, such as a disconnected device or a device that is no longer in the group, do not cause an error response: the API accepts the message first. They show up later as status `ERROR` with a `failed_reason`.

## Best practices

The JavaScript examples use this helper:

```javascript
async function sendGroupMessage(token, groupId, type, params) {
  const res = await fetch(`https://api.whatspie.com/groups/${groupId}/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ type, params }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message);
  return body;
}
```

### 1. Group message etiquette

Keep group messages clear and structured:

```javascript
const announcement = {
  type: 'chat',
  params: {
    text:
      '📢 *ANNOUNCEMENT* 📢\n\n' +
      'Subject: Weekly Standup\n' +
      '📅 When: Monday 10:00 AM\n' +
      '📍 Where: Conference Room B\n' +
      '⏱️ Duration: 30 minutes\n\n' +
      'Please bring your progress updates! 📊',
  },
};

await sendGroupMessage('YOUR_API_TOKEN', 495, announcement.type, announcement.params);
```

### 2. Batch group messaging

```javascript
async function sendToMultipleGroups(token, message, groupIds) {
  const results = [];

  for (const groupId of groupIds) {
    try {
      const result = await sendGroupMessage(token, groupId, message.type, message.params);
      results.push({ groupId, success: true, messageId: result.data.id });
    } catch (error) {
      results.push({ groupId, success: false, error: error.message });
    }
    await new Promise((resolve) => setTimeout(resolve, 2000)); // pause between groups
  }

  return results;
}

const update = {
  type: 'chat',
  params: { text: "🎉 Company Update: We've reached 10,000 users! Thank you all for your hard work! 🚀" },
};

const results = await sendToMultipleGroups('YOUR_API_TOKEN', update, [495, 496, 497]);
```

### 3. Group message scheduling

The API sends immediately. To schedule, wait in your own app and send at the right time:

```javascript
function scheduleGroupMessage(token, groupId, message, scheduleTime) {
  const delay = scheduleTime.getTime() - Date.now();
  if (delay <= 0) throw new Error('Schedule time must be in the future');

  setTimeout(async () => {
    try {
      const result = await sendGroupMessage(token, groupId, message.type, message.params);
      console.log('Scheduled message queued:', result.data.id);
    } catch (error) {
      console.error('Failed to send scheduled message:', error.message);
    }
  }, delay);
}

// Tomorrow at 9 AM
const tomorrow9AM = new Date();
tomorrow9AM.setDate(tomorrow9AM.getDate() + 1);
tomorrow9AM.setHours(9, 0, 0, 0);

scheduleGroupMessage(
  'YOUR_API_TOKEN',
  495,
  { type: 'chat', params: { text: '⏰ Reminder: Daily standup in 1 hour! 👥' } },
  tomorrow9AM,
);
```

## Limitations

- **Group membership:** the group's device must still be a member of the group.
- **Message size:** the same WhatsApp limits as individual messages (16 MB for images, 100 MB for files).
- **Sending rate:** WhatsApp may block numbers that send too much to groups. Space out your messages.
- **Admin restrictions:** some groups allow only admins to send messages.
- **Delivery tracking:** group messages are marked `SENT` once WhatsApp accepts them; per-member delivery is not tracked.
- **Not supported:** mentions, replies to a message, template and list messages to groups.

## Getting group information

Before sending, you can check the group with [Get group](./get-group.md):

```bash
curl -X GET 'https://api.whatspie.com/groups/495' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Accept: application/json'
```

Response:

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "id": "495",
    "device_id": "5",
    "jid": "120363022368688477@g.us",
    "title": "Project Team",
    "description": "Development team coordination",
    "image_url": null,
    "muted": false,
    "spam": false,
    "group_created_at": "2024-11-15T09:00:00Z",
    "created_at": "2024-11-15T09:05:00Z",
    "updated_at": "2024-12-20T14:30:00Z"
  }
}
```

## Related

- [List groups](./list-groups.md): find a group's `id`
- [Send text](../messaging/send-text.md): text message format
- [Send image](../messaging/send-image.md): image message parameters
- [Send file](../messaging/send-file.md): file message parameters
- [Send video](../messaging/send-video.md): video message parameters
- [Send location](../messaging/send-location.md): location sharing
- [Send template](../messaging/send-template.md): deprecated template messages
- [Send list](../messaging/send-list.md): deprecated list messages
