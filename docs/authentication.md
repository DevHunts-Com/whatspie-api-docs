---
title: Authentication
description: Get your Whatspie API token, send it with every request, test it, and fix authentication errors.
---

# Authentication

Every request to the Whatspie API must carry your API token in the `Authorization` header as a Bearer token. There are no other authentication methods.

## Overview

1. **Get your API token** from the Whatspie dashboard: **Developers** in the sidebar, or [app.whatspie.com/profile?tab=developer](https://app.whatspie.com/profile?tab=developer).
2. **Send the token** in the `Authorization` header of every request.
3. **Start using the API.** Your token gives access to the devices on your account.

## Required headers

| Header | Value | Description |
|---|---|---|
| `Authorization` | `Bearer YOUR_API_TOKEN` | Your API token. Write `Bearer`, one space, then the token. |
| `Content-Type` | `application/json` | Needed on requests with a JSON body. |
| `Accept` | `application/json` | The API responds with JSON. |

## Example

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat",
    "params": {
      "text": "Hello World!"
    }
  }'
```

See [Send text message](./messaging/send-text.md) for the request and response fields.

## Get your API token

1. Log in to the Whatspie dashboard at [app.whatspie.com](https://app.whatspie.com).
2. Open **Developers** in the sidebar, or go to **Profile** → **Developer**: [app.whatspie.com/profile?tab=developer](https://app.whatspie.com/profile?tab=developer).
3. Copy your API token from the developer credentials section.
4. Use this token in all API requests.

### Token storage

- Store the token securely in your application.
- Never put the token in client-side code or in logs.
- Use environment variables in production.

### Security best practices

1. **Secure storage:** keep the token in environment variables or a secrets manager, not in source code.
2. **HTTPS only:** always call `https://api.whatspie.com`, never plain HTTP.
3. **Token protection:** never expose the token in client-side code or logs.
4. **Sending rate:** space out your messages. WhatsApp can block numbers that send too much too fast.
5. **IP restrictions:** call the API only from your own servers, and restrict which of your machines hold the token.

## Test your token

List your devices. This checks the token without sending a message:

```bash
curl 'https://api.whatspie.com/devices' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Accept: application/json'
```

A valid token returns HTTP `200` with the devices on your account (fields trimmed):

```json
{
  "status": 200,
  "message": "OK",
  "data": [
    {
      "id": 12,
      "phone": "6281234567890",
      "status": "ACTIVE",
      "paired_status": "PAIRED",
      "webhook_url": null,
      "created_at": "2025-08-22T03:36:02Z",
      "updated_at": "2025-08-22T03:36:02Z"
    }
  ]
}
```

`paired_status: "PAIRED"` means the device is connected to WhatsApp and can send messages. See [Paired status values](./devices/list.md#paired-status-values).

An invalid token returns HTTP `403`:

```json
{
  "status": 403,
  "message": "Invalid Authentication Token"
}
```

### Environment variable setup

```bash
# Set your API token as an environment variable
export WHATSPIE_API_TOKEN="your_actual_token_here"

# Use it in a request
curl 'https://api.whatspie.com/devices' \
  -H "Authorization: Bearer $WHATSPIE_API_TOKEN" \
  -H 'Accept: application/json'
```

## Errors

Authentication errors return HTTP `403` with one of these messages:

| `message` | Cause | Fix |
|---|---|---|
| `Missing Authorization header` | The request has no `Authorization` header. | Add `Authorization: Bearer YOUR_API_TOKEN`. |
| `Missing token in Authorization header` | The header has no token after `Bearer `. | Check that the token is not empty, and that `Bearer` is followed by one space. |
| `Invalid Authentication Token` | The token does not match an account. | Copy the token again from the dashboard. It may have been revoked or regenerated. |
| `Device not found or access denied` | The `device` number in the request is not a device on your account. | Use a device number listed by `GET /devices`. |
| Quota or subscription message | Your package has no quota left for this request. | Check your package and subscription in the dashboard. |

## Next steps

- [Connect your WhatsApp device](./device-management.md) using QR codes
- [Send messages](./messaging/send-text.md) to contacts
- [Manage groups](./groups/list-groups.md) and participants

If a token is revoked or regenerated, requests with the old token fail with `Invalid Authentication Token`. Handle this error in your application, for example by alerting an operator instead of retrying.
