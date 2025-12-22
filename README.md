# Tesla Hydra - Trailer Departure Times

Tampermonkey userscript that displays trailer departure times on the Tesla Hydra Load page.

## Features

- ✅ Automatically adds "Depart" column to trailer list
- ✅ Color-coded urgency indicators:
  - 🔴 Red: Departing within 30 minutes (urgent!)
  - 🟡 Yellow: Departing within 1 hour (warning)
  - 🟢 Green: Departing in more than 1 hour (normal)
- ✅ Shows time until departure (e.g., "2h 11m")
- ✅ Hover tooltip with full schedule (Pick, Pack, Load, Close, Depart)
- ✅ Auto-updates every 30 seconds
- ✅ Handles dynamic content (new trailers added automatically)

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
- `FEDEXEXPRESSFREIGHT...` → No schedule (shows "—")

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

