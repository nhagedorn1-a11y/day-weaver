import { useState } from 'react';
import { ADLMission, FineMotorGame as FineMotorGameType } from '@/types/activities';
import { 
  adlMissions, 
  fineMotorGames, 
  balanceActivities, 
  bilateralActivities 
} from '@/data/motorActivities';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { FineMotorGame } from './motor/FineMotorGame';
import { BalanceActivity } from './motor/BalanceActivity';
import { BilateralActivity } from './motor/BilateralActivity';
import { ADLSteps } from './motor/ADLSteps';
import { ActivityList } from './motor/ActivityList';

interface MotorModuleProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

type MotorView = 
  | 'home' 
  | 'fineMotorList' 
  | 'fineMotorGame'
  | 'balanceList'
  | 'balanceActivity'
  | 'bilateralList'
  | 'bilateralActivity'
  | 'adlList' 
  | 'adlSteps';

interface BalanceActivityType {
  id: string;
  title: string;
  emoji: string;
  instructions: string[];
  difficulty: number;
  moves?: string[];
  poses?: string[];
  speedLevels?: number[];
}

interface BilateralActivityType {
  id: string;
  title: string;
  emoji: string;
  instructions: string[];
  difficulty: number;
  patterns?: string[];
}

// Lane card component for home view
function LaneCard({ 
  emoji, 
  title, 
  subtitle, 
  count,
  onClick 
}: { 
  emoji: string; 
  title: string; 
  subtitle: string; 
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-5 rounded bg-card border-2 border-border hover:border-primary/50 transition-colors"
    >
      <span className="text-5xl">{emoji}</span>
      <div className="flex-1 text-left">
        <span className="font-semibold text-lg block">{title}</span>
        <span className="text-sm text-muted-foreground">{subtitle}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{count}</span>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </button>
  );
}

export function MotorModule({ onBack, onTokensEarned }: MotorModuleProps) {
  const [view, setView] = useState<MotorView>('home');
  const [selectedFineMotorGame, setSelectedFineMotorGame] = useState<FineMotorGameType | null>(null);
  const [selectedBalanceActivity, setSelectedBalanceActivity] = useState<BalanceActivityType | null>(null);
  const [selectedBilateralActivity, setSelectedBilateralActivity] = useState<BilateralActivityType | null>(null);
  const [selectedADL, setSelectedADL] = useState<ADLMission | null>(null);

  // Handle tokens earned
  const handleTokensEarned = (tokens: number) => {
    onTokensEarned(tokens);
    setView('home');
    setSelectedFineMotorGame(null);
    setSelectedBalanceActivity(null);
    setSelectedBilateralActivity(null);
    setSelectedADL(null);
  };

  // Fine Motor Game view
  if (view === 'fineMotorGame' && selectedFineMotorGame) {
    return (
      <FineMotorGame
        game={selectedFineMotorGame}
        onBack={() => setView('fineMotorList')}
        onComplete={handleTokensEarned}
      />
    );
  }

  // Fine Motor List view
  if (view === 'fineMotorList') {
    return (
      <ActivityList
        title="Fine Motor Forge"
        description="Practice pinching, tracing, and tapping to build hand strength."
        items={fineMotorGames}
        onSelect={(item) => {
          setSelectedFineMotorGame(item as FineMotorGameType);
          setView('fineMotorGame');
        }}
        onBack={() => setView('home')}
      />
    );
  }

  // Balance Activity view
  if (view === 'balanceActivity' && selectedBalanceActivity) {
    return (
      <BalanceActivity
        activity={selectedBalanceActivity}
        onBack={() => setView('balanceList')}
        onComplete={handleTokensEarned}
      />
    );
  }

  // Balance List view
  if (view === 'balanceList') {
    return (
      <ActivityList
        title="Balance & Move"
        description="Get moving with coordination and balance activities."
        items={balanceActivities as BalanceActivityType[]}
        onSelect={(item) => {
          setSelectedBalanceActivity(item as BalanceActivityType);
          setView('balanceActivity');
        }}
        onBack={() => setView('home')}
      />
    );
  }

  // Bilateral Activity view
  if (view === 'bilateralActivity' && selectedBilateralActivity) {
    return (
      <BilateralActivity
        activity={selectedBilateralActivity}
        onBack={() => setView('bilateralList')}
        onComplete={handleTokensEarned}
      />
    );
  }

  // Bilateral List view
  if (view === 'bilateralList') {
    return (
      <ActivityList
        title="Two-Hand Skills"
        description="Use both hands together for coordination practice."
        items={bilateralActivities as BilateralActivityType[]}
        onSelect={(item) => {
          setSelectedBilateralActivity(item as BilateralActivityType);
          setView('bilateralActivity');
        }}
        onBack={() => setView('home')}
      />
    );
  }

  // ADL Steps view
  if (view === 'adlSteps' && selectedADL) {
    return (
      <ADLSteps
        mission={selectedADL}
        onBack={() => setView('adlList')}
        onComplete={handleTokensEarned}
      />
    );
  }

  // ADL List view
  if (view === 'adlList') {
    return (
      <ActivityList
        title="Daily Living Skills"
        description="Practice everyday tasks one step at a time. Earn tokens for each step!"
        items={adlMissions.map(m => ({
          ...m,
          steps: m.steps
        }))}
        onSelect={(item) => {
          const mission = adlMissions.find(m => m.id === item.id);
          if (mission) {
            setSelectedADL(mission);
            setView('adlSteps');
          }
        }}
        onBack={() => setView('home')}
      />
    );
  }

  // Home view
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-semibold text-lg">Motor Skills</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Fine motor & coordination
          </span>
        </div>
      </header>

      <div className="p-4 space-y-3">
        {/* Fine Motor Forge */}
        <LaneCard
          emoji="✋"
          title="Fine Motor Forge"
          subtitle="Pinch, trace, cut, drag & tap"
          count={fineMotorGames.length}
          onClick={() => setView('fineMotorList')}
        />

        {/* Balance & Move */}
        <LaneCard
          emoji="🤸"
          title="Balance & Move"
          subtitle="Coordination & movement"
          count={balanceActivities.length}
          onClick={() => setView('balanceList')}
        />

        {/* Bilateral Skills */}
        <LaneCard
          emoji="👐"
          title="Two-Hand Skills"
          subtitle="Bilateral coordination"
          count={bilateralActivities.length}
          onClick={() => setView('bilateralList')}
        />

        {/* ADL Missions */}
        <LaneCard
          emoji="👕"
          title="Daily Living Skills"
          subtitle="Buttons, zippers, shoes & more"
          count={adlMissions.length}
          onClick={() => setView('adlList')}
        />
      </div>
    </div>
  );
}
