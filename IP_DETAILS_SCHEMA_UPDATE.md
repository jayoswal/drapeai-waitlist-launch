# Database Schema Update - IP and IP Details Separation

## Date: January 1, 2026

---

## Overview

Separated IP address from geo-location details into two distinct fields:
- **`ip`**: Just the IP address (string) from ipify.org
- **`ip_details`**: Complete geo-location JSON data from ipapi.co

---

## Database Schema Changes

### **Before:**
```sql
CREATE TABLE visit_details (
  ...
  ip TEXT,
  ...
);

CREATE TABLE submission_details (
  ...
  ip TEXT,
  ...
);
```

### **After:**
```sql
CREATE TABLE visit_details (
  ...
  ip TEXT,              -- Just the IP address
  ip_details TEXT,      -- Complete geo JSON string
  ...
);

CREATE TABLE submission_details (
  ...
  ip TEXT,              -- Just the IP address
  ip_details TEXT,      -- Complete geo JSON string
  ...
);
```

---

## API Changes

### **GET /api/geo**

**New Response Format:**
```json
{
  "ip": "203.0.113.45",
  "ip_details": "{\"ip\":\"203.0.113.45\",\"city\":\"Mumbai\",\"country\":\"IN\",...}",
  "raw": {
    "ip": "203.0.113.45",
    "city": "Mumbai",
    ...
  }
}
```

**Fields:**
- `ip`: Plain string IP address from ipify.org
- `ip_details`: Complete geo-location data as JSON string from ipapi.co
- `raw`: Same as ip_details but as object (for debugging)

---

## Data Flow

### **Step-by-Step Process:**

1. **Frontend calls `/api/geo`**

2. **Server Step 1**: Fetch IP from ipify.org
   ```javascript
   GET https://api.ipify.org?format=json
   → {"ip": "203.0.113.45"}
   ```

3. **Server Step 2**: Fetch geo data using that IP
   ```javascript
   GET https://ipapi.co/203.0.113.45/json/
   → {
       "ip": "203.0.113.45",
       "city": "Mumbai",
       "region": "Maharashtra",
       "country": "IN",
       "latitude": 19.0760,
       "longitude": 72.8777,
       ...
     }
   ```

4. **Server returns both**:
   - `ip`: "203.0.113.45"
   - `ip_details`: JSON.stringify(geoData)

5. **Frontend sends to `/api/visit` or `/api/waitlist`**:
   ```javascript
   {
     ...otherFields,
     ip: "203.0.113.45",
     ip_details: "{...geo data...}"
   }
   ```

6. **Database stores both fields separately**

---

## Database Storage Examples

### **visit_details table:**
```
id | visit_id | ip            | ip_details                          | created_at
---|----------|---------------|-------------------------------------|------------
1  | abc123   | 203.0.113.45  | {"ip":"203.0.113.45","city":"..."}  | 2026-01-01
```

### **submission_details table:**
```
id | email          | ip            | ip_details                          | created_at
---|----------------|---------------|-------------------------------------|------------
1  | user@email.com | 203.0.113.45  | {"ip":"203.0.113.45","city":"..."}  | 2026-01-01
```

---

## Querying Data

### **Get just the IP:**
```sql
SELECT ip FROM visit_details;
-- Returns: "203.0.113.45"
```

### **Get specific geo field:**
```sql
SELECT 
  ip,
  json_extract(ip_details, '$.city') as city,
  json_extract(ip_details, '$.country') as country
FROM visit_details;
```

### **Get all geo data:**
```sql
SELECT ip_details FROM visit_details;
-- Returns: Full JSON string
```

### **Parse complete geo data in SQLite:**
```sql
SELECT 
  ip,
  json_extract(ip_details, '$.city') as city,
  json_extract(ip_details, '$.region') as region,
  json_extract(ip_details, '$.country') as country,
  json_extract(ip_details, '$.latitude') as latitude,
  json_extract(ip_details, '$.longitude') as longitude,
  json_extract(ip_details, '$.org') as isp
FROM visit_details;
```

