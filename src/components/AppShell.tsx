import { useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Loader2, WifiOff, RefreshCw } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
  requireAuth?: boolean;
}

type AppStatus = 'initializing' | 'ready' | 'offline' | 'error';

interface AppState {
  status: AppStatus;
  user: User | null;
  session: Session | null;
  isOnline: boolean;
  error: string | null;
}

export function AppShell({ children, requireAuth = false }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [appState, setAppState] = useState<AppState>({
    status: 'initializing',
    user: null,
    session: null,
    isOnline: navigator.onLine,
    error: null,
  });

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setAppState(prev => ({ ...prev, isOnline: true, status: prev.status === 'offline' ? 'ready' : prev.status }));
    };
    const handleOffline = () => {
      setAppState(prev => ({ ...prev, isOnline: false, status: 'offline' }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auth state management
  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAppState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        status: 'ready',
      }));
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setAppState(prev => ({
          ...prev,
          status: 'error',
          error: error.message,
        }));
        return;
      }

      setAppState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        status: 'ready',
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auth redirect logic
  useEffect(() => {
    if (appState.status !== 'ready') return;
    
    const isAuthPage = location.pathname === '/auth';
    
    // If auth required and no user, redirect to auth (unless already there)
    if (requireAuth && !appState.user && !isAuthPage) {
      navigate('/auth', { replace: true });
    }
  }, [appState.status, appState.user, requireAuth, location.pathname, navigate]);

  // Loading state
  if (appState.status === 'initializing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Offline state
  if (appState.status === 'offline') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-muted flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">You're offline</h1>
            <p className="text-muted-foreground">
              Some features need an internet connection. You can still use timers and basic activities.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          {/* Allow continuing in offline mode */}
          <button
            onClick={() => setAppState(prev => ({ ...prev, status: 'ready' }))}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue in offline mode →
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (appState.status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-destructive/10 flex items-center justify-center">
            <span className="text-4xl">😕</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">
              {appState.error || 'We had trouble loading the app. Please try again.'}
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Reload App
          </button>
        </div>
      </div>
    );
  }

  // Ready - render children
  return <>{children}</>;
}

// Export a hook for components to access app state
export function useAppState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, isLoading, isAuthenticated: !!user };
}
