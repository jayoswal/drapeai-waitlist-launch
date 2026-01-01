# Local Network Testing Guide

This guide explains how to test your Node.js project on multiple devices connected to the same WiFi network.

## Steps

### 1. Find Your Computer's Local IP Address
- On macOS, open Terminal and run:
  ```sh
  ifconfig | grep inet
  ```
- Look for an IP address like `192.168.x.x` (not `127.0.0.1`).

### 2. Start Your Node.js Server
- In your project directory, run:
  ```sh
  node server/server.js
  ```
- Confirm the server is running (e.g., `Server running on http://localhost:3000`).

### 3. Access the Project from Another Device
- Make sure the second device is connected to the same WiFi network.
- Open a browser on the second device.
- Enter the following URL, replacing `<your-local-ip>` with your computer's IP:
  ```
  http://<your-local-ip>:3000
  ```
  Example: `http://192.168.1.5:3000`

### 4. Check Firewall Settings (if needed)
- If you can't access the site, check your computer's firewall settings.
- Allow incoming connections for Node.js or the terminal app.

## Notes
- Both devices must be on the same WiFi/local network.
- This method works for any device (phone, tablet, laptop, etc.) with a browser.
- Your project will be accessible only while the server is running.

---
