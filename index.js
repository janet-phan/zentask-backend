const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post("/add-task", async (req, res) => {
  const task = req.body;

  const googleEndpoint = process.env.GOOGLE_SCRIPT_URL;

  try {
    const response = await fetch(googleEndpoint, {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();
    res.status(200).send({ message: "Success", response: text });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to forward to Google Apps Script" });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: "GET",
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Failed to fetch tasks from Google Sheets:", error);
    res.status(500).json({ error: "Unable to fetch tasks" });
  }
});

app.post("/update-task", async (req, res) => {
  const { id, done } = req.body;

  const googleEndpoint = process.env.GOOGLE_SCRIPT_URL;
  console.log("🌍 Sending update to:", googleEndpoint);

  try {
    const response = await fetch(googleEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, done, update: true }),
    });

    const text = await response.text();
    console.log("🧼 Google Apps Script responded with:", text); // ✅ Add this

    res.status(200).send({ message: "Updated", response: text });
  } catch (error) {
    console.error("❌ Failed to update task:", error.message);
    res.status(500).send({ error: "Failed to update task" });
  }
});

app.post("/delete-task", async (req, res) => {
  const taskIdToDelete = req.body.id;

  console.log("🧹 Received delete request for task ID:", taskIdToDelete);

  const googleEndpoint = process.env.GOOGLE_SCRIPT_URL;

  try {
    const response = await fetch(googleEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: taskIdToDelete,
        delete: true,
      }),
    });

    const text = await response.text();

    console.log("🧼 Google Apps Script responded with:", text); // ✅ This shows what the script returned

    res.status(200).send({ message: "Deleted", response: text });
  } catch (error) {
    console.error("❌ Failed to delete task:", error);
    res.status(500).send({ error: "Failed to delete task" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
