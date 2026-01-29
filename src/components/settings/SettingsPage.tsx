import { X, Volume2, User, Palette, Bell, Cloud, ChevronRight, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';
import { SoundSettingsPanel } from './SoundSettingsPanel';
import { DisplaySettingsPanel } from './DisplaySettingsPanel';

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

type SettingsSection = 'main' | 'sound' | 'display' | 'notifications' | 'account';

export function SettingsPage({ isOpen, onClose, user, onLogin, onLogout }: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('main');

  if (!isOpen) return null;

  const renderSection = () => {
    switch (activeSection) {
      case 'sound':
        return <SoundSettingsPanel onBack={() => setActiveSection('main')} />;
      case 'display':
        return <DisplaySettingsPanel onBack={() => setActiveSection('main')} />;
      case 'notifications':
        return (
          <div className="p-4">
            <button onClick={() => setActiveSection('main')} className="flex items-center gap-2 text-muted-foreground mb-6">
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back
            </button>
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <p className="text-muted-foreground">Notification settings coming soon.</p>
          </div>
        );
      case 'account':
        return (
          <div className="p-4">
            <button onClick={() => setActiveSection('main')} className="flex items-center gap-2 text-muted-foreground mb-6">
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back
            </button>
            <h2 className="text-xl font-bold mb-4">Account</h2>
            {user ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full p-4 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center gap-2 font-medium hover:bg-destructive/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">Sign in to sync your data across devices.</p>
                <button
                  onClick={onLogin}
                  className="w-full p-4 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 font-medium hover:bg-primary/90 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="p-4 space-y-3">
            {/* Sound Settings */}
            <button
              onClick={() => setActiveSection('sound')}
              className="w-full p-4 rounded-xl bg-card border border-border flex items-center gap-4 hover:border-primary/40 hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Sound & Speech</p>
                <p className="text-sm text-muted-foreground">TTS engine, phonemes, volume</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Display Settings */}
            <button
              onClick={() => setActiveSection('display')}
              className="w-full p-4 rounded-xl bg-card border border-border flex items-center gap-4 hover:border-primary/40 hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="w-12 h-12 rounded-xl bg-token/10 flex items-center justify-center">
                <Palette className="w-6 h-6 text-token" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Display</p>
                <p className="text-sm text-muted-foreground">Theme, animations, text size</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => setActiveSection('notifications')}
              className="w-full p-4 rounded-xl bg-card border border-border flex items-center gap-4 hover:border-primary/40 hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="w-12 h-12 rounded-xl bg-calm/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-calm" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Notifications</p>
                <p className="text-sm text-muted-foreground">Reminders, alerts</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Account */}
            <button
              onClick={() => setActiveSection('account')}
              className="w-full p-4 rounded-xl bg-card border border-border flex items-center gap-4 hover:border-primary/40 hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                {user ? (
                  <User className="w-6 h-6 text-secondary-foreground" />
                ) : (
                  <LogIn className="w-6 h-6 text-secondary-foreground" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Account</p>
                <p className="text-sm text-muted-foreground">
                  {user ? user.email : 'Sign in to sync'}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Cloud Status */}
            {user && (
              <div className="mt-6 p-4 rounded-xl bg-calm/10 border border-calm/20">
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-calm" />
                  <div>
                    <p className="font-medium text-calm">Cloud Sync Active</p>
                    <p className="text-sm text-muted-foreground">Your data syncs across devices</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/95 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative h-full flex flex-col safe-top safe-bottom">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border animate-slide-down">
          <div>
            <h2 className="text-xl font-bold">Settings</h2>
            <p className="text-sm text-muted-foreground">
              {activeSection === 'main' ? 'Configure your experience' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm hover:shadow-md transition-shadow touch-bounce"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Content */}
        <div className="flex-1 overflow-auto">
          {renderSection()}
        </div>

        {/* Bottom hint */}
        <div className="p-4 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Tap anywhere outside to close
          </p>
        </div>
      </div>
    </div>
  );
}
