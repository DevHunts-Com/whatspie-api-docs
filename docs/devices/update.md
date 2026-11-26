---
title: Update device
description: Change a device's phone number, status, or webhook URL with PUT /devices/{id}. Read the warning first.
---

# Update device

Change a device's phone number, status, or webhook URL.

```
PUT https://api.whatspie.com/devices/{id}
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

`{id}` is the numeric device `id` from [List devices](./list.md), not the phone number. The phone number goes in the `device` field when you send messages.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `phone` | string | No | Device phone number. |
| `status` | string | No | Device status. |
| `webhook_url` | string | No | URL that receives [webhooks](../webhooks.md). |

:::warning[Update replaces the device record]
This endpoint currently saves only the fields in your request and clears the rest of the device record, including fields you did not send. Change the webhook URL and other settings in the [Whatspie dashboard](https://app.whatspie.com) instead until this is fixed.
:::

## Request example

```bash
curl -L -X PUT 'https://api.whatspie.com/devices/5' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "phone": "62895383079050",
    "status": "ACTIVE",
    "webhook_url": "https://your-webhook-url.com"
  }'
```

## Responses

```json
{
  "status": 200,
  "message": "Device updated successfully",
  "data": null
}
```

Every failure returns `400` with `Failed to update device`, including a wrong or foreign device ID. A non-numeric `{id}` returns `400 Invalid device ID`.
