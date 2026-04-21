import React from 'react';
import { getWeatherConfig, type WeatherData } from '../api/weatherApi';
import { motion } from 'motion/react';

interface ForecastListProps {
  daily: WeatherData['daily'];
}

export default function ForecastList({ daily }: ForecastListProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-xl h-full flex flex-col gap-4">
      <h3 className="text-lg font-bold px-2">7-Day Forecast</h3>
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        {daily.time.map((date, i) => {
          const config = getWeatherConfig(daily.weather_code[i]);
          const dateObj = new Date(date);
          const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const Icon = config.icon;

          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center justify-between p-4 transition-all duration-300 ${
                i === 0 
                  ? 'bg-blue-500/10 border border-blue-500/20 rounded-2xl' 
                  : 'hover:bg-white/5 rounded-2xl border border-transparent'
              }`}
            >
              <span className={`w-12 font-bold ${i === 0 ? 'text-blue-400' : 'text-slate-400 font-medium'}`}>
                {dayName}
              </span>

              <div className="flex items-center gap-3 flex-1 px-4">
                <Icon className={`w-5 h-5 ${i === 0 ? 'text-blue-300' : config.color}`} strokeWidth={2} />
                <span className="text-xs text-slate-400 truncate max-w-[80px]">
                  {config.label}
                </span>
              </div>

              <div className="flex gap-3 text-sm font-bold w-20 justify-end">
                <span>{Math.round(daily.temperature_2m_max[i])}°</span>
                <span className="text-slate-500">{Math.round(daily.temperature_2m_min[i])}°</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
