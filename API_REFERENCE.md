# 📖 API Reference - Unified FunCaptcha Solver v3.0

## Base URL
```
https://YOUR-APP.onrender.com
```

## Authentication
No authentication required (add if needed)

---

## Service Health & Info

### GET /health
Check service status and statistics.

**Response:**
```json
{
  "status": "healthy",
  "service": "unified-funcaptcha-solver",
  "version": "3.0.0",
  "arkose_js_loaded": true,
  "stats": {
    "solved": 42,
    "suppressed_solved": 5,
    "pow_solved": 3,
    "decrypted": 10,
    "errors": 0
  }
}
```

### GET /stats
Detailed statistics.

**Response:**
```json
{
  "solved": 100,
  "failed": 5,
  "suppressed_solved": 20,
  "pow_solved": 10,
  "decrypted": 30,
  "errors": 2,
  "uptime": 1234567890
}
```

---

## Blob Extraction

### POST /extract/blob
Extract encryption blob from Arkose Labs.

**Request:**
```json
{
  "sitekey": "476068BF-9607-4799-B53D-966BE98E2B81",
  "proxy": "http://proxy:port"
}
```

**Or with preset:**
```json
{
  "preset": "roblox_login"
}
```

**Presets:**
- `roblox_login` - Uses ROBLOX_LOGIN_SITEKEY
- `roblox_register` - Uses ROBLOX_REGISTER_SITEKEY

**Response:**
```json
{
  "success": true,
  "blob": "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk...",
  "public_key": "476068BF-9607-4799-B53D-966BE98E2B81",
  "timestamp": 1702123456
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to extract blob"
}
```

---

## Captcha Solving

### POST /solve/create
Create a solve task.

**Request:**
```json
{
  "sitekey": "476068BF-9607-4799-B53D-966BE98E2B81",
  "blob": "token_data_here",
  "has_suppressed": false,
  "suppressed_challenge": {},
  "has_pow": false,
  "pow_challenge": {},
  "proxy": "http://proxy:port"
}
```

**Response:**
```json
{
  "success": true,
  "task_id": "a1b2c3d4e5f6",
  "status": "solving"
}
```

### GET /solve/status/{task_id}
Check task status.

**Response (Processing):**
```json
{
  "success": true,
  "status": "processing"
}
```

**Response (Completed):**
```json
{
  "success": true,
  "status": "completed",
  "token": "token_abc123...",
  "suppressed_answer": null,
  "pow_solution": null
}
```

**Response (Error):**
```json
{
  "success": false,
  "status": "error",
  "error": "Error message"
}
```

### POST /unified/solve
Extract blob AND solve in one request.

**Request:**
```json
{
  "preset": "roblox_login",
  "has_suppressed": false,
  "has_pow": false,
  "proxy": "http://proxy:port"
}
```

**Response:**
```json
{
  "success": true,
  "task_id": "task_uuid",
  "status": "solving",
  "blob": "token_data_here"
}
```

---

## Decryption

### POST /decrypt/tguess
Decrypt tguess encrypted data using session token.

**Request:**
```json
{
  "encrypted_data": "{\"ct\":\"zD2isDRbgZ7MYSHffHif5qYCc2NdumaOAIk/3vl9YBdpF/PZLON/aWVzEwzzRkUp\",\"iv\":\"43a2a646edb1619a3c6c46746656a94a\",\"s\":\"70d51865c43d1101\"}",
  "session_token": "30717f9d16c739a32.6572443605"
}
```

**Response:**
```json
{
  "success": true,
  "data": "decrypted_plaintext_data"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid session token"
}
```

### POST /decrypt/bda
Decrypt BDA encrypted data using user agent.

**Request:**
```json
{
  "bda_data": "eyJjdCI6IlhFR3R...(base64 encoded)",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}
```

**Response:**
```json
{
  "success": true,
  "data": "decrypted_plaintext_data"
}
```

---

## Legacy Endpoints (Backward Compatibility)

### POST /funcaptcha/createTask
Create task (legacy format).

**Request:**
```json
{
  "preset": "roblox_login",
  "has_suppressed": false,
  "has_pow": false
}
```

**Response:**
```json
{
  "success": true,
  "task_id": "task_uuid"
}
```

### POST /funcaptcha/getTask
Get task result (legacy format).

**Request:**
```json
{
  "task_id": "task_uuid"
}
```

**Response (Completed):**
```json
{
  "status": "completed",
  "captcha": {
    "token": "token_data"
  }
}
```

**Response (Processing):**
```json
{
  "status": "processing"
}
```

---

## Constants

### Roblox Sitekeys
- **Login**: `476068BF-9607-4799-B53D-966BE98E2B81`
- **Register**: `A2A14B1D-1AF3-C791-9BBC-EE33CC7A0A6F`

### Default User Agent
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36
```

---

## Error Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 400 | Bad request (missing parameters) |
| 404 | Not found (task not found) |
| 500 | Server error |

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "No token in response" | Blob extraction failed | Verify sitekey, check proxy |
| "Task not found" | Task ID doesn't exist | Use correct task ID |
| "Missing encrypted_data" | Encryption data not provided | Include encrypted_data in request |
| "arkose.js not loaded" | JavaScript file missing | Deploy with arkose.js file |

---

## Usage Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_URL = 'https://your-app.onrender.com';

// Unified solve
async function solveCaptcha() {
  try {
    const taskRes = await axios.post(`${API_URL}/unified/solve`, {
      preset: 'roblox_login'
    });
    
    const taskId = taskRes.data.task_id;
    
    // Poll for result
    let result;
    while (true) {
      const statusRes = await axios.get(`${API_URL}/solve/status/${taskId}`);
      
      if (statusRes.data.status === 'completed') {
        result = statusRes.data;
        break;
      }
      
      await new Promise(r => setTimeout(r, 500));
    }
    
    console.log('Token:', result.token);
    return result.token;
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

// Decrypt tguess
async function decryptTGuess(encryptedData, sessionToken) {
  try {
    const res = await axios.post(`${API_URL}/decrypt/tguess`, {
      encrypted_data: encryptedData,
      session_token: sessionToken
    });
    
    console.log('Decrypted:', res.data.data);
    return res.data.data;
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

solveCaptcha();
```

### Python

```python
import requests
import time

API_URL = 'https://your-app.onrender.com'

def solve_captcha():
    """Solve Roblox captcha"""
    # Create task
    resp = requests.post(f'{API_URL}/unified/solve', json={
        'preset': 'roblox_login'
    })
    
    data = resp.json()
    task_id = data['task_id']
    
    # Poll for result
    while True:
        status_resp = requests.get(f'{API_URL}/solve/status/{task_id}')
        status_data = status_resp.json()
        
        if status_data['status'] == 'completed':
            print(f'Token: {status_data["token"]}')
            return status_data['token']
        
        time.sleep(0.5)

def decrypt_tguess(encrypted_data, session_token):
    """Decrypt tguess data"""
    resp = requests.post(f'{API_URL}/decrypt/tguess', json={
        'encrypted_data': encrypted_data,
        'session_token': session_token
    })
    
    data = resp.json()
    if data['success']:
        print(f'Decrypted: {data["data"]}')
        return data['data']
    else:
        print(f'Error: {data["error"]}')

solve_captcha()
```

### cURL

```bash
# Health check
curl https://your-app.onrender.com/health

# Extract blob
curl -X POST https://your-app.onrender.com/extract/blob \
  -H "Content-Type: application/json" \
  -d '{"preset": "roblox_login"}'

# Create solve task
TASK=$(curl -s -X POST https://your-app.onrender.com/unified/solve \
  -H "Content-Type: application/json" \
  -d '{"preset": "roblox_login"}' | jq -r '.task_id')

# Check status
curl https://your-app.onrender.com/solve/status/$TASK

# Decrypt tguess
curl -X POST https://your-app.onrender.com/decrypt/tguess \
  -H "Content-Type: application/json" \
  -d '{
    "encrypted_data": "{\"ct\":\"...\",\"iv\":\"...\",\"s\":\"...\"}",
    "session_token": "token_here"
  }'
```

---

## Rate Limiting
Currently no rate limits applied. Add if needed in Render configuration.

## CORS
No CORS restrictions. Configure as needed for your domain.

## Timeouts
- Default task timeout: 60 seconds
- Poll interval: 500ms (recommended)
- Max poll iterations: ~120 (for 60 second timeout)

---

**Last Updated**: 2024
**Version**: 3.0.0
**Status**: Production Ready ✅
