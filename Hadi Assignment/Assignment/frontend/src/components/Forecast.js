import React from 'react';

const Forecast = ({ forecast }) => {
  if (!forecast || !forecast.list) return null;
  
  // Get one forecast per day (noon)
  const dailyForecasts = forecast.list
    .filter((item, index) => index % 8 === 4) // Get noon forecasts (every 8th item)
    .slice(0, 5); // Limit to 5 days
  
  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {dailyForecasts.map((item, index) => {
          const date = new Date(item.dt * 1000);
          const day = date.toLocaleDateString('en-US', { weekday: 'short' });
          const weatherIcon = item.weather[0].icon;
          const iconUrl = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
          
          return (
            <div 
              key={index} 
              className="bg-white/10 rounded-lg p-4 text-center transition-transform hover:scale-105"
            >
              <p className="font-semibold">{day}</p>
              <p className="text-sm opacity-70">
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              
              <div className="flex justify-center">
                <img src={iconUrl} alt={item.weather[0].description} />
              </div>
              
              <p className="font-bold text-xl">{Math.round(item.main.temp)}°C</p>
              <p className="text-sm capitalize">{item.weather[0].description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;