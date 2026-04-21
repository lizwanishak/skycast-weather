import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchLocations, type GeocodingResult } from '../api/weatherApi';
import { cn } from '../lib/utils';

interface SearchBarProps {
  onSelect: (location: GeocodingResult) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setIsSearching(true);
    timeoutRef.current = setTimeout(async () => {
      const data = await searchLocations(query);
      setResults(data);
      setIsOpen(data.length > 0);
      setIsSearching(false);
    }, 400);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
          )}
        </div>
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-md transition-all shadow-xl"
          placeholder="Search global cities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#0a0a0a]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          {results.map((res) => (
            <button
              key={res.id}
              onClick={() => {
                onSelect(res);
                setIsOpen(false);
                setQuery('');
              }}
              className="w-full text-left px-5 py-4 hover:bg-white/5 border-b border-white/5 last:border-0 flex items-center gap-4 transition-colors group"
            >
              <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-blue-500/20 transition-colors border border-white/5">
                <MapPin className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-100">{res.name}</span>
                <span className="text-xs text-slate-500">
                  {[res.admin1, res.country].filter(Boolean).join(', ')}
                </span>
              </div>
              <span className="ml-auto text-[10px] font-bold text-slate-600 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 uppercase">
                {res.country_code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
