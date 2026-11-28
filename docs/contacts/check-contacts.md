---
title: Check contacts
description: Check whether phone numbers are registered on WhatsApp with POST /contacts/check.
---

# Check contacts

Check whether one or more phone numbers are registered on WhatsApp before you message them. The check runs through one of your connected devices.

## Endpoint

```
POST https://api.whatspie.com/contacts/check
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Phone number of the device that runs the check. It must be connected to WhatsApp. |
| `phones` | array of strings | Yes | Phone numbers to check. At least one. |

### Phone number format

- **Format:** international format, country code first, without `+` or a leading zero.
- **Examples:** `"6281776521626"`, `"1234567890"`, `"447123456789"`.
- **Avoid:** `"+6281776521626"`, `"081776521626"`, `"0081776521626"`.

The API does not reject badly formatted numbers. WhatsApp normalises some of them during the check: `+6281776521626` and `081776521626` can still come back as `true`, and `phone` repeats the number as you sent it. Other formats come back as `false`. Send the international format, so the number you check is the number you later send to.

## Request examples

### Single contact check

```bash
curl -L -X POST 'https://api.whatspie.com/contacts/check' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "device": "6281776521626",
    "phones": [
      "6281776521626"
    ]
  }'
```

### Multiple contacts check

```bash
curl -L -X POST 'https://api.whatspie.com/contacts/check' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "device": "6281776521626",
    "phones": [
      "6281776521626",
      "6285603051722",
      "6281234567890",
      "6289876543210"
    ]
  }'
```

### International numbers check

```bash
curl -L -X POST 'https://api.whatspie.com/contacts/check' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "device": "6281776521626",
    "phones": [
      "6281776521626",
      "60123456789",
      "65123456789",
      "91987654321",
      "1234567890",
      "447123456789"
    ]
  }'
```

## Response

```json
{
  "status": 200,
  "message": "OK",
  "data": [
    {
      "phone": "6281776521626",
      "is_on_whatsapp": false
    },
    {
      "phone": "6285603051722",
      "is_on_whatsapp": true
    },
    {
      "phone": "6281234567890",
      "is_on_whatsapp": false
    },
    {
      "phone": "6289876543210",
      "is_on_whatsapp": false
    }
  ]
}
```

| Field | Type | Description |
|---|---|---|
| `phone` | string | The number, exactly as you sent it. |
| `is_on_whatsapp` | boolean | `true` if the number has a WhatsApp account. |

Results come back in the same order as `phones`.

## Errors

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid request body: ...` | The body is not valid JSON, or `device` or `phones` is missing. |
| `400` | `Phones array cannot be empty` | `phones` is an empty array. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `403` | `Device not found or access denied` | `device` is not a device on your account. |
| `500` | `Internal server error` | The check failed, for example because the device is not connected to WhatsApp. Check the device in [Device management](../device-management.md). |

```json
{
  "status": 403,
  "message": "Device not found or access denied"
}
```

## Notes

- **Number of phones:** there is no fixed limit, but numbers are checked one after another, so long lists take longer. Split large lists into smaller batches.
- **Connected device needed:** the check uses the device's WhatsApp connection. A disconnected device returns `500`.

## Related

- [Send text messages](../messaging/send-text.md) to verified contacts
- [Send image messages](../messaging/send-image.md) to verified numbers
- [Device management](../device-management.md): manage and connect your devices
- [Add members](../groups/add-members.md): add verified contacts to a group
