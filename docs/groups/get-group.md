---
title: Get group
description: Get one WhatsApp group by its id with GET /groups/{id}.
---

# Get group

Get the details of one group by its ID. The response has the same fields as each entry in [List groups](./list-groups.md): name, description, picture, and status.

The data comes from the groups Whatspie has stored for your devices. It does not include the group's members, admins, permissions, or message history.

## Endpoint

```
GET https://api.whatspie.com/groups/{id}
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Path parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | Yes | The group's `id` from [List groups](./list-groups.md), for example `15378`. Not the `jid`; see [Which ID to use](./list-groups.md#which-id-to-use). |

## Request example

```bash
curl -L -X GET 'https://api.whatspie.com/groups/15378' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

## Response

```json
{
  "status": 200,
  "message": "OK",
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
    "updated_at": "2024-12-20T14:30:00Z"
  }
}
```

## Response fields

| Field | Type | Description |
|---|---|---|
| `id` | string | Whatspie's ID for the group. |
| `device_id` | string | ID of the device that is in this group. |
| `jid` | string | WhatsApp's group identifier, ending in `@g.us`. |
| `title` | string | Group name. |
| `description` | string or null | Group description. Currently set to `null` by every [Refresh groups](./refresh-groups.md) run. |
| `image_url` | string or null | Group picture URL. |
| `muted` | boolean | Whether the group is muted on your device. |
| `spam` | boolean | Whether the group is marked as spam. |
| `group_created_at` | string | When the group was created on WhatsApp, ISO 8601. |
| `created_at` | string | When Whatspie first stored the group for your device, ISO 8601. |
| `updated_at` | string | When the stored group information last changed, ISO 8601. |

To get the latest name or picture from WhatsApp, run [Refresh groups](./refresh-groups.md) first. Note that a refresh currently clears `description` to `null`.

## Errors

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid group ID` | `id` is not a number, for example a `jid`. |
| `404` | `Group not found` | No group with this `id`, or it belongs to a device on another account. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `401` | `User not authenticated` | Internal authentication error. A missing or wrong token normally returns `403` first. |

```json
{
  "status": 404,
  "message": "Group not found"
}
```

```json
{
  "status": 400,
  "message": "Invalid group ID"
}
```

## Usage examples

### Get group details with error handling

```javascript
async function getGroupDetails(token, groupId) {
  const response = await fetch(`https://api.whatspie.com/groups/${groupId}`, {
    headers: {
      Accept: 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(`${result.status}: ${result.message}`);
  }

  const group = result.data;
  console.log(`Group: ${group.title}`);
  console.log(`JID: ${group.jid}`);
  console.log(`Description: ${group.description ?? '(none)'}`);
  console.log(`Muted: ${group.muted ? 'Yes' : 'No'}`);
  return group;
}

getGroupDetails('YOUR_API_TOKEN', 15378)
  .then(() => console.log('Group loaded successfully'))
  .catch((error) => console.error('Failed to load group:', error.message));
```

### Export group report

```javascript
async function exportGroupReport(token, groupId) {
  const group = await getGroupDetails(token, groupId);

  const report = {
    name: group.title,
    jid: group.jid,
    description: group.description,
    hasPicture: Boolean(group.image_url),
    muted: group.muted,
    spam: group.spam,
    createdOnWhatsApp: new Date(group.group_created_at).toLocaleDateString(),
    firstStored: new Date(group.created_at).toLocaleDateString(),
    lastUpdated: new Date(group.updated_at).toLocaleDateString(),
  };

  console.log(`📋 GROUP REPORT: ${report.name}`);
  console.log('='.repeat(50));
  console.log(`🆔 JID: ${report.jid}`);
  console.log(`📝 Description: ${report.description ?? '(none)'}`);
  console.log(`🖼️ Picture: ${report.hasPicture ? 'Yes' : 'No'}`);
  console.log(`🔕 Muted: ${report.muted ? 'Yes' : 'No'}`);
  console.log(`📅 Created on WhatsApp: ${report.createdOnWhatsApp}`);
  console.log(`📅 Last updated: ${report.lastUpdated}`);

  return report;
}
```

## Related

- [List groups](./list-groups.md): all groups and their IDs
- [Refresh groups](./refresh-groups.md): update the stored group information from WhatsApp
- [Send group messages](./send-group-messages.md): send messages to the group
- [Update group](./update-group.md): change the group's name, description, or picture
- [Add members](./add-members.md): add participants to the group
