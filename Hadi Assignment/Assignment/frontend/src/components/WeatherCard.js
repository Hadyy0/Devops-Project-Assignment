import React from 'react';

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const { main, weather: weatherData, wind, name, sys } = weather;
  const weatherIcon = weatherData[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8 transition-all hover:shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-3xl font-bold mb-1">
            {name}, {sys.country}
          </h2>
          <p className="text-xl opacity-80">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        
        <div className="flex items-center">
          <img
            src={iconUrl}
            alt={weatherData[0].description}
            className="w-20 h-20"
          />
          <div className="text-right">
            <h3 className="text-5xl font-bold">{Math.round(main.temp)}°C</h3>
            <p className="text-xl capitalize">{weatherData[0].description}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white/10 p-4 rounded-lg">
          <p className="text-sm opacity-70">Feels Like</p>
          <p className="text-xl font-semibold">{Math.round(main.feels_like)}°C</p>
        </div>
        <div className="bg-white/10 p-4 rounded-lg">
          <p className="text-sm opacity-70">Humidity</p>
          <p className="text-xl font-semibold">{main.humidity}%</p>
        </div>
        <div className="bg-white/10 p-4 rounded-lg">
          <p className="text-sm opacity-70">Wind Speed</p>
          <p className="text-xl font-semibold">{Math.round(wind.speed)} m/s</p>
        </div>
        <div className="bg-white/10 p-4 rounded-lg">
          <p className="text-sm opacity-70">Pressure</p>
          <p className="text-xl font-semibold">{main.pressure} hPa</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;