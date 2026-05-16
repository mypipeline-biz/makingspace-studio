# Making Space — Deployment Setup Guide

## Phase 1: Push Code to GitHub

### Prerequisites
- GitHub account: `mypipeline-biz` ✓
- Git installed on your computer ([download here](https://git-scm.com))

### Step 1: Create the repository on GitHub

1. Go to **github.com/mypipeline-biz**
2. Click **"New"** (or go to https://github.com/new)
3. Fill in:
   - **Repository name:** `makingspace-studio`
   - **Description:** `Making Space — Creative Studio & Workshop Booking Platform`
   - **Public** (selected)
   - Leave other options as default
4. Click **"Create repository"**

You'll see a page with setup instructions. **Copy the commands shown** — they'll look like:

```
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

### Step 2: Push code from your computer

Open your terminal/command prompt and run:

```bash
# Download the files I've prepared
cd ~/Desktop  # or wherever you want to work
git clone https://github.com/mypipeline-biz/makingspace-studio.git
cd makingspace-studio

# Verify the files are there
ls -la
# You should see: index.html, admin.html, README.md, .gitignore, netlify.toml

# Create the main branch and push
git branch -M main
git remote add origin https://github.com/mypipeline-biz/makingspace-studio.git
git add .
git commit -m "Initial commit: Making Space website and CMS"
git push -u origin main

# Create develop branch for staging
git checkout -b develop
git push -u origin develop
```

**If you get authentication errors**, GitHub now requires either:
- **Personal Access Token** (recommended): https://github.com/settings/tokens
  - Scopes: `repo`, `workflow`
  - Use this instead of your password when prompted
- **SSH key** (advanced): https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## Phase 2: Deploy to Netlify

### Step 1: Sign up on Netlify

1. Go to **netlify.com**
2. Click **"Sign up"** → **"GitHub"** (authenticate with your GitHub account)
3. Accept permissions

### Step 2: Deploy from GitHub

1. Go to https://app.netlify.com/sites
2. Click **"New site from Git"**
3. Select **GitHub** → authorize
4. Find and select **`mypipeline-biz/makingspace-studio`**
5. **Basic build settings:**
   - Leave "Build command" blank (static site)
   - Leave "Publish directory" as `.` (root folder)
6. Click **"Deploy site"**

Netlify will build and deploy. You'll get a URL like:
```
https://random-name-12345.netlify.app
```

**Test it works:**
- Visit the URL
- Try signing up (this will test the bcrypt functionality)
- Open DevTools (F12) → Console tab to see any errors

---

## Phase 3: Set Up Staging & Production

### Option A: Using Git Branches (Recommended)

1. **In Netlify**, click **"Site settings"** → **"Build & deploy"**
2. **Branch deploys:**
   - Click **"Edit settings"** on "Deploy contexts"
   - Set:
     - `main` branch → Production deployment
     - `develop` branch → Preview/Staging deployment
3. **Deploy previews:**
   - Each pull request auto-deploys to a preview URL
   - Perfect for testing before merging to main

**Workflow:**
```bash
# Work on develop branch
git checkout develop
# Make changes, test on staging URL
git add .
git commit -m "Fix signup form"
git push origin develop

# When ready, merge to main for production
git checkout main
git merge develop
git push origin main
```

### Option B: Using Custom Domains (After Testing)

Once you verify everything works:

1. **Buy domain** (if you haven't already)
   - Register at Namecheap, GoDaddy, or your registrar
   - DNS points to Netlify nameservers

2. **In Netlify**, click **"Domain settings"**
   - Add custom domain: `makingspace.studio` (production)
   - Add subdomain: `staging.makingspace.studio` (staging)

3. **DNS setup:**
   - Netlify will give you nameservers to add to your registrar
   - Takes 24-48 hours to fully propagate

---

## Phase 4: Testing Checklist

### On Staging (develop branch / staging URL)

- [ ] Sign up with email/password
- [ ] Verify bcrypt hashing works (check DevTools Console)
- [ ] Login with created account
- [ ] Book a session with pre-filled form
- [ ] Save session to wishlist
- [ ] View profile page
- [ ] Test OAuth buttons (Google/Apple)
- [ ] Open admin.html and verify CMS works
- [ ] Edit session details in CMS
- [ ] Refresh browser and verify data persisted

### Before Promoting to Production

- [ ] Run through all tests again on staging
- [ ] Check DevTools Console for any errors
- [ ] Test on mobile device
- [ ] Test in different browsers (Chrome, Firefox, Safari)
- [ ] Verify all forms submit correctly

---

## Phase 5: Known Issues to Fix

Based on testing, we need to fix:

1. **Signup form not submitting** — likely bcrypt timing issue
2. **Book Now button in session overlay** — modal not appearing
3. **OAuth buttons** — currently show alert instead of redirect

These will be **debugged on the staging URL** where we can see real console errors.

---

## File Structure

```
makingspace-studio/
├── index.html          # Main website
├── admin.html          # CMS admin panel
├── README.md           # Documentation
├── netlify.toml        # Netlify configuration
└── .gitignore          # Git ignore rules
```

---

## Troubleshooting

### "Permission denied" when pushing to GitHub

→ You need a Personal Access Token. Generate one at https://github.com/settings/tokens

### "Command not found: git"

→ Install Git: https://git-scm.com/downloads

### Netlify deployment shows errors

→ Check the deploy log in Netlify dashboard (Sites → Deploys → build log)

### Changes not showing after push

→ Netlify may be caching. Click "Clear cache and deploy site" in Netlify

---

## Next Steps

1. **Set up GitHub repo** (Phase 1)
2. **Deploy to Netlify** (Phase 2)
3. **Configure staging/production** (Phase 3)
4. **Test everything** (Phase 4)
5. **Debug the 3 issues** using real staging environment
6. **Promote to production** once all tests pass

**Estimated time:** 30 minutes for full setup

---

Need help with any step? Let me know!
