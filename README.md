
# 🧠 ZenTask — Node + Google Sheets Backend

This is the lightweight Express.js server that connects your **React frontend** to your **Google Sheets database** via Google Apps Script.

It acts as a middleware for:

- ➕ Adding tasks
- 🔁 Updating task completion
- 🗑️ Deleting tasks
- 📄 Fetching all tasks on page load

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the server

```bash
node index.js
```

Server will run at: [http://localhost:4000](http://localhost:4000)

---

## 🌍 Environment Variables

Create a `.env` file and add your **Google Apps Script Web App URL**:

```
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

This keeps your API key out of your codebase.

---

## 📂 Routes

| Method | Endpoint         | Description            |
|--------|------------------|------------------------|
| GET    | `/tasks`         | Fetch tasks from Sheet |
| POST   | `/add-task`      | Add a new task         |
| POST   | `/update-task`   | Toggle task status     |
| POST   | `/delete-task`   | Delete a task          |

---

## 🧠 How It Works

- The backend receives JSON from the frontend
- It forwards the data to the Google Apps Script Web App
- The script reads/writes to your connected Google Sheet
- Logs are written to a separate `"Logs"` tab for debugging

---

## 📄 Google Apps Script

The full Google Apps Script powering this app is available in:
```
zentask-backend/apps-script/zenTask.gs
```
This file is provided for reference. To use it, paste the contents into a Google Apps Script project bound to your Google Sheet, then deploy it as a Web App.

---

## 🔐 TODO

- Validate inputs
- Rate-limit abuse
- Add session handling (if needed)

---

## ✨ Credits

Backend powered by:
- Express
- Node.js
- dotenv
- Google Apps Script + Sheets

Made with ☕ and 📋
