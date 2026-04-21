import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  CloudDrizzle, 
  SunMedium, 
  CloudSun,
  type LucideIcon
} from "lucide-react";

export interface WeatherConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

// WMO Code Mapping Logic
export const getWeatherConfig = (code: number): WeatherConfig => {
  const mapping: Record<number, WeatherConfig> = {
    0: { label: "Clear Sky", icon: Sun, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    1: { label: "Mainly Clear", icon: SunMedium, color: "text-yellow-200", bg: "bg-yellow-200/10" },
    2: { label: "Partly Cloudy", icon: CloudSun, color: "text-blue-200", bg: "bg-blue-200/10" },
    3: { label: "Overcast", icon: Cloud, color: "text-gray-400", bg: "bg-gray-400/10" },
    45: { label: "Fog", icon: CloudFog, color: "text-gray-400", bg: "bg-gray-400/10" },
    48: { label: "Rime Fog", icon: CloudFog, color: "text-gray-400", bg: "bg-gray-400/10" },
    51: { label: "Light Drizzle", icon: CloudDrizzle, color: "text-blue-300", bg: "bg-blue-300/10" },
    53: { label: "Moderate Drizzle", icon: CloudDrizzle, color: "text-blue-400", bg: "bg-blue-400/10" },
    55: { label: "Dense Drizzle", icon: CloudDrizzle, color: "text-blue-500", bg: "bg-blue-500/10" },
    61: { label: "Slight Rain", icon: CloudRain, color: "text-blue-400", bg: "bg-blue-400/10" },
    63: { label: "Moderate Rain", icon: CloudRain, color: "text-blue-500", bg: "bg-blue-500/10" },
    65: { label: "Heavy Rain", icon: CloudRain, color: "text-blue-600", bg: "bg-blue-600/10" },
    71: { label: "Slight Snow", icon: CloudSnow, color: "text-white", bg: "bg-white/10" },
    73: { label: "Moderate Snow", icon: CloudSnow, color: "text-white", bg: "bg-white/10" },
    75: { label: "Heavy Snow", icon: CloudSnow, color: "text-white", bg: "bg-white/10" },
    95: { label: "Thunderstorm", icon: CloudLightning, color: "text-purple-500", bg: "bg-purple-500/10" },
  };

  return mapping[code] || { label: "Cloudy", icon: Cloud, color: "text-gray-400", bg: "bg-gray-400/10" };
};

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country: string;
  country_code: string;
}

// Geocoding API (City -> Lat/Lon)
export const searchLocations = async (query: string): Promise<GeocodingResult[]> => {
  if (!query || query.length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
};

export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

// Weather API (Lat/Lon -> Forecast)
export const fetchWeather = async (lat: number, lon: number, unit: 'celsius' | 'fahrenheit'): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    temperature_unit: unit,
    wind_speed_unit: 'kmh',
    timezone: 'auto'
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather data fetch failed");
    return await response.json();
  } catch (error) {
    console.error("Weather fetch error:", error);
    throw error;
  }
};
