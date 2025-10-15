import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

// Route to fetch weather by city
app.get("/api/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`;
    console.log('url:', url); // Debugging line to log the URL
    const response = await axios.get(url);
    console.log('response:', response);
    res.json(response.data);
  } catch (err) {
    console.log("Error fetching weather data:", err.message); // Debugging line to log the error
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));