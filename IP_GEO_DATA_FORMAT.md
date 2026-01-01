# IP and Geo-Location Data Format

## Overview
The application now fetches comprehensive IP and geo-location data from **ipapi.co** and stores it as a JSON string in the `ip` field of both `visit_details` and `submission_details` tables.

## Data Structure
The complete response from ipapi.co includes the following fields (stored as JSON string):

```json
{
  "ip": "203.0.113.45",
  "version": "IPv4",
  "city": "Mumbai",
  "region": "Maharashtra",
  "region_code": "MH",
  "country": "IN",
  "country_name": "India",
  "country_code": "IN",
  "country_code_iso3": "IND",
  "country_capital": "New Delhi",
  "country_tld": ".in",
  "continent_code": "AS",
  "in_eu": false,
  "postal": "400001",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "timezone": "Asia/Kolkata",
  "utc_offset": "+0530",
  "country_calling_code": "+91",
  "currency": "INR",
  "currency_name": "Rupee",
  "languages": "en-IN,hi,bn,te,mr,ta,ur,gu,kn,ml,or,pa,as,bh,sat,ks,ne,sd,kok,doi,mni,sit,sa,fr,lus,inc",
  "country_area": 3287590.0,
  "country_population": 1352617328,
  "asn": "AS12345",
  "org": "Example ISP Ltd"
}
```

## Key Fields Captured

### Geographic Data
- **ip**: The visitor's public IP address
- **city**: City name
- **region**: State/Province name
- **region_code**: State/Province code
- **country**: Country code (2-letter)
- **country_name**: Full country name
- **postal**: Postal/ZIP code
- **latitude**: Geographic latitude
- **longitude**: Geographic longitude
- **timezone**: IANA timezone identifier
- **utc_offset**: UTC offset string

### Network Data
- **asn**: Autonomous System Number
- **org**: Organization/ISP name
- **version**: IP version (IPv4/IPv6)

### Country Metadata
- **country_capital**: Capital city
- **country_calling_code**: Phone country code
- **currency**: Currency code
- **currency_name**: Currency name
- **languages**: Supported languages
- **country_population**: Country population
- **in_eu**: Boolean - is country in EU

## Database Storage

### Tables Affected
1. **visit_details.ip** - TEXT field containing JSON string
2. **submission_details.ip** - TEXT field containing JSON string

### Example Query to Parse Data
```sql
-- Get IP and city from visit_details
SELECT 
  id,
  json_extract(ip, '$.ip') as ip_address,
  json_extract(ip, '$.city') as city,
  json_extract(ip, '$.country_name') as country,
  json_extract(ip, '$.org') as isp
FROM visit_details;
```

## API Endpoint

### GET /api/geo
**Response:**
```json
{
  "ip": "{\"ip\":\"203.0.113.45\",\"city\":\"Mumbai\",...}",
  "raw": {
    "ip": "203.0.113.45",
    "city": "Mumbai",
    ...
  }
}
```

- **ip**: Complete data as JSON string (stored in database)
- **raw**: Same data as object (for debugging, not stored)

## Fallback Behavior
If ipapi.co fails or is unreachable, the system falls back to:
```json
{
  "ip": "xxx.xxx.xxx.xxx",
  "error": "Could not fetch geo data"
}
```

Where IP is extracted from:
1. `x-forwarded-for` header (if behind proxy)
2. `x-real-ip` header (if configured)
3. `req.socket.remoteAddress` (direct connection)
4. `"unknown"` (if all else fails)

## Rate Limits
- **ipapi.co free tier**: 1,000 requests per day
- For production with high traffic, consider:
  - Paid ipapi.co plan
  - Alternative services (ipgeolocation.io, ip-api.com)
  - Caching mechanism

## Privacy Considerations
- Full IP and geo data is collected
- Ensure GDPR/privacy compliance
- Consider anonymizing IPs for EU visitors
- Add privacy policy disclosure

## Testing
To test locally:
1. Start the server: `node server/server.js`
2. Visit: http://localhost:3000/api/geo
3. You'll see your real public IP and location data

## Production Notes
- Works automatically in production (no configuration needed)
- Detects visitor's real public IP regardless of hosting setup
- No proxy/reverse-proxy configuration required
