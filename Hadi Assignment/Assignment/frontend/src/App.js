import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import Forecast from './components/Forecast';
import './App.css';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState('London');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const weatherResponse = await axios.get(`${API_URL}/weather/${city}`);
      setWeather(weatherResponse.data);
      
      const forecastResponse = await axios.get(`${API_URL}/forecast/${city}`);
      setForecast(forecastResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchCity) => {
    setCity(searchCity);
    fetchWeatherData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Weather Dashboard</h1>
          <p className="text-xl">Real-time weather information</p>
        </header>
        
        <SearchBar onSearch={handleSearch} />
        
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {weather && <WeatherCard weather={weather} />}
            {forecast && <Forecast forecast={forecast} />}
          </>
        )}
        
        <footer className="mt-12 text-center text-white/70">
          <p>Weather data provided by OpenWeatherMap API</p>
          <p className="mt-2">
            Created for Docker Microservices Assignment &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;