const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "SmartShip News API is running!",
    version: "1.0.0",
    endpoints: ["/api/news", "/health"],
    status: "healthy",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "smartship-news-api",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/news", async (req, res) => {
  try {
    if (!process.env.GNEWS_API_KEY) {
      return res.status(500).json({
        error: "GNEWS_API_KEY not configured",
      });
    }

    const response = await axios.get(
      `https://gnews.io/api/v4/search?q=shipping&lang=en&apikey=${process.env.GNEWS_API_KEY}`
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).json({
      error: "Failed to fetch news",
      message: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`SmartShip Backend server running on port ${PORT}`);
});
