# Tesla Hydra - Trailer Departure Times

Tampermonkey userscript that displays trailer departure times on the Tesla Hydra Load page.

## Features

- ✅ Automatically adds "Depart" column to trailer list
- ✅ Color-coded urgency indicators:
  - 🔴 Red: Departing within 10 minutes (urgent!)
  - 🟡 Yellow: Departing within 30 minutes (warning)
  - 🟢 Green: Departing in more than 30 minutes (normal)
- ✅ Shows time until departure (e.g., "2h 11m")
- ✅ Hover tooltip with full schedule (Pick, Pack, Load, Close, Depart)
- ✅ Auto-updates every 30 seconds
- ✅ Handles dynamic content (new trailers added automatically)
- ✅ **Multiple alert types** to prevent missing departures:
  - 🔔 Browser desktop notifications
  - 📢 Visual popup alerts on page
  - 🔊 Sound alerts (critical/warning beeps)
  - 💬 Microsoft Teams webhook integration (optional)
- ✅ Configurable alert thresholds (critical at 10min, warning at 30min, early at 30min)
- ✅ Alert cooldown system prevents notification spam

## Screenshots

*Add screenshots here if you have them*

## Installation

### Prerequisites

- Chrome/Edge/Firefox browser
- [Tampermonkey extension](https://www.tampermonkey.net/) installed and enabled

### Step 1: Install Tampermonkey

1. Go to [Tampermonkey website](https://www.tampermonkey.net/)
2. Install for your browser (Chrome/Edge/Firefox)
3. Verify it's enabled (checkmark in browser toolbar)

### Step 2: Install the Script

**Option A: From GitHub (Recommended)**

1. Click on `tesla-hydra-departure.user.js` in this repository
2. Click the **"Raw"** button (top right)
3. Tampermonkey should automatically detect it and show "Install" dialog
4. Click **"Install"**

**Option B: Manual Installation**

1. Open Tampermonkey Dashboard (click icon → Dashboard)
2. Click **"+"** (Create new script)
3. Delete all default code
4. Copy all code from `tesla-hydra-departure.user.js`
5. Paste into editor
6. Save (Ctrl+S)

### Step 3: Verify Installation

1. Go to: `https://mfs-synergy.tesla.com/hydra/load`
2. Open Console (F12)
3. You should see: `=== TESLA HYDRA DEPARTURE SCRIPT LOADED ===`
4. Departure times should appear in a new column!

## Configuration

### Update Departure Schedules

Edit the `DEPARTURE_SCHEDULE` object in the script:

```javascript
const DEPARTURE_SCHEDULE = {
    '3':  { pick: '22:25', pack: '23:25', load: '00:25', close: '00:40', depart: '00:45' },
    '4':  { pick: '19:40', pack: '20:40', load: '21:40', close: '21:55', depart: '22:00' },
    // Add or modify routes as needed
};
```

### Adjust Urgency Thresholds

```javascript
const STYLES = {
    urgentMinutes: 30,      // Red if departing within 30 minutes
    warningMinutes: 60,     // Yellow if departing within 60 minutes
    // ...
};
```

### Configure Alerts

The script includes multiple alert types to prevent missing trailer departures:

**Alert Types:**
- **Browser Notifications**: Desktop notifications (requires permission)
- **Visual Popups**: On-page alert banners
- **Sound Alerts**: Audio beeps for critical/warning situations
- **Teams Integration**: Microsoft Teams webhook messages (optional)

**Configure Alert Settings:**

```javascript
const ALERT_CONFIG = {
    // Alert thresholds (minutes before departure)
    criticalAlert: 10,      // Critical alert at 10 minutes (urgent)
    warningAlert: 30,       // Warning alert at 30 minutes
    earlyAlert: 30,         // Early alert at 30 minutes
    
    // Enable/disable alert types
    enableBrowserNotifications: true,  // Desktop notifications
    enableVisualAlerts: true,          // Visual popups
    enableSoundAlerts: true,           // Sound alerts
    enableTeamsAlerts: false,          // Teams webhook
    
    // Teams webhook URL (get from Teams channel → Connectors → Incoming Webhook)
    teamsWebhookUrl: '',  // Example: 'https://outlook.office.com/webhook/...'
    
    // Alert cooldown (minutes) - prevents spam
    alertCooldown: 5,
    
    // Sound volume (0.0 to 1.0)
    soundVolume: 0.5,
};
```

**Setting up Teams Alerts:**

1. Go to your Teams channel
2. Click **"..."** (More options) → **Connectors**
3. Search for **"Incoming Webhook"** and click **Configure**
4. Give it a name (e.g., "Trailer Alerts") and click **Create**
5. Copy the webhook URL
6. Paste it into `teamsWebhookUrl` in the script
7. Set `enableTeamsAlerts: true`

## How It Works

1. Script waits for the page iframe to load
2. Finds trailer buttons (TRUCK, TRK, T4, etc.)
3. Extracts route numbers from trailer names
4. Looks up departure schedule
5. Adds departure time column with color-coded urgency
6. Updates colors every 30 seconds

## Supported Trailer Formats

- `TRUCK4/121925` → Route 4
- `TRUCK10-480684/12/19/25` → Route 10
- `TRK3-121925-28695` → Route 3
- `T4-121925-480660` → Route 4
- `FEDEXEXPRESSFREIGHT...` → FEDEX route (14:30)
- `DGUPS12/22/2025` → UPS route (17:00)
- `VORUPS12222512PM` → UPS route (17:00)
- `HVBODFL-12/22/25` → ODFL route (17:00)
- `ODFL-493528-12/22/25-DS` → ODFL route (17:00)

## Troubleshooting

### Script Not Running

1. Check Tampermonkey is enabled (`chrome://extensions`)
2. Check script is enabled in Dashboard (green checkmark)
3. Check Console (F12) for error messages
4. Verify URL matches: `https://mfs-synergy.tesla.com/hydra/load*`

### Departure Times Not Appearing

1. Wait 5-10 seconds (script waits for iframe to load)
2. Check Console for `[Hydra Departure]` messages
3. Refresh the page (F5)
4. Check if trailer buttons are visible on page

### Wrong Departure Times

- Edit the `DEPARTURE_SCHEDULE` in the script
- Update route numbers and times
- Save and refresh page

## Updating the Script

1. In Tampermonkey Dashboard, click script name
2. Edit the code
3. Save (Ctrl+S)
4. Refresh Tesla Hydra page

Or if installed from GitHub:
- Tampermonkey will check for updates automatically
- Or click "Check for userscript updates" in Dashboard

## Contributing

To add new routes or improve the script:

1. Fork this repository
2. Make your changes
3. Test on Tesla Hydra page
4. Submit a pull request

## License

Internal use only - Tesla Motors

## Support

For issues or questions:
- Check Console (F12) for error messages
- Review troubleshooting section above
- Contact the script author

## Changelog

### Version 1.12
- Added multiple alert types: browser notifications, visual popups, sound alerts
- Added Microsoft Teams webhook integration (optional, requires setup)
- Configurable alert thresholds (critical at 15min, warning at 30min, early at 60min)
- Alert cooldown system to prevent spam
- Visual popup alerts with auto-dismiss
- Sound alerts with different patterns for critical/warning

### Version 1.11
- Improved UPS detection to match any trailer containing "UPS" (not just specific prefixes)
- Improved ODFL detection to match any trailer containing "ODFL" (not just specific prefixes)
- Updated filter pattern to be more flexible for carrier routes

### Version 1.10
- Fixed route detection for VORUPS trailers (now detects as UPS route)
- Fixed route detection for ODFL- prefix trailers (e.g., "ODFL-493528-12/22/25-DS")
- Improved filter pattern to include VORUPS and ODFL prefixes

### Version 1.9
- Added carrier routes: UPS (17:00), ODFL (17:00), FedEx (14:30)
- Improved route detection for DGUPS, HVBODFL, and FEDEX trailers
- Updated departure schedules for carrier-specific trailers

### Version 1.8
- Fixed GDC route detection for formats like "LOCKPORT-PTLZ240162-12/22"
- Improved trailer name matching to include all GDC destinations
- Added debug logging for GDC trailers
- Fixed tooltip labels for non-milkrun routes

### Version 1.7
- Added GDC routes: Lockport, Tampa, Tilburg, Greenville, Scarborough
- Improved route detection for destination-based trailers
- Updated schedule configuration

### Version 1.6
- Added GitHub auto-update support (@updateURL and @downloadURL)
- Configured for automatic updates from GitHub repository
- Improved version management

### Version 1.5
- Added visual indicator when script loads
- Improved iframe detection
- Better error handling
- Enhanced logging for debugging

### Version 1.4
- Added immediate console logging
- Improved Tampermonkey detection
- Better initialization timing

### Version 1.3
- Fixed iframe access issues
- Improved row detection
- Better handling of dynamic content

### Version 1.2
- Initial release
- Basic departure time display
- Color-coded urgency

