---
title: List groups
description: List the WhatsApp groups of your devices with GET /groups, and get each group's id and jid.
---

# List groups

List the WhatsApp groups your devices are members of. Use it to find a group's `id` and `jid` for the other group endpoints.

The list comes from the groups Whatspie has stored for your devices, not from a live WhatsApp query. After you join, leave, or rename a group, update the stored list with [Refresh groups](./refresh-groups.md).

## Endpoint

```
GET https://api.whatspie.com/groups
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Query parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | No | Phone number of one of your devices. Returns only that device's groups. Without it, the groups of all your devices are returned together. |

## Request examples

### All groups

```bash
curl -L -X GET 'https://api.whatspie.com/groups' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### Groups of one device

```bash
curl -L -X GET 'https://api.whatspie.com/groups?device=6281234567890' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### With custom headers

```bash
curl -L -X GET 'https://api.whatspie.com/groups' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'User-Agent: MyApp/1.0'
```

## Response

```json
{
  "status": 200,
  "message": "OK",
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

If your devices have no stored groups, `data` is an empty list.

## Response fields

### Group object fields

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

### Which ID to use

| Use | Field | Example |
|---|---|---|
| `/groups/{id}` endpoints: [Get group](./get-group.md), [Send group messages](./send-group-messages.md), [Add members](./add-members.md), [Update group](./update-group.md) | `id`, as a number in the path | `/groups/15378` |
| `msisdn` in [Send reaction](../messaging/send-reaction.md) with `is_group: true` | `jid` | `120363022368688477@g.us` |

The same WhatsApp group appears once per device. If two of your devices are in the same group, you get two entries with the same `jid` and different `id` and `device_id`.

### Field descriptions

**JID:** WhatsApp's identifier for the group. Group JIDs always end with `@g.us`.

**Timestamps:**

- `group_created_at`: when the group was created on WhatsApp.
- `created_at`: when your device's group was first stored in Whatspie.
- `updated_at`: when the stored group information last changed.

**Status fields:**

- `muted`: notifications for the group are turned off.
- `spam`: the group is marked as spam or unwanted.

## Errors

| HTTP status | `message` | Cause |
|---|---|---|
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `403` | `Device not found or access denied` | `device` is not a device on your account. |
| `403` | `No devices found for user` | Your account has no devices. |
| `500` | `Internal server error` | The groups of the given `device` could not be read. Try again later. |
| `401` | `User not authenticated` | Internal authentication error. A missing or wrong token normally returns `403` first. |

```json
{
  "status": 403,
  "message": "Device not found or access denied"
}
```

## Usage examples

The examples use this helper:

```javascript
async function listGroups(token, device) {
  const url = new URL('https://api.whatspie.com/groups');
  if (device) url.searchParams.set('device', device);

  const res = await fetch(url, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message);
  return body.data; // array of groups
}
```

### Filter groups by status

```javascript
async function getFilteredGroups(token) {
  const groups = await listGroups(token);

  // Unmuted groups
  const activeGroups = groups.filter((group) => !group.muted);

  // Groups created on WhatsApp in the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentGroups = groups.filter((group) => new Date(group.group_created_at) > thirtyDaysAgo);

  console.log(`Active groups (unmuted): ${activeGroups.length}`);
  activeGroups.forEach((group) => console.log(`- ${group.title} (ID: ${group.id})`));

  console.log(`\nRecent groups (last 30 days): ${recentGroups.length}`);
  recentGroups.forEach((group) => {
    const createdDate = new Date(group.group_created_at).toLocaleDateString();
    console.log(`- ${group.title} (Created: ${createdDate})`);
  });

  return { activeGroups, recentGroups };
}
```

### Get recently updated groups

```javascript
async function getRecentlyUpdatedGroups(token, hoursAgo = 24) {
  const groups = await listGroups(token);
  const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

  const recentlyUpdated = groups
    .filter((group) => new Date(group.updated_at) > cutoffTime)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  console.log(`${recentlyUpdated.length} groups updated in last ${hoursAgo} hours:`);
  recentlyUpdated.forEach((group) => {
    const lastUpdate = new Date(group.updated_at).toLocaleString();
    console.log(`- ${group.title}: ${lastUpdate}${group.muted ? ' (Muted)' : ''}`);
  });

  return recentlyUpdated;
}
```

### Export groups data

```javascript
async function exportGroupsData(token) {
  const groups = await listGroups(token);
  if (groups.length === 0) return '';

  const exportData = groups.map((group) => ({
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
    'Last Updated': new Date(group.updated_at).toLocaleDateString(),
  }));

  // Quote every value and escape quotes, so commas and quotes in titles are safe
  const toCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const csvHeaders = Object.keys(exportData[0]).map(toCsv).join(',');
  const csvRows = exportData.map((row) => Object.values(row).map(toCsv).join(','));

  const csvContent = [csvHeaders, ...csvRows].join('\n');
  console.log('Groups export ready:');
  console.log(csvContent);
  return csvContent;
}
```

### Monitor group changes

The stored list only changes after a [refresh](./refresh-groups.md), so a monitor can only detect what a refresh brings in: new groups, changed titles, and groups that are gone. Descriptions are not compared, because a refresh currently clears them.

```javascript
class GroupMonitor {
  constructor(apiToken, checkInterval = 30000) { // 30 seconds
    this.apiToken = apiToken;
    this.checkInterval = checkInterval;
    this.previousGroups = new Map();
    this.isMonitoring = false;
  }

  async fetchGroups() {
    return listGroups(this.apiToken);
  }

  detectChanges(currentGroups) {
    const changes = [];

    for (const group of currentGroups) {
      const previous = this.previousGroups.get(group.id);

      if (!previous) {
        changes.push({ type: 'new_group', group, message: `New group: ${group.title}` });
        continue;
      }
      if (group.title !== previous.title) {
        changes.push({
          type: 'name_changed',
          group,
          message: `Group name changed: ${previous.title} → ${group.title}`,
        });
      }
    }

    for (const [id, previous] of this.previousGroups) {
      if (!currentGroups.some((g) => g.id === id)) {
        changes.push({ type: 'group_removed', group: previous, message: `Group no longer listed: ${previous.title}` });
      }
    }

    return changes;
  }

  remember(groups) {
    this.previousGroups = new Map(groups.map((group) => [group.id, group]));
  }

  async startMonitoring(onChanges = null) {
    this.isMonitoring = true;
    const initialGroups = await this.fetchGroups();
    this.remember(initialGroups);
    console.log(`Monitoring ${initialGroups.length} groups...`);

    const monitor = async () => {
      if (!this.isMonitoring) return;
      try {
        const currentGroups = await this.fetchGroups();
        const changes = this.detectChanges(currentGroups);
        if (changes.length > 0) {
          console.log(`Detected ${changes.length} changes:`);
          changes.forEach((change) => console.log(`- ${change.message}`));
          onChanges?.(changes);
        }
        this.remember(currentGroups);
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

const monitor = new GroupMonitor('YOUR_API_TOKEN', 30000);
monitor.startMonitoring((changes) => {
  changes
    .filter((change) => change.type === 'new_group')
    .forEach((change) => console.log(`🔔 ${change.message}`));
});

// Stop monitoring after 10 minutes
setTimeout(() => monitor.stopMonitoring(), 600000);
```

## Polling guidance

The API does not limit how often you call this endpoint. The list only changes after a refresh, so calling it often returns the same data:

- **Recommended frequency:** no more than once every 30 seconds.
- **To see new or changed groups:** call [Refresh groups](./refresh-groups.md) first, then list.

## Related

- [Get group](./get-group.md): details of one group
- [Send group messages](./send-group-messages.md): send messages to a group
- [Refresh groups](./refresh-groups.md): update the stored group list from WhatsApp
- [Update group](./update-group.md): change a group's name, description, or picture
- [Add members](./add-members.md): add participants to a group
