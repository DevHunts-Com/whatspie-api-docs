---
title: Refresh groups
description: Re-sync a device's WhatsApp group list from the live connection into Whatspie with POST /groups/refresh.
---

# Refresh groups

Fetch a device's current group list from its live WhatsApp connection and save it in Whatspie. [List groups](./list-groups.md) and [Get group](./get-group.md) read this stored list, so refresh it after you join, leave, or change a group.

## Endpoint

```
POST https://api.whatspie.com/groups/refresh
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Query parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Phone number of the device whose groups to refresh. |

## Request example

```bash
curl -X POST 'https://api.whatspie.com/groups/refresh?device=6281234567890' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Accept: application/json'
```

## Response

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

### Response fields

Same shape as [List groups](./list-groups.md#group-object-fields); see that page for each field. `data` holds only the groups synced by this call. `updated_at` is the time of this refresh for every synced group.

## Errors

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Device parameter is required` | The `device` query parameter is missing. |
| `403` | `Device not found or access denied` | `device` is not a device on your account. |
| `403` | `failed to fetch group list from whatspie node: ...` containing `Disconnected` or `Connection issue` | The device is not connected to WhatsApp, or Whatspie could not reach it. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `500` | Error description | Any other error while fetching the groups. Try again later. |

### Missing device parameter

```json
{
  "status": 400,
  "message": "Device parameter is required"
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
  "message": "failed to fetch group list from whatspie node: Disconnected"
}
```

The device must be connected (paired and online), because the group list is fetched live from its WhatsApp connection.

## How it works

1. Whatspie fetches the current group list from the device's live WhatsApp connection.
2. Each group is **upserted** into the stored list, matched by device and group JID: existing groups are updated in place, newly joined groups are added.
3. Groups you have left on WhatsApp are **not removed** from the stored list.
4. Title, picture, mute, and spam status are updated from WhatsApp. The stored `description` is cleared to `null` on every refresh; see the warning below.

:::warning[Descriptions are cleared]
A refresh currently sets `description` to `null` for every synced group, even if the group has a description on WhatsApp.
:::

:::tip[When to use this]
Call this endpoint after joining a new group, or periodically if you rely on [List groups](./list-groups.md) for up-to-date group data and don't want to wait for the next automatic sync.
:::

## Related

- [List groups](./list-groups.md): the stored group list (no live fetch)
- [Get group](./get-group.md): details of one stored group
- [Send group messages](./send-group-messages.md): send messages to groups
