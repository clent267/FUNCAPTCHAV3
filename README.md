# 🎮 Unified Roblox FunCaptcha Solver v3.0

A production-ready Flask service for solving Roblox FunCaptcha challenges with integrated decryption utilities. Deployed on Render.

**Features:**
- ✅ Blob extraction from Arkose Labs
- ✅ FunCaptcha solving (regular, suppressed, PoW)
- ✅ TGuess data decryption
- ✅ BDA data decryption
- ✅ RESTful API with async task processing
- ✅ Health checks and statistics
- ✅ Render-ready deployment

---

## 🚀 Quick Start

### Local Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/funcaptcha-solver.git
cd funcaptcha-solver

# Install dependencies
pip install -r requirements.txt

# Run locally
python app.py
```

Visit: `http://localhost:8080/health`

### Render Deployment

1. Push to GitHub
2. Connect repository to Render
3. Set Start Command:
   ```bash
   gunicorn app:app --bind 0.0.0.0:$PORT --workers 4 --worker-class sync --timeout 60
   ```
4. Deploy and get your URL

---

## 📋 What's Included

```
├── app.py                    # Main Flask application (v3.0 integrated)
├── requirements.txt          # Python dependencies
├── arkose.js                 # Required: JavaScript encryption
├── webgl.json               # Optional: WebGL configuration
├── Procfile                 # Render configuration
├── runtime.txt              # Python version (3.11.6)
├── .gitignore               # Git ignore patterns
├── README.md                # This file
├── RENDER_DEPLOYMENT.md     # Render setup guide
├── SETUP_CHECKLIST.md       # Step-by-step checklist
├── API_REFERENCE.md         # Complete API documentation
└── LICENSE                  # Your license
```

---

## 🔧 What's New in v3.0

### Integrated Decryption Utilities

All decryption functionality from `decrypt_tguess.py` and `decrypt_bda.py` is now built into `app.py`:

```python
# TGuess Decryption
POST /decrypt/tguess
{
  "encrypted_data": "...",
  "session_token": "..."
}

# BDA Decryption  
POST /decrypt/bda
{
  "bda_data": "...",
  "user_agent": "..."
}
```

### Enhanced Utils & Arkose Classes

- `Arkose.generate_key_pbkdf()` - For tguess decryption
- `Arkose.generate_other_key_pbkdf()` - For tguess key generation
- `DecryptionUtils.decrypt_tguess()` - Standalone tguess decryption
- `DecryptionUtils.decrypt_bda()` - Standalone BDA decryption

### Statistics Tracking

New counter in health/stats endpoints:
```json
{
  "decrypted": 42
}
```

---

## 📖 Documentation

### Setup & Deployment
- **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** - Complete Render setup guide with examples
- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Step-by-step checklist for deployment

### API Documentation
- **[API_REFERENCE.md](API_REFERENCE.md)** - Complete endpoint reference with examples

### Quick Commands

```bash
# Check service health
curl https://your-app.onrender.com/health

# Extract blob
curl -X POST https://your-app.onrender.com/extract/blob \
  -H "Content-Type: application/json" \
  -d '{"preset": "roblox_login"}'

# Create solve task
curl -X POST https://your-app.onrender.com/unified/solve \
  -H "Content-Type: application/json" \
  -d '{"preset": "roblox_login"}'

# View statistics
curl https://your-app.onrender.com/stats
```

---

## 🛠️ Key Endpoints

### Service Info
- `GET /health` - Service status
- `GET /stats` - Detailed statistics

### Blob Extraction
- `POST /extract/blob` - Extract blob from Arkose

### Captcha Solving
- `POST /solve/create` - Create solve task
- `GET /solve/status/{task_id}` - Check task status
- `POST /unified/solve` - Extract + Solve in one request

### Decryption (NEW in v3.0)
- `POST /decrypt/tguess` - Decrypt tguess data
- `POST /decrypt/bda` - Decrypt BDA data

### Legacy (Backward Compatible)
- `POST /funcaptcha/createTask`
- `POST /funcaptcha/getTask`

---

## 📊 Usage Examples

### Node.js
```javascript
const axios = require('axios');

async function solveCaptcha() {
  const res = await axios.post('https://your-app.onrender.com/unified/solve', {
    preset: 'roblox_login'
  });
  
  const taskId = res.data.task_id;
  
  // Poll for result
  let result;
  while (true) {
    const status = await axios.get(
      `https://your-app.onrender.com/solve/status/${taskId}`
    );
    
    if (status.data.status === 'completed') {
      result = status.data;
      break;
    }
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  return result.token;
}
```

### Python
```python
import requests
import time

def solve_captcha():
    resp = requests.post('https://your-app.onrender.com/unified/solve', json={
        'preset': 'roblox_login'
    })
    
    task_id = resp.json()['task_id']
    
    while True:
        status = requests.get(
            f'https://your-app.onrender.com/solve/status/{task_id}'
        )
        
        if status.json()['status'] == 'completed':
            return status.json()['token']
        
        time.sleep(0.5)
```

### Decrypt TGuess
```javascript
const res = await axios.post('https://your-app.onrender.com/decrypt/tguess', {
  encrypted_data: '{"ct":"...","iv":"...","s":"..."}',
  session_token: 'session_token_here'
});

console.log('Decrypted:', res.data.data);
```

---

## 🔐 Deployment

### Render.com

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Unified FunCaptcha Solver v3.0"
   git push origin main
   ```

2. **Connect to Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 4 --worker-class sync --timeout 60`
   - Environment: `DEBUG=False`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build (~3-5 minutes)

### Local Deployment

```bash
# Install dependencies
pip install -r requirements.txt

# Run Flask development server
python app.py

# Or use Gunicorn
gunicorn app:app --bind 0.0.0.0:8080 --workers 4
```

---

## 📦 Requirements

- Python 3.11+
- Flask 2.3.3
- PyExecJS 1.5.1
- pycryptodom 18.0.0
- cryptography 41.0.4
- curl-cffi 0.5.9
- gunicorn 21.2.0

See `requirements.txt` for full list.

---

## 🐛 Troubleshooting

### "arkose.js not found"
- Ensure `arkose.js` is in repository root
- Check: `git ls-files | grep arkose.js`
- Add if missing: `git add arkose.js && git commit -m "Add arkose.js" && git push`

### Build fails on Render
- Check build logs: Render Dashboard → Logs
- Verify Python 3.11+ is selected
- Ensure all files are committed to git

### Task stays in "processing"
- Check `/health` endpoint
- Review Render logs for errors
- Increase timeout: `--timeout 120`

### High memory usage
- Reduce workers: `--workers 2`
- Monitor with `/stats` endpoint

---

## 📈 Monitoring

### Health Check
```bash
curl https://your-app.onrender.com/health
```

Response includes:
- Service status
- Version
- Arkose.js loaded status
- Statistics (solved, errors, etc.)

### Statistics
```bash
curl https://your-app.onrender.com/stats
```

Tracks:
- Total solved
- Failures
- Suppressed solved
- PoW solved
- Decrypted (new)
- Errors

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

[Your License Here]

---

## 🔗 Resources

- **API Docs**: [API_REFERENCE.md](API_REFERENCE.md)
- **Setup Guide**: [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
- **Deployment**: [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
- **Render Docs**: https://render.com/docs
- **Flask Docs**: https://flask.palletsprojects.com/

---

## 📞 Support

- Check `/health` for service status
- Review logs in Render dashboard
- Check API documentation for endpoint details
- Verify all files are present in repository

---

## 🎯 Roadmap

- [x] Blob extraction
- [x] Captcha solving
- [x] TGuess decryption
- [x] BDA decryption
- [x] Render deployment
- [ ] Rate limiting
- [ ] API key authentication
- [ ] Advanced metrics
- [ ] Database integration
- [ ] Webhook callbacks

---

**Status**: Production Ready ✅  
**Version**: 3.0.0  
**Last Updated**: December 2024  
**Created**: With ❤️ for Roblox automation

---

## Quick Links

| Link | Description |
|------|-------------|
| [API Reference](API_REFERENCE.md) | Complete endpoint documentation |
| [Setup Guide](SETUP_CHECKLIST.md) | Step-by-step deployment checklist |
| [Render Guide](RENDER_DEPLOYMENT.md) | Render.com deployment guide |
| [Health Check](https://your-app.onrender.com/health) | Service status |
| [Statistics](https://your-app.onrender.com/stats) | Service statistics |

---

## Version History

- **v3.0** ✨ NEW - Integrated decryption utilities (tguess, BDA)
- **v2.0** - Added blob extraction and suppressed captcha support
- **v1.0** - Initial PoW solver release
