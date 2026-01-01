# IPify Integration Note

## Date: January 1, 2026

---

## What Changed

Updated the IP and geo-location fetching to use **ipify.org** for IP detection instead of relying on ipapi.co's automatic detection.

---

## Why This Change?

### Before:
```javascript
// Single request to ipapi.co
const ipRes = await fetch('https://ipapi.co/json/');
```
- ipapi.co auto-detects IP from the request
- Works fine but relies on single service

### After:
```javascript
// Step 1: Get IP from ipify.org
const ipRes = await fetch('https://api.ipify.org?format=json');
const userIP = ipData.ip;

// Step 2: Get geo data from ipapi.co using the IP
const geoRes = await fetch(`https://ipapi.co/${userIP}/json/`);
```

### Benefits:
1. **More Reliable IP Detection**: ipify.org specializes in IP detection
2. **No Rate Limits**: ipify.org is completely free with no limits
3. **Separation of Concerns**: IP detection separate from geo-location
4. **Flexibility**: Can easily switch geo-location provider while keeping IP detection

---

## API Endpoint

### GET /api/geo

**New Implementation:**
1. Calls `https://api.ipify.org?format=json` → Returns: `{"ip": "203.0.113.45"}`
2. Extracts IP address from response
3. Calls `https://ipapi.co/{ip}/json/` → Returns full geo data
4. Returns complete geo-location data as JSON string

**Response Format:**
```json
{
  "ip": "{\"ip\":\"203.0.113.45\",\"city\":\"Mumbai\",...}",
  "raw": {
    "ip": "203.0.113.45",
    "city": "Mumbai",
    "country": "IN",
    ...
  }
}
```

---

## ipify.org Details

### What is ipify?
- Free, reliable IP address API
- Returns visitor's public IP address
- No authentication required
- No rate limits
- Used by millions of applications

### Endpoints:
- `https://api.ipify.org` → Returns plain text IP
- `https://api.ipify.org?format=json` → Returns JSON: `{"ip": "x.x.x.x"}`
- `https://api64.ipify.org` → Returns IPv6 if available

### Response Example:
```json
{
  "ip": "203.0.113.45"
}
```

---

## Error Handling

If either ipify or ipapi fails:
```javascript
catch (e) {
  // Fallback to request headers
  const fallbackIP = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.socket.remoteAddress || 
                     'unknown';
  res.json({ 
    ip: JSON.stringify({ ip: fallbackIP, error: 'Could not fetch geo data' })
  });
}
```

---

## Testing

### Test the endpoint:
```bash
# Start server
node server/server.js

# Test in browser or curl
curl http://localhost:3000/api/geo
```

### Expected Response:
```json
{
  "ip": "{\"ip\":\"YOUR_PUBLIC_IP\",\"city\":\"Your City\",\"country\":\"Your Country\",...}",
  "raw": {
    "ip": "YOUR_PUBLIC_IP",
    "city": "Your City",
    "country": "Your Country",
    ...
  }
}
```

---

## Rate Limits Summary

| Service | Free Tier Limit | Purpose |
|---------|----------------|---------|
| **ipify.org** | Unlimited | Get public IP address |
| **ipapi.co** | 1,000/day | Get geo-location data |

**Total API calls per user visit**: 2 (1 to ipify + 1 to ipapi)

---

## Data Flow

```
User Visits Page
      ↓
Frontend calls /api/geo
      ↓
Server calls ipify.org → Gets IP: "203.0.113.45"
      ↓
Server calls ipapi.co/203.0.113.45/json/ → Gets geo data
      ↓
Server returns complete data as JSON string
      ↓
Frontend sends to /api/visit or /api/waitlist
      ↓
Stored in database (visit_details.ip or submission_details.ip)
```

---

## Files Modified

- **server/server.js**: Updated `/api/geo` endpoint
- **IP_GEO_DATA_FORMAT.md**: Updated documentation
- **This file**: Created implementation note

---

## Rollback

To revert to previous implementation:
```javascript
// Replace /api/geo endpoint with:
app.get('/api/geo', async (req, res) => {
  try {
    const ipRes = await fetch('https://ipapi.co/json/');
    const data = await ipRes.json();
    res.json({ 
      ip: JSON.stringify(data),
      raw: data
    });
  } catch (e) {
    // ...fallback code...
  }
});
```

---

## References

- ipify API: https://www.ipify.org/
- ipapi.co: https://ipapi.co/

