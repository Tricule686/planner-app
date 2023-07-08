import React, { useEffect, useState } from 'react';

const API_KEY = 'f176765e02b82dd9871ffe9748ea9f68'; // Replace with your OpenWeatherMap API key

export default function WeatherWidget() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherData();
    }
  }, [latitude, longitude]);

  const fetchWeatherData = async () => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      const temperature = data.main.temp;
      const condition = data.weather[0].description;
      setWeather({ temperature, condition });
    } catch (error) {
      setError('Error fetching weather data');
    }
  };

  return (
    <div className="widget">
      <h3>Weather Widget</h3>
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="weather-container">
          {weather ? (
            <div className="weather-content">
              <p className="temperature">{weather.temperature}°C</p>
              <p className="condition">{weather.condition}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </div>
  );
}
