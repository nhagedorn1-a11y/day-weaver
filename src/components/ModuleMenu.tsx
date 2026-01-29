import { forwardRef } from 'react';
import { AppModule } from '@/types/jackos';
import { appModules } from '@/data/appContent';
import { X, ChevronRight } from 'lucide-react';

interface ModuleMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: AppModule) => void;
  currentModule: AppModule;
}

export const ModuleMenu = forwardRef<HTMLDivElement, ModuleMenuProps>(
  function ModuleMenu({ isOpen, onClose, onSelectModule, currentModule }, ref) {
    if (!isOpen) return null;

    return (
      <div ref={ref} className="fixed inset-0 z-50 animate-fade-in">
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
              <h2 className="text-xl font-bold">Modules</h2>
              <p className="text-sm text-muted-foreground">Choose an activity</p>
            </div>
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm hover:shadow-md transition-shadow touch-bounce"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module grid with staggered animation */}
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
                      group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                      transition-all touch-bounce relative overflow-hidden
                      ${isActive 
                        ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl' 
                        : 'bg-card border-2 border-border hover:border-primary/40 hover:shadow-lg'
                      }
                    `}
                  >
                    {/* Background decoration */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    )}
                    
                    <div className={`
                      relative w-14 h-14 rounded-2xl flex items-center justify-center
                      ${isActive ? 'bg-white/20' : 'bg-muted group-hover:bg-primary/10'}
                      transition-colors
                    `}>
                      <span className="text-3xl">{module.icon}</span>
                    </div>
                    
                    <div className="relative text-center">
                      <span className="font-bold block">{module.title}</span>
                      <span className={`text-xs mt-0.5 block ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {module.description}
                      </span>
                    </div>

                    {isActive && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
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
);
