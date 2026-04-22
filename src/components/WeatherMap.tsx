import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { renderToString } from "react-dom/server";

interface WeatherMapProps {
  latitude: number;
  longitude: number;
  city: string;
}

// Helper to update map view when location changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 10, { animate: true });
  }, [center, map]);
  return null;
}

export default function WeatherMap({
  latitude,
  longitude,
  city,
}: WeatherMapProps) {
  // Memoize position and icon to prevent map "flickering" on parent re-renders
  const position = useMemo<[number, number]>(
    () => [latitude, longitude],
    [latitude, longitude],
  );

  const customIcon = useMemo(
    () =>
      L.divIcon({
        html: renderToString(
          <div className="relative flex items-center justify-center">
            <div className="absolute w-10 h-10 bg-blue-500/40 rounded-full animate-ping" />
            <div className="relative bg-blue-500 p-2 rounded-full shadow-lg shadow-blue-500/50 border-2 border-white/20">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>,
        ),
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }),
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full w-full rounded-[2rem] overflow-hidden border border-white/10 frosted-card shadow-2xl relative z-0"
    >
      <MapContainer
        center={position}
        zoom={10}
        className="h-full w-full"
        zoomControl={true}
      >
        <ChangeView center={position} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={position} icon={customIcon} />
      </MapContainer>
    </motion.div>
  );
}