---

## Benefits of This Structure

### **1. Clean IP Storage**
- Direct access to IP without parsing JSON
- Easy filtering and searching by IP
- Can index `ip` field for performance

### **2. Complete Geo Data**
- All geo-location information preserved
- Can extract any field when needed
- No data loss

### **3. Flexible Queries**
- Query by IP: `WHERE ip = '203.0.113.45'`
- Query by city: `WHERE json_extract(ip_details, '$.city') = 'Mumbai'`
- Query by country: `WHERE json_extract(ip_details, '$.country') = 'IN'`

### **4. Easy Data Export**
- IP field is plain text
- ip_details can be parsed in any programming language

---

## Migration Notes

### **For Existing Database:**

If you have existing data in the old schema, you may need to:

1. **Add new column:**
   ```sql
   ALTER TABLE visit_details ADD COLUMN ip_details TEXT;
   ALTER TABLE submission_details ADD COLUMN ip_details TEXT;
   ```

2. **Migrate existing data** (if old `ip` field had JSON):
   ```sql
   UPDATE visit_details SET ip_details = ip WHERE ip LIKE '{%';
   UPDATE submission_details SET ip_details = ip WHERE ip LIKE '{%';
   ```

3. **Clean up IP field** (extract just IP from JSON if needed):
   ```sql
   UPDATE visit_details 
   SET ip = json_extract(ip, '$.ip') 
   WHERE ip LIKE '{%';
   ```

**Note**: New installations don't need migration.

---

## API Examples

### **Testing /api/geo:**
```bash
curl http://localhost:3000/api/geo
```

**Expected Response:**
```json
{
  "ip": "49.37.249.183",
  "ip_details": "{\"ip\":\"49.37.249.183\",\"version\":\"IPv4\",\"city\":\"Mumbai\",\"region\":\"Maharashtra\",\"region_code\":\"MH\",\"country\":\"IN\",\"country_name\":\"India\",\"country_code\":\"IN\",\"country_code_iso3\":\"IND\",\"country_capital\":\"New Delhi\",\"country_tld\":\".in\",\"continent_code\":\"AS\",\"in_eu\":false,\"postal\":\"400001\",\"latitude\":19.0760,\"longitude\":72.8777,\"timezone\":\"Asia/Kolkata\",\"utc_offset\":\"+0530\",\"country_calling_code\":\"+91\",\"currency\":\"INR\",\"currency_name\":\"Rupee\",\"languages\":\"en-IN,hi,bn,te,mr,ta,ur,gu,kn,ml,or,pa,as,bh,sat,ks,ne,sd,kok,doi,mni,sit,sa,fr,lus,inc\",\"country_area\":3287590.0,\"country_population\":1352617328,\"asn\":\"AS12345\",\"org\":\"Example ISP Ltd\"}",
  "raw": {
    "ip": "49.37.249.183",
    "city": "Mumbai",
    "country": "IN",
    ...
  }
}
```

---

## Files Modified

1. **server/server.js**:
   - Updated database schema (added `ip_details` column)
   - Modified `/api/geo` endpoint to return both fields
   - Updated `/api/visit` to accept and store both fields
   - Updated `/api/waitlist` to accept and store both fields

2. **js/main.js**:
   - Modified `getIPGeo()` to return both `ip` and `ip_details`
   - Updated `initWaitlistButton()` to send both fields
   - Updated waitlist form submission to send both fields

---

## Summary

### **What Changed:**
- ✅ Database now has separate `ip` and `ip_details` fields
- ✅ `ip` stores plain IP address string
- ✅ `ip_details` stores complete geo-location JSON
- ✅ API returns both fields
- ✅ Frontend sends both fields to server

### **Why This is Better:**
- Clean separation of concerns
- Easy to query by IP directly
- Full geo data preserved for analysis
- More flexible for future features

### **Impact:**
- New database schema (existing DBs may need migration)
- No breaking changes to external behavior
- Better data structure for analytics

