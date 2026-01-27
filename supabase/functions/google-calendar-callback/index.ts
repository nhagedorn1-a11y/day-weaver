import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')!;
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return new Response(generateHtml('error', 'Authorization was denied'), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (!code || !state) {
      return new Response(generateHtml('error', 'Missing authorization code'), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Parse state to get userId
    let userId: string;
    try {
      const stateData = JSON.parse(decodeURIComponent(state));
      userId = stateData.userId;
    } catch {
      return new Response(generateHtml('error', 'Invalid state parameter'), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Exchange code for tokens
    const redirectUri = `${SUPABASE_URL}/functions/v1/google-calendar-callback`;
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return new Response(generateHtml('error', 'Failed to exchange authorization code'), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const tokens = await tokenResponse.json();
    console.log('Successfully obtained tokens for user:', userId);

    // Store tokens in database using service role
    const supabaseAdmin = createClient(
      SUPABASE_URL,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    const { error: upsertError } = await supabaseAdmin
      .from('google_calendar_tokens')
      .upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: expiresAt.toISOString(),
        calendar_id: 'primary',
      }, { onConflict: 'user_id' });

    if (upsertError) {
      console.error('Failed to store tokens:', upsertError);
      return new Response(generateHtml('error', 'Failed to save connection'), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    console.log('Successfully stored tokens for user:', userId);
    return new Response(generateHtml('success', 'Google Calendar connected!'), {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Callback error:', error);
    return new Response(generateHtml('error', 'An unexpected error occurred'), {
      headers: { 'Content-Type': 'text/html' },
    });
  }
});

function generateHtml(status: 'success' | 'error', message: string): string {
  const emoji = status === 'success' ? '✅' : '❌';
  const color = status === 'success' ? '#22c55e' : '#ef4444';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Google Calendar Connection</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      max-width: 400px;
    }
    .emoji { font-size: 4rem; margin-bottom: 1rem; }
    h1 { color: ${color}; margin: 0 0 0.5rem 0; font-size: 1.5rem; }
    p { color: #64748b; margin: 0 0 1.5rem 0; }
    .close-btn {
      background: ${color};
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      font-weight: 600;
    }
    .close-btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">${emoji}</div>
    <h1>${status === 'success' ? 'Connected!' : 'Connection Failed'}</h1>
    <p>${message}</p>
    <button class="close-btn" onclick="window.close(); window.opener?.postMessage('calendar-connected', '*');">
      Close Window
    </button>
  </div>
  <script>
    // Notify parent window and close
    if (window.opener) {
      window.opener.postMessage('calendar-${status}', '*');
    }
    setTimeout(() => { try { window.close(); } catch(e) {} }, 3000);
  </script>
</body>
</html>
  `;
}
