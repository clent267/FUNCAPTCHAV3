# 🎮 Render Deployment Guide - Unified FunCaptcha Solver v3.0

## Quick Setup

### Files Required
- `app.py` - Main Flask application
- `requirements.txt` - Python dependencies
- `arkose.js` - JavaScript encryption/decryption (REQUIRED)
- `webgl.json` - WebGL configuration (optional)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Unified FunCaptcha Solver v3.0"
git push origin main
```

### 2. Create on Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `funcaptcha-solver`
   - **Runtime**: `Python 3.11`
   - **Region**: Choose closest to you
   - **Branch**: `main`

### 3. Build & Start Commands

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn app:app --bind 0.0.0.0:$PORT --workers 4 --worker-class sync --timeout 60
```

### 4. Environment Variables

Add in Render dashboard (Settings → Environment):

```
DEBUG=False
```

### 5. Deploy

Click "Deploy" and wait for build to complete (~3-5 minutes)

---

## API Endpoints

### Health Check
```bash
GET /health
```
Response:
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

### Extract Blob
```bash
POST /extract/blob
Content-Type: application/json

{
  "sitekey": "476068BF-9607-4799-B53D-966BE98E2B81",
  "proxy": "http://proxy:port"
}
```

Or use preset:
```json
{
  "preset": "roblox_login"
}
```

Response:
```json
{
  "success": true,
  "blob": "token_data_here",
  "public_key": "476068BF-9607-4799-B53D-966BE98E2B81",
  "timestamp": 1234567890
}
```

### Create Solve Task
```bash
POST /solve/create
Content-Type: application/json

{
  "sitekey": "476068BF-9607-4799-B53D-966BE98E2B81",
  "has_suppressed": false,
  "has_pow": false
}
```

Response:
```json
{
  "success": true,
  "task_id": "abc123def456",
  "status": "solving"
}
```

### Check Task Status
```bash
GET /solve/status/{task_id}
```

Response (when completed):
```json
{
  "success": true,
  "status": "completed",
  "token": "token_...",
  "suppressed_answer": null,
  "pow_solution": null
}
```

### Unified Solve (Extract + Solve)
```bash
POST /unified/solve
Content-Type: application/json

{
  "preset": "roblox_login",
  "has_suppressed": false,
  "has_pow": false
}
```

Response:
```json
{
  "success": true,
  "task_id": "uuid",
  "status": "solving",
  "blob": "token_data"
}
```

### Decrypt TGuess
```bash
POST /decrypt/tguess
Content-Type: application/json

{
  "encrypted_data": "{\"ct\":\"...\",\"iv\":\"...\",\"s\":\"...\"}",
  "session_token": "session_token_here"
}
```

Response:
```json
{
  "success": true,
  "data": "decrypted_plaintext"
}
```

### Decrypt BDA
```bash
POST /decrypt/bda
Content-Type: application/json

{
  "bda_data": "base64_encoded_data",
  "user_agent": "Mozilla/5.0..."
}
```

Response:
```json
{
  "success": true,
  "data": "decrypted_plaintext"
}
```

### Get Statistics
```bash
GET /stats
```

Response:
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

## Node.js Example

```javascript
const axios = require('axios');

const API_URL = 'https://your-app.onrender.com';

async function solveRoblox() {
  try {
    // Create solve task
    const taskRes = await axios.post(`${API_URL}/unified/solve`, {
      preset: 'roblox_login',
      has_suppressed: false,
      has_pow: false
    });

    const taskId = taskRes.data.task_id;
    console.log('Task created:', taskId);

    // Poll for result
    let completed = false;
    let result;
    
    while (!completed) {
      const statusRes = await axios.get(`${API_URL}/solve/status/${taskId}`);
      
      if (statusRes.data.status === 'completed') {
        result = statusRes.data;
        completed = true;
      } else if (statusRes.data.status === 'error') {
        throw new Error(statusRes.data.error);
      } else {
        await new Promise(r => setTimeout(r, 500)); // Wait 500ms
      }
    }

    console.log('Token:', result.token);
    return result.token;
  } catch (err) {
    console.error('Error:', err.message);
  }
}

solveRoblox();
```

## Python Example

```python
import requests
import time

API_URL = 'https://your-app.onrender.com'

def solve_roblox():
    # Create task
    response = requests.post(f'{API_URL}/unified/solve', json={
        'preset': 'roblox_login',
        'has_suppressed': False,
        'has_pow': False
    })
    
    data = response.json()
    task_id = data['task_id']
    print(f'Task created: {task_id}')
    
    # Poll for result
    while True:
        status_res = requests.get(f'{API_URL}/solve/status/{task_id}')
        status_data = status_res.json()
        
        if status_data['status'] == 'completed':
            print(f'Token: {status_data["token"]}')
            return status_data['token']
        elif status_data['status'] == 'error':
            raise Exception(status_data['error'])
        
        time.sleep(0.5)

solve_roblox()
```

---

## Troubleshooting

### "arkose.js not found"
- Make sure `arkose.js` is in the root directory
- Check that git includes it: `git ls-files | grep arkose.js`
- If missing, add to `.gitignore` and commit

### Build fails
- Check logs: Render → Logs → Build Logs
- Verify Python 3.11+ is set
- Ensure `requirements.txt` exists

### High memory usage
- Reduce `--workers` in start command
- Check if tasks are being cleaned up properly

### Slow decryption
- Large `webgl.json` may slow startup
- Consider using smaller/optimized version

---

## Advanced Configuration

### Custom Worker Count

For more concurrent requests:
```bash
gunicorn app:app --bind 0.0.0.0:$PORT --workers 8 --worker-class sync
```

For high concurrency (use with caution):
```bash
gunicorn app:app --bind 0.0.0.0:$PORT --workers 4 --worker-class gevent --worker-connections 1000
```

### Enable Debug (NOT PRODUCTION)

Add environment variable: `DEBUG=True`

Start command will run Flask's debug server instead of gunicorn.

### HTTPS/SSL
- Render provides automatic SSL
- All traffic is encrypted by default
- No configuration needed

---

## Version History

- **v3.0** - Added decryption utilities (tguess, BDA) + integrated decrypt_*.py
- **v2.0** - Added blob extraction + suppressed captcha support
- **v1.0** - Basic PoW solver

---

## Support

Check `/health` endpoint for service status and statistics.
View logs in Render dashboard for errors.
