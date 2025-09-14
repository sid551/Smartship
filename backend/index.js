const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/api/news", async (req, res) => {
  try {
    const response = await axios.get(
      `https://gnews.io/api/v4/search?q=shipping&lang=en&apikey=${process.env.GNEWS_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "SmartShip News API is running!",
    version: "1.0.0",
    endpoints: ["/api/news"],
  });
});

app.listen(PORT, () => {
  console.log(`SmartShip Backend server running on port ${PORT}`);
});
