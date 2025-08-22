---
sidebar_position: 6
---

# 📋 Send List Messages

Create interactive list messages with multiple sections and options using the Whatspie API, perfect for menus, catalogs, and organized selections.

<div style={{background: 'linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%)', padding: '1.5rem', borderRadius: '8px', color: '#4c1d95', margin: '1.5rem 0'}}>
  <h3 style={{color: '#4c1d95', margin: '0 0 1rem 0'}}>📝 Structured Lists</h3>
  <p style={{margin: 0}}>Send organized lists with multiple sections, descriptions, and selectable options that make it easy for users to choose from various items.</p>
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
| `type` | string | ✅ | Message type: `"list"` for list messages |
| `params` | object | ✅ | List configuration object |
| `simulate_typing` | integer | ❌ | Show typing indicator: `1` (yes) or `0` (no) |

## 🎯 List Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | ✅ | List title (main heading) |
| `text` | string | ✅ | List description text |
| `footer` | string | ❌ | Footer text displayed at bottom |
| `buttonText` | string | ✅ | Text on the button to view the list |
| `sections` | array | ✅ | Array of list sections with rows |

## 📑 Section Structure

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | ✅ | Section title/header |
| `rows` | array | ✅ | Array of selectable row items |

## 🎯 Row Structure

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | ✅ | Row title (main text) |
| `rowId` | string | ✅ | Unique identifier for the row |
| `description` | string | ❌ | Optional description text |

## 🚀 Request Examples

### Restaurant Menu List

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "list",
    "params": {
      "title": "🍕 Tony'\''s Pizza Menu",
      "text": "Choose from our delicious menu! All items are freshly prepared with the finest ingredients. 🔥",
      "footer": "🚚 Free delivery on orders over $25",
      "buttonText": "📋 View Menu",
      "sections": [
        {
          "title": "🍕 Pizzas",
          "rows": [
            {
              "title": "Margherita Pizza",
              "rowId": "pizza_margherita",
              "description": "Fresh tomatoes, mozzarella, basil - $12"
            },
            {
              "title": "Pepperoni Pizza", 
              "rowId": "pizza_pepperoni",
              "description": "Pepperoni, mozzarella, tomato sauce - $15"
            }
          ]
        },
        {
          "title": "🥗 Salads",
          "rows": [
            {
              "title": "Caesar Salad",
              "rowId": "salad_caesar",
              "description": "Crispy lettuce, parmesan, croutons - $8"
            },
            {
              "title": "Greek Salad",
              "rowId": "salad_greek", 
              "description": "Tomatoes, olives, feta, cucumber - $9"
            }
          ]
        }
      ]
    },
    "simulate_typing": 1
  }'
```

### Product Catalog List

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "list",
    "params": {
      "title": "📱 TechStore Catalog",
      "text": "Browse our latest collection of tech products with amazing deals and warranties!",
      "footer": "💳 Easy payments • 🚚 Fast shipping",
      "buttonText": "🛒 Browse Products",
      "sections": [
        {
          "title": "📱 Smartphones",
          "rows": [
            {
              "title": "iPhone 15 Pro",
              "rowId": "iphone_15_pro",
              "description": "Latest Apple flagship - $999"
            },
            {
              "title": "Samsung Galaxy S24",
              "rowId": "galaxy_s24",
              "description": "Android powerhouse - $849"
            }
          ]
        },
        {
          "title": "💻 Laptops", 
          "rows": [
            {
              "title": "MacBook Air M3",
              "rowId": "macbook_air_m3",
              "description": "Ultra-portable performance - $1299"
            },
            {
              "title": "Dell XPS 13",
              "rowId": "dell_xps_13",
              "description": "Windows ultrabook - $999"
            }
          ]
        }
      ]
    },
    "simulate_typing": 1
  }'
```

### Service Selection List

```bash
curl -X POST "https://api.whatspie.com/messages" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device": "6281234567890",
    "receiver": "6289876543210",
    "type": "list",
    "params": {
      "title": "🏥 Healthcare Services",
      "text": "Select the service you need. Our qualified professionals are ready to help you.",
      "footer": "📞 Emergency? Call (555) 123-HELP",
      "buttonText": "📋 Select Service",
      "sections": [
        {
          "title": "👨‍⚕️ General Medicine",
          "rows": [
            {
              "title": "General Consultation",
              "rowId": "consultation_general",
              "description": "45-min appointment with doctor"
            },
            {
              "title": "Health Checkup",
              "rowId": "checkup_general",
              "description": "Comprehensive health screening"
            }
          ]
        },
        {
          "title": "🦷 Dental Care",
          "rows": [
            {
              "title": "Dental Cleaning",
              "rowId": "dental_cleaning",
              "description": "Professional teeth cleaning"
            },
            {
              "title": "Dental Consultation",
              "rowId": "dental_consultation", 
              "description": "Initial dental examination"
            }
          ]
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

async function sendListMessage(token, device, receiver, listConfig) {
  try {
    const response = await axios.post(
      'https://api.whatspie.com/messages',
      {
        device: device,
        receiver: receiver,
        type: 'list',
        params: listConfig,
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
    console.error('Error sending list:', error.response?.data || error.message);
    throw error;
  }
}

// Usage examples
async function examples() {
  const token = 'YOUR_API_TOKEN';
  const device = '6281234567890';
  const receiver = '6289876543210';

  // Coffee shop menu
  const coffeeMenuList = {
    title: '☕ Daily Brew Coffee Menu',
    text: 'Welcome to Daily Brew! Choose from our premium coffee selection made with the finest beans. ☕✨',
    footer: '🎁 Buy 5 get 1 free!',
    buttonText: '☕ View Coffee Menu',
    sections: [
      {
        title: '☕ Hot Coffee',
        rows: [
          {
            title: 'Espresso',
            rowId: 'espresso',
            description: 'Rich and bold - $3.50'
          },
          {
            title: 'Cappuccino',
            rowId: 'cappuccino',
            description: 'Creamy and frothy - $4.50'
          },
          {
            title: 'Americano',
            rowId: 'americano',
            description: 'Smooth and strong - $3.75'
          }
        ]
      },
      {
        title: '🧊 Cold Drinks',
        rows: [
          {
            title: 'Iced Latte',
            rowId: 'iced_latte',
            description: 'Cool and refreshing - $5.00'
          },
          {
            title: 'Cold Brew',
            rowId: 'cold_brew',
            description: 'Smooth cold coffee - $4.25'
          }
        ]
      },
      {
        title: '🥐 Pastries',
        rows: [
          {
            title: 'Croissant',
            rowId: 'croissant',
            description: 'Buttery and flaky - $2.75'
          },
          {
            title: 'Blueberry Muffin',
            rowId: 'muffin_blueberry',
            description: 'Fresh and sweet - $3.25'
          }
        ]
      }
    ]
  };

  await sendListMessage(token, device, receiver, coffeeMenuList);

  // Fitness program selection
  const fitnessPrograms = {
    title: '💪 Fitness Programs 2024',
    text: 'Transform your life with our professional fitness programs. All programs include nutrition guidance and personal coaching!',
    footer: '📅 Free trial available',
    buttonText: '🏋️ Choose Program',
    sections: [
      {
        title: '🏋️‍♀️ Strength Training',
        rows: [
          {
            title: 'Beginner Strength',
            rowId: 'strength_beginner',
            description: '3x/week • Perfect for starters'
          },
          {
            title: 'Advanced Powerlifting',
            rowId: 'powerlifting_advanced',
            description: '5x/week • For experienced lifters'
          }
        ]
      },
      {
        title: '🏃‍♂️ Cardio Programs',
        rows: [
          {
            title: 'HIIT Training',
            rowId: 'hiit_program',
            description: '4x/week • High intensity workouts'
          },
          {
            title: 'Marathon Prep',
            rowId: 'marathon_prep',
            description: '6x/week • Long distance running'
          }
        ]
      },
      {
        title: '🧘‍♀️ Wellness',
        rows: [
          {
            title: 'Yoga Flow',
            rowId: 'yoga_flow',
            description: 'Daily classes • Mind-body connection'
          },
          {
            title: 'Pilates Core',
            rowId: 'pilates_core',
            description: '3x/week • Core strengthening'
          }
        ]
      }
    ]
  };

  await sendListMessage(token, device, receiver, fitnessPrograms);

  // Event ticket selection
  const eventTickets = {
    title: '🎵 Summer Music Festival 2024',
    text: 'Join us for an unforgettable weekend of music, food, and fun! Select your ticket type below.',
    footer: '🎫 Limited tickets available',
    buttonText: '🎟️ Select Tickets',
    sections: [
      {
        title: '🎫 General Admission',
        rows: [
          {
            title: 'Single Day Pass',
            rowId: 'single_day',
            description: 'Access for 1 day - $75'
          },
          {
            title: 'Weekend Pass',
            rowId: 'weekend_pass',
            description: 'Full 3-day access - $150'
          }
        ]
      },
      {
        title: '⭐ VIP Experience',
        rows: [
          {
            title: 'VIP Single Day',
            rowId: 'vip_single',
            description: 'Premium experience - $200'
          },
          {
            title: 'VIP Weekend',
            rowId: 'vip_weekend',
            description: 'Ultimate 3-day VIP - $500'
          }
        ]
      }
    ]
  };

  await sendListMessage(token, device, receiver, eventTickets);
}

examples().then(() => console.log('All lists sent!'));
```

### Python

```python
import requests

def send_list_message(token, device, receiver, list_config):
    url = "https://api.whatspie.com/messages"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    data = {
        'device': device,
        'receiver': receiver,
        'type': 'list',
        'params': list_config,
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
    
    # Educational course catalog
    course_catalog = {
        'title': '📚 Online Learning Catalog',
        'text': 'Expand your skills with our comprehensive online courses. Learn from industry experts and get certified!',
        'footer': '🎓 Certificates included • 📱 Mobile-friendly',
        'buttonText': '📖 Browse Courses',
        'sections': [
            {
                'title': '💻 Programming',
                'rows': [
                    {
                        'title': 'JavaScript Masterclass',
                        'rowId': 'course_javascript',
                        'description': '40 hours • Beginner to Advanced'
                    },
                    {
                        'title': 'Python for Data Science',
                        'rowId': 'course_python_ds',
                        'description': '35 hours • Includes projects'
                    },
                    {
                        'title': 'React Development',
                        'rowId': 'course_react',
                        'description': '30 hours • Build real apps'
                    }
                ]
            },
            {
                'title': '🎨 Design',
                'rows': [
                    {
                        'title': 'UI/UX Design Fundamentals',
                        'rowId': 'course_uiux',
                        'description': '25 hours • Design thinking'
                    },
                    {
                        'title': 'Adobe Creative Suite',
                        'rowId': 'course_adobe',
                        'description': '45 hours • Photoshop, Illustrator'
                    }
                ]
            },
            {
                'title': '📈 Business',
                'rows': [
                    {
                        'title': 'Digital Marketing',
                        'rowId': 'course_marketing',
                        'description': '20 hours • Social media focus'
                    },
                    {
                        'title': 'Project Management',
                        'rowId': 'course_pm',
                        'description': '28 hours • Agile & Scrum'
                    }
                ]
            }
        ]
    }
    
    result = send_list_message(token, device, receiver, course_catalog)
    print(f"Course catalog sent: {result['data']['id']}")
    
    # Travel destination list
    travel_destinations = {
        'title': '✈️ Dream Destinations 2024',
        'text': 'Discover amazing travel packages to the world\'s most beautiful destinations. Book now and save up to 30%!',
        'footer': '🎒 All-inclusive packages available',
        'buttonText': '🌍 Explore Destinations',
        'sections': [
            {
                'title': '🏖️ Beach Destinations',
                'rows': [
                    {
                        'title': 'Maldives Paradise',
                        'rowId': 'dest_maldives',
                        'description': '7 days • Overwater villa • $2,999'
                    },
                    {
                        'title': 'Bali Adventure',
                        'rowId': 'dest_bali',
                        'description': '10 days • Cultural experience • $1,799'
                    },
                    {
                        'title': 'Caribbean Cruise',
                        'rowId': 'dest_caribbean',
                        'description': '8 days • Island hopping • $2,299'
                    }
                ]
            },
            {
                'title': '🏔️ Mountain Adventures',
                'rows': [
                    {
                        'title': 'Swiss Alps Tour',
                        'rowId': 'dest_swiss_alps',
                        'description': '12 days • Hiking & skiing • $3,499'
                    },
                    {
                        'title': 'Nepal Trekking',
                        'rowId': 'dest_nepal',
                        'description': '15 days • Everest base camp • $2,799'
                    }
                ]
            },
            {
                'title': '🏛️ Cultural Tours',
                'rows': [
                    {
                        'title': 'Japan Discovery',
                        'rowId': 'dest_japan',
                        'description': '14 days • Traditional & modern • $3,299'
                    },
                    {
                        'title': 'European Capitals',
                        'rowId': 'dest_europe',
                        'description': '18 days • 8 countries • $3,999'
                    }
                ]
            }
        ]
    }
    
    result = send_list_message(token, device, receiver, travel_destinations)
    print(f"Travel destinations sent: {result['data']['id']}")
    
except requests.RequestException as e:
    print(f"Error: {e}")
```

