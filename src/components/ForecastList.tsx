import React from "react";
import { getWeatherConfig, type WeatherData } from "../api/weatherApi";
import { motion } from "motion/react";

interface ForecastListProps {
  daily: WeatherData["daily"];
}

export default function ForecastList({ daily }: ForecastListProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-4xl p-4 md:p-5 backdrop-blur-xl flex flex-col gap-3">
      <h3 className="text-sm font-bold px-2 uppercase tracking-widest text-slate-400">
        7-Day Forecast
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {daily.time.map((date, i) => {
          const config = getWeatherConfig(daily.weather_code[i]);
          const dateObj = new Date(date);
          const dayName =
            i === 0
              ? "Today"
              : dateObj.toLocaleDateString("en-US", { weekday: "short" });
          const Icon = config.icon;

          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex flex-col items-center w-full p-3 md:p-4 transition-all duration-300 gap-3 ${
                i === 0
                  ? "bg-blue-500/10 border border-blue-500/20 rounded-2xl"
                  : "hover:bg-white/5 rounded-2xl border border-transparent"
              }`}
            >
              <span
                className={`font-bold text-sm ${i === 0 ? "text-blue-400" : "text-slate-400"}`}
              >
                {dayName}
              </span>

              <Icon
                className={`w-8 h-8 ${i === 0 ? "text-blue-300" : config.color}`}
                strokeWidth={1.5}
              />

              <div className="flex flex-col items-center text-sm font-bold">
                <span>{Math.round(daily.temperature_2m_max[i])}°</span>
                <span className="text-slate-500">
                  {Math.round(daily.temperature_2m_min[i])}°
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
