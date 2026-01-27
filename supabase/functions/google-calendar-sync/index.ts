import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')!;
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;

interface Task {
  id: string;
  title: string;
  scheduledTime?: string;
  duration?: number;
  completed: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const supabase = createClient(
      SUPABASE_URL,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const userId = claims.claims.sub;
    const body = await req.json();
    const { action, tasks, date } = body;

    // Get stored tokens
    const supabaseAdmin = createClient(
      SUPABASE_URL,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('google_calendar_tokens')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (tokenError || !tokenData) {
      return new Response(JSON.stringify({ error: 'Calendar not connected' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Refresh token if expired
    let accessToken = tokenData.access_token;
    if (new Date(tokenData.expires_at) < new Date()) {
      console.log('Refreshing expired token for user:', userId);
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          refresh_token: tokenData.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (!refreshResponse.ok) {
        console.error('Token refresh failed');
        return new Response(JSON.stringify({ error: 'Token expired, please reconnect' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const newTokens = await refreshResponse.json();
      accessToken = newTokens.access_token;

      await supabaseAdmin
        .from('google_calendar_tokens')
        .update({
          access_token: newTokens.access_token,
          expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
        })
        .eq('user_id', userId);
    }

    if (action === 'pull') {
      // Fetch events from Google Calendar
      const targetDate = date || new Date().toISOString().split('T')[0];
      const timeMin = `${targetDate}T00:00:00Z`;
      const timeMax = `${targetDate}T23:59:59Z`;

      const eventsResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${tokenData.calendar_id}/events?` +
        `timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!eventsResponse.ok) {
        const errorText = await eventsResponse.text();
        console.error('Failed to fetch events:', errorText);
        return new Response(JSON.stringify({ error: 'Failed to fetch calendar events' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const eventsData = await eventsResponse.json();
      const events = eventsData.items?.map((event: any) => ({
        id: event.id,
        title: event.summary || 'Untitled Event',
        scheduledTime: event.start?.dateTime 
          ? new Date(event.start.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
          : event.start?.date ? '09:00' : undefined,
        duration: event.end?.dateTime && event.start?.dateTime
          ? Math.round((new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime()) / 60000)
          : 30,
        completed: false,
        googleEventId: event.id,
      })) || [];

      console.log(`Pulled ${events.length} events for user:`, userId);
      return new Response(JSON.stringify({ events }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'push') {
      // Push tasks to Google Calendar
      if (!tasks || !Array.isArray(tasks)) {
        return new Response(JSON.stringify({ error: 'No tasks provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const targetDate = date || new Date().toISOString().split('T')[0];
      const results = [];

      for (const task of tasks as Task[]) {
        // Check if already synced
        const { data: syncData } = await supabaseAdmin
          .from('calendar_sync_events')
          .select('google_event_id')
          .eq('user_id', userId)
          .eq('local_task_id', task.id)
          .maybeSingle();

        const startTime = task.scheduledTime || '09:00';
        const durationMinutes = task.duration || 30;
        const startDateTime = new Date(`${targetDate}T${startTime}:00`);
        const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);

        const eventBody = {
          summary: task.title,
          start: { dateTime: startDateTime.toISOString(), timeZone: 'UTC' },
          end: { dateTime: endDateTime.toISOString(), timeZone: 'UTC' },
        };

        let eventId: string;

        if (syncData?.google_event_id) {
          // Update existing event
          const updateResponse = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${tokenData.calendar_id}/events/${syncData.google_event_id}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(eventBody),
            }
          );

          if (updateResponse.ok) {
            const updatedEvent = await updateResponse.json();
            eventId = updatedEvent.id;
            results.push({ taskId: task.id, status: 'updated', eventId });
          } else {
            results.push({ taskId: task.id, status: 'failed' });
            continue;
          }
        } else {
          // Create new event
          const createResponse = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${tokenData.calendar_id}/events`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(eventBody),
            }
          );

          if (createResponse.ok) {
            const newEvent = await createResponse.json();
            eventId = newEvent.id;

            // Store sync mapping
            await supabaseAdmin
              .from('calendar_sync_events')
              .upsert({
                user_id: userId,
                local_task_id: task.id,
                google_event_id: eventId,
              }, { onConflict: 'user_id,local_task_id' });

            results.push({ taskId: task.id, status: 'created', eventId });
          } else {
            results.push({ taskId: task.id, status: 'failed' });
          }
        }
      }

      console.log(`Pushed ${results.filter(r => r.status !== 'failed').length} events for user:`, userId);
      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Sync error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
