import { AppModule } from '@/types/jackos';
import { appModules } from '@/data/appContent';
import { X } from 'lucide-react';

interface ModuleMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: AppModule) => void;
  currentModule: AppModule;
}

export function ModuleMenu({ isOpen, onClose, onSelectModule, currentModule }: ModuleMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm safe-top safe-bottom animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-xl font-semibold">Modules</h2>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Module grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
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
                flex flex-col items-center justify-center gap-2 p-6 rounded-3xl
                transition-all hover:scale-105 active:scale-100
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-card border-2 border-border hover:border-primary/50'
                }
              `}
            >
              <span className="text-4xl">{module.icon}</span>
              <span className="font-semibold">{module.title}</span>
              <span className={`text-xs ${isActive ? 'opacity-80' : 'text-muted-foreground'}`}>
                {module.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
