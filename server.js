const express = require('express');
const fetch = require('node-fetch'); // Install via: npm install node-fetch@2
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Restaurant API endpoint
app.get("/api/restaurants", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing lat/lng parameters" });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY; // Securely stored in .env
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=restaurant&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json({ restaurants: data.results });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});