---
title: Send text message
description: Send a WhatsApp text message to a phone number with POST /messages.
---

# Send text message

Send a text message from one of your devices to a phone number. The text supports WhatsApp formatting and emoji.

## Endpoint

```
POST https://api.whatspie.com/messages
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `device` | string | Yes | Phone number of your sending device: the `phone` field from [List devices](../devices/list.md), not the numeric device `id`. |
| `receiver` | string | Yes | Recipient's phone number. Up to 35 characters. |
| `type` | string | Yes | `chat` for a text message. |
| `params` | object | Yes | Message content. |
| `params.text` | string | Yes | The text to send. Supports [WhatsApp formatting](#text-formatting). |

Write phone numbers in international format without `+`. See [Phone number format](#phone-number-format).

`params` accepts only these keys: `text`, `caption`, `fileName`, `mimetype`, `location`, `image`, `document`, `video`. Any other key is rejected.

The older format, with the text in a top-level `message` field and no `params`, is still accepted for backward compatibility. New integrations should use `params`.

### Example

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
      "text": "*Bold* _italic_ ~strikethrough~ ```monospace```\n\nNew paragraph with emoji 🎉"
    }
  }'
```

The JavaScript examples on this page use this helper:

```javascript
async function sendTextMessage(token, device, receiver, message) {
  const res = await fetch('https://api.whatspie.com/messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ device, receiver, type: 'chat', params: { text: message } }),
  });
  const body = await res.json();
  if (!res.ok) {
    const error = new Error(body.message);
    error.status = res.status;
    throw error;
  }
  return body;
}
```

## Response

A successful request returns HTTP `200` with the queued message:

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
    "body": "Hello World!",
    "status": "PENDING",
    "wa_id": null,
    "retry": 0,
    "failed_reason": null,
    "file_url": null,
    "file_name": null,
    "file_caption": null,
    "file_size": null,
    "file_mime": null,
    "params": { "text": "Hello World!" },
    "is_group": false,
    "created_at": "2025-08-22T03:36:02Z",
    "updated_at": "2025-08-22T03:36:02Z"
  }
}
```

### Response fields

| Field | Type | Description |
|---|---|---|
| `id` | number | Message ID. Use it with [Get message](./get-message.md) to check the message later. |
| `device_id` | number | ID of the sending device. |
| `from_number` | string | Sender device number. |
| `to_number` | string | Recipient's phone number. |
| `type` | string | `chat`. |
| `msg_type` | string | `outgoing` for messages you send. |
| `body` | string | The text that was sent. |
| `status` | string | Delivery status. `PENDING` right after the request: the message is queued, not yet delivered. It changes as delivery progresses; see [Status values](./get-message.md#status-values). |
| `wa_id` | string or null | WhatsApp's own message ID. `null` while the message is `PENDING`; filled in after WhatsApp accepts it. |
| `retry` | number | Number of send retries. |
| `failed_reason` | string or null | Why sending failed, if it did. |
| `file_url`, `file_name`, `file_caption`, `file_size`, `file_mime` | null | Not used for text messages. |
| `params` | object | Stored message parameters: `{ "text": "..." }`. |
| `is_group` | boolean | `false` for messages to a phone number. |
| `created_at`, `updated_at` | string | Timestamps, ISO 8601. |

## Errors

Errors return the HTTP status in `status` and a description in `message`:

```json
{
  "status": 400,
  "message": "Invalid message params: unknown parameter 'body'. Allowed parameters: text, caption, fileName, mimetype, location, image, document"
}
```

The API's error message leaves `video` out of the allowed list, but `video` is allowed.

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid message params: ...` | `params` contains a key that is not allowed, or a nested value has the wrong shape. |
| `400` | `Message text is required for chat type` | The request has neither `params` nor a legacy `message` field. |
| `400` | `Invalid request body: ...` | The body is not valid JSON, or `device`, `receiver`, or `type` is missing. |
| `400` | `Invalid message type. Must be one of: ...` | `type` is not a supported message type. |
| `403` | `Missing Authorization header` | No `Authorization` header. |
| `403` | `Missing token in Authorization header` | The header has no token after `Bearer `. |
| `403` | `Invalid Authentication Token` | The token is wrong or revoked. |
| `403` | `Device not found or access denied` | `device` is not a device on your account. |
| `403` | Quota or subscription message | Your package has no messages left. |
| `500` | Error description | Internal error, for example the message could not be saved. Try again later. |

Sending failures, such as a disconnected device or a number that is not on WhatsApp, do not cause an error response either: the API accepts the message first and sends it in the background. They show up later as status `ERROR` with a `failed_reason`. Check them with [Get message](./get-message.md); see [Status values](./get-message.md#status-values).

## Phone number format

Write `device` and `receiver` in international format: country code followed by the number, without `+`, spaces, or hyphens.

| Country | Format | Example |
|---|---|---|
| USA | `1XXXXXXXXXX` | `11234567890` |
| UK | `44XXXXXXXXXX` | `441234567890` |
| India | `91XXXXXXXXXX` | `911234567890` |
| Indonesia | `62XXXXXXXXXXX` | `6281234567890` |
| Brazil | `55XXXXXXXXXXX` | `5511987654321` |
| Germany | `49XXXXXXXXXX` | `491234567890` |

Invalid formats:

- `+6281234567890`: contains `+`
- `081234567890`: missing country code
- `6281-234-567-890`: contains hyphens
- `62 81234567890`: contains spaces

## Text formatting

WhatsApp formatting works in `params.text`:

| Style | Syntax | Example |
|---|---|---|
| Bold | `*text*` | `*Order confirmed*` |
| Italic | `_text_` | `_optional_` |
| Strikethrough | `~text~` | `~old price~` |
| Monospace | ` ```text``` ` | ` ```ABC-123``` ` |

Use `\n` in JSON for a line break.

### Formatting examples

```bash
# Bold text
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat",
    "params": { "text": "This is *bold text* in WhatsApp" }
  }'

# Mixed formatting
curl -X POST 'https://api.whatspie.com/messages' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "chat",
    "params": { "text": "*Bold* _italic_ ~strike~ text combined!" }
  }'
```

### Emoji and special characters

Emoji and other Unicode characters are sent as-is:

```javascript
const messages = [
  'Hello! 👋 How are you today?',
  "Thanks for your order! ✅ We'll process it soon.",
  '🎉 Congratulations on your achievement!',
  '❗ Important: Please reply to this message.',
  '🚨 *URGENT NOTICE* 🚨\n\nYour account will expire in 3 days.\n\n✅ Renew now: https://example.com\n💳 Questions? Reply to this message',
];

const token = 'YOUR_API_TOKEN';
const device = '6281234567890';
const receiver = '6289876543210';

for (const [index, msg] of messages.entries()) {
  try {
    const result = await sendTextMessage(token, device, receiver, msg);
    console.log(`Message ${index + 1} queued:`, result.data.id);
  } catch (error) {
    console.error(`Message ${index + 1} failed:`, error.message);
  }
  await new Promise((resolve) => setTimeout(resolve, 1000)); // pause between messages
}
```

## Best practices

### 1. Validate phone numbers

Check numbers before you send, so typos fail early instead of reaching the API:

```javascript
function isValidPhoneNumber(phoneNumber) {
  // Country code + number, digits only, no leading zero
  return /^[1-9]\d{10,14}$/.test(phoneNumber);
}

function validateWhatspieRequest(device, receiver, message) {
  if (!isValidPhoneNumber(device)) throw new Error('Invalid device phone number format');
  if (!isValidPhoneNumber(receiver)) throw new Error('Invalid receiver phone number format');
  if (!message) throw new Error('Message is empty');
  return true;
}

try {
  validateWhatspieRequest('6281234567890', '6289876543210', 'Hello World!');
  await sendTextMessage(token, '6281234567890', '6289876543210', 'Hello World!');
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

### 2. Message length

The API does not enforce a maximum length. Long messages are harder to read on a phone, so keep them short. If you want a limit in your own app, check it before sending:

```javascript
function validateMessage(message, maxLength = 4096) {
  if (message.length > maxLength) {
    throw new Error(`Message too long. Maximum ${maxLength} characters allowed.`);
  }
  return true;
}
```

### 3. Rate limiting

Sending many messages quickly can get your number blocked by WhatsApp. Space your messages out:

```javascript
class MessageSender {
  constructor(token, device, minIntervalMs = 1000) {
    this.token = token;
    this.device = device;
    this.minIntervalMs = minIntervalMs;
    this.lastSent = 0;
  }

  async sendMessage(receiver, message) {
    const wait = this.minIntervalMs - (Date.now() - this.lastSent);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));

    const result = await sendTextMessage(this.token, this.device, receiver, message);
    this.lastSent = Date.now();
    return result;
  }
}
```

### 4. Error handling

Retry only errors that can succeed on a second try. Authentication and request errors fail the same way every time:

```javascript
async function sendMessageWithRetry(token, device, receiver, message, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendTextMessage(token, device, receiver, message);
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);

      // 400 and 403 will not succeed on retry
      if (error.status === 400 || error.status === 403) throw error;
      if (attempt === maxRetries) throw error;

      // Exponential backoff: 2 s, 4 s, ...
      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
    }
  }
}

function describeError(error) {
  switch (error.status) {
    case 400:
      return `Bad request: ${error.message}`;
    case 403:
      return `Forbidden: ${error.message}. Check your token, device, and quota.`;
    case 500:
      return 'Server error: please try again later';
    default:
      return error.status ? `HTTP ${error.status}: ${error.message}` : `Network error: ${error.message}`;
  }
}

try {
  const result = await sendMessageWithRetry(
    'YOUR_API_TOKEN',
    '6281234567890',
    '6289876543210',
    'Hello with error handling!',
  );
  console.log('Message queued:', result.data.id);
} catch (error) {
  console.error('Failed to send message:', describeError(error));
}
```

### 5. Bulk messaging

The API sends one message per request. To message many recipients, loop with a delay:

```javascript
async function sendBulkMessages(token, device, recipients, message, options = {}) {
  const { delayMs = 2000, onProgress = null, onError = null } = options;
  const results = [];
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i++) {
    const receiver = recipients[i];
    try {
      const result = await sendTextMessage(token, device, receiver, message);
      results.push({ receiver, success: true, messageId: result.data.id, createdAt: result.data.created_at });
      sent++;
      onProgress?.({ sent, failed, total: recipients.length, current: receiver });
    } catch (error) {
      results.push({ receiver, success: false, error: error.message });
      failed++;
      onError?.(receiver, error.message);
    }
    if (i < recipients.length - 1) await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return { results, summary: { sent, failed, total: recipients.length } };
}

const bulkResults = await sendBulkMessages(
  'YOUR_API_TOKEN',
  '6281234567890',
  ['6289876543210', '6287654321098', '6285432109876'],
  '📢 *Important Update*\n\nOur services will be updated tonight from 2-4 AM.\n\nSorry for any inconvenience! 🙏',
  {
    delayMs: 3000,
    onProgress: (p) => console.log(`Progress: ${p.sent}/${p.total} sent (${p.failed} failed)`),
    onError: (receiver, error) => console.warn(`Failed to send to ${receiver}: ${error}`),
  },
);
console.log('Bulk messaging completed:', bulkResults.summary);
```

Personalized messages work the same way, with the text built per contact:

```javascript
async function sendPersonalizedMessages(token, device, contacts) {
  const results = [];
  for (const contact of contacts) {
    const text = `Hi ${contact.name}! 👋\n\nThanks for being a valued customer. Your account status: ${contact.status}\n\nQuestions? Just reply! 💬`;
    try {
      const result = await sendTextMessage(token, device, contact.phone, text);
      results.push({ ...contact, success: true, messageId: result.data.id });
    } catch (error) {
      results.push({ ...contact, success: false, error: error.message });
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return results;
}

const personalizedResults = await sendPersonalizedMessages('YOUR_API_TOKEN', '6281234567890', [
  { name: 'John Doe', phone: '6289876543210', status: 'Active' },
  { name: 'Jane Smith', phone: '6287654321098', status: 'Premium' },
]);
console.log('Personalized messages sent:', personalizedResults);
```

## Limitations and guidelines

- **Message length:** the API sets no limit. Keep messages readable on a phone.
- **Sending rate:** about 1–2 messages per second is a common safe rate to avoid temporary blocks.
- **Recipients:** must have an active WhatsApp account. Use [Check contacts](../contacts/check-contacts.md) to verify numbers first.
- **Sending device:** must be connected to WhatsApp. A disconnected device cannot deliver messages. See [Device management](../device-management.md).
- **WhatsApp policies:** follow WhatsApp's business messaging policies and terms.
- **International numbers:** always include the country code.

## Use cases

### Customer support

```javascript
const supportMsg = `👋 Hi! Thanks for contacting support.

🔍 *Issue*: ${customerIssue}
🎟️ *Ticket*: #${ticketNumber}
⏱️ *Response Time*: Within 2 hours

📞 Urgent? Call: +1-800-SUPPORT
💬 Questions? Just reply here!

_We're here to help!_ ✨`;
```

### Marketing campaigns

```javascript
const campaignMsg = `🎉 *FLASH SALE ALERT* 🎉

⚡ *50% OFF* Everything!
⏰ Today only: ${new Date().toLocaleDateString()}
🛍️ Shop now: ${shopUrl}

💰 Use code: *FLASH50*
🚚 Free shipping on orders $75+

*Limited time offer!* ⏳`;
```

### Appointment reminders

```javascript
const reminderMsg = `📅 *Appointment Reminder*

👤 *Patient*: ${patientName}
🏥 *Doctor*: Dr. ${doctorName}
📅 *Date*: ${appointmentDate}
⏰ *Time*: ${appointmentTime}
📍 *Location*: ${clinicAddress}

✅ Reply *CONFIRM* to confirm
❌ Reply *CANCEL* to reschedule

📞 Questions? Call: ${clinicPhone}`;
```

## Related

- [Send image](./send-image.md): images with captions
- [Send file](./send-file.md): documents and other files
- [Send location](./send-location.md): location coordinates
- [Get message](./get-message.md): check a message's delivery status
- [Device management](../device-management.md): check that your device is connected
- [Authentication](../authentication.md): API tokens
