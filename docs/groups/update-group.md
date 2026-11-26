---
title: Update group
description: Change a WhatsApp group's name, description, or picture with PUT /groups/{id}.
---

# Update group

Change a group's name, description, or picture. Whatspie applies the change on WhatsApp first, then updates its stored copy of the group.

## Endpoint

```
PUT https://api.whatspie.com/groups/{id}
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Path parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | Yes | The group's `id` from [List groups](./list-groups.md). Not the `jid`; see [Which ID to use](./list-groups.md#which-id-to-use). |

## Request

All fields are optional; send the ones you want to change. Empty strings are ignored, and a body with no fields returns success without changing anything.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `subject` | string | No | New group name. WhatsApp's limit is 25 characters; the API does not check it. |
| `description` | string | No | New group description. WhatsApp's limit is 500 characters; the API does not check it. |
| `profile_url` | string | No | Public URL of the new group picture. Whatspie downloads it, with a 10-second timeout. |

The change is made by the device the group belongs to.

:::info[Admin required]
The group's device must be a group admin to update group information. Some settings may require creator privileges.
:::

## Request examples

### Update group name and description

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

### Update group with a profile picture

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

### Update only the description

```bash
curl -L -X PUT 'https://api.whatspie.com/groups/1' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "description": "Updated group description with new information and guidelines"
  }'
```

## Response

A successful request returns HTTP `200` with the updated group, in the same shape as [List groups](./list-groups.md#group-object-fields):

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "id": "1",
    "device_id": "5",
    "jid": "120363022368688477@g.us",
    "title": "Keluarga Bahagia",
    "description": "Ini deskripsi keluarga yang bahagia dan harmonis",
    "image_url": "https://wonder-day.com/wp-content/uploads/2020/10/wonder-day-among-us-21.png",
    "muted": false,
    "spam": false,
    "group_created_at": "2024-11-15T09:00:00Z",
    "created_at": "2024-11-15T09:05:00Z",
    "updated_at": "2024-12-20T15:30:00Z"
  }
}
```

`image_url` holds the `profile_url` you sent, not a WhatsApp-hosted copy.

## Errors

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid group ID` | `id` is not a number, for example a `jid`. |
| `400` | `Invalid request body: ...` | The body is not valid JSON. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `500` | `Internal server error` | Any failure: the group was not found or belongs to another account, the device is not an admin or not connected, or the picture could not be downloaded. |

```json
{
  "status": 500,
  "message": "Internal server error"
}
```

The `500` response does not say which of these causes it was. Check that the group `id` is yours, that the device is connected and an admin, and that `profile_url` is a public image URL.

## Limitations

- **No clearing:** an empty `description` is ignored, so you cannot clear a description with this endpoint.
- **Not supported:** group permissions (who can send or edit) and disappearing messages cannot be changed through the API.

## Related

- [Get group](./get-group.md): check the stored group details
- [List groups](./list-groups.md): find a group's `id`
- [Refresh groups](./refresh-groups.md): re-sync the stored list from WhatsApp
