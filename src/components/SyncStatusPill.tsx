import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SyncStatus = 'online' | 'syncing' | 'offline' | 'error';

interface SyncStatusPillProps {
  className?: string;
}

export function SyncStatusPill({ className }: SyncStatusPillProps) {
  const [status, setStatus] = useState<SyncStatus>(navigator.onLine ? 'online' : 'offline');
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const handleOnline = () => setStatus('online');
    const handleOffline = () => setStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-hide label after showing
  useEffect(() => {
    if (showLabel) {
      const timer = setTimeout(() => setShowLabel(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showLabel]);

  const config: Record<SyncStatus, { 
    icon: typeof Wifi; 
    label: string; 
    bgClass: string; 
    textClass: string;
    iconClass: string;
  }> = {
    online: {
      icon: Cloud,
      label: 'Connected',
      bgClass: 'bg-calm/10',
      textClass: 'text-calm',
      iconClass: 'text-calm',
    },
    syncing: {
      icon: RefreshCw,
      label: 'Syncing...',
      bgClass: 'bg-primary/10',
      textClass: 'text-primary',
      iconClass: 'text-primary animate-spin',
    },
    offline: {
      icon: WifiOff,
      label: 'Offline',
      bgClass: 'bg-muted',
      textClass: 'text-muted-foreground',
      iconClass: 'text-muted-foreground',
    },
    error: {
      icon: AlertCircle,
      label: 'Sync Error',
      bgClass: 'bg-destructive/10',
      textClass: 'text-destructive',
      iconClass: 'text-destructive',
    },
  };

  const { icon: Icon, label, bgClass, textClass, iconClass } = config[status];

  return (
    <button
      onClick={() => setShowLabel(!showLabel)}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-full transition-all',
        bgClass,
        className
      )}
      aria-label={`Sync status: ${label}`}
    >
      <Icon className={cn('w-4 h-4', iconClass)} />
      {showLabel && (
        <span className={cn('text-xs font-medium animate-fade-in', textClass)}>
          {label}
        </span>
      )}
    </button>
  );
}

// Hook for components that need to check/set sync status
export function useSyncStatus() {
  const [status, setStatus] = useState<SyncStatus>(navigator.onLine ? 'online' : 'offline');

  useEffect(() => {
    const handleOnline = () => setStatus('online');
    const handleOffline = () => setStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { status, setStatus, isOnline: status === 'online' || status === 'syncing' };
}
