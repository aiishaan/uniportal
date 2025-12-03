// public/app.js

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadCourses();
    
    // MAGIC DEMO: Poll server every 1.5 seconds
    setInterval(checkForUpdates, 1500);
});

async function loadProfile() {
    const res = await fetch('/api/user');
    const data = await res.json();
    document.getElementById('studentName').innerText = data.name;
    document.getElementById('studentId').innerText = data.id;
    document.getElementById('creditCount').innerText = data.credits;
}

async function loadCourses() {
    const res = await fetch('/api/courses');
    const courses = await res.json();
    const table = document.getElementById('courseTable');
    table.innerHTML = ""; // Clear existing
    courses.forEach(c => {
        let row = `<tr>
            <td>${c.code}</td>
            <td>${c.name}</td>
            <td>${c.prof}</td>
            <td>${c.credits}</td>
        </tr>`;
        table.innerHTML += row;
    });
}

// User clicks button
async function calculateBill() {
    const parking = document.getElementById('parkingInput').value;
    const gym = document.getElementById('gymInput').value;
    const donation = document.getElementById('donationInput').value;

    await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parking, gym, donation })
    });
    
    // We don't need to manually update UI here, 
    // the checkForUpdates() function will catch it in < 1.5s
    checkForUpdates();
}

// The Polling Function
async function checkForUpdates() {
    try {
        const res = await fetch('/api/bill-status');
        const data = await res.json();
        
        // Update UI
        document.getElementById('tuitionCost').innerText = formatMoney(data.breakdown.tuition);
        document.getElementById('parkingCost').innerText = formatMoney(data.breakdown.parking);
        document.getElementById('totalCost').innerText = formatMoney(data.total);
        
        // Visual Alert Logic
        const totalBox = document.getElementById('totalBox');
        if(data.total < 0) {
            totalBox.style.backgroundColor = "#e74c3c"; // Red
            if(!totalBox.innerHTML.includes("CREDIT")) {
                 totalBox.innerHTML += "<br><small>(CREDIT OWED TO STUDENT)</small>";
            }
        } else {
            totalBox.style.backgroundColor = "#27ae60"; // Green
            // Clean up the text if we go back to positive
             const smallTag = totalBox.querySelector('small');
             if(smallTag) smallTag.remove();
        }
    } catch (e) {
        console.log("Polling error", e);
    }
}

function formatMoney(amount) {
    if(amount === undefined) return "$0.00";
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}