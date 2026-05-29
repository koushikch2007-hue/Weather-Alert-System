# ⛅ Weather Alert System
### React + n8n College Project

---

## 📁 Project Structure

```
weather-alert-system/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js    ← Live weather metrics + n8n status
│   │   ├── AlertList.js    ← View/toggle/delete alerts
│   │   ├── AddAlert.js     ← Add new alert with form
│   │   ├── History.js      ← Alert history log
│   │   └── Toast.js        ← Notification popup
│   ├── App.js              ← Main app logic + state
│   ├── App.css             ← All styles
│   ├── index.js            ← Entry point
│   └── index.css           ← Global styles
├── package.json
└── README.md
```

---

## 🚀 How to Run

### Step 1 — Install Node.js
Download from https://nodejs.org (choose LTS version)

### Step 2 — Install dependencies
Open terminal in this folder and run:
```bash
npm install
```

### Step 3 — Start the app
```bash
npm start
```

The app opens at **http://localhost:3000** 🎉

---

## 🔗 Connect to n8n

### Step 1 — Set up n8n
- Go to https://n8n.io and create a free account
- OR run locally: `npx n8n`

### Step 2 — Build the workflow
1. Add **Schedule Trigger** node → set to every 30 minutes
2. Add **HTTP Request** node:
   - URL: `https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=YOUR_API_KEY&units=metric`
   - Get free API key at: https://openweathermap.org/api
3. Add **IF** node:
   - Condition: `{{ $json.main.temp }} > 38`
4. Add **Gmail** node (true branch):
   - Send alert email
5. Add **Webhook** node:
   - Copy the webhook URL

### Step 3 — Connect React to n8n
In `src/App.js`, replace:
```js
const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/weather-alert';
```
with your actual n8n webhook URL.

---

## 🎓 How to Present This

**Tell your class:**
1. "This is a React frontend — it shows weather data and lets users set alert rules"
2. "Behind the scenes, n8n runs a workflow every 30 minutes automatically"
3. "When the temperature crosses the limit, n8n sends a real email — no code needed for that part!"
4. Click **"Simulate a weather check"** to show a live demo

**Key talking points:**
- React handles the UI and user interaction
- n8n handles the automation and notifications
- They communicate via a **webhook** (like a doorbell — React rings it, n8n responds)

---

## ✅ Features
- 📊 Live weather dashboard (temp, humidity, wind, rain)
- 🔔 Create custom alerts with threshold slider
- 🔄 Enable/disable alerts with toggle
- 📋 Alert history log
- 📧 Email + WhatsApp notifications via n8n
- 🔗 n8n webhook integration
