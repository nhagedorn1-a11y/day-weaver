import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Palisades, NY coordinates
const DEFAULT_LAT = 41.0101;
const DEFAULT_LON = -73.9118;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat = DEFAULT_LAT, lon = DEFAULT_LON } = await req.json().catch(() => ({}));

    // Use Open-Meteo API (free, no API key required)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit&timezone=America/New_York`;

    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Map weather codes to emojis
    const weatherCodeToEmoji = (code: number, isDay: boolean): { emoji: string; description: string } => {
      // WMO Weather interpretation codes
      if (code === 0) return { emoji: isDay ? '☀️' : '🌙', description: 'Clear' };
      if (code === 1) return { emoji: isDay ? '🌤️' : '🌙', description: 'Mostly Clear' };
      if (code === 2) return { emoji: '⛅', description: 'Partly Cloudy' };
      if (code === 3) return { emoji: '☁️', description: 'Cloudy' };
      if (code >= 45 && code <= 48) return { emoji: '🌫️', description: 'Foggy' };
      if (code >= 51 && code <= 55) return { emoji: '🌧️', description: 'Drizzle' };
      if (code >= 56 && code <= 57) return { emoji: '🌧️❄️', description: 'Freezing Drizzle' };
      if (code >= 61 && code <= 65) return { emoji: '🌧️', description: 'Rain' };
      if (code >= 66 && code <= 67) return { emoji: '🌧️❄️', description: 'Freezing Rain' };
      if (code >= 71 && code <= 77) return { emoji: '❄️', description: 'Snow' };
      if (code >= 80 && code <= 82) return { emoji: '🌦️', description: 'Showers' };
      if (code >= 85 && code <= 86) return { emoji: '🌨️', description: 'Snow Showers' };
      if (code >= 95) return { emoji: '⛈️', description: 'Thunderstorm' };
      return { emoji: isDay ? '☀️' : '🌙', description: 'Unknown' };
    };

    const current = data.current;
    const weatherInfo = weatherCodeToEmoji(current.weather_code, current.is_day === 1);
    
    const result = {
      temperature: Math.round(current.temperature_2m),
      temperatureUnit: '°F',
      emoji: weatherInfo.emoji,
      description: weatherInfo.description,
      isDay: current.is_day === 1,
      location: 'Palisades, NY',
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Weather fetch error:', error);
    
    // Fallback response
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    
    return new Response(JSON.stringify({
      temperature: isDay ? 45 : 38,
      temperatureUnit: '°F',
      emoji: isDay ? '☀️' : '🌙',
      description: 'Weather unavailable',
      isDay,
      location: 'Palisades, NY',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
