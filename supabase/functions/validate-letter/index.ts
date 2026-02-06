import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { image, letter } = await req.json();

    if (!image || !letter) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: image, letter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Validating letter "${letter}" with AI vision`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a kind handwriting teacher for young children (ages 4-7). You evaluate whether a child's drawing on a canvas is a reasonable attempt at writing a specific letter or number.

Rules for evaluation:
- Be encouraging but honest. Children's handwriting is wobbly — that's OK.
- The letter should be RECOGNIZABLE as the target character, even if imperfect.
- A random scribble, line, or completely different letter should be rejected.
- Consider both uppercase and lowercase forms based on what was asked.
- The drawing is white lines on a dark/transparent background on a small canvas.
- Focus on overall shape recognition, not perfection.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Is this a reasonable attempt at writing the character "${letter}"? Look at the drawn strokes (the colored lines) and ignore any faint guide letters or grid lines in the background.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "evaluate_handwriting",
              description:
                "Evaluate whether the child's handwriting attempt matches the target letter.",
              parameters: {
                type: "object",
                properties: {
                  valid: {
                    type: "boolean",
                    description:
                      "true if the drawing is a recognizable attempt at the target letter, false otherwise",
                  },
                  feedback: {
                    type: "string",
                    description:
                      "A short, encouraging feedback message for the child (max 10 words). If valid, praise them. If not, give a gentle, specific hint about what to improve.",
                  },
                },
                required: ["valid", "feedback"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: {
          type: "function",
          function: { name: "evaluate_handwriting" },
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data));

    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      console.log(`AI verdict for "${letter}": valid=${result.valid}, feedback="${result.feedback}"`);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: if no tool call, try to parse content
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      console.log("AI returned text instead of tool call:", content);
      // Default to accepting if we can't parse
      return new Response(
        JSON.stringify({ valid: true, feedback: "Good effort!" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Unexpected AI response format");
  } catch (error) {
    console.error("validate-letter error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
