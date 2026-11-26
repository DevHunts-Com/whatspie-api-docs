---
title: Delete device
description: Delete a WhatsApp device permanently with DELETE /devices/{id}.
---

# Delete device

Delete a device from your account. It cannot be undone.

```
DELETE https://api.whatspie.com/devices/{id}
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Request example

```bash
curl -L -X DELETE 'https://api.whatspie.com/devices/5' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

## Responses

```json
{
  "status": 200,
  "message": "Device deleted successfully",
  "data": null
}
```

Every failure returns `400` with `Failed to delete device`, including a wrong or foreign device ID. A non-numeric `{id}` returns `400 Invalid device ID`.
