// ==UserScript==
// @name         Tesla Hydra - Trailer Departure Times
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Display trailer departure times on Tesla Hydra Load page
// @author       Fabricio Rocha
// @match        https://mfs-synergy.tesla.com/hydra/load*
// @grant        none
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/rochafa-10/tesla-hydra-departure-times/main/tesla-hydra-departure.user.js
// @downloadURL  https://raw.githubusercontent.com/rochafa-10/tesla-hydra-departure-times/main/tesla-hydra-departure.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Immediate test to verify script is running
    console.log('%c=== TESLA HYDRA DEPARTURE SCRIPT LOADED ===', 'color: green; font-size: 16px; font-weight: bold;');
    console.log('[Hydra Departure] Script file executed at:', new Date().toISOString());
    console.log('[Hydra Departure] Current URL:', window.location.href);
    console.log('[Hydra Departure] Document readyState:', document.readyState);
    console.log('[Hydra Departure] User Agent:', navigator.userAgent);
    console.log('[Hydra Departure] Script location:', typeof GM_info !== 'undefined' ? 'Tampermonkey' : 'Direct');
    
    // Show visible indicator that script is running
    const scriptIndicator = document.createElement('div');
    scriptIndicator.id = 'hydra-departure-indicator';
    scriptIndicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #4CAF50;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-family: Arial, sans-serif;
        z-index: 999999;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        pointer-events: none;
    `;
    scriptIndicator.textContent = '✓ Hydra Departure Script Running';
    document.body.appendChild(scriptIndicator);
    
    // Remove indicator after 5 seconds
    setTimeout(() => {
        if (scriptIndicator.parentNode) {
            scriptIndicator.style.opacity = '0';
            scriptIndicator.style.transition = 'opacity 0.5s';
            setTimeout(() => scriptIndicator.remove(), 500);
        }
    }, 5000);
    
    // Show Tampermonkey info if available
    if (typeof GM_info !== 'undefined') {
        console.log('[Hydra Departure] Tampermonkey detected! Version:', GM_info.script.version);
        console.log('[Hydra Departure] Script name:', GM_info.script.name);
    } else {
        console.warn('[Hydra Departure] GM_info not available - script may not be running in Tampermonkey');
    }

    // ========================================
    // SCHEDULE CONFIGURATION - UPDATE AS NEEDED
    // ========================================
    const DEPARTURE_SCHEDULE = {
        'NON MILK RUN': { pick: '14:40', pack: '15:40', load: '16:40', close: '16:55', depart: '17:00' },
        'INTERNATIONAL': { pick: '14:40', pack: '15:40', load: '16:40', close: '16:55', depart: '17:00' },
        '1':  { pick: '16:40', pack: '17:40', load: '18:40', close: '18:55', depart: '19:00' },
        '2':  { pick: '22:25', pack: '23:25', load: '00:25', close: '00:40', depart: '00:45' },
        '3':  { pick: '22:25', pack: '23:25', load: '00:25', close: '00:40', depart: '00:45' },
        '4':  { pick: '19:40', pack: '20:40', load: '21:40', close: '21:55', depart: '22:00' },
        '5':  { pick: '22:40', pack: '23:40', load: '00:40', close: '00:55', depart: '01:00' },
        '7':  { pick: '21:10', pack: '22:10', load: '23:10', close: '23:25', depart: '23:30' },
        '8':  { pick: '21:10', pack: '22:10', load: '23:10', close: '23:25', depart: '23:30' },
        '10': { pick: '19:40', pack: '20:40', load: '21:40', close: '21:55', depart: '22:00' },
        '11': { pick: '19:25', pack: '20:25', load: '21:25', close: '21:40', depart: '21:45' },
        '12': { pick: '19:25', pack: '20:25', load: '21:25', close: '21:40', depart: '21:45' },
        '13': { pick: '23:10', pack: '00:10', load: '01:10', close: '01:25', depart: '01:30' },
        '31': { pick: '19:10', pack: '20:10', load: '21:10', close: '21:25', depart: '21:30' },
        '35': { pick: '14:40', pack: '15:40', load: '16:40', close: '16:55', depart: '17:00' },
        '36': { pick: '14:40', pack: '15:40', load: '16:40', close: '16:55', depart: '17:00' },
        // GDC Routes
        'LOCKPORT': { pick: '12:10', pack: '13:10', load: '14:10', close: '14:25', depart: '14:30' },
        'TAMPA': { pick: '14:10', pack: '15:10', load: '16:10', close: '16:25', depart: '16:30' },
        'TILBURG': { pick: '14:10', pack: '15:10', load: '16:10', close: '16:25', depart: '16:30' },
        'GREENVILLE': { pick: '14:10', pack: '15:10', load: '16:10', close: '16:25', depart: '16:30' },
        'SCARBOROUGH': { pick: '14:10', pack: '15:10', load: '16:10', close: '16:25', depart: '16:30' },
    };

    const STYLES = {
        urgentMinutes: 30,
        warningMinutes: 60,
        colors: {
            urgent: '#ff4444',
            warning: '#ffaa00',
            normal: '#44aa44',
            unknown: '#888888'
        }
    };

    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    
    function extractRouteNumber(trailerName) {
        if (!trailerName) return null;
        const upperName = trailerName.toUpperCase();
        
        // Check for special routes first
        if (upperName.includes('INTERNATIONAL')) return 'INTERNATIONAL';
        if (upperName.includes('NON MILK') || upperName.includes('NONMILK')) return 'NON MILK RUN';
        
        // Check for GDC destinations (check at start or after dash/separator)
        // Examples: "LOCKPORT-PTLZ240162-12/22" or "SCARBOROUGH-PF5345-12/22/25"
        if (upperName.startsWith('LOCKPORT') || upperName.includes('-LOCKPORT') || upperName.includes('_LOCKPORT')) return 'LOCKPORT';
        if (upperName.startsWith('TAMPA') || upperName.includes('-TAMPA') || upperName.includes('_TAMPA')) return 'TAMPA';
        if (upperName.startsWith('TILBURG') || upperName.includes('-TILBURG') || upperName.includes('_TILBURG')) return 'TILBURG';
        if (upperName.startsWith('GREENVILLE') || upperName.includes('-GREENVILLE') || upperName.includes('_GREENVILLE')) return 'GREENVILLE';
        if (upperName.startsWith('SCARBOROUGH') || upperName.includes('-SCARBOROUGH') || upperName.includes('_SCARBOROUGH')) return 'SCARBOROUGH';
        
        // Match TRUCK or TRK followed by number
        const match = upperName.match(/(?:TRUCK|TRK)(\d+)/);
        if (match) return match[1];
        // Also handle T4, T5, etc.
        const tMatch = upperName.match(/^T(\d+)/);
        if (tMatch) return tMatch[1];
        return null;
    }

    function timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function getCurrentMinutes() {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    }

    function minutesUntilDeparture(departTime) {
        const departMinutes = timeToMinutes(departTime);
        const currentMinutes = getCurrentMinutes();
        let diff = departMinutes - currentMinutes;
        if (departMinutes < 360 && currentMinutes > 1200) {
            diff += 1440;
        } else if (diff < -720) {
            diff += 1440;
        }
        return diff;
    }

    function getUrgencyColor(departTime) {
        if (!departTime) return STYLES.colors.unknown;
        const minutesLeft = minutesUntilDeparture(departTime);
        if (minutesLeft <= STYLES.urgentMinutes) return STYLES.colors.urgent;
        if (minutesLeft <= STYLES.warningMinutes) return STYLES.colors.warning;
        return STYLES.colors.normal;
    }

    function formatTimeUntil(departTime) {
        if (!departTime) return '';
        const minutesLeft = minutesUntilDeparture(departTime);
        if (minutesLeft < 0) return '(DEPARTED)';
        if (minutesLeft < 60) return `(${minutesLeft}m)`;
        const hours = Math.floor(minutesLeft / 60);
        const mins = minutesLeft % 60;
        return `(${hours}h ${mins}m)`;
    }

    // ========================================
    // MAIN INJECTION LOGIC
    // ========================================
    
    function getIframeDocument() {
        const iframe = document.querySelector('iframe');
        if (!iframe) {
            console.log('[Hydra Departure] No iframe found');
            return null;
        }
        try {
            // Try multiple ways to access iframe
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (doc && doc.body) {
                return doc;
            }
            // If iframe hasn't loaded yet, wait for it
            if (iframe.contentWindow) {
                return iframe.contentWindow.document;
            }
            return null;
        } catch (e) {
            console.error('[Hydra Departure] Cannot access iframe:', e.message);
            return null;
        }
    }

    let isProcessing = false;
    
    function addDepartureColumn() {
        if (isProcessing) return false;
        isProcessing = true;
        
        try {
            const iframeDoc = getIframeDocument();
            if (!iframeDoc) {
                console.log('[Hydra Departure] Iframe not accessible');
                return false;
            }

            // Find header row - look for elements containing "Trailer" and "Dwell Time"
            const headerElements = Array.from(iframeDoc.querySelectorAll('*')).filter(el => {
                const text = (el.textContent || el.innerText || '').trim();
                return text === 'Trailer' || text === 'Dwell Time';
            });

            if (headerElements.length < 2) {
                console.log('[Hydra Departure] Header not found, found:', headerElements.length);
                return false;
            }

            // Find common parent of header elements
            let headerParent = headerElements[0].parentElement;
            let attempts = 0;
            while (headerParent && attempts < 10) {
                const children = Array.from(headerParent.children || []);
                const hasTrailer = children.some(c => {
                    const text = (c.textContent || c.innerText || '').trim();
                    return text.includes('Trailer');
                });
                const hasDwell = children.some(c => {
                    const text = (c.textContent || c.innerText || '').trim();
                    return text.includes('Dwell Time');
                });
                if (hasTrailer && hasDwell) break;
                headerParent = headerParent.parentElement;
                attempts++;
            }

            if (!headerParent) {
                console.log('[Hydra Departure] Header parent not found');
                return false;
            }

            // Add "Depart" header if it doesn't exist
            if (!headerParent.querySelector('.departure-col-header')) {
                const headerChildren = Array.from(headerParent.children);
                const lastHeader = headerChildren[headerChildren.length - 1];
                const departHeader = document.createElement(lastHeader.tagName);
                departHeader.className = 'departure-col-header departure-col';
                departHeader.style.cssText = `
                    padding: 8px 12px;
                    font-weight: bold;
                    text-align: center;
                    min-width: 120px;
                    white-space: nowrap;
                    color: inherit;
                `;
                departHeader.textContent = 'Depart';
                headerParent.appendChild(departHeader);
            }

            // Find all trailer buttons/items - try both ION-BUTTON and regular button, and also ION-ITEM
            const allElements = Array.from(iframeDoc.querySelectorAll('ion-button, button, ion-item'));
            const trailerElements = allElements.filter(el => {
                const text = (el.textContent || el.innerText || '').trim();
                // Match trailer patterns: FEDEX..., TRUCK..., TRK..., T4-..., GDC destinations, etc.
                const isTrailer = /^(FEDEX|TRUCK\d+|TRK\d+|T\d+-|LOCKPORT|TAMPA|TILBURG|GREENVILLE|SCARBOROUGH|DGUPS|HVBODFL)/i.test(text) && text.length > 5 && text.length < 100;
                return isTrailer;
            });

            if (trailerElements.length === 0) {
                console.log('[Hydra Departure] No trailer elements found');
                return false;
            }

            console.log(`[Hydra Departure] Found ${trailerElements.length} trailer elements`);

            // Process each trailer element/row
            trailerElements.forEach(trailerElement => {
                // Skip if already processed
                if (trailerElement.dataset.departureProcessed === 'true') return;

                // Find parent row container (ION-ITEM or similar)
                let rowParent = trailerElement.closest('ion-item') || trailerElement.parentElement;
                attempts = 0;
                while (rowParent && attempts < 10) {
                    const siblings = Array.from(rowParent.children || []);
                    const hasDwellTime = siblings.some(s => {
                        const text = (s.textContent || s.innerText || '').trim();
                        return /\d+d|\d+h|\d+m/.test(text);
                    });
                    if (siblings.length >= 2 && hasDwellTime) break;
                    rowParent = rowParent.parentElement;
                    attempts++;
                    if (!rowParent || rowParent.tagName === 'BODY') break;
                }

                if (!rowParent) {
                    rowParent = trailerElement.parentElement;
                }

                // Check if departure column already exists
                if (rowParent.querySelector('.departure-col-data')) return;

                // Get trailer name from element or its children
                let trailerName = (trailerElement.textContent || trailerElement.innerText || '').trim();
                // If empty, try finding text in child elements
                if (!trailerName || trailerName.length < 5) {
                    const label = trailerElement.querySelector('ion-label, span, div');
                    if (label) trailerName = (label.textContent || label.innerText || '').trim();
                }
                const routeNum = extractRouteNumber(trailerName);
                const schedule = routeNum ? DEPARTURE_SCHEDULE[routeNum] : null;
                const departTime = schedule ? schedule.depart : null;
                
                // Debug logging
                if (trailerName && (trailerName.includes('LOCKPORT') || trailerName.includes('SCARBOROUGH') || trailerName.includes('TAMPA') || trailerName.includes('TILBURG') || trailerName.includes('GREENVILLE'))) {
                    console.log(`[Hydra Departure] Trailer: ${trailerName}, Route: ${routeNum}, Schedule:`, schedule ? 'Found' : 'Not found', 'Depart:', departTime);
                }

                // Create departure cell
                const departCell = document.createElement('div');
                departCell.className = 'departure-col-data departure-col';
                departCell.dataset.routeNum = routeNum || 'unknown';

                if (departTime) {
                    const color = getUrgencyColor(departTime);
                    const timeUntil = formatTimeUntil(departTime);
                    
                    departCell.style.cssText = `
                        padding: 8px 12px;
                        text-align: center;
                        font-weight: bold;
                        color: white;
                        background-color: ${color};
                        border-radius: 4px;
                        font-size: 14px;
                        white-space: nowrap;
                        min-width: 120px;
                    `;
                    departCell.innerHTML = `${departTime}<br><small style="font-size: 11px;">${timeUntil}</small>`;
                    
                    if (schedule) {
                        const routeLabel = ['LOCKPORT', 'TAMPA', 'TILBURG', 'GREENVILLE', 'SCARBOROUGH', 'INTERNATIONAL', 'NON MILK RUN'].includes(routeNum) 
                            ? routeNum 
                            : `MILKRUN ${routeNum}`;
                        departCell.title = `Route: ${routeLabel}\nPick: ${schedule.pick}\nPack: ${schedule.pack}\nLoad: ${schedule.load}\nClose: ${schedule.close}\nDepart: ${schedule.depart}`;
                    }
                } else {
                    departCell.style.cssText = `
                        padding: 8px 12px;
                        text-align: center;
                        color: ${STYLES.colors.unknown};
                        font-style: italic;
                        white-space: nowrap;
                        min-width: 120px;
                    `;
                    departCell.textContent = routeNum ? 'Not scheduled' : '—';
                    departCell.title = trailerName ? `Trailer: ${trailerName}` : '';
                }

                rowParent.appendChild(departCell);
                trailerElement.dataset.departureProcessed = 'true';
            });

            return true;
        } catch (error) {
            console.error('[Hydra Departure] Error adding column:', error);
            return false;
        } finally {
            isProcessing = false;
        }
    }

    function updateDepartureCells() {
        const iframeDoc = getIframeDocument();
        if (!iframeDoc) return;

        iframeDoc.querySelectorAll('.departure-col-data').forEach(cell => {
            const routeNum = cell.dataset.routeNum;
            if (!routeNum || routeNum === 'unknown') return;
            
            const schedule = DEPARTURE_SCHEDULE[routeNum];
            if (!schedule || !schedule.depart) return;
            
            const departTime = schedule.depart;
            const color = getUrgencyColor(departTime);
            const timeUntil = formatTimeUntil(departTime);
            
            cell.style.backgroundColor = color;
            cell.innerHTML = `${departTime}<br><small style="font-size: 11px;">${timeUntil}</small>`;
        });
    }

    function addInfoPanel() {
        const iframeDoc = getIframeDocument();
        if (!iframeDoc) return;
        
        if (iframeDoc.querySelector('#departure-info-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'departure-info-panel';
        panel.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 12px 16px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 99999;
            font-family: Arial, sans-serif;
            font-size: 12px;
            min-width: 200px;
        `;

        const updateTime = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            panel.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">
                    🕐 ${timeStr}
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <span style="display: flex; align-items: center; gap: 6px;">
                        <span style="width: 16px; height: 16px; background: ${STYLES.colors.urgent}; border-radius: 2px; display: inline-block;"></span>
                        &lt;30m (Urgent)
                    </span>
                    <span style="display: flex; align-items: center; gap: 6px;">
                        <span style="width: 16px; height: 16px; background: ${STYLES.colors.warning}; border-radius: 2px; display: inline-block;"></span>
                        &lt;1h (Warning)
                    </span>
                    <span style="display: flex; align-items: center; gap: 6px;">
                        <span style="width: 16px; height: 16px; background: ${STYLES.colors.normal}; border-radius: 2px; display: inline-block;"></span>
                        &gt;1h (Normal)
                    </span>
                </div>
                <div style="margin-top: 8px; color: #666; font-size: 10px; border-top: 1px solid #eee; padding-top: 8px;">
                    Hover over departure time for full schedule
                </div>
            `;
        };

        updateTime();
        setInterval(updateTime, 1000);

        // Add to main document body (not iframe) so it's always visible
        document.body.appendChild(panel);
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    
    let observer = null;
    let refreshInterval = null;
    
    function initialize() {
        console.log('[Hydra Departure] Initializing...');
        
        // Add info panel to main document
        addInfoPanel();
        
        function tryAddColumn(retries = 20) {
            if (retries <= 0) {
                console.log('[Hydra Departure] Max retries reached');
                return;
            }
            
            console.log(`[Hydra Departure] Attempting to add column, retries left: ${retries}`);
            const result = addDepartureColumn();
            
            if (result) {
                console.log('[Hydra Departure] Column added successfully!');
                // Verify it was actually added
                setTimeout(() => {
                    const iframeDoc = getIframeDocument();
                    if (iframeDoc) {
                        const cols = iframeDoc.querySelectorAll('.departure-col-data').length;
                        const headers = iframeDoc.querySelectorAll('.departure-col-header').length;
                        console.log(`[Hydra Departure] Verification: ${cols} columns, ${headers} headers`);
                    }
                }, 1000);
            } else {
                console.log(`[Hydra Departure] Failed to add column, retrying in 1 second...`);
                setTimeout(() => tryAddColumn(retries - 1), 1000);
            }
        }
        
        // Wait a bit longer before first attempt
        setTimeout(() => {
            tryAddColumn();
        }, 1000);
        
        // Set up mutation observer on iframe content
        function setupObserver() {
            const iframeDoc = getIframeDocument();
            if (iframeDoc && iframeDoc.body) {
                console.log('[Hydra Departure] Setting up mutation observer');
                let mutationTimeout = null;
                observer = new MutationObserver((mutations) => {
                    const hasRelevantChanges = mutations.some(mutation => {
                        const target = mutation.target;
                        // Check if buttons or rows were added/changed
                        if (mutation.addedNodes.length > 0) {
                            return Array.from(mutation.addedNodes).some(node => {
                                if (node.nodeType !== 1) return false;
                                const text = (node.textContent || node.innerText || '').trim();
                                return node.tagName === 'ION-BUTTON' || 
                                       node.tagName === 'ION-ITEM' ||
                                       node.tagName === 'BUTTON' || 
                                       node.querySelector('ion-button, ion-item, button') ||
                                       /^(FEDEX|TRUCK\d+|TRK\d+|T\d+-)/i.test(text);
                            });
                        }
                        return false;
                    });
                    
                    if (hasRelevantChanges) {
                        clearTimeout(mutationTimeout);
                        mutationTimeout = setTimeout(() => {
                            console.log('[Hydra Departure] Detected changes, re-running addDepartureColumn');
                            // Reset processed flags for new elements
                            const iframeDoc2 = getIframeDocument();
                            if (iframeDoc2) {
                                iframeDoc2.querySelectorAll('[data-departure-processed]').forEach(el => {
                                    delete el.dataset.departureProcessed;
                                });
                                addDepartureColumn();
                            }
                        }, 500);
                    }
                });
                
                observer.observe(iframeDoc.body, {
                    childList: true,
                    subtree: true
                });
            } else {
                // Retry setting up observer if iframe not ready
                setTimeout(setupObserver, 2000);
            }
        }
        
        setupObserver();
        
        // Refresh colors/times periodically
        refreshInterval = setInterval(() => {
            updateDepartureCells();
        }, 30000);
        
        console.log('[Hydra Departure] Initialized successfully!');
    }

    function start() {
        console.log('[Hydra Departure] Script started, readyState:', document.readyState);
        
        let initialized = false;
        
        function initializeOnce() {
            if (initialized) return;
            initialized = true;
            initialize();
        }
        
        // Wait for iframe to load - more aggressive retry for Tampermonkey
        function waitForIframe(retries = 40) {
            const iframe = document.querySelector('iframe');
            console.log('[Hydra Departure] Checking iframe, attempt:', 41 - retries, 'iframe found:', !!iframe);
            
            if (iframe) {
                try {
                    // Check if iframe has loaded
                    if (iframe.contentWindow && iframe.contentWindow.document) {
                        const iframeDoc = getIframeDocument();
                        if (iframeDoc && iframeDoc.body) {
                            // Check if content is actually loaded (has buttons)
                            const buttons = iframeDoc.querySelectorAll('button, ion-button');
                            console.log('[Hydra Departure] Iframe accessible, buttons found:', buttons.length);
                            
                            if (buttons.length > 0) {
                                console.log('[Hydra Departure] Content loaded, initializing...');
                                // Wait a bit more for content to fully render
                                setTimeout(() => {
                                    initializeOnce();
                                }, 3000);
                                return;
                            } else {
                                console.log('[Hydra Departure] Iframe accessible but content not loaded yet');
                            }
                        } else {
                            console.log('[Hydra Departure] Iframe found but body not ready');
                        }
                    } else {
                        console.log('[Hydra Departure] Iframe found but contentWindow not ready');
                    }
                } catch (e) {
                    console.log('[Hydra Departure] Error accessing iframe:', e.message);
                }
            }
            
            if (retries > 0) {
                setTimeout(() => waitForIframe(retries - 1), 1000);
            } else {
                console.error('[Hydra Departure] Failed to access iframe after all retries');
            }
        }
        
        // Listen for iframe load event specifically
        function setupIframeListener() {
            const iframe = document.querySelector('iframe');
            if (iframe) {
                iframe.addEventListener('load', () => {
                    console.log('[Hydra Departure] Iframe load event fired');
                    setTimeout(() => {
                        waitForIframe(10);
                    }, 2000);
                });
            } else {
                // Retry if iframe not found yet
                setTimeout(setupIframeListener, 500);
            }
        }
        
        // Try multiple strategies to ensure we catch the iframe
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('[Hydra Departure] DOMContentLoaded fired');
                setupIframeListener();
                setTimeout(waitForIframe, 2000);
            });
        } else {
            console.log('[Hydra Departure] Document already loaded');
            setupIframeListener();
            setTimeout(waitForIframe, 2000);
        }
        
        // Also listen for window load event
        window.addEventListener('load', () => {
            console.log('[Hydra Departure] Window load event fired');
            setupIframeListener();
            setTimeout(waitForIframe, 3000);
        });
        
        // Start checking immediately as well
        setTimeout(() => {
            setupIframeListener();
            waitForIframe();
        }, 1000);
    }
    
    start();

})();
