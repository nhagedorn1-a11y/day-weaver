import { useState } from 'react';
import { Calendar, RefreshCw, Link2, Unlink, Download, Upload, Check, ExternalLink } from 'lucide-react';
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
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50 border border-border">
        <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <span className="text-sm font-medium text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!status.connected) {
    return (
      <button
        onClick={connect}
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-md active:scale-[0.98] transition-all"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Calendar className="w-4 h-4 text-primary" />
        </div>
        <div className="text-left">
          <span className="text-sm font-semibold block">Connect Calendar</span>
          <span className="text-[10px] text-muted-foreground">Sync with Google</span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground ml-1" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isSyncing}
        className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all ${
          isSyncing 
            ? 'bg-primary/10 border-primary/30' 
            : 'bg-gradient-to-r from-calm/10 to-next/10 border-calm/30 hover:border-calm/50 hover:shadow-md'
        }`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          isSyncing ? 'bg-primary/20' : 'bg-calm/20'
        }`}>
          {isSyncing ? (
            <RefreshCw className="w-4 h-4 text-primary animate-spin" />
          ) : (
            <Calendar className="w-4 h-4 text-calm" />
          )}
        </div>
        <div className="text-left">
          <span className="text-sm font-semibold block flex items-center gap-1.5">
            Calendar
            <Check className="w-3.5 h-3.5 text-calm" />
          </span>
          <span className="text-[10px] text-muted-foreground">
            {isSyncing ? 'Syncing...' : 'Connected'}
          </span>
        </div>
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)} 
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-card rounded-2xl border border-border shadow-xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="px-4 py-3 bg-muted/30 border-b border-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-calm" />
                <span className="font-semibold text-sm">Google Calendar</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={handlePull}
                disabled={isSyncing}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold">Import Events</p>
                  <p className="text-xs text-muted-foreground">Pull today's events</p>
                </div>
              </button>

              <button
                onClick={handlePush}
                disabled={isSyncing}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-calm/10 flex items-center justify-center group-hover:bg-calm/20 transition-colors">
                  <Upload className="w-5 h-5 text-calm" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold">Export Schedule</p>
                  <p className="text-xs text-muted-foreground">Push {tasks.filter(t => !t.completed).length} activities</p>
                </div>
              </button>
            </div>

            {/* Disconnect */}
            <div className="p-2 pt-0 border-t border-border mt-1">
              <button
                onClick={() => {
                  disconnect();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-destructive/10 text-destructive/80 hover:text-destructive transition-colors"
              >
                <Unlink className="w-4 h-4" />
                <span className="text-sm font-medium">Disconnect Calendar</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
