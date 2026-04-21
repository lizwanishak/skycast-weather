import React from 'react';
import { Wind, Droplets, Thermometer, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface DetailCardProps {
  Icon: LucideIcon;
  label: string;
  value: string;
  delay?: number;
}

function DetailCard({ Icon, label, value, delay = 0 }: DetailCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col items-center text-center gap-2 backdrop-blur-md group hover:bg-white/10 transition-all"
    >
      <Icon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{label}</span>
      <span className="text-xl font-bold text-slate-100">{value}</span>
    </motion.div>
  );
}

interface StatsGridProps {
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
}

export default function StatsGrid({ 
  apparent_temperature, 
  relative_humidity_2m, 
  wind_speed_10m 
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <DetailCard 
        Icon={Thermometer} 
        label="Feels Like" 
        value={`${Math.round(apparent_temperature)}°`} 
        delay={0.1}
      />
      <DetailCard 
        Icon={Droplets} 
        label="Humidity" 
        value={`${relative_humidity_2m}%`} 
        delay={0.2}
      />
      <DetailCard 
        Icon={Wind} 
        label="Wind Speed" 
        value={`${wind_speed_10m} km/h`} 
        delay={0.3}
      />
    </div>
  );
}
