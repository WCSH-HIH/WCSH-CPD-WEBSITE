/* ========================================
   CEU DASHBOARD JAVASCRIPT
   Reads from published Google Sheet
   Email: cpdwcsh@gmail.com
   ======================================== */

// ========================================
// CONFIGURATION
// ========================================
// 👇 REPLACE WITH YOUR PUBLISHED GOOGLE SHEET CSV URL
const PUBLISHED_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRSXHF8jK8T56O3KocsSSom5yw2F5F8jf2z9IfUBBgTOwEsEF161IO7WTP7UCPxnMnb-clezyY1FJYX/pub?gid=1046381608&single=true&output=csv';

let currentUserPhone = '';
let allData = [];

// ========================================
// LOAD CEU DASHBOARD
// ========================================
async function loadCEUDashboard() {
    const phone = document.getElementById('searchInput').value.trim();
    
    if (!phone) {
        alert('Please enter your phone number');
        return;
    }
    
    // Normalize phone number (remove spaces, dashes, etc.)
    const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (normalizedPhone.length < 9) {
        alert('Please enter a valid phone number');
        return;
    }
    
    currentUserPhone = normalizedPhone;
    
    // Show loading
    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('debugInfo').style.display = 'none';
    
    // Check if URL is configured
    if (PUBLISHED_CSV_URL === 'YOUR_PUBLISHED_CSV_URL_HERE') {
        showDebugInfo('❌ Google Sheet not configured yet!<br><br>' +
            '<strong>Setup Steps:</strong><br>' +
            '1. Create Google Form with these fields:<br>' +
            '   - Staff Full Name<br>' +
            '   - Staff Phone Number<br>' +
            '   - Topic<br>' +
            '   - Activity type<br>' +
            '   - CEU<br>' +
            '   - Training Date<br>' +
            '   - code<br><br>' +
            '2. Open the Form Responses Google Sheet<br>' +
            '3. Add a new column at the END called "Status"<br>' +
            '4. File → Share → Publish to web → Select your sheet → CSV<br>' +
            '5. Copy the CSV URL and paste in assets/js/ceu-dashboard.js (line 11)<br><br>' +
            '<strong>Note:</strong> CPD head will manually type "Verified" in Status column to approve submissions');
        document.getElementById('loadingMessage').style.display = 'none';
        return;
    }
    
    try {
        // Fetch data from Google Sheets
        const response = await fetch(PUBLISHED_CSV_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        
        console.log('CSV Response received, length:', csvText.length);
        
        // Parse CSV
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                console.log('Parsed rows:', results.data.length);
                console.log('Sample row:', results.data[0]);
                allData = results.data;
                processUserData(normalizedPhone);
            },
            error: function(error) {
                console.error('Parse error:', error);
                showDebugInfo('❌ Error parsing CSV data:<br>' + error.message);
                document.getElementById('loadingMessage').style.display = 'none';
            }
        });
        
    } catch (error) {
        console.error('Error loading data:', error);
        showDebugInfo('❌ Error loading data:<br><br>' +
            '<strong>Possible issues:</strong><br>' +
            '• Check your internet connection<br>' +
            '• Make sure the Google Sheet is published to web<br>' +
            '• Verify the CSV URL is correct<br>' +
            '• Try opening the CSV URL in a new tab to test<br><br>' +
            '<strong>Error details:</strong> ' + error.message);
        document.getElementById('loadingMessage').style.display = 'none';
    }
}

