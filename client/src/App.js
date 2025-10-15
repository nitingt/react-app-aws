import React, { useState } from "react";

function App() {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiType, setApiType] = useState("open-weather"); // <-- NEW state

  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }

    setError("");
    setLoading(true);
    setWeather(null);

    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

      const endpoint = apiType === "weather" ? "api/weather" : "api/open-weather";
      const res = await fetch(`${API_BASE_URL}/${endpoint}?city=${city}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log("Fetched data:", data); // Debugging line to log fetched data
      setWeather(data);
    } catch (err) {
      console.error(err);
      setError("Could not fetch weather. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🌤 Weather App</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>
          <input
            type="radio"
            name="apiType"
            value="open-weather"
            checked={apiType === "open-weather"}
            onChange={() => setApiType("open-weather")}
          />{" "}
          Open-Meteo API (no key)
        </label>{" "}
        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            name="apiType"
            value="weather"
            checked={apiType === "weather"}
            onChange={() => setApiType("weather")}
          />{" "}
          OpenWeather API (with key)
        </label>
      </div>

      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
      />
      <button onClick={getWeather} style={{ padding: "8px 16px" }}>
        Get Weather
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {weather && (
        <div style={{ marginTop: "20px" }}>
          <h3>
            🌍 {weather.city || "Weather Data"}{" "}
            {weather.latitude && weather.longitude && (
              <>
                ({weather.latitude.toFixed(2)}, {weather.longitude.toFixed(2)})
              </>
            )}
          </h3>

          {/* Handle OpenWeather or Open-Meteo display */}
          {weather.hourly ? (
            <>
              <h4>Hourly Temperatures (°C)</h4>
              <ul
                style={{
                  listStyleType: "none",
                  padding: 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                  margin: "0 auto",
                  width: "300px",
                  textAlign: "left",
                }}
              >
                {weather.hourly.time.slice(0, 12).map((time, index) => (
                  <li key={time} style={{ marginBottom: "5px" }}>
                    <strong>
                      {new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </strong>
                    : {weather.hourly.temperature_2m[index]} °C
                  </li>
                ))}
              </ul>
            </>
          ) : (
            weather.main && (
              <div>
                <p>🌡 Temperature: {weather.main.temp} °C</p>
                <p>💨 Wind: {weather.wind.speed} m/s</p>
                <p>☁ Condition: {weather.weather[0].description}</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default App;