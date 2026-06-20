# ⚡ Getting Started - 15 Minute Deploy

**For the impatient: Deploy to Render in 15 minutes**

---

## Step 1: Prepare Files (2 min)

Create a folder and copy these files:
```
app.py
requirements.txt
arkose.js          ← MUST HAVE
webgl.json         ← OPTIONAL
Procfile
runtime.txt
.gitignore
```

---

## Step 2: Create GitHub Repo (3 min)

```bash
cd your-folder
git init
git add .
git commit -m "Unified FunCaptcha Solver v3.0"

# Create repo at github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Step 3: Deploy to Render (5 min)

1. Go to **https://render.com**
2. Sign in with GitHub
3. Click **"New +" → "Web Service"**
4. Select your repository
5. Fill in:
   - **Name**: `funcaptcha-solver`
   - **Runtime**: `Python 3`
   - **Region**: Your region
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: 
     ```
     gunicorn app:app --bind 0.0.0.0:$PORT --workers 4 --worker-class sync --timeout 60
     ```
6. Add Environment:
   - **Key**: `DEBUG`
   - **Value**: `False`
7. Click **"Create Web Service"**

---

## Step 4: Test (3 min)

Wait for it to say **"Live"** (takes 3-5 min), then test:

```bash
# Replace YOUR-APP with your actual app name from Render
curl https://YOUR-APP.onrender.com/health

# Should return:
# {
#   "status": "healthy",
#   "version": "3.0.0",
#   ...
# }
```

---

## Step 5: Use It (2 min)

**Node.js:**
```javascript
const API = 'https://YOUR-APP.onrender.com';

// Solve captcha
const task = await fetch(API + '/unified/solve', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({preset: 'roblox_login'})
}).then(r => r.json());

// Get result
const result = await fetch(API + '/solve/status/' + task.task_id)
  .then(r => r.json());

console.log(result.token);
```

**Python:**
```python
import requests

API = 'https://YOUR-APP.onrender.com'

# Create task
task = requests.post(API + '/unified/solve', 
  json={'preset': 'roblox_login'}).json()

# Get result
while True:
  result = requests.get(API + '/solve/status/' + task['task_id']).json()
  if result['status'] == 'completed':
    print(result['token'])
    break
```

**cURL:**
```bash
API=https://YOUR-APP.onrender.com

# Solve
TASK=$(curl -s -X POST $API/unified/solve \
  -H 'Content-Type: application/json' \
  -d '{"preset":"roblox_login"}' | jq -r .task_id)

# Check
curl $API/solve/status/$TASK
```

---

## 🎯 Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Check service status |
| `/stats` | GET | View statistics |
| `/unified/solve` | POST | Solve captcha |
| `/solve/status/{id}` | GET | Check task status |
| `/extract/blob` | POST | Extract blob only |
| `/decrypt/tguess` | POST | Decrypt tguess data |
| `/decrypt/bda` | POST | Decrypt BDA data |

---

## ❓ Quick FAQ

**Q: Where do I get arkose.js?**  
A: You should already have it. Make sure it's in the root folder.

**Q: My app shows "Build Failed"**  
A: Check Render logs. Usually means missing `arkose.js` or syntax error in `requirements.txt`

**Q: Task stays "processing"**  
A: That's normal. Poll `/solve/status/{task_id}` every 500ms until it's done.

**Q: How do I update my app?**  
A: Push to GitHub. Render auto-redeploys.

**Q: Can I use this locally?**  
A: Yes! `python app.py` then visit `http://localhost:8080/health`

---

## 📚 More Info

- **Full Docs**: See `RENDER_DEPLOYMENT.md`
- **All Endpoints**: See `API_REFERENCE.md`
- **Setup Checklist**: See `SETUP_CHECKLIST.md`

---

## 🚀 Done!

Your service is live at: `https://YOUR-APP.onrender.com`

Test it now with the code above.

---

**Need help?**
- Check `/health` endpoint
- Review `RENDER_DEPLOYMENT.md`
- Look at examples in `API_REFERENCE.md`
