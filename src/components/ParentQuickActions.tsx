import { Plus, RotateCcw, Pause, MessageSquare, Settings } from 'lucide-react';

interface ParentQuickActionsProps {
  onExtendTime: () => void;
  onSwapOrder: () => void;
  onPause: () => void;
  onAddNote: () => void;
}

export function ParentQuickActions({
  onExtendTime,
  onSwapOrder,
  onPause,
  onAddNote,
}: ParentQuickActionsProps) {
  const actions = [
    { id: 'extend', icon: Plus, label: '+2 min', onClick: onExtendTime, color: 'text-calm' },
    { id: 'swap', icon: RotateCcw, label: 'Swap', onClick: onSwapOrder, color: 'text-next' },
    { id: 'pause', icon: Pause, label: 'Pause', onClick: onPause, color: 'text-primary' },
    { id: 'note', icon: MessageSquare, label: 'Note', onClick: onAddNote, color: 'text-token' },
  ];

  return (
    <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-secondary/60 to-muted/40 rounded-2xl border border-border/50">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background/60 rounded-xl">
        <Settings className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">Quick</span>
      </div>
      
      <div className="flex-1 flex gap-1.5">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl bg-card/80 border border-border/50 hover:border-border hover:bg-card hover:shadow-sm active:scale-[0.97] transition-all"
          >
            <action.icon className={`w-4 h-4 ${action.color}`} />
            <span className="text-[10px] font-semibold text-muted-foreground">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
