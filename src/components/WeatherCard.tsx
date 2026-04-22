import React from "react";
import { MapPin, Wind, Droplets, Thermometer, Sun } from "lucide-react";
import {
  getWeatherConfig,
  type WeatherData,
  type GeocodingResult,
} from "../api/weatherApi";
import { motion } from "motion/react";

interface WeatherCardProps {
  location: GeocodingResult;
  current: WeatherData["current"];
  low?: number;
  high?: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  uv_index?: number;
}

export default function WeatherCard({
  location,
  current,
  low,
  high,
  apparent_temperature,
  relative_humidity_2m,
  wind_speed_10m,
  uv_index = 0,
}: WeatherCardProps) {
  const config = getWeatherConfig(current.weather_code);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-linear-to-br from-blue-500/20 to-indigo-500/10 rounded-4xl border border-white/10 p-8 md:p-10 shadow-2xl text-white h-full flex flex-col justify-between"
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-300 font-medium mb-1">
              <MapPin className="w-4 h-4" />
              <span>
                {[location.admin1, location.country_code.toUpperCase()]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
            <h2 className="text-6xl md:text-7xl font-bold tracking-tighter">
              {location.name}
            </h2>
            <p className="text-xl text-slate-400 mt-2">{config.label}</p>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="hidden md:block"
          >
            <Icon
              size={120}
              className="text-slate-200 drop-shadow-2xl"
              strokeWidth={1.5}
            />
          </motion.div>
        </div>

        <div className="flex items-end justify-between mt-auto mb-8">
          <div className="text-8xl md:text-9xl font-light leading-none tracking-tighter">
            {Math.round(current.temperature_2m)}
            <span className="text-blue-400">°</span>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="md:hidden">
              <Icon
                size={64}
                className="text-slate-200 drop-shadow-2xl"
                strokeWidth={1.5}
              />
            </div>
            {low !== undefined && high !== undefined && (
              <span className="text-[10px] md:text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Low: {Math.round(low)}° • High: {Math.round(high)}°
              </span>
            )}
          </div>
        </div>

        {/* Integrated Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 pt-8 border-t border-white/10 gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2 text-blue-300/80">
              <Thermometer className="w-4 h-4" />
              <span className="text-xs uppercase font-bold tracking-widest">
                Feels Like
              </span>
            </div>
            <span className="text-xl font-bold">
              {Math.round(apparent_temperature)}°
            </span>
          </div>
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2 text-blue-300/80">
              <Droplets className="w-4 h-4" />
              <span className="text-xs uppercase font-bold tracking-widest">
                Humidity
              </span>
            </div>
            <span className="text-xl font-bold">{relative_humidity_2m}%</span>
          </div>
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2 text-blue-300/80">
              <Wind className="w-4 h-4" />
              <span className="text-xs uppercase font-bold tracking-widest">
                Wind
              </span>
            </div>
            <span className="text-xl font-bold">
              {Math.round(wind_speed_10m)} <span className="text-xs">km/h</span>
            </span>
          </div>
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2 text-blue-300/80">
              <Sun className="w-4 h-4" />
              <span className="text-xs uppercase font-bold tracking-widest">
                UV Index
              </span>
            </div>
            <span className="text-xl font-bold">{uv_index}</span>
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
    </motion.div>
  );
}
