/**
 * UNIVERSITY DEPARTMENTAL SERVER - UNIPORTAL BACKEND
 * --------------------------------------------------
 * Vulnerability: CWE-682 (Incorrect Calculation)
 * Features: Shared State for Real-time Demo
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 8081; // Using 8081 to avoid "Address in use" errors

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- MOCK DATABASE ---
const currentUser = {
    id: "80055123",
    name: "Alex Candidate",
    major: "Computer Science",
    credits: 16,
    tuitionRate: 550.00
};

const courses = [
    { code: "CS404", name: "Network Security", credits: 4, prof: "Dr. Smith" },
    { code: "CS405", name: "Operating Systems", credits: 4, prof: "Dr. Jones" },
    { code: "MATH301", name: "Linear Algebra", credits: 3, prof: "Dr. White" },
    { code: "PHYS101", name: "Physics I", credits: 4, prof: "Dr. Brown" },
    { code: "ART101", name: "Art History", credits: 1, prof: "Dr. Green" }
];

// --- SHARED STATE (For the Magic Demo) ---
// This variable remembers the last calculation anyone performed.
let latestBillState = {
    total: 0,
    breakdown: { tuition: 0, parking: 0, gym: 0, donation: 0 }
};

// --- API ENDPOINTS ---

app.get('/api/user', (req, res) => res.json(currentUser));
app.get('/api/courses', (req, res) => res.json(courses));

// NEW: Endpoint for Browser to check status
app.get('/api/bill-status', (req, res) => {
    res.json(latestBillState);
});

// VULNERABLE BILLING ENDPOINT
app.post('/api/calculate', (req, res) => {
    console.log(`[LOG] Billing Request from IP: ${req.ip}`);

    let parkingQty = parseInt(req.body.parking);
    let gymAccess = parseInt(req.body.gym);
    let donation = parseInt(req.body.donation);

    const PARKING_PRICE = 150.00;
    const GYM_PRICE = 50.00;
    
    let tuition = currentUser.credits * currentUser.tuitionRate;

    // --- VULNERABLE LOGIC START ---
    // CWE-682: No check for negative numbers.
    let parkingCost = parkingQty * PARKING_PRICE;
    let gymCost = gymAccess * GYM_PRICE;
    
    let totalBill = tuition + parkingCost + gymCost + donation;
    // --- VULNERABLE LOGIC END ---

    // UPDATE SHARED STATE
    latestBillState = {
        total: totalBill,
        breakdown: {
            tuition: tuition,
            parking: parkingCost,
            gym: gymCost,
            donation: donation
        }
    };

    console.log(`Total Bill: ${totalBill}`);

    res.json({
        success: true,
        breakdown: latestBillState.breakdown,
        total: totalBill
    });
});

app.listen(PORT, () => {
    console.log(`\nServer Online on port ${PORT}`);
});