# Sharing the Script with Your Team

## Quick Share Instructions

### Step 1: Push to GitHub

1. **Commit and push the updated version 1.8:**
   ```bash
   git add tesla-hydra-departure.user.js README.md
   git commit -m "Update to version 1.8 - Fixed GDC route detection"
   git push origin main
   ```

2. **Verify the file is on GitHub:**
   - Go to: `https://github.com/rochafa-10/tesla-hydra-departure-times`
   - Check that `tesla-hydra-departure.user.js` shows version 1.8

### Step 2: Share with Your Team

**Send them this message:**

---

**Subject: Tesla Hydra - Trailer Departure Times Script**

Hi team,

I've created a Tampermonkey script that automatically displays trailer departure times on the Tesla Hydra Load page. It shows:
- Departure times with color-coded urgency (red/yellow/green)
- Time remaining until departure
- Full schedule on hover

**Installation (2 minutes):**

1. **Install Tampermonkey** (if you don't have it):
   - Go to: https://www.tampermonkey.net/
   - Install for Chrome/Edge/Firefox

2. **Install the script:**
   - Go to: https://github.com/rochafa-10/tesla-hydra-departure-times/blob/main/tesla-hydra-departure.user.js
   - Click the **"Raw"** button (top right)
   - Tampermonkey will pop up → Click **"Install"**
   - Done! ✅

3. **Test it:**
   - Go to: `https://mfs-synergy.tesla.com/hydra/load`
   - You should see a new "Depart" column with departure times

**Auto-Updates:**
The script will automatically update when I make changes. You don't need to do anything!

**Need help?**
- Check the README: https://github.com/rochafa-10/tesla-hydra-departure-times
- Or contact me

---

### Step 3: Alternative Sharing Methods

**Option A: Direct Link (Easiest)**
Share this link - clicking "Raw" will auto-install:
```
https://github.com/rochafa-10/tesla-hydra-departure-times/raw/main/tesla-hydra-departure.user.js
```

**Option B: Email with Instructions**
Attach `INSTALLATION.md` to your email

**Option C: Team Chat/Slack**
Post the GitHub link and installation steps

## What Your Team Needs

1. ✅ Tampermonkey extension installed
2. ✅ Access to Tesla Hydra page
3. ✅ 2 minutes to install

## Future Updates

When you update the script:
1. Update version number in the script (e.g., `@version 1.9`)
2. Commit and push to GitHub
3. Team members will get auto-update notification from Tampermonkey
4. They just click "Update" - no manual work needed!

## Repository Link

**Main Repository:**
https://github.com/rochafa-10/tesla-hydra-departure-times

**Direct Script Link (for installation):**
https://github.com/rochafa-10/tesla-hydra-departure-times/raw/main/tesla-hydra-departure.user.js

