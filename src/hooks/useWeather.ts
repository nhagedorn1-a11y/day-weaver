import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LOCATION_CONFIG } from '@/data/locationConfig';

export interface WeatherData {
  temperature: number;
  temperatureUnit: string;
  emoji: string;
  description: string;
  isDay: boolean;
  location: string;
}

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem('weather_cache');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setWeather(data);
            setLoading(false);
            return;
          }
        }

        const { data, error: fetchError } = await supabase.functions.invoke('get-weather', {
          body: {
            lat: LOCATION_CONFIG.latitude,
            lon: LOCATION_CONFIG.longitude,
          },
        });

        if (fetchError) {
          throw fetchError;
        }

        setWeather(data);
        
        // Cache the result
        localStorage.setItem('weather_cache', JSON.stringify({
          data,
          timestamp: Date.now(),
        }));
        
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Unable to fetch weather');
        
        // Provide fallback
        const hour = new Date().getHours();
        const isDay = hour >= 6 && hour < 18;
        setWeather({
          temperature: isDay ? 45 : 38,
          temperatureUnit: '°F',
          emoji: isDay ? '☀️' : '🌙',
          description: 'Palisades',
          isDay,
          location: 'Palisades, NY',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, CACHE_DURATION);
    return () => clearInterval(interval);
  }, []);

  return { weather, loading, error };
}
