# Phone Field Format Update

## Date: January 1, 2026

---

## Overview

Updated the phone field format from a simple string concatenation to a structured JSON object.

---

## Changes

### **Before:**
```
Phone field stored as: "IN-9999999999"
Format: "{COUNTRY_CODE}-{PHONE_NUMBER}"
```

### **After:**
```json
Phone field stored as: {"country_code": "+91", "phone": "9999999999"}
Format: JSON string with country_code and phone properties
```

---

## Data Structure

### **Field: `phone` (TEXT in database)**

**Stored Value:**
```json
{
  "country_code": "+91",
  "phone": "9999999999"
}
```

**Properties:**
- `country_code`: International dialing code (e.g., "+91", "+1", "+44")
- `phone`: Phone number without country code (digits only)

---

## Examples

### **Example 1: Indian Number**
```json
{
  "country_code": "+91",
  "phone": "9876543210"
}
```

### **Example 2: US Number**
```json
{
  "country_code": "+1",
  "phone": "2125551234"
}
```

### **Example 3: UK Number**
```json
{
  "country_code": "+44",
  "phone": "7911123456"
}
```

### **Example 4: UAE Number**
```json
{
  "country_code": "+971",
  "phone": "501234567"
}
```

---

## Country Code Mapping

Complete mapping of all supported countries:

```javascript
{
  'IN': '+91',    // India
  'US': '+1',     // United States
  'GB': '+44',    // United Kingdom
  'CA': '+1',     // Canada
  'AU': '+61',    // Australia
  'SG': '+65',    // Singapore
  'DE': '+49',    // Germany
  'FR': '+33',    // France
  'IT': '+39',    // Italy
  'ES': '+34',    // Spain
  'CN': '+86',    // China
  'JP': '+81',    // Japan
  'BR': '+55',    // Brazil
  'ZA': '+27',    // South Africa
  'RU': '+7',     // Russia
  'MX': '+52',    // Mexico
  'AE': '+971',   // UAE
  'KR': '+82',    // South Korea
  'SA': '+966',   // Saudi Arabia
  'ID': '+62',    // Indonesia
  'PK': '+92',    // Pakistan
  'BD': '+880',   // Bangladesh
  'NG': '+234',   // Nigeria
  'EG': '+20',    // Egypt
  'TR': '+90',    // Turkey
  'TH': '+66',    // Thailand
  'MY': '+60',    // Malaysia
  'PH': '+63',    // Philippines
  'VN': '+84',    // Vietnam
  'UA': '+380',   // Ukraine
  'PL': '+48',    // Poland
  'AR': '+54',    // Argentina
  'CO': '+57',    // Colombia
  'CL': '+56',    // Chile
  'NZ': '+64',    // New Zealand
  'SE': '+46',    // Sweden
  'NO': '+47',    // Norway
  'FI': '+358',   // Finland
  'DK': '+45',    // Denmark
  'IE': '+353',   // Ireland
  'CH': '+41',    // Switzerland
  'BE': '+32',    // Belgium
  'NL': '+31',    // Netherlands
  'AT': '+43',    // Austria
  'GR': '+30',    // Greece
  'PT': '+351',   // Portugal
  'CZ': '+420',   // Czech Republic
  'HU': '+36',    // Hungary
  'RO': '+40',    // Romania
  'SK': '+421',   // Slovakia
  'BG': '+359',   // Bulgaria
  'HR': '+385',   // Croatia
  'SI': '+386',   // Slovenia
  'LT': '+370',   // Lithuania
  'LV': '+371',   // Latvia
  'EE': '+372',   // Estonia
  'LU': '+352',   // Luxembourg
  'IS': '+354',   // Iceland
  'MT': '+356',   // Malta
  'CY': '+357',   // Cyprus
  'LI': '+423'    // Liechtenstein
}
```

---

## Database Queries

### **Parsing Phone Data in SQLite:**

**Get country code:**
```sql
SELECT 
  email,
  json_extract(phone, '$.country_code') as country_code
FROM submission_details;
```

**Get phone number:**
```sql
SELECT 
  email,
  json_extract(phone, '$.phone') as phone_number
FROM submission_details;
```

**Get both:**
```sql
SELECT 
  email,
  json_extract(phone, '$.country_code') as country_code,
  json_extract(phone, '$.phone') as phone_number
FROM submission_details;
```

**Filter by country code:**
```sql
SELECT * FROM submission_details
WHERE json_extract(phone, '$.country_code') = '+91';
```

**Get full formatted phone:**
```sql
SELECT 
  email,
  json_extract(phone, '$.country_code') || json_extract(phone, '$.phone') as full_phone
FROM submission_details;
```

---

## API Payload Example

### **Frontend sends to `/api/waitlist`:**
```json
{
  "visit_id": "abc123xyz",
  "email": "user@example.com",
  "phone": "{\"country_code\":\"+91\",\"phone\":\"9876543210\"}",
  "user_agent": "Mozilla/5.0...",
  "ip": "203.0.113.45",
  "ip_details": "{\"endpoint\":\"https://ipapi.co/...\",\"response\":{...}}"
}
```

### **Database stores:**
```
| id | email              | phone                                              |
|----|--------------------|----------------------------------------------------|
| 1  | user@example.com   | {"country_code":"+91","phone":"9876543210"}       |
```

---

## Benefits of This Structure

### **1. Structured Data**
- Easy to parse country code separately
- Clean separation of country and phone number
- No string splitting required

### **2. International Support**
- Handles different country code lengths (+1, +91, +971, etc.)
- No ambiguity in parsing

### **3. Flexible Queries**
- Can filter by country code
- Can search by phone number
- Can construct full phone number when needed

### **4. Data Integrity**
- Country code always starts with "+"
- Phone number is always numeric
- Validates data structure

---

## Code Implementation

### **File: `js/main.js`**

**Location:** Lines ~355-395

**Key Changes:**
1. Added `countryCodeMap` object with all country-to-calling-code mappings
2. Changed from `country-phone` concatenation to JSON object
3. Store as JSON string in database

**Code:**
```javascript
// Structure phone as JSON object
const phoneData = {
  country_code: countryCodeMap[countryCode] || "+91",
  phone: phone
};

const payload = {
  visit_id,
  email,
  phone: JSON.stringify(phoneData),  // Store as JSON string
  user_agent,
  ip,
  ip_details,
};
```

---

## Migration Notes

### **For Existing Database:**

If you have existing data in old format ("IN-9999999999"), you may want to migrate:

**Example Migration Script:**
```javascript
// Read old format
const oldData = db.prepare('SELECT id, phone FROM submission_details').all();

// Convert each record
for (const row of oldData) {
  if (row.phone && row.phone.includes('-')) {
    const [countryISO, phoneNumber] = row.phone.split('-');
    const phoneData = {
      country_code: countryCodeMap[countryISO] || '+91',
      phone: phoneNumber
    };
    
    db.prepare('UPDATE submission_details SET phone = ? WHERE id = ?')
      .run(JSON.stringify(phoneData), row.id);
  }
}
```

**Note**: New installations don't need migration.

---

## Testing

### **Test Case 1: Indian Number**
- Select: 🇮🇳 +91
- Enter: 9876543210
- Expected DB value: `{"country_code":"+91","phone":"9876543210"}`

### **Test Case 2: US Number**
- Select: 🇺🇸 +1
- Enter: 2125551234
- Expected DB value: `{"country_code":"+1","phone":"2125551234"}`

### **Test Case 3: UAE Number**
- Select: 🇦🇪 +971
- Enter: 501234567
- Expected DB value: `{"country_code":"+971","phone":"501234567"}`

---

## Summary

### **What Changed:**
- ✅ Phone field now stores structured JSON instead of string concatenation
- ✅ Format: `{"country_code": "+91", "phone": "9999999999"}`
- ✅ Added complete country code mapping for all 60+ countries
- ✅ Easier to query and parse phone data

### **Why This is Better:**
- Clean separation of country code and phone number
- No string parsing or splitting required
- Better international support
- Easier database queries with json_extract()

### **Impact:**
- Frontend code updated in `js/main.js`
- Database schema unchanged (still TEXT field)
- New data format for all future submissions
- Existing data may need migration (if any)

