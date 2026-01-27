import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/jackos';
import { toast } from 'sonner';

interface CalendarStatus {
  connected: boolean;
  calendarId?: string;
  lastSync?: string;
}

export function useGoogleCalendar() {
  const [status, setStatus] = useState<CalendarStatus>({ connected: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const checkStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus({ connected: false });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('google-calendar-status', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) {
        console.error('Status check error:', error);
        setStatus({ connected: false });
      } else {
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to check calendar status:', error);
      setStatus({ connected: false });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in first');
        return;
      }

      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error || !data?.authUrl) {
        console.error('Auth URL error:', error);
        toast.error('Failed to start connection');
        return;
      }

      // Open OAuth popup
      const popup = window.open(data.authUrl, 'google-calendar-auth', 'width=500,height=600');
      
      // Listen for completion
      const handleMessage = (event: MessageEvent) => {
        if (event.data === 'calendar-success') {
          toast.success('Google Calendar connected!');
          checkStatus();
        } else if (event.data === 'calendar-error') {
          toast.error('Failed to connect calendar');
        }
        window.removeEventListener('message', handleMessage);
      };
      window.addEventListener('message', handleMessage);

      // Poll for popup close
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          checkStatus();
        }
      }, 1000);
    } catch (error) {
      console.error('Connect error:', error);
      toast.error('Failed to connect');
    }
  }, [checkStatus]);

  const disconnect = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.functions.invoke('google-calendar-disconnect', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) {
        console.error('Disconnect error:', error);
        toast.error('Failed to disconnect');
      } else {
        setStatus({ connected: false });
        toast.success('Calendar disconnected');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error('Failed to disconnect');
    }
  }, []);

  const pullEvents = useCallback(async (date?: string): Promise<Task[]> => {
    setIsSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in first');
        return [];
      }

      const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { action: 'pull', date },
      });

      if (error) {
        console.error('Pull error:', error);
        toast.error('Failed to fetch calendar events');
        return [];
      }

      toast.success(`Pulled ${data.events?.length || 0} events`);
      return data.events || [];
    } catch (error) {
      console.error('Pull error:', error);
      toast.error('Failed to fetch events');
      return [];
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const pushTasks = useCallback(async (tasks: Task[], date?: string) => {
    setIsSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in first');
        return;
      }

      const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { action: 'push', tasks, date },
      });

      if (error) {
        console.error('Push error:', error);
        toast.error('Failed to sync to calendar');
        return;
      }

      const successCount = data.results?.filter((r: any) => r.status !== 'failed').length || 0;
      toast.success(`Synced ${successCount} activities to calendar`);
    } catch (error) {
      console.error('Push error:', error);
      toast.error('Failed to sync');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    status,
    isLoading,
    isSyncing,
    connect,
    disconnect,
    pullEvents,
    pushTasks,
    checkStatus,
  };
}
