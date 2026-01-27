import { Plus, RotateCcw, Pause, MessageSquare } from 'lucide-react';

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
    { id: 'extend', icon: Plus, label: '+2 min', onClick: onExtendTime },
    { id: 'swap', icon: RotateCcw, label: 'Swap', onClick: onSwapOrder },
    { id: 'pause', icon: Pause, label: 'Pause', onClick: onPause },
    { id: 'note', icon: MessageSquare, label: 'Note', onClick: onAddNote },
  ];

  return (
    <div className="flex items-center gap-2 p-4 bg-secondary/50 rounded-2xl">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className="parent-button flex-1 flex-col py-3"
        >
          <action.icon className="w-4 h-4 mb-1" />
          <span className="text-xs">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
