import React, { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city) return setError("Please enter a city");
    setError("");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/weather?city=${city}`
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setWeather(data);
    } catch (err) {
      setError("Could not fetch weather. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🌤 Weather App</h2>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Get Weather</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather && (
        <div style={{ marginTop: "20px" }}>
          <h3>{weather.name}</h3>
          <p>🌡 Temperature: {weather.main.temp} °C</p>
          <p>💨 Wind: {weather.wind.speed} m/s</p>
          <p>☁ Condition: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;