# 📋 Render Deployment Checklist

## Pre-Deployment (Local Setup)

- [ ] Have `arkose.js` in your repository root
- [ ] Have `webgl.json` in your repository root (optional but recommended)
- [ ] Create a new GitHub repository
- [ ] Clone the repository locally

## Files to Include in Repository

- [ ] `app.py` - Main Flask application with integrated decryption
- [ ] `requirements.txt` - Python dependencies
- [ ] `arkose.js` - Required for encryption/decryption
- [ ] `webgl.json` - WebGL configuration (optional)
- [ ] `Procfile` - Render configuration
- [ ] `runtime.txt` - Python version specification
- [ ] `.gitignore` - Ignore unnecessary files
- [ ] `README.md` - Project documentation

## Git Setup

```bash
# Initialize repository
git init

# Add all files
git add .

# Verify files
git ls-files
# Should include: app.py, requirements.txt, arkose.js, Procfile, runtime.txt

# First commit
git commit -m "Initial commit: Unified FunCaptcha Solver v3.0"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

## Render Dashboard Setup

### Step 1: Create Web Service
- [ ] Go to https://render.com
- [ ] Click "New +" button
- [ ] Select "Web Service"

### Step 2: Connect Repository
- [ ] Sign in with GitHub
- [ ] Select your repository
- [ ] Click "Connect"

### Step 3: Configure Service
- [ ] **Name**: `funcaptcha-solver` (or your preference)
- [ ] **Runtime**: `Python 3`
- [ ] **Region**: Select closest to your location
- [ ] **Branch**: `main`
- [ ] **Build Command**: `pip install -r requirements.txt`
- [ ] **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 4 --worker-class sync --timeout 60`

### Step 4: Environment Variables
Click "Add Environment Variable":
- [ ] Key: `DEBUG`, Value: `False`

### Step 5: Resources
- [ ] **Plan Type**: Select plan (Free, Starter, etc.)
- [ ] Auto-deploy: Enable if desired

### Step 6: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (~3-5 minutes)
- [ ] Check deployment logs for errors

## Verification

- [ ] Service shows "Live" status in Render dashboard
- [ ] Visit `https://YOUR-APP.onrender.com/health`
- [ ] Should return JSON with service status
- [ ] Check that `"arkose_js_loaded": true`

## Testing Endpoints

### Test 1: Health Check
```bash
curl https://YOUR-APP.onrender.com/health
```

Expected: JSON response with status "healthy"

### Test 2: Extract Blob
```bash
curl -X POST https://YOUR-APP.onrender.com/extract/blob \
  -H "Content-Type: application/json" \
  -d '{"preset": "roblox_login"}'
```

Expected: JSON with blob token

### Test 3: Create Task & Check Status
```bash
# Create task
TASK_ID=$(curl -X POST https://YOUR-APP.onrender.com/unified/solve \
  -H "Content-Type: application/json" \
  -d '{"preset": "roblox_login"}' | jq -r '.task_id')

# Check status
curl https://YOUR-APP.onrender.com/solve/status/$TASK_ID
```

## Common Issues & Solutions

### Issue: "arkose.js not found" error

**Solution:**
1. Check file exists locally: `ls arkose.js`
2. Check git tracks it: `git ls-files | grep arkose.js`
3. If not tracked:
   ```bash
   git add arkose.js
   git commit -m "Add arkose.js"
   git push
   ```
4. Redeploy in Render dashboard

### Issue: Build fails with "No such file or directory"

**Solution:**
1. Check Render build logs for specific error
2. Verify all required files are in repository root
3. Check for typos in `requirements.txt`
4. Ensure Python version is 3.11+

### Issue: Task created but returns "processing" indefinitely

**Solution:**
1. Check `/health` endpoint for stats
2. Review Render logs for errors
3. Increase timeout in start command: `--timeout 120`
4. Check if suppressed/PoW solving is configured

### Issue: High memory usage

**Solution:**
1. Reduce workers: `--workers 2`
2. Add memory limit: `--max-requests 100`
3. Check for memory leaks in logs

## Post-Deployment

- [ ] Save API URL: `https://YOUR-APP.onrender.com`
- [ ] Test all endpoints
- [ ] Monitor logs for errors
- [ ] Set up monitoring/alerting if needed
- [ ] Document any custom configurations

## Ongoing Maintenance

### Weekly
- [ ] Check service status in Render dashboard
- [ ] Review `/stats` endpoint for error trends

### Monthly
- [ ] Check for library updates
- [ ] Review API logs for issues
- [ ] Update dependencies if needed

### Update Process
```bash
# Make changes locally
git add .
git commit -m "Update: description"
git push

# Render will auto-deploy if auto-deploy is enabled
# Otherwise, manually trigger from Render dashboard
```

## Support Resources

- Render Docs: https://render.com/docs
- Flask Docs: https://flask.palletsprojects.com/
- Check service health: `/health` endpoint
- View statistics: `/stats` endpoint

---

**Status**: Ready for deployment ✅
**Last Updated**: 2024
**Version**: 3.0.0
