/* ========================================
   WCSH CPD CENTER - EVENTS JAVASCRIPT
   Google Sheets Integration for Dynamic Events
   Email: cpdwcsh@gmail.com
   ======================================== */

// ========================================
// CONFIGURATION
// ========================================

// 👇 REPLACE THIS WITH YOUR PUBLISHED GOOGLE SHEET CSV URL
const EVENTS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQxYjInkJIPzVE6EloVmtN2Kdf4rnx6JUmschJVSk0iIC8hrPa5PNZhmA1VkIBPJu9TQLXjOmZc_qmR/pub?gid=0&single=true&output=csv';

// Instructions:
// 1. Create a Google Sheet with columns: Event Date | Event Title | Event Description | Event Category | Month | Year | Number of Trainees | Participants | Venue
// 2. File → Share → Publish to web → Select sheet → CSV format → Publish
// 3. Copy the URL and replace 'YOUR_PUBLISHED_EVENTS_CSV_URL' above
//
// DATE FORMAT TIPS:
// - Use format: YYYY-MM-DD (e.g., 2026-03-15)
// - Or use: MM/DD/YYYY (e.g., 03/15/2026)
// - Or use: DD/MM/YYYY (e.g., 15/03/2026)
// - Google Sheets date cells work automatically

// ========================================
// LOAD EVENTS ON PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Only run on events.html page
    const eventsContainer = document.getElementById('eventsContainer');
    if (!eventsContainer) return;
    
    loadEventsFromGoogleSheets();
});

// ========================================
// LOAD EVENTS FROM GOOGLE SHEETS
// ========================================

async function loadEventsFromGoogleSheets() {
    const eventsContainer = document.getElementById('eventsContainer');
    const noEventsMessage = document.getElementById('noEventsMessage');
    
    // Show loading message
    eventsContainer.innerHTML = '<div style="text-align: center; padding: 3rem; color: #6B7280;"><p>Loading events...</p></div>';
    
    // Check if URL is configured
    if (EVENTS_CSV_URL === 'YOUR_PUBLISHED_EVENTS_CSV_URL') {
        eventsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: #FEF3C7; border-radius: 16px; border-left: 4px solid #F59E0B;">
                <h3 style="color: #92400E; margin-bottom: 1rem;">⚠️ Events Google Sheet Not Configured</h3>
                <p style="color: #78350F; margin-bottom: 1.5rem;">
                    The CPD Director needs to set up the Events Google Sheet to display upcoming events here.
                </p>
                <div style="text-align: left; max-width: 600px; margin: 0 auto; background: white; padding: 1.5rem; border-radius: 12px;">
                    <h4 style="color: #1F2937; margin-bottom: 1rem;">Setup Instructions:</h4>
                    <ol style="color: #6B7280; margin-left: 1.5rem;">
                        <li style="margin-bottom: 0.75rem;">Create a Google Sheet named "WCSH CPD Events"</li>
                        <li style="margin-bottom: 0.75rem;">Add columns: <strong>Event Date | Event Title | Event Description | Event Category | Month | Year | Number of Trainees | Participants | Venue</strong></li>
                        <li style="margin-bottom: 0.75rem;">Add your events data</li>
                        <li style="margin-bottom: 0.75rem;">File → Share → Publish to web → Select sheet → CSV format → Publish</li>
                        <li style="margin-bottom: 0.75rem;">Copy the CSV URL</li>
                        <li style="margin-bottom: 0.75rem;">Open <code>assets/js/events.js</code> and replace the URL on line 11</li>
                    </ol>
                </div>
            </div>
        `;
        return;
    }
    
    try {
        // Fetch CSV data from Google Sheets
        const response = await fetch(EVENTS_CSV_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        
        const csvText = await response.text();
        
        // Parse CSV (using simple parsing - you can use PapaParse library for complex CSV)
        const events = parseCSV(csvText);
        
        if (events.length === 0) {
            noEventsMessage.style.display = 'block';
            eventsContainer.innerHTML = '';
            return;
        }
        
        // Group events by month
        const eventsByMonth = groupEventsByMonth(events);
        
        // Render events
        renderEvents(eventsByMonth);
        
    } catch (error) {
        console.error('Error loading events:', error);
        eventsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: #FEE2E2; border-radius: 16px; border-left: 4px solid #EF4444;">
                <h3 style="color: #991B1B; margin-bottom: 1rem;">❌ Error Loading Events</h3>
                <p style="color: #7F1D1D;">Could not load events from Google Sheets. Please check:</p>
                <ul style="color: #7F1D1D; text-align: left; max-width: 500px; margin: 1rem auto;">
                    <li>Google Sheet is published to web</li>
                    <li>CSV URL is correct in events.js</li>
                    <li>Sheet has the correct column names</li>
                    <li>Internet connection is working</li>
                </ul>
                <p style="color: #7F1D1D; margin-top: 1.5rem;">
                    <strong>Contact:</strong> cpdwcsh@gmail.com | +251-91-615-4691
                </p>
            </div>
        `;
    }
}

// ========================================
// PARSE CSV DATA
// ========================================

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const events = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        const event = {};
        
        headers.forEach((header, index) => {
            event[header] = values[index] || '';
        });
        
        // Only add events with required fields
        if (event['Event Title'] && event['Event Date']) {
            events.push(event);
        }
    }
    
    return events;
}

// ========================================
// GROUP EVENTS BY MONTH
// ========================================

function groupEventsByMonth(events) {
    const grouped = {};
    
    events.forEach(event => {
        const month = event.Month || '';
        const year = event.Year || '';
        const key = `${month} ${year}`;
        
        if (!grouped[key]) {
            grouped[key] = [];
        }
        
        grouped[key].push(event);
    });
    
    return grouped;
}

// ========================================
// RENDER EVENTS
// ========================================

function renderEvents(eventsByMonth) {
    const eventsContainer = document.getElementById('eventsContainer');
    let html = '';
    
    Object.keys(eventsByMonth).forEach(monthYear => {
        const events = eventsByMonth[monthYear];
        
        html += `
            <div class="month-section" style="margin-bottom: 4rem;">
                <h2 style="color: #1F2937; font-size: 2rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 3px solid #3B82F6;">
                    📅 ${monthYear}
                </h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
        `;
        
        events.forEach(event => {
            html += createEventCard(event);
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    eventsContainer.innerHTML = html;
}

// ========================================
// CREATE EVENT CARD HTML
// ========================================

function createEventCard(event) {
    const title = event['Event Title'] || 'Untitled Event';
    const description = event['Event Description'] || 'No description available';
    const category = event['Event Category'] || 'General';
    const date = event['Event Date'] || '';
    const numberOfTrainees = event['Number of Trainees'] || '';
    const participants = event['Participants'] || '';
    const venue = event['Venue'] || '';
    
    // Format date
    let formattedDate = '';
    if (date) {
        try {
            // Handle different date formats
            let dateObj;
            
            // Check if it's already in a standard format
            if (date.includes('/') || date.includes('-')) {
                dateObj = new Date(date);
            } else {
                // Try parsing as is
                dateObj = new Date(date);
            }
            
            // Check if date is valid
            if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                });
            } else {
                // If parsing failed, just use the original date string
                formattedDate = date;
            }
        } catch (e) {
            // If all else fails, use the original date string
            formattedDate = date;
        }
    }
    
    return `
        <div style="background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08); border: 2px solid #E5E7EB; transition: all 0.3s ease;" 
             onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 30px rgba(59, 130, 246, 0.2)'; this.style.borderColor='#3B82F6';"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 12px rgba(0, 0, 0, 0.08)'; this.style.borderColor='#E5E7EB';">
            
            <div style="margin-bottom: 1rem;">
                <span style="display: inline-block; background: #EFF6FF; color: #3B82F6; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700;">
                    ${category}
                </span>
            </div>
            
            <h3 style="color: #1F2937; font-size: 1.25rem; margin-bottom: 0.75rem; font-weight: 800;">
                ${title}
            </h3>
            
            <p style="color: #6B7280; font-size: 0.95rem; margin-bottom: 1rem; line-height: 1.6;">
                ${description}
            </p>
            
            ${formattedDate ? `
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #6B7280; font-size: 0.9rem; margin-bottom: 0.5rem;">
                    <span>📅</span>
                    <span style="font-weight: 600;">${formattedDate}</span>
                </div>
            ` : ''}
            
            ${venue ? `
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #6B7280; font-size: 0.9rem; margin-bottom: 0.5rem;">
                    <span>📍</span>
                    <span style="font-weight: 600;">${venue}</span>
                </div>
            ` : ''}
            
            ${participants ? `
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #6B7280; font-size: 0.9rem; margin-bottom: 0.5rem;">
                    <span>👥</span>
                    <span style="font-weight: 600;">Participants: ${participants}</span>
                </div>
            ` : ''}
            
            ${numberOfTrainees ? `
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #6B7280; font-size: 0.9rem; margin-bottom: 1rem;">
                    <span>🎓</span>
                    <span style="font-weight: 600;">Trainees: ${numberOfTrainees}</span>
                </div>
            ` : ''}
            
            <button onclick="alert('Registration: Please contact CPD Office\\n\\nEmail: cpdwcsh@gmail.com\\nPhone: +251-91-615-4691')" 
                    style="width: 100%; padding: 0.75rem; background: linear-gradient(135deg, #F97316, #EA580C); color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 1rem; transition: all 0.3s ease;"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(249, 115, 22, 0.4)';"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                Register Now
            </button>
        </div>
    `;
}

// ========================================
// FALLBACK: LOAD EXAMPLE EVENTS (if no Google Sheet)
// ========================================

function loadExampleEvents() {
    const exampleEvents = [
        {
            'Event Date': '2026-03-15',
            'Event Title': 'Advanced Emergency Medicine Workshop',
            'Event Description': 'Comprehensive training on emergency care protocols, trauma management, and critical interventions.',
            'Event Category': 'Clinical CPD',
            'Month': 'March',
            'Year': '2026'
        },
        {
            'Event Date': '2026-03-22',
            'Event Title': 'Quality Improvement Symposium',
            'Event Description': 'Learn quality metrics, patient safety protocols, and continuous improvement methodologies.',
            'Event Category': 'Quality Improvement',
            'Month': 'March',
            'Year': '2026'
        },
        {
            'Event Date': '2026-04-10',
            'Event Title': 'Maternal Health Best Practices',
            'Event Description': 'Evidence-based maternal health protocols and obstetric emergency management.',
            'Event Category': 'Clinical CPD',
            'Month': 'April',
            'Year': '2026'
        }
    ];
    
    const eventsByMonth = groupEventsByMonth(exampleEvents);
    renderEvents(eventsByMonth);
}

// ========================================
// UPDATE HOME PAGE UPCOMING EVENTS (if needed)
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const upcomingEventsHome = document.getElementById('upcomingEventsHome');
    
    if (upcomingEventsHome && EVENTS_CSV_URL !== 'YOUR_PUBLISHED_EVENTS_CSV_URL') {
        // Load first 3 events for home page preview
        loadHomePageEvents();
    }
});

async function loadHomePageEvents() {
    try {
        const response = await fetch(EVENTS_CSV_URL);
        if (!response.ok) return;
        
        const csvText = await response.text();
        const events = parseCSV(csvText);
        
        // Take first 3 upcoming events
        const upcomingEvents = events.slice(0, 3);
        
        const upcomingEventsHome = document.getElementById('upcomingEventsHome');
        let html = '';
        
        upcomingEvents.forEach(event => {
            html += createEventCard(event);
        });
        
        upcomingEventsHome.innerHTML = html;
        
    } catch (error) {
        console.log('Could not load home page events:', error);
    }
}

// ========================================
// END OF EVENTS.JS
// ========================================