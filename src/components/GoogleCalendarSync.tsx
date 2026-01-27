import { useState } from 'react';
import { Calendar, RefreshCw, Link2, Unlink, Download, Upload } from 'lucide-react';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';
import { Task } from '@/types/jackos';

interface GoogleCalendarSyncProps {
  tasks: Task[];
  onImportTasks: (tasks: Task[]) => void;
}

export function GoogleCalendarSync({ tasks, onImportTasks }: GoogleCalendarSyncProps) {
  const { status, isLoading, isSyncing, connect, disconnect, pullEvents, pushTasks } = useGoogleCalendar();
  const [showMenu, setShowMenu] = useState(false);

  const handlePull = async () => {
    const events = await pullEvents();
    if (events.length > 0) {
      // Convert to Task format with proper IDs
      const importedTasks: Task[] = events.map((e: any) => ({
        id: `gcal-${e.id}`,
        title: e.title,
        icon: 'calendar',
        duration: e.duration || 30,
        completed: false,
        tokens: 1,
        category: 'routine' as const,
        scheduledTime: e.scheduledTime,
      }));
      onImportTasks(importedTasks);
    }
    setShowMenu(false);
  };

  const handlePush = async () => {
    await pushTasks(tasks);
    setShowMenu(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted animate-pulse">
        <Calendar className="w-4 h-4" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!status.connected) {
    return (
      <button
        onClick={connect}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-md active:scale-[0.98] transition-all"
      >
        <Calendar className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Connect Google Calendar</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isSyncing}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
          isSyncing 
            ? 'bg-primary/10 border-primary/30' 
            : 'bg-card border-calm/50 hover:border-calm hover:shadow-md'
        }`}
      >
        {isSyncing ? (
          <RefreshCw className="w-4 h-4 text-primary animate-spin" />
        ) : (
          <Calendar className="w-4 h-4 text-calm" />
        )}
        <span className="text-sm font-medium">
          {isSyncing ? 'Syncing...' : 'Calendar Connected'}
        </span>
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)} 
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-56 bg-card rounded-xl border border-border shadow-lg overflow-hidden">
            <button
              onClick={handlePull}
              disabled={isSyncing}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
            >
              <Download className="w-4 h-4 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium">Import Events</p>
                <p className="text-xs text-muted-foreground">Pull from Google Calendar</p>
              </div>
            </button>
            <button
              onClick={handlePush}
              disabled={isSyncing}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
            >
              <Upload className="w-4 h-4 text-calm" />
              <div className="text-left">
                <p className="text-sm font-medium">Export Schedule</p>
                <p className="text-xs text-muted-foreground">Push to Google Calendar</p>
              </div>
            </button>
            <div className="border-t border-border">
              <button
                onClick={() => {
                  disconnect();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 text-destructive transition-colors"
              >
                <Unlink className="w-4 h-4" />
                <span className="text-sm font-medium">Disconnect</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
