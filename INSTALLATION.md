# Quick Installation Guide

## For Team Members

### Step 1: Install Tampermonkey

1. Go to: https://www.tampermonkey.net/
2. Click "Download" for your browser (Chrome/Edge/Firefox)
3. Install the extension
4. Verify it's enabled (checkmark in toolbar)

### Step 2: Install the Script

**Easiest Method - From GitHub:**

1. Go to the GitHub repository
2. Click on `tesla-hydra-departure.user.js`
3. Click the **"Raw"** button (top right of the code view)
4. Tampermonkey will automatically detect it
5. Click **"Install"** in the popup
6. Done! ✅

**Alternative Method - Copy/Paste:**

1. Open Tampermonkey Dashboard (click icon → Dashboard)
2. Click **"+"** (Create new script)
3. Delete all default code
4. Copy all code from `tesla-hydra-departure.user.js`
5. Paste into editor
6. Save (Ctrl+S)

### Step 3: Test It

1. Go to: `https://mfs-synergy.tesla.com/hydra/load`
2. Wait for page to load
3. You should see:
   - New "Depart" column
   - Departure times with colors
   - Time until departure

## Troubleshooting

**Script not working?**
- Check Tampermonkey is enabled
- Check script is enabled in Dashboard
- Open Console (F12) and look for errors
- Refresh the page

**Need help?**
- Check the main README.md
- Contact the script author

