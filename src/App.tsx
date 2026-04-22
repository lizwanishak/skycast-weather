import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastList from "./components/ForecastList";
import WeatherMap from "./components/WeatherMap";
import {
  fetchWeather,
  type WeatherData,
  type GeocodingResult,
} from "./api/weatherApi";
import {
  getCachedData,
  setCachedData,
  saveLastLocation,
  getLastLocation,
} from "./utils/cache";
import { Cloud, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [location, setLocation] = useState<GeocodingResult | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load last location and weather on mount
  useEffect(() => {
    const saved = getLastLocation();
    if (saved) {
      handleLocationSelect(saved);
    }
  }, []);

  // Update weather when unit changes
  useEffect(() => {
    if (location) {
      updateWeather(location, unit);
    }
  }, [unit]);

  const updateWeather = async (
    loc: GeocodingResult,
    currentUnit: "celsius" | "fahrenheit",
  ) => {
    const cacheKey = `${loc.id}_${currentUnit}`;
    const cached = getCachedData<WeatherData>(cacheKey);

    if (cached) {
      setWeather(cached);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(loc.latitude, loc.longitude, currentUnit);
      setWeather(data);
      setCachedData(cacheKey, data);
    } catch (err) {
      setError("Unable to fetch weather data. Please check your connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (loc: GeocodingResult) => {
    setLocation(loc);
    saveLastLocation(loc);
    updateWeather(loc, unit);
  };

  return (
    <div className="h-screen text-slate-100 selection:bg-blue-500/30 overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-4 md:py-6 relative z-10 flex flex-col gap-4 md:gap-6 h-full">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-tr from-blue-400 to-cyan-300 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cloud className="w-6 h-6 text-slate-900" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
              LightSky
            </h1>
          </div>

          <div className="flex-1 max-w-md w-full sm:mx-8">
            <SearchBar onSelect={handleLocationSelect} />
          </div>

          <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10 shrink-0 backdrop-blur-sm">
            <button
              onClick={() => setUnit("celsius")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unit === "celsius"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit("fahrenheit")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unit === "fahrenheit"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              °F
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {isLoading && !weather ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 space-y-4"
              >
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-400 font-medium">
                  Fetching sky data...
                </p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 p-10 rounded-[2.5rem] backdrop-blur-md flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto"
              >
                <div className="p-3 bg-red-500/20 rounded-full">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-400">Oops!</h3>
                  <p className="text-slate-400 max-w-xs">{error}</p>
                </div>
                <button
                  onClick={() => location && updateWeather(location, unit)}
                  className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-bold transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            ) : weather && location ? (
              <motion.div
                key="weather"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-6 h-full"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                  <div className="lg:col-span-8 h-full">
                    <WeatherCard
                      location={location}
                      current={weather.current}
                      low={weather.daily.temperature_2m_min[0]}
                      high={weather.daily.temperature_2m_max[0]}
                      apparent_temperature={
                        weather.current.apparent_temperature
                      }
                      relative_humidity_2m={
                        weather.current.relative_humidity_2m
                      }
                      wind_speed_10m={weather.current.wind_speed_10m}
                    />
                  </div>
                  <div className="lg:col-span-4 h-full">
                    <WeatherMap
                      latitude={location.latitude}
                      longitude={location.longitude}
                      city={location.name}
                    />
                  </div>
                </div>
                <ForecastList daily={weather.daily} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 backdrop-blur-md">
                  <Cloud className="w-10 h-10 text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-300">
                  Ready for LightSky?
                </h2>
                <p className="text-slate-500 mt-2 max-w-xs">
                  Search for your city above to get your personalized weather
                  forecast.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="shrink-0 py-2 text-center">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            Powered by Open-Meteo • 15min Cache Enabled
          </p>
        </footer>
      </div>
    </div>
  );
}
