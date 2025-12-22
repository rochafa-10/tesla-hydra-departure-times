# Contributing

## Adding New Routes

To add departure schedules for new routes:

1. Open `tesla-hydra-departure.user.js`
2. Find the `DEPARTURE_SCHEDULE` object
3. Add your route:

```javascript
const DEPARTURE_SCHEDULE = {
    // ... existing routes ...
    'NEW_ROUTE': { 
        pick: '14:40', 
        pack: '15:40', 
        load: '16:40', 
        close: '16:55', 
        depart: '17:00' 
    },
};
```

4. Save and test
5. Submit a pull request

## Updating Existing Routes

1. Find the route in `DEPARTURE_SCHEDULE`
2. Update the times
3. Test on Tesla Hydra page
4. Submit pull request

## Reporting Issues

When reporting issues, please include:

1. Browser and version
2. Tampermonkey version
3. Console errors (F12)
4. Screenshot if possible
5. Steps to reproduce

## Code Style

- Use consistent indentation (spaces, not tabs)
- Add comments for complex logic
- Test changes before submitting
- Update version number in script header

