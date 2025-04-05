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

app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});