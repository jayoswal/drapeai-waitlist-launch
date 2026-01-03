# DrapeAI Waitlist Launch – EC2 Deployment Guide

This guide explains how to deploy and run the DrapeAI Waitlist Launch project on an AWS EC2 instance from scratch.

---

## 1. Prerequisites
- An AWS EC2 instance (Ubuntu 20.04/22.04 recommended)
- SSH access to your EC2 instance
- A domain (optional, for production)

---

## 2. Initial Server Setup
1. **Update and install dependencies:**
   ```sh
   sudo apt update && sudo apt upgrade -y
   # Install Node.js 24.x (official way)
   curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
   sudo apt install -y nodejs git
   ```
2. **(Optional) Install build tools:**
   ```sh
   sudo apt install -y build-essential
   ```

---

## 3. Clone the Repository
```sh
git clone https://github.com/jayoswal/drapeai-waitlist-launch.git
cd drapeai-waitlist-launch
```

---

## 4. Install Node.js Dependencies
```sh
cd server
npm install
```

---

## 5. Start the Backend Server
```sh
node server.js
```
- The server will start on port 3000 by default.
- Access the site at `http://<your-ec2-public-ip>:3000`

---

## 6. (Optional) Run as a Background Service
To keep the server running after you disconnect:
```sh
sudo npm install -g pm2
pm2 start server.js --name drapeai-waitlist
pm2 save
pm2 startup
```

# If you get a permissions error when installing pm2, use 'sudo' as shown above.

---

## 7. (Optional) Configure a Reverse Proxy (Nginx)
For production, use Nginx to serve the site and handle SSL:

1. **Install Nginx:**
   ```sh
   sudo apt install nginx
   ```
2. **Configure Nginx for your domain and IP:**
   - Edit `/etc/nginx/sites-available/default` (or create a new file in `/etc/nginx/sites-available/drapeai`):
   ```sh
   sudo nano /etc/nginx/sites-available/drapeai
   ```
   - Paste the following config (replace email if using Let's Encrypt):
   ```nginx
   server {
       listen 80;
       server_name drapeai.in www.drapeai.in 3.111.29.1;

       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   - Enable the config:
   ```sh
   sudo ln -sf /etc/nginx/sites-available/drapeai /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl reload nginx
   ```
3. **(Optional) Set up SSL with Let's Encrypt:**
   ```sh
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d drapeai.in -d www.drapeai.in -d 3.111.29.1 --redirect --agree-tos -m your@email.com
   ```

---

## 8. Database
- The SQLite database file (`waitlist.db`) is created automatically in the `server/` directory.
- To reset data, you can delete this file and restart the server.

---

## 8.1. Backing Up the Database to S3
To copy your `waitlist.db` file to your S3 bucket (`drapeai-wailist-launch-db`):

1. **Install AWS CLI (if not already installed):**
   ```sh
   sudo apt update
   sudo apt install unzip -y
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   aws --version
   ```
2. **Configure AWS CLI (first time only):**
   ```sh
   aws configure
   # Enter your AWS Access Key, Secret Key, region, and output format
   ```
3. **Copy the database file to S3:**
   (Run this command from the directory containing `waitlist.db`)
   ```sh
   aws s3 cp waitlist.db s3://drapeai-wailist-launch-db/<addnumber>
   aws s3 cp waitlist.db s3://drapeai-wailist-launch-db/3/
   ```

---

## 9. Environment Variables (Optional)
- By default, the server runs on port 3000. To change:
  ```sh
  export PORT=8080
  node server.js
  ```

---

## 10. Updating the App (When You Push New Changes to GitHub)
Whenever you push new changes to the GitHub repository, follow these steps on your EC2 instance:

1. **SSH into your EC2 instance:**
   ```sh
   ssh ubuntu@<your-ec2-public-ip>
   # or use your username if different
   ```
2. **Navigate to your project directory:**
   ```sh
   cd drapeai-waitlist-launch
   ```
3. **Pull the latest changes:**
   ```sh
   git pull
   ```
4. **(If you changed backend code or dependencies) Reinstall dependencies:**
   ```sh
   cd server
   npm install
   cd ..
   ```
5. **Restart the server:**
   - If using pm2:
     ```sh
     pm2 restart drapeai-waitlist
     ```
   - If running manually, stop the old process and run:
     ```sh
     cd server
     node server.js
     ```

---

## 11. Troubleshooting
- **Port already in use:** Change the port or stop the conflicting process.
- **Site not loading:** Check server logs, security group rules, and Nginx config.
- **Database issues:** Delete `waitlist.db` to reset.

---

## 12. Security & Production Tips
- Use a firewall (AWS Security Groups) to allow only necessary ports (80, 443, 22).
- Use HTTPS in production.
- Regularly backup your `waitlist.db` file.
- Keep your server and dependencies up to date.

---

## 13. Useful Commands
- View server logs: `pm2 logs drapeai-waitlist`
- Restart server: `pm2 restart drapeai-waitlist`
- Stop server: `pm2 stop drapeai-waitlist`

---

## 14. Contact
For help, contact the project maintainer: jayumeshoswal2001@gmail.com

---

## 15. Cloudflare DNS Setup for A Records

To ensure your domain is properly routed through Cloudflare and benefits from CDN and security features, add the following A records in your Cloudflare DNS settings:

1. **Log in to your Cloudflare dashboard** at [https://dash.cloudflare.com/](https://dash.cloudflare.com/) and select your domain (`drapeai.in`).

2. **Go to the DNS tab.**

3. **Add or update these A records:**

   - **A Record for root domain:**
     - Type: `A`
     - Name: `@`
     - IPv4 address: *(your EC2 public IP address)*
     - Proxy status: **Proxied** (orange cloud)

   - **A Record for www subdomain:**
     - Type: `A`
     - Name: `www`
     - IPv4 address: *(your EC2 public IP address)*
     - Proxy status: **Proxied** (orange cloud)

4. **Save the records.**

5. **Wait for DNS propagation** (usually a few minutes, but can take up to 24 hours).

**Note:**  
The Cloudflare account email used is: `clickonova.faylawson@gmail.com`

---

## 16. Cloudflare Caching Configuration & Purge

To ensure your latest changes are served and old cache is cleared:

1. Go to Cloudflare Caching Configuration for your domain:
   [https://dash.cloudflare.com/90f624089b369a2ef5060b5f79ccde82/drapeai.in/caching/configuration](https://dash.cloudflare.com/90f624089b369a2ef5060b5f79ccde82/drapeai.in/caching/configuration)

2. In the left sidebar, click **Caching** → **Configuration**.

3. Click **Purge Everything** to clear all cached files and assets for your domain.

This ensures all users get the latest version of your site and assets after deployment or updates.

---
