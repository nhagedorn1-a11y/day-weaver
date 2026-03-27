import { forwardRef } from 'react';
import { AppModule } from '@/types/jackos';
import { appModules } from '@/data/appContent';
import { X, ChevronRight, Settings } from 'lucide-react';

interface ModuleMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: AppModule) => void;
  onOpenSettings: () => void;
  currentModule: AppModule;
}

export const ModuleMenu = forwardRef<HTMLDivElement, ModuleMenuProps>(
  function ModuleMenu({ isOpen, onClose, onSelectModule, onOpenSettings, currentModule }, ref) {
    if (!isOpen) return null;

    return (
      <div ref={ref} className="fixed inset-0 z-50 animate-fade-in">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/95"
          onClick={onClose}
        />
        
        {/* Content */}
        <div className="relative h-full flex flex-col safe-top safe-bottom">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border animate-slide-down">
            <div>
              <h2 className="text-base font-semibold">Modules</h2>
              <p className="text-xs text-muted-foreground">Choose an activity</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center transition-colors hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Module grid */}
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-2 gap-3 stagger-children">
              {appModules.map((module) => {
                const isActive = module.id === currentModule;
                
                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      onSelectModule(module.id);
                      onClose();
                    }}
                    className={`
                      group flex flex-col items-center justify-center gap-2.5 p-4 rounded-lg
                      transition-all active:scale-[0.98]
                      ${isActive 
                        ? 'bg-primary text-primary-foreground border border-primary' 
                        : 'bg-card border border-border hover:bg-muted/50'
                      }
                    `}
                    style={{ boxShadow: isActive ? undefined : 'var(--shadow-card)' }}
                  >
                    <div className={`
                      w-11 h-11 rounded-lg flex items-center justify-center
                      ${isActive ? 'bg-primary-foreground/15' : 'bg-muted'}
                      transition-colors
                    `}>
                      <span className="text-2xl">{module.icon}</span>
                    </div>
                    
                    <div className="text-center">
                      <span className="font-medium text-sm block">{module.title}</span>
                      <span className={`text-[11px] mt-0.5 block ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {module.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings Button */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="w-full p-3 rounded-lg bg-card border border-border flex items-center gap-3 hover:bg-muted/50 transition-colors active:scale-[0.99]"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">Settings</p>
                <p className="text-xs text-muted-foreground">Sound, display, account</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);
