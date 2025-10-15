import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://" + process.env.CODESPACE_NAME + "-3000.app.github.dev",
  "https://3000-" + process.env.CODESPACE_NAME + ".app.github.dev"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

const PORT = process.env.PORT || 5000;

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Route to fetch weather by city (OpenWeather API)
app.get("/api/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    console.log("No city provided");
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`;
    console.log(`[OpenWeather API] Fetching: ${url}`);

    const response = await axios.get(url);

    console.log(`[Weatherbit API] Response received for ${city}`, response.data);
    res.json(response.data);
  } catch (err) {
    console.error(`[OpenWeather API] Error fetching weather data for ${city}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Route to fetch weather by city (Open-Meteo API, no key)
app.get("/api/open-weather", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    console.log("No city provided");
    return res.status(400).json({ error: "City is required" });
  }

  try {
    // Step 1: Convert city -> coordinates
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;
    console.log(`[Open-Meteo] Geocoding: ${geoUrl}`);
    const geoResponse = await axios.get(geoUrl);

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      console.log(`[Open-Meteo] City not found: ${city}`);
      return res.status(404).json({ error: "City not found" });
    }

    const { latitude, longitude } = geoResponse.data.results[0];
    console.log(`[Open-Meteo] Coordinates for ${city}: lat=${latitude}, lon=${longitude}`);

    // Step 2: Fetch weather data using coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;
    console.log(`[Open-Meteo] Fetching weather: ${weatherUrl}`);
    const weatherResponse = await axios.get(weatherUrl);

    console.log(`[Open-Meteo] Weather response received for ${city}`);
    res.json({
      city,
      latitude,
      longitude,
      hourly: weatherResponse.data.hourly,
    });
  } catch (err) {
    console.error(`[Open-Meteo] Error fetching weather data for ${city}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));