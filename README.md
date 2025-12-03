# UniPortal - Student Billing System
### Departmental Security Project | CWE-682 Demonstration

* **Course:** CS System Security
* **Vulnerability:** CWE-682 (Incorrect Calculation)
* **Port:** 8081

---

## 1. Project Overview
UniPortal is a mocked Student Information System (SIS) designed to demonstrate a critical logic vulnerability. It features a **Node.js backend** with a **real-time shared state**, allowing the web interface to update automatically when an exploit is triggered on the server.

---

## 2. Vulnerability Analysis (CWE-682)
The vulnerability lies in the billing calculation logic (`server.js`). The system calculates the Total Bill by adding tuition to optional add-ons (Parking, Gym) but **fails to validate that input quantities are positive**.



**The Flaw:**
> `Total = Tuition + (ParkingQty * $150)`

If an attacker injects a negative number (e.g., `-1000`):
> `Total = Tuition + (-1000 * $150)`
> `Total = Tuition - $150,000`

This results in a massive negative balance, meaning the university owes the attacker money.

---

## 3. Quick Start Guide

### A. Run the Server (Linux Side)
1.  Navigate to the folder and install dependencies:
    ```bash
    cd uniportal
    npm install
    ```
2.  Start the application:
    ```bash
    node server.js
    ```
    *Output:* `Server Online on port 8081`

### B. View the GUI (Laptop Side)
Since the server is headless, you must tunnel the connection to your local machine. Run this in a **new terminal on your laptop**:



1.  **Establish the Tunnel:**
    ```bash
    # Replace 'user' with your ID and 'csx1' with your specific server
    ssh -L 8081:localhost:8081 user@csx1.university.edu
    ```

2.  **Access the App:** Open your browser to `http://localhost:8081/dashboard.html`

3.  **Log in:** Click "Login" (credentials are pre-filled).

---

## 4. How to Exploit
This project features a **"Magic Demo"**: when you run the attack script on the server, the browser UI will flash RED automatically.

### Method 1: The Script (Recommended)
1.  Ensure the browser dashboard is open and showing a balance of **$8,950.00**.
2.  On the server terminal, run the exploit:
    ```bash
    ./exploit.sh
    ```
3.  **Watch the Browser:** Within 2 seconds, the dashboard will update to show a **Negative Balance** and a **RED** warning box.

### Method 2: Manual Attack
1.  In the browser, right-click the "Parking Pass" input and select **Inspect**.
2.  Delete the `min="0"` attribute from the HTML.
3.  Type `-1000` into the box and click **Update Invoice**.

---

## 5. File Manifest
* **`server.js`**: Backend logic containing the CWE-682 flaw and state memory.
* **`exploit.sh`**: Attack script that sends negative JSON payloads via curl.
* **`public/app.js`**: Frontend logic that polls the server for real-time updates.
* **`public/dashboard.html`**: The main GUI.
