---
title: Add members
description: Add participants to a WhatsApp group with POST /groups/{id}/members/add.
---

# Add members

Add one or more phone numbers to a WhatsApp group. The group's device adds them.

## Endpoint

```
POST https://api.whatspie.com/groups/{id}/members/add
```

Send your API token in the `Authorization: Bearer YOUR_API_TOKEN` header. See [Authentication](../authentication.md).

## Path parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | Yes | The group's `id` from [List groups](./list-groups.md). Not the `jid`; see [Which ID to use](./list-groups.md#which-id-to-use). |

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `participants` | array of strings | Yes | Phone numbers to add. At least one. |

### Phone number format

- **Format:** international format, digits only, without `+` or a leading zero.
- **Example:** `"6287830605729"`, not `"087830605729"` or `"+6287830605729"`.
- **Why:** each number is sent to WhatsApp as `<number>@s.whatsapp.net` exactly as you wrote it, so `+`, spaces, or a leading `0` produce an invalid number.
- **WhatsApp:** the number must be registered on WhatsApp.

:::info[Admin permission required]
The group's device must be a group administrator to add new members.
:::

## Request examples

### Add a single member

```bash
curl -L -X POST 'https://api.whatspie.com/groups/2/members/add' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "participants": [
      "6287830605729"
    ]
  }'
```

### Add multiple members

```bash
curl -L -X POST 'https://api.whatspie.com/groups/2/members/add' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "participants": [
      "6287830605729",
      "6281234567890",
      "6289876543210",
      "6285544332211"
    ]
  }'
```

### Add members from different countries

```bash
curl -L -X POST 'https://api.whatspie.com/groups/2/members/add' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  --data-raw '{
    "participants": [
      "6287830605729",
      "60123456789",
      "65123456789",
      "91123456789",
      "1234567890"
    ]
  }'
```

## Response

```json
{
  "status": 200,
  "message": "Members added successfully",
  "data": {
    "group_id": 2,
    "members_added": [
      "6287830605729",
      "6281234567890"
    ]
  }
}
```

| Field | Type | Description |
|---|---|---|
| `group_id` | number | The group `id` from the request path. |
| `members_added` | array of strings | The `participants` you sent, returned as-is. |

:::warning[Per-number results are not reported]
`members_added` repeats your request. It does not say which numbers WhatsApp actually added. A number can still be left out, for example because it is not on WhatsApp or its privacy settings block being added. Check the group in WhatsApp to confirm.

A number that is already a member is different: the whole request then fails with `500`. See [Errors](#errors).
:::

## Errors

| HTTP status | `message` | Cause |
|---|---|---|
| `400` | `Invalid group ID` | `id` is not a number, for example a `jid`. |
| `400` | `Invalid request body: ...` | The body is not valid JSON, or `participants` is missing. |
| `400` | `Members list cannot be empty` | `participants` is an empty array. |
| `403` | `Missing Authorization header`, `Missing token in Authorization header`, `Invalid Authentication Token` | Token problem. See [Authentication](../authentication.md#errors). |
| `500` | `Internal server error` | Any failure: the group was not found or belongs to another account, the device is not an admin or not connected, a number is already a member, or WhatsApp rejected the request. |

```json
{
  "status": 400,
  "message": "Members list cannot be empty"
}
```

```json
{
  "status": 500,
  "message": "Internal server error"
}
```

The `500` response does not say which of these causes it was. Check that the group `id` is yours and that the device is connected and an admin.

## Usage examples

The examples use this helper:

```javascript
async function addGroupMembers(token, groupId, phoneNumbers) {
  const response = await fetch(`https://api.whatspie.com/groups/${groupId}/members/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ participants: phoneNumbers }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(`${result.status}: ${result.message}`);
  }
  return result.data; // { group_id, members_added }
}
```

### Add members with error handling

```javascript
try {
  const data = await addGroupMembers('YOUR_API_TOKEN', 2, ['6287830605729', '6281234567890', '6289876543210']);
  console.log(`✅ Sent ${data.members_added.length} numbers to group ${data.group_id}`);
  data.members_added.forEach((phone) => console.log(`  + ${phone}`));
} catch (error) {
  console.error('Error adding members:', error.message);
}
```

### Bulk member addition with validation

Clean and validate numbers first, then send them in batches:

```javascript
function validatePhoneNumbers(phoneNumbers) {
  const validNumbers = [];
  const invalidNumbers = [];

  phoneNumbers.forEach((phone) => {
    const cleanPhone = phone.replace(/[^\d]/g, ''); // digits only
    if (cleanPhone.length >= 10 && cleanPhone.length <= 15 && !cleanPhone.startsWith('0')) {
      validNumbers.push(cleanPhone);
    } else {
      invalidNumbers.push(phone);
    }
  });

  return { validNumbers, invalidNumbers };
}

async function bulkAddMembers(token, groupId, phoneNumbers, batchSize = 20) {
  const { validNumbers, invalidNumbers } = validatePhoneNumbers(phoneNumbers);
  if (invalidNumbers.length > 0) console.warn('Invalid phone numbers detected:', invalidNumbers);
  if (validNumbers.length === 0) throw new Error('No valid phone numbers provided');

  // The API has no batch limit; smaller batches make failures easier to retry
  const batches = [];
  for (let i = 0; i < validNumbers.length; i += batchSize) {
    batches.push(validNumbers.slice(i, i + batchSize));
  }

  const results = [];
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} members)...`);
    try {
      await addGroupMembers(token, groupId, batch);
      results.push({ batch, success: true });
    } catch (error) {
      console.error(`Batch ${i + 1} failed:`, error.message);
      results.push({ batch, success: false, error: error.message });
    }
    if (i < batches.length - 1) await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const sent = results.filter((r) => r.success).reduce((sum, r) => sum + r.batch.length, 0);
  const failed = results.filter((r) => !r.success).reduce((sum, r) => sum + r.batch.length, 0);

  console.log('\n📊 Bulk Addition Summary:');
  console.log(`✅ Sent: ${sent}`);
  console.log(`❌ In failed batches: ${failed}`);
  console.log(`📋 Invalid numbers: ${invalidNumbers.length}`);

  return results;
}

bulkAddMembers('YOUR_API_TOKEN', 2, [
  '6287830605729', '6281234567890', '6289876543210',
  '+62855-4433-2211', '628-1122-334455', // cleaned to digits
  'invalid-number', // rejected
  '6287766554433', '6281987654321',
]);
```

### Add members from a CSV file

```javascript
async function addMembersFromCSV(token, groupId, csvData) {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].toLowerCase().split(',');

  const phoneIndex = headers.findIndex((h) => h.includes('phone') || h.includes('number') || h.includes('mobile'));
  const nameIndex = headers.findIndex((h) => h.includes('name') || h.includes('nama'));
  if (phoneIndex === -1) throw new Error('No phone number column found in CSV');

  const members = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    const phone = row[phoneIndex]?.trim();
    const name = nameIndex !== -1 ? row[nameIndex]?.trim() : '';
    if (phone) members.push({ phone, name });
  }
  console.log(`📋 Found ${members.length} members in CSV`);

  const results = await bulkAddMembers(token, groupId, members.map((m) => m.phone));

  const report = {
    csvMembers: members.length,
    sent: results.filter((r) => r.success).reduce((sum, r) => sum + r.batch.length, 0),
    inFailedBatches: results.filter((r) => !r.success).reduce((sum, r) => sum + r.batch.length, 0),
    details: results,
  };

  console.log('\n📊 CSV Import Report:');
  console.log(`📋 CSV records: ${report.csvMembers}`);
  console.log(`✅ Sent: ${report.sent}`);
  console.log(`❌ In failed batches: ${report.inFailedBatches}`);
  return report;
}

const sampleCSV = `name,phone,email
John Doe,6287830605729,john@example.com
Jane Smith,6281234567890,jane@example.com
Mike Wilson,6289876543210,mike@example.com`;

addMembersFromCSV('YOUR_API_TOKEN', 2, sampleCSV);
```

### Monitor member addition progress

```javascript
async function addMembersWithProgress(token, groupId, phoneNumbers, onProgress, batchSize = 5) {
  const batches = [];
  for (let i = 0; i < phoneNumbers.length; i += batchSize) {
    batches.push(phoneNumbers.slice(i, i + batchSize));
  }

  const progress = { total: phoneNumbers.length, processed: 0, sent: 0, failed: 0, failedNumbers: [] };

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    onProgress?.({ ...progress, percent: Math.round((i / batches.length) * 100), status: `Batch ${i + 1}/${batches.length}` });

    try {
      await addGroupMembers(token, groupId, batch);
      progress.sent += batch.length;
    } catch (error) {
      progress.failed += batch.length;
      progress.failedNumbers.push(...batch.map((phone) => ({ phone, error: error.message })));
    }
    progress.processed += batch.length;

    if (i < batches.length - 1) await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  onProgress?.({ ...progress, percent: 100, status: 'Completed' });
  return progress;
}

const phoneNumbers = Array.from({ length: 50 }, (_, i) => `628${String(i).padStart(9, '0')}`);

addMembersWithProgress('YOUR_API_TOKEN', 2, phoneNumbers, (p) => {
  console.clear();
  console.log(`📊 Adding members: ${p.percent}%  (${p.status})`);
  console.log(`Processed: ${p.processed}/${p.total}  ✅ ${p.sent}  ❌ ${p.failed}`);
  const filled = Math.round((p.percent / 100) * 30);
  console.log(`[${'█'.repeat(filled)}${'░'.repeat(30 - filled)}] ${p.percent}%`);
});
```

## Limitations and considerations

### WhatsApp restrictions

- **Group member limit:** maximum 1024 members per group.
- **Privacy settings:** users can block being added to groups.
- **WhatsApp registration:** phone numbers must be registered on WhatsApp.
- **Admin requirement:** only group admins can add members.

### API behavior

- **No batch or rate limit:** the API sets no maximum number of participants per request and no rate limit. WhatsApp may still restrict accounts that add many people quickly.
- **No per-number result:** the response does not say which numbers were added.
- **Phone format:** international format, digits only (no `+`, `00`, or leading `0`).

### Error handling

- **Partial results:** WhatsApp may add some numbers and skip others, and the response does not show which.
- **Retries:** retry a batch only after a `500`, and check the device connection first.
- **Validation:** always clean and validate phone numbers before sending.
- **Logging:** log the numbers you sent so you can review them later in WhatsApp.

### Best practices

- **Batch processing:** split large member lists into smaller batches.
- **Progress tracking:** use progress callbacks for bulk operations.
- **Error reporting:** keep a list of numbers in failed batches.
- **User consent:** make sure people agree to being added to groups.

## Related

- [Get group](./get-group.md): check the stored group details (it does not list members)
- [List groups](./list-groups.md): find groups to add members to
- [Update group](./update-group.md): change the group's name, description, or picture
- [Send group messages](./send-group-messages.md): welcome new members
- [Refresh groups](./refresh-groups.md): re-sync the stored group list from WhatsApp
