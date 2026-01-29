import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, voiceId = 'EXAVITQu4vr4xnSDxMaL' } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    
    if (!ELEVENLABS_API_KEY) {
      console.error("ELEVENLABS_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating TTS for text: "${text}" with voice: ${voiceId}`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_22050_32`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5", // Fast model for quick phoneme sounds
          voice_settings: {
            stability: 0.8,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
            speed: 0.85, // Slightly slower for clarity
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API error [${response.status}]: ${errorText}`);
      return new Response(
        JSON.stringify({ error: `ElevenLabs API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    console.log(`Generated audio: ${audioBuffer.byteLength} bytes`);

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error: unknown) {
    console.error("Error generating TTS:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate audio';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