### PHP

```php
<?php
function sendListMessage($token, $device, $receiver, $listConfig) {
    $url = 'https://api.whatspie.com/messages';
    
    $data = [
        'device' => $device,
        'receiver' => $receiver,
        'type' => 'list',
        'params' => $listConfig,
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
    
    // Car rental services
    $carRentalList = [
        'title' => '🚗 Premium Car Rentals',
        'text' => 'Choose from our premium fleet of vehicles. All cars are sanitized, insured, and ready for your adventure!',
        'footer' => '🛡️ Full insurance included • 🔧 24/7 support',
        'buttonText' => '🚙 Select Vehicle',
        'sections' => [
            [
                'title' => '🏎️ Luxury Cars',
                'rows' => [
                    [
                        'title' => 'BMW 5 Series',
                        'rowId' => 'car_bmw_5series',
                        'description' => 'Premium sedan • $150/day'
                    ],
                    [
                        'title' => 'Mercedes C-Class',
                        'rowId' => 'car_mercedes_c',
                        'description' => 'Elegant comfort • $140/day'
                    ],
                    [
                        'title' => 'Audi A6',
                        'rowId' => 'car_audi_a6',
                        'description' => 'Technology & style • $145/day'
                    ]
                ]
            ],
            [
                'title' => '🚙 SUVs & Trucks',
                'rows' => [
                    [
                        'title' => 'Toyota Highlander',
                        'rowId' => 'car_highlander',
                        'description' => 'Family SUV • $95/day'
                    ],
                    [
                        'title' => 'Ford F-150',
                        'rowId' => 'car_f150',
                        'description' => 'Pickup truck • $85/day'
                    ]
                ]
            ],
            [
                'title' => '🚗 Economy Cars',
                'rows' => [
                    [
                        'title' => 'Honda Civic',
                        'rowId' => 'car_civic',
                        'description' => 'Reliable & efficient • $45/day'
                    ],
                    [
                        'title' => 'Toyota Camry',
                        'rowId' => 'car_camry',
                        'description' => 'Comfortable sedan • $55/day'
                    ]
                ]
            ]
        ]
    ];
    
    $result = sendListMessage($token, $device, $receiver, $carRentalList);
    echo "Car rental list sent: " . $result['data']['id'] . "\n";
    
    // Wedding services package
    $weddingServices = [
        'title' => '💒 Wedding Services Package',
        'text' => 'Make your special day perfect with our comprehensive wedding services. Professional team, beautiful venues, unforgettable memories!',
        'footer' => '💍 Your dream wedding awaits',
        'buttonText' => '💐 View Services',
        'sections' => [
            [
                'title' => '📸 Photography & Video',
                'rows' => [
                    [
                        'title' => 'Full Day Photography',
                        'rowId' => 'wedding_photo_full',
                        'description' => '12 hours • 2 photographers • $2,500'
                    ],
                    [
                        'title' => 'Cinematic Wedding Film',
                        'rowId' => 'wedding_video_cinematic',
                        'description' => 'Full ceremony & reception • $3,500'
                    ]
                ]
            ],
            [
                'title' => '🌸 Decoration & Flowers',
                'rows' => [
                    [
                        'title' => 'Venue Decoration',
                        'rowId' => 'wedding_decoration',
                        'description' => 'Complete venue setup • $1,800'
                    ],
                    [
                        'title' => 'Bridal Bouquet Package',
                        'rowId' => 'wedding_flowers',
                        'description' => 'Bouquet + arrangements • $650'
                    ]
                ]
            ],
            [
                'title' => '🍰 Catering & Cake',
                'rows' => [
                    [
                        'title' => 'Premium Catering',
                        'rowId' => 'wedding_catering_premium',
                        'description' => '100 guests • 5-course meal • $4,500'
                    ],
                    [
                        'title' => 'Custom Wedding Cake',
                        'rowId' => 'wedding_cake',
                        'description' => '3-tier custom design • $450'
                    ]
                ]
            ]
        ]
    ];
    
    $result = sendListMessage($token, $device, $receiver, $weddingServices);
    echo "Wedding services list sent: " . $result['data']['id'] . "\n";
    
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
  "message": "List message sent successfully",
  "data": {
    "id": "msg_list_12345",
    "status": "pending",
    "type": "list",
    "device": "6281234567890",
    "receiver": "6289876543210",
    "params": {
      "title": "Amazing Whatspie List message",
      "text": "This is new template from Whatspie! 🥵",
      "footer": "This is template footer",
      "buttonText": "Required, text on the button to view the list",
      "sections": [...]
    },
    "simulate_typing": 1,
    "timestamp": "2024-12-20T10:30:00Z"
  }
}
```

### Error Response - Invalid List Structure

```json
{
  "code": 400,
  "message": "Invalid list parameters",
  "error": "List sections must contain at least one row"
}
```

## 💡 Best Practices

### 1. Optimal List Structure

```javascript
// ✅ Good - Well organized with clear sections
const goodListStructure = {
  title: '🎯 Clear Main Title',
  text: 'Concise description that explains what the list contains.',
  footer: 'Brief footer text',
  buttonText: '📋 Action Button', // Clear action
  sections: [
    {
      title: '📱 Category 1', // Use emojis for clarity
      rows: [
        {
          title: 'Item Name',
          rowId: 'unique_id_1',
          description: 'Short, helpful description'
        }
      ]
    }
  ]
};

// ❌ Avoid - Too many sections, unclear titles
const poorListStructure = {
  title: 'List of Various Things', // Too vague
  text: 'Here are some items you can choose from...', // Not informative
  buttonText: 'Click', // Not descriptive
  sections: [
    // Too many sections make it overwhelming
    { title: 'Section 1', rows: [...] },
    { title: 'Section 2', rows: [...] },
    { title: 'Section 3', rows: [...] },
    { title: 'Section 4', rows: [...] },
    { title: 'Section 5', rows: [...] }
  ]
};
```

### 2. Effective Row Descriptions

```javascript
function createEffectiveRows() {
  return [
    // ✅ Good - includes key information
    {
      title: 'Premium Burger',
      rowId: 'burger_premium',
      description: 'Angus beef, bacon, cheese - $15.99'
    },
    
    // ✅ Good - concise but informative  
    {
      title: 'Yoga Class',
      rowId: 'yoga_beginner',
      description: 'Beginner level • 60 min • Morning slot'
    },
    
    // ❌ Avoid - too long
    {
      title: 'Special Deluxe Ultimate Supreme Pizza',
      rowId: 'pizza_special',
      description: 'This amazing pizza contains the finest ingredients sourced from local farms including...'
    },
    
    // ❌ Avoid - no useful information
    {
      title: 'Item 1',
      rowId: 'item1',
      description: 'Available now'
    }
  ];
}
```

### 3. List Validation

```javascript
function validateListConfig(config) {
  const errors = [];
  
  // Validate required fields
  if (!config.title) errors.push('Title is required');
  if (!config.text) errors.push('Text is required');
  if (!config.buttonText) errors.push('Button text is required');
  if (!config.sections || config.sections.length === 0) {
    errors.push('At least one section is required');
  }
  
  // Validate length limits
  if (config.title && config.title.length > 24) {
    errors.push('Title should be under 24 characters');
  }
  
  if (config.text && config.text.length > 1024) {
    errors.push('Text should be under 1024 characters');
  }
  
  // Validate sections
  if (config.sections) {
    if (config.sections.length > 10) {
      errors.push('Maximum 10 sections allowed');
    }
    
    config.sections.forEach((section, sIndex) => {
      if (!section.title) {
        errors.push(`Section ${sIndex + 1} must have a title`);
      }
      
      if (!section.rows || section.rows.length === 0) {
        errors.push(`Section ${sIndex + 1} must have at least one row`);
      }
      
      if (section.rows && section.rows.length > 10) {
        errors.push(`Section ${sIndex + 1} can have maximum 10 rows`);
      }
      
      // Validate rows
      section.rows?.forEach((row, rIndex) => {
        if (!row.title) {
          errors.push(`Row ${rIndex + 1} in section ${sIndex + 1} must have a title`);
        }
        
        if (!row.rowId) {
          errors.push(`Row ${rIndex + 1} in section ${sIndex + 1} must have a rowId`);
        }
        
        // Check for duplicate rowIds
        const allRowIds = config.sections.flatMap(s => s.rows?.map(r => r.rowId) || []);
        const duplicates = allRowIds.filter((id, index) => allRowIds.indexOf(id) !== index);
        if (duplicates.length > 0) {
          errors.push(`Duplicate rowIds found: ${duplicates.join(', ')}`);
        }
      });
    });
  }
  
  if (errors.length > 0) {
    throw new Error('List validation failed: ' + errors.join(', '));
  }
  
  return true;
}

// Usage
try {
  validateListConfig(listConfig);
  const result = await sendListMessage(token, device, receiver, listConfig);
  console.log('List sent successfully:', result.data.id);
} catch (error) {
  console.error('List error:', error.message);
}
```

## 🎨 Common Use Cases

### Hotel Booking

```javascript
const hotelBookingList = {
  title: '🏨 Hotel Reservations',
  text: 'Find the perfect stay for your trip. All hotels include free WiFi and breakfast.',
  footer: '📞 24/7 customer support available',
  buttonText: '🛏️ View Hotels',
  sections: [
    {
      title: '⭐⭐⭐⭐⭐ Luxury',
      rows: [
        {
          title: 'Grand Palace Hotel',
          rowId: 'hotel_grand_palace',
          description: 'City center • Pool & Spa • $299/night'
        }
      ]
    },
    {
      title: '⭐⭐⭐⭐ Premium',
      rows: [
        {
          title: 'Business Inn',
          rowId: 'hotel_business_inn', 
          description: 'Near airport • Meeting rooms • $159/night'
        }
      ]
    }
  ]
};
```

### Support Ticket Categories

```javascript
const supportCategories = {
  title: '🎫 Create Support Ticket',
  text: 'Tell us how we can help you. Our support team will respond within 24 hours.',
  footer: '⚡ Urgent issues: call (555) 123-HELP',
  buttonText: '📝 Select Issue Type',
  sections: [
    {
      title: '🐛 Technical Issues',
      rows: [
        {
          title: 'Website Not Loading',
          rowId: 'tech_website_loading',
          description: 'Pages won\'t load or load slowly'
        },
        {
          title: 'Login Problems',
          rowId: 'tech_login_issues',
          description: 'Can\'t sign in to your account'
        }
      ]
    },
    {
      title: '💳 Billing & Payments',
      rows: [
        {
          title: 'Payment Failed',
          rowId: 'billing_payment_failed',
          description: 'Transaction was declined'
        },
        {
          title: 'Refund Request',
          rowId: 'billing_refund',
          description: 'Request a refund for purchase'
        }
      ]
    }
  ]
};
```

## ⚠️ Limitations

- **Section Limit**: Maximum 10 sections per list
- **Row Limit**: Maximum 10 rows per section  
- **Total Items**: Maximum 100 total selectable items
- **Title Length**: List title maximum 24 characters
- **Text Length**: Description text maximum 1024 characters
- **Button Text**: Button text maximum 20 characters
- **Row Title**: Row titles maximum 24 characters
- **Row Description**: Row descriptions maximum 72 characters

## 🔗 Related Endpoints

- [Send Template Messages](./send-template) - For interactive button templates
- [Send Text Messages](./send-text) - For simple text messaging  
- [Send Image Messages](./send-image) - For multimedia content
- [Get Message Status](../messages/get-messages) - Check delivery status

## 📞 Support

Need help with list messages?
- 📖 [List Design Guide](../guides/lists)
- 🛠️ [Troubleshooting Guide](../troubleshooting)
- 💬 [Community Forum](https://community.whatspie.com)