---
title: Quickstart
description: Send your first WhatsApp message with the Whatspie API in about 5 minutes, from token to delivery check.
---

# Quickstart

In this tutorial you get an API token, connect a WhatsApp number, and send your first message with `curl`. It takes about 5 minutes.

## Before you start

You need:

- **A Whatspie account.** Sign up or log in at [app.whatspie.com](https://app.whatspie.com).
- **A phone with WhatsApp.** You scan a QR code with it to connect its number to Whatspie.
- **A terminal with `curl`.** On Windows PowerShell, type `curl.exe` instead of `curl`.

## Step 1: Copy your API token

In the dashboard, open **Developers** in the sidebar, or go to [app.whatspie.com/profile?tab=developer](https://app.whatspie.com/profile?tab=developer). Copy your API token. Treat it like a password.

In the commands below, replace `YOUR_API_TOKEN` with it. See [Authentication](./authentication.md) for details.

## Step 2: Add a device

A device is one WhatsApp number connected to Whatspie. Every message you send goes through a device.

1. In the dashboard, open **Devices** in the sidebar and click **Add Device**.
2. Enter a **Device Name**, for example `Test phone`.
3. Choose a package. To try Whatspie, choose the **Free** package (`BETA`, one per account). Compare Free and Paid features on the [pricing page](https://whatspie.com/#pricing).
4. Click **Create Device**.

## Step 3: Connect it to WhatsApp

1. In **Devices**, click **Connect** next to your new device. A QR code appears.
2. On your phone, open WhatsApp, go to **Linked devices**, and tap **Link a device**.
3. Scan the QR code. You have about 20 seconds; if it expires, click **Connect** again.

## Step 4: Check your token and device

List your devices. This checks your token without sending a message:

```bash
curl 'https://api.whatspie.com/devices' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Accept: application/json'
```

The response looks like this (fields trimmed). `data` is a list with one entry per device:

```json
{
  "status": 200,
  "message": "OK",
  "data": [
    {
      "id": 12,
      "phone": "6281234567890",
      "paired_status": "PAIRED"
    }
  ]
}
```

Find your device in `data`:

- `"paired_status": "PAIRED"` means it is connected to WhatsApp. If it says `UNPAIRED`, repeat Step 3.
- `"phone"` is its WhatsApp number. This is `YOUR_DEVICE_PHONE` in the next step. Use `phone`, not `id`: `id` is only for `/devices/{id}` URLs.

If you get `403 Invalid Authentication Token`, copy the token again from Step 1.

## Step 5: Send a message

Replace `YOUR_API_TOKEN`, `YOUR_DEVICE_PHONE` (from Step 4), and `RECEIVER_PHONE` (a number you can check on a phone). Write numbers in international format without `+`, for example `6281234567890` (Indonesia: replace the first `0` with `62`).

```bash
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "device": "YOUR_DEVICE_PHONE",
    "receiver": "RECEIVER_PHONE",
    "type": "chat",
    "params": {
      "text": "Hi!"
    }
  }'
```

A successful request returns the queued message. In this example the device is `6281234567890` and the receiver is `6289876543210`:

```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "id": 36259782,
    "device_id": 12,
    "from_number": "6281234567890",
    "to_number": "6289876543210",
    "type": "chat",
    "msg_type": "outgoing",
    "body": "Hi!",
    "status": "PENDING",
    "wa_id": null,
    "retry": 0,
    "failed_reason": null,
    "file_url": null,
    "file_name": null,
    "file_caption": null,
    "file_size": null,
    "file_mime": null,
    "params": { "text": "Hi!" },
    "is_group": false,
    "created_at": "2025-08-22T03:36:02Z",
    "updated_at": "2025-08-22T03:36:02Z"
  }
}
```

`PENDING` means the message is queued for sending, not yet delivered. Note `data.id` for the next step.

If the request fails instead:

- `403 Device not found or access denied`: `device` is not a connected device on your account. Use the `phone` from Step 4; see [Connect your first device](./device-management.md#connect-your-first-device).
- `403 Invalid Authentication Token`: the token is wrong. See [Authentication](./authentication.md#errors).

## Step 6: Check delivery

Open WhatsApp on the receiving phone: the message "Hi!" arrives from your device's number.

You can also check it with the API. Replace `MESSAGE_ID` with `data.id` from Step 5:

```bash
curl 'https://api.whatspie.com/messages/MESSAGE_ID' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Accept: application/json'
```

`data.status` changes as delivery progresses: `SENT`, then `RECEIVED`, then `READ`. If it is `ERROR`, `data.failed_reason` says why, for example a disconnected device or a number that is not on WhatsApp. See [Status values](./messaging/get-message.md#status-values).

You have sent your first message with the Whatspie API.

## Next steps

- [Send images](./messaging/send-image.md), [files](./messaging/send-file.md), [videos](./messaging/send-video.md), and [locations](./messaging/send-location.md)
- [Send messages to groups](./groups/send-group-messages.md)
- [Receive incoming messages with webhooks](./webhooks.md)
- [Messaging guide](./messaging/guide.md): code helpers, batch sending, and retries
- No code? [Use Claude with MCP](./mcp/quickstart.md)
