---
sidebar_position: 5
---

# 📝 Send Template Messages

Create interactive template messages with buttons, footers, and rich content using the Whatspie API for enhanced user engagement and professional communication.

<div style={{background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", padding: "1.5rem", borderRadius: "8px", color: "#8b4513", margin: "1.5rem 0"}}>
  <h3 style={{color: "#8b4513", margin: "0 0 1rem 0"}}>🎨 Interactive Templates</h3>
  <p style={{margin: "0"}}>Send structured messages with custom buttons, footers, and interactive elements that enhance user experience and drive engagement.</p>
</div>

## 🌐 Endpoint

```
POST https://api.whatspie.com/messages
```

## 🔐 Authentication

Bearer token required with proper JSON content headers.

## 📋 Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `device` | string | ✅ | Your registered WhatsApp device number |
| `receiver` | string | ✅ | Recipient's phone number (international format) |
| `type` | string | ✅ | Message type: `"template"` for template messages |
| `params` | object | ✅ | Template configuration object |
| `simulate_typing` | integer | ❌ | Show typing indicator: `1` (yes) or `0` (no) |

## 🎯 Template Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | ✅ | Main template message content |
| `footer` | string | ❌ | Footer text displayed at bottom |
| `templateButtons` | array | ❌ | Array of interactive template buttons |
| `buttons` | array | ❌ | Array of simple reply buttons |

## 🔘 Template Button Types

<div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", margin: "1.5rem 0"}}>
  <div style={{background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "8px", padding: "1rem"}}>
    <h4 style={{color: "#0284c7", marginTop: "0"}}>🌐 URL Button</h4>
    <p style={{margin: "0", fontSize: "0.9rem"}}>Opens a website or link when clicked</p>
    <code style={{fontSize: "0.8rem"}}>urlButton</code>
  </div>
  
  <div style={{background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "8px", padding: "1rem"}}>
    <h4 style={{color: "#059669", marginTop: "0"}}>📞 Call Button</h4>
    <p style={{margin: "0", fontSize: "0.9rem"}}>Initiates a phone call when clicked</p>
    <code style={{fontSize: "0.8rem"}}>callButton</code>
  </div>
  
  <div style={{background: "#fef3c7", border: "1px solid #fed7aa", borderRadius: "8px", padding: "1rem"}}>
    <h4 style={{color: "#d97706", marginTop: "0"}}>⚡ Quick Reply</h4>
    <p style={{margin: "0", fontSize: "0.9rem"}}>Sends a quick response message</p>
    <code style={{fontSize: "0.8rem"}}>quickReplyButton</code>
  </div>
</div>

## 🚀 Request Examples

### Template with Mixed Buttons

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "template",
    "params": {
      "text": "🎉 Welcome to Whatspie! Thanks for choosing our service.",
      "footer": "Powered by Whatspie API",
      "templateButtons": [
        {
          "index": 1,
          "urlButton": {
            "displayText": "⭐ Visit Whatspie Web",
            "url": "https://whatspie.com"
          }
        },
        {
          "index": 2,
          "callButton": {
            "displayText": "📞 Call Support",
            "phoneNumber": "+6285603051722"
          }
        },
        {
          "index": 3,
          "quickReplyButton": {
            "displayText": "✨ Quick Help",
            "url": "https://help.whatspie.com"
          }
        }
      ]
    },
    "simulate_typing": 1
  }'
```

### Simple Button Template

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "template",
    "params": {
      "text": "Would you like to proceed with your order?",
      "footer": "Thank you for shopping with us!",
      "buttons": [
        {
          "buttonId": "yes_proceed",
          "buttonText": {
            "displayText": "✅ Yes, Proceed"
          },
          "type": 1
        },
        {
          "buttonId": "no_cancel",
          "buttonText": {
            "displayText": "❌ No, Cancel"
          },
          "type": 1
        }
      ]
    },
    "simulate_typing": 1
  }'
```

### Business Information Template

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "template",
    "params": {
      "text": "🏢 *TechStore Inc.*\n\nWe provide the latest technology solutions for your business needs. From hardware to software, we have it all!",
      "footer": "📍 Downtown Tech Center • Open Mon-Fri 9AM-6PM",
      "templateButtons": [
        {
          "index": 1,
          "urlButton": {
            "displayText": "🌐 Visit Our Website",
            "url": "https://techstore.example.com"
          }
        },
        {
          "index": 2,
          "callButton": {
            "displayText": "📞 Call Us Now",
            "phoneNumber": "+1234567890"
          }
        }
      ]
    },
    "simulate_typing": 1
  }'
```

## 🔥 Code Examples

### Node.js

```javascript
const axios = require('axios');

async function sendTemplateMessage(token, device, receiver, templateConfig) {
  try {
    const response = await axios.post(
      'https://api.whatspie.com/messages',
      {
        device: device,
        receiver: receiver,
        type: 'template',
        params: templateConfig,
        simulate_typing: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error sending template:', error.response?.data || error.message);
    throw error;
  }
}

// Usage examples
async function examples() {
  const token = 'YOUR_API_TOKEN';
  const device = '6281234567890';
  const receiver = '6289876543210';

  // Customer service template
  const customerServiceTemplate = {
    text: '👋 Hello! Thank you for contacting our customer service.',
    footer: 'We are here to help you 24/7',
    templateButtons: [
      {
        index: 1,
        urlButton: {
          displayText: '🌐 Help Center',
          url: 'https://help.example.com'
        }
      },
      {
        index: 2,
        callButton: {
          displayText: '📞 Call Support',
          phoneNumber: '+1234567890'
        }
      },
      {
        index: 3,
        quickReplyButton: {
          displayText: '💬 Live Chat',
          url: 'https://chat.example.com'
        }
      }
    ]
  };

  await sendTemplateMessage(token, device, receiver, customerServiceTemplate);

  // Product promotion template
  const promoTemplate = {
    text: '🔥 *FLASH SALE ALERT* 🔥\n\n50% OFF on all electronics!\nLimited time offer - ends tonight!',
    footer: '⏰ Offer valid until midnight',
    buttons: [
      {
        buttonId: 'shop_now',
        buttonText: { displayText: '🛒 Shop Now' },
        type: 1
      },
      {
        buttonId: 'view_deals',
        buttonText: { displayText: '👀 View Deals' },
        type: 1
      }
    ]
  };

  await sendTemplateMessage(token, device, receiver, promoTemplate);

  // Survey template
  const surveyTemplate = {
    text: '📊 We value your feedback!\n\nHow was your experience with our service?',
    footer: 'Your opinion helps us improve',
    buttons: [
      {
        buttonId: 'excellent',
        buttonText: { displayText: '⭐ Excellent' },
        type: 1
      },
      {
        buttonId: 'good',
        buttonText: { displayText: '👍 Good' },
        type: 1
      },
      {
        buttonId: 'needs_improvement',
        buttonText: { displayText: '🔧 Needs Improvement' },
        type: 1
      }
    ]
  };

  await sendTemplateMessage(token, device, receiver, surveyTemplate);
}

examples().then(() => console.log('All templates sent!'));
```

### Python

```python
import requests

def send_template_message(token, device, receiver, template_config):
    url = "https://api.whatspie.com/messages"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    data = {
        'device': device,
        'receiver': receiver,
        'type': 'template',
        'params': template_config,
        'simulate_typing': 1
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

# Usage examples
try:
    token = 'YOUR_API_TOKEN'
    device = '6281234567890'
    receiver = '6289876543210'
    
    # Event invitation template
    event_template = {
        'text': '🎊 You\'re Invited to TechConf 2024!\n\nJoin us for an amazing day of technology talks and networking.',
        'footer': '📅 March 15, 2024 • 📍 Tech Center Hall',
        'templateButtons': [
            {
                'index': 1,
                'urlButton': {
                    'displayText': '🎟️ Register Now',
                    'url': 'https://techconf2024.com/register'
                }
            },
            {
                'index': 2,
                'callButton': {
                    'displayText': '📞 Contact Organizer',
                    'phoneNumber': '+1234567890'
                }
            },
            {
                'index': 3,
                'quickReplyButton': {
                    'displayText': '📋 Event Details',
                    'url': 'https://techconf2024.com/details'
                }
            }
        ]
    }
    
    result = send_template_message(token, device, receiver, event_template)
    print(f"Event invitation sent: {result['data']['id']}")
    
    # Appointment confirmation template
    appointment_template = {
        'text': '🏥 *Appointment Confirmation*\n\nDr. Smith\nTomorrow, 2:00 PM\nRoom 205',
        'footer': 'Please arrive 15 minutes early',
        'buttons': [
            {
                'buttonId': 'confirm_appointment',
                'buttonText': {'displayText': '✅ Confirm'},
                'type': 1
            },
            {
                'buttonId': 'reschedule_appointment',
                'buttonText': {'displayText': '📅 Reschedule'},
                'type': 1
            },
            {
                'buttonId': 'cancel_appointment',
                'buttonText': {'displayText': '❌ Cancel'},
                'type': 1
            }
        ]
    }
    
    result = send_template_message(token, device, receiver, appointment_template)
    print(f"Appointment reminder sent: {result['data']['id']}")
    
except requests.RequestException as e:
    print(f"Error: {e}")
```

### PHP

```php
<?php
function sendTemplateMessage($token, $device, $receiver, $templateConfig) {
    $url = 'https://api.whatspie.com/messages';
    
    $data = [
        'device' => $device,
        'receiver' => $receiver,
        'type' => 'template',
        'params' => $templateConfig,
        'simulate_typing' => 1
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    } else {
        throw new Exception("HTTP $httpCode: $response");
    }
}

// Usage examples
try {
    $token = 'YOUR_API_TOKEN';
    $device = '6281234567890';
    $receiver = '6289876543210';
    
    // Restaurant menu template
    $menuTemplate = [
        'text' => '🍕 *Tony\'s Pizza Menu* 🍕

🍕 Margherita Pizza - $12
🍖 Pepperoni Pizza - $15  
🥗 Caesar Salad - $8
🍝 Spaghetti Carbonara - $14

Fresh ingredients, authentic taste!',
        'footer' => '🚚 Free delivery on orders over $25',
        'templateButtons' => [
            [
                'index' => 1,
                'urlButton' => [
                    'displayText' => '🛒 Order Online',
                    'url' => 'https://tonys-pizza.com/order'
                ]
            ],
            [
                'index' => 2,
                'callButton' => [
                    'displayText' => '📞 Call & Order',
                    'phoneNumber' => '+1234567890'
                ]
            ]
        ]
    ];
    
    $result = sendTemplateMessage($token, $device, $receiver, $menuTemplate);
    echo "Menu sent: " . $result['data']['id'] . "\n";
    
    // Newsletter subscription template
    $newsletterTemplate = [
        'text' => '📧 *Subscribe to Our Newsletter*

Stay updated with the latest news, offers, and updates from our company!

✨ Exclusive deals
📰 Industry insights  
🎁 Member-only rewards',
        'footer' => 'Unsubscribe anytime',
        'buttons' => [
            [
                'buttonId' => 'subscribe_weekly',
                'buttonText' => ['displayText' => '📅 Weekly Updates'],
                'type' => 1
            ],
            [
                'buttonId' => 'subscribe_monthly',
                'buttonText' => ['displayText' => '📆 Monthly Digest'],
                'type' => 1
            ],
            [
                'buttonId' => 'no_thanks',
                'buttonText' => ['displayText' => '🚫 No Thanks'],
                'type' => 1
            ]
        ]
    ];
    
    $result = sendTemplateMessage($token, $device, $receiver, $newsletterTemplate);
    echo "Newsletter template sent: " . $result['data']['id'] . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
```

## 📊 Response Format

### Success Response

```json
{
  "code": 200,
  "message": "Template message sent successfully",
  "data": {
    "id": "msg_template_12345",
    "status": "pending",
    "type": "template",
    "device": "6281234567890",
    "receiver": "6289876543210",
    "params": {
      "text": "Welcome to Whatspie!",
      "footer": "Powered by Whatspie API",
      "templateButtons": [...]
    },
    "simulate_typing": 1,
    "timestamp": "2024-12-20T10:30:00Z"
  }
}
```

### Error Response - Invalid Template Structure

```json
{
  "code": 400,
  "message": "Invalid template parameters",
  "error": "Template buttons must have valid button configuration"
}
```

## 💡 Best Practices

### 1. Button Design Guidelines

```javascript
// Optimal button text length
function createOptimalButtons() {
  return [
    {
      buttonId: 'action1',
      buttonText: { displayText: '✅ Yes' }, // Short and clear
      type: 1
    },
    {
      buttonId: 'action2',
      buttonText: { displayText: '❌ No' }, // Use emojis for clarity
      type: 1
    }
  ];
}

// Avoid overly long button text
function avoidLongButtons() {
  // ❌ Bad - too long
  const badButton = {
    buttonText: { displayText: 'Click here to proceed with the very long process that might take some time' }
  };
  
  // ✅ Good - concise and clear
  const goodButton = {
    buttonText: { displayText: '🚀 Start Process' }
  };
}
```

### 2. Template Message Structure

```javascript
function createWellStructuredTemplate() {
  return {
    text: `🎯 *Clear Main Message*
    
Keep your main content focused and scannable.
Use formatting to highlight important information.`,
    
    footer: 'Keep footer text short and relevant', // Max ~60 characters
    
    templateButtons: [
      {
        index: 1,
        urlButton: {
          displayText: '🌐 Primary Action', // Most important action first
          url: 'https://primary-action.com'
        }
      },
      {
        index: 2,
        quickReplyButton: {
          displayText: '💬 Secondary Action', // Less important actions follow
          url: 'https://secondary.com'
        }
      }
    ]
  };
}
```

### 3. Error Handling for Templates

```javascript
function validateTemplateConfig(config) {
  const errors = [];
  
  // Validate text
  if (!config.text || config.text.length > 1024) {
    errors.push('Text is required and must be under 1024 characters');
  }
  
  // Validate footer
  if (config.footer && config.footer.length > 60) {
    errors.push('Footer should be under 60 characters for best display');
  }
  
  // Validate buttons
  if (config.templateButtons) {
    config.templateButtons.forEach((button, index) => {
      if (!button.index || button.index !== index + 1) {
        errors.push(`Button at position ${index + 1} must have correct index`);
      }
      
      if (button.urlButton && !isValidUrl(button.urlButton.url)) {
        errors.push(`Invalid URL in button ${index + 1}`);
      }
    });
  }
  
  if (errors.length > 0) {
    throw new Error('Template validation failed: ' + errors.join(', '));
  }
  
  return true;
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Usage
try {
  validateTemplateConfig(templateConfig);
  const result = await sendTemplateMessage(token, device, receiver, templateConfig);
} catch (error) {
  console.error('Template error:', error.message);
}
```

## 🎨 Template Use Cases

### E-commerce Order Confirmation

```javascript
const orderConfirmationTemplate = {
  text: `🛒 *Order Confirmed!* 

Order #12345
📦 3 items • Total: $89.99
🚚 Estimated delivery: 2-3 days`,
  
  footer: 'Thank you for shopping with us!',
  
  templateButtons: [
    {
      index: 1,
      urlButton: {
        displayText: '📱 Track Order',
        url: 'https://shop.example.com/track/12345'
      }
    },
    {
      index: 2,
      callButton: {
        displayText: '📞 Contact Support',
        phoneNumber: '+1234567890'
      }
    }
  ]
};
```

### Event RSVP

```javascript
const eventRSVPTemplate = {
  text: `🎉 *Tech Meetup Invitation*

📅 December 25, 2024
⏰ 6:00 PM - 9:00 PM  
📍 Innovation Hub Downtown
🎯 Topic: "AI in 2024"`,
  
  footer: '🍕 Food & drinks provided',
  
  buttons: [
    {
      buttonId: 'rsvp_yes',
      buttonText: { displayText: '✅ I\'ll be there!' },
      type: 1
    },
    {
      buttonId: 'rsvp_no',
      buttonText: { displayText: '❌ Can\'t make it' },
      type: 1
    },
    {
      buttonId: 'rsvp_maybe',
      buttonText: { displayText: '🤔 Maybe' },
      type: 1
    }
  ]
};
```

### Customer Feedback

```javascript
const feedbackTemplate = {
  text: `⭐ *Rate Your Experience*

How satisfied are you with our service today?

Your feedback helps us serve you better!`,
  
  footer: 'Takes less than 30 seconds',
  
  buttons: [
    {
      buttonId: 'rating_5',
      buttonText: { displayText: '⭐⭐⭐⭐⭐ Amazing' },
      type: 1
    },
    {
      buttonId: 'rating_4',
      buttonText: { displayText: '⭐⭐⭐⭐ Great' },
      type: 1
    },
    {
      buttonId: 'rating_3',
      buttonText: { displayText: '⭐⭐⭐ Good' },
      type: 1
    }
  ]
};
```

## ⚠️ Limitations

- **Button Limit**: Maximum 3 template buttons or 10 reply buttons per message
- **Text Length**: Main text maximum 1024 characters
- **Footer Length**: Footer text maximum 60 characters for optimal display
- **Button Text**: Keep button text under 20 characters
- **URL Validation**: URLs must be valid and accessible
- **Phone Numbers**: Must be in international format for call buttons

## 🔗 Related Endpoints

- [Send Text Messages](./send-text) - For simple text messaging
- [Send Image Messages](./send-image) - For multimedia content
- [Send List Messages](./send-list) - For structured list options
- [Get Message Status](../messages/get-messages) - Check delivery status