// ========================================
// PROCESS USER DATA
// ========================================
function processUserData(userPhone) {
    document.getElementById('loadingMessage').style.display = 'none';
    
    console.log('Processing data for phone:', userPhone);
    console.log('Total rows:', allData.length);
    
    // DEBUG: Show all column names
    if (allData.length > 0) {
        const columnNames = Object.keys(allData[0]);
        console.log('=== COLUMN NAMES IN YOUR SHEET ===');
        columnNames.forEach((name, index) => {
            console.log(`Column ${index + 1}: "${name}"`);
        });
        console.log('=================================');
    }
    
    // Helper function to find column value with multiple possible names
    function getColumnValue(row, possibleNames) {
        // First try exact match
        for (let name of possibleNames) {
            if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
                return row[name];
            }
        }
        
        // Then try trimmed match (in case of extra spaces)
        const rowKeys = Object.keys(row);
        for (let name of possibleNames) {
            const trimmedName = name.trim();
            for (let key of rowKeys) {
                if (key.trim() === trimmedName && row[key] !== undefined && row[key] !== null && row[key] !== '') {
                    return row[key];
                }
            }
        }
        
        return '';
    }
    
    // Normalize phone function
    function normalizePhone(phone) {
        if (!phone) return '';
        return phone.toString().replace(/[\s\-\(\)\+]/g, '');
    }
    
    // Filter data for this user
    const userSubmissions = allData.filter(row => {
        const rowPhone = normalizePhone(getColumnValue(row, [
            'Phone Number',      // Your exact column name
            ' Phone Number',
            'Phone Number ',
            'Phone', 
            'Mobile'
        ]));
        
        const searchPhone = normalizePhone(userPhone);
        
        // Match last 9 digits to handle +251 prefix variations
        const rowLast9 = rowPhone.slice(-9);
        const searchLast9 = searchPhone.slice(-9);
        
        return rowLast9 === searchLast9 && rowLast9.length === 9;
    });
    
    console.log('User submissions found:', userSubmissions.length);
    
    if (userSubmissions.length === 0) {
        showDebugInfo('⚠️ No records found for phone: ' + userPhone + '<br><br>' +
            '<strong>Make sure:</strong><br>' +
            '• You used the correct phone number when submitting<br>' +
            '• Your phone column is named "Phone Number" or "Phone"<br>' +
            '• Total rows in sheet: ' + allData.length + '<br>' +
            '• Sample phone from sheet: ' + (allData[0] ? getColumnValue(allData[0], ['Phone Number', 'Phone']) : 'N/A'));
        
        showNoData();
        return;
    }
    
    // Separate verified and pending
    const verified = userSubmissions.filter(row => {
        const status = getColumnValue(row, ['Status', 'Verification Status']).trim().toLowerCase();
        return status === 'verified';
    });
    
    const pending = userSubmissions.filter(row => {
        const status = getColumnValue(row, ['Status', 'Verification Status']).trim().toLowerCase();
        return status !== 'verified';
    });
    
    console.log('Verified:', verified.length, 'Pending:', pending.length);
    
    if (verified.length === 0) {
        showDebugInfo('⏳ You have ' + userSubmissions.length + ' submission(s), but none are marked as "Verified" yet.<br><br>' +
            '<strong>Contact CPD Office:</strong><br>' +
            'Email: cpdwcsh@gmail.com<br>' +
            'Phone: +251-91-615-4691');
        
        showNoData();
        return;
    }
    
    // Calculate totals
    let totalCredits = 0;
    const categoryTotals = {};
    
    verified.forEach(row => {
        // Try to find CEU column - your new column name is "CEU"
        const creditsStr = getColumnValue(row, [
            'CEU',               // Your new column name
            ' CEU',
            'CEU ',
            'Credits',
            'CEU Credits',
            'Number of CEU Credits'
        ]);
        
        console.log('CEU raw value:', creditsStr); // Debug
        
        const credits = parseFloat(creditsStr) || 0;
        
        // Try to find Activity Type column - your new column name is "Activity Type"
        const category = getColumnValue(row, [
            'Activity Type',     // Your new column name
            ' Activity Type',
            'Activity Type ',
            'Category',
            'Type',
            'Training Category'
        ]) || 'Other';
        
        console.log('Activity Type raw value:', category); // Debug
        console.log('Parsed CEU:', credits); // Debug
        
        totalCredits += credits;
        categoryTotals[category] = (categoryTotals[category] || 0) + credits;
    });
    
    console.log('Total CEU calculated:', totalCredits); // Debug
    console.log('Activity Type totals:', categoryTotals); // Debug
    
    // Get user name
    const userName = getColumnValue(verified[0] || userSubmissions[0], [
        'Name',              // Your column name
        ' Name',             // With space
        'Name ',             // With space
        'Staff Full Name',
        'Full Name', 
        'Staff Name'
    ]) || 'User';
    
    // Display dashboard
    displayDashboard(userName, totalCredits, verified.length, pending.length, categoryTotals, verified, getColumnValue);
}

// ========================================
// DISPLAY DASHBOARD
// ========================================
function displayDashboard(name, totalCredits, verifiedCount, pendingCount, categoryTotals, trainings, getColumnValue) {
    // Hide login, show dashboard
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('noDataMessage').style.display = 'none';
    document.getElementById('dashboardResults').style.display = 'block';
    
    // Set name
    document.getElementById('participantName').textContent = name.split(' ')[0];
    
    // Set totals
    document.getElementById('totalCredits').textContent = totalCredits.toFixed(1);
    document.getElementById('totalSubmissions').textContent = verifiedCount;
    document.getElementById('pendingCount').textContent = pendingCount;
    
    // Set last update
    if (trainings.length > 0) {
        const lastDate = getColumnValue(trainings[trainings.length - 1], ['Timestamp', 'Training Date', 'Date']) || 'N/A';
        try {
            document.getElementById('lastUpdate').textContent = new Date(lastDate).toLocaleDateString();
        } catch (e) {
            document.getElementById('lastUpdate').textContent = lastDate;
        }
    }
    
    // Display categories
    const categoryHTML = Object.entries(categoryTotals).map(([category, credits]) => `
        <div class="category-item">
            <span class="category-name">${category}</span>
            <span class="category-value">${credits.toFixed(1)}</span>
        </div>
    `).join('');
    document.getElementById('categoryBreakdown').innerHTML = categoryHTML || '<p>No categories yet</p>';
    
    // Display training history
    const historyHTML = trainings.reverse().map(row => {
        const trainingDate = getColumnValue(row, ['Date', 'Training Date', 'Timestamp']);
        const trainingTitle = getColumnValue(row, [
            'Topic',             // Your new column name
            ' Topic',
            'Topic ',
            'Training Title',
            'Title',
            'Training'
        ]) || 'N/A';
        
        const category = getColumnValue(row, [
            'Activity Type',     // Your new column name
            ' Activity Type',
            'Activity Type ',
            'Category',
            'Type',
            'Training Category'
        ]) || 'Other';
        
        const creditsStr = getColumnValue(row, [
            'CEU',               // Your new column name
            ' CEU',
            'CEU ',
            'Credits',
            'Number of CEU Credits',
            'CEU Credits'
        ]);
        
        console.log('Row data:', row); // Debug - show entire row
        console.log('CEU string found:', creditsStr); // Debug
        console.log('Activity Type found:', category); // Debug
        
        const credits = parseFloat(creditsStr) || 0;
        
        return `
        <tr>
            <td>${new Date(trainingDate).toLocaleDateString()}</td>
            <td>${trainingTitle}</td>
            <td>${category}</td>
            <td><strong>${credits.toFixed(1)}</strong></td>
            <td><span class="status-badge status-verified">✅ Verified</span></td>
        </tr>
    `}).join('');
    document.getElementById('trainingHistoryBody').innerHTML = historyHTML;
    
    // Set national system data
    document.getElementById('nationalTotalCredits').textContent = totalCredits.toFixed(1);
    document.getElementById('nationalEmailDisplay').textContent = currentUserPhone;
    
    // Scroll to top of dashboard
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// SHOW DEBUG INFO
// ========================================
function showDebugInfo(message) {
    document.getElementById('debugContent').innerHTML = message;
    document.getElementById('debugInfo').style.display = 'block';
}

function closeDebug() {
    document.getElementById('debugInfo').style.display = 'none';
}

// ========================================
// SHOW NO DATA
// ========================================
function showNoData() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardResults').style.display = 'none';
    document.getElementById('noDataMessage').style.display = 'block';
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function logout() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('dashboardResults').style.display = 'none';
    document.getElementById('noDataMessage').style.display = 'none';
    document.getElementById('searchInput').value = '';
    currentUserPhone = '';
}

function tryAgain() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('noDataMessage').style.display = 'none';
}

function printCredits() {
    window.print();
}

// ========================================
// ALLOW ENTER KEY TO SUBMIT
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('searchInput');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') loadCEUDashboard();
        });
    }
});