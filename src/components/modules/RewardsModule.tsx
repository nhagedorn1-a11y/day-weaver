import { useState } from 'react';
import { praiseLibrary } from '@/data/appContent';
import { 
  REWARD_TIERS, 
  IPAD_END_RITUAL, 
  IPAD_CLEAN_END_BONUS,
  getTierProgress,
  isIPadReward,
  RewardTier,
  TierReward 
} from '@/data/rewardTiers';
import { ArrowLeft, Star, Sparkles, Clock, Check, X, ChevronRight, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useSound } from '@/contexts/SoundContext';

interface RewardsModuleProps {
  onBack: () => void;
  tokensEarned: number;
  onSpendTokens: (amount: number) => void;
}

type RewardsView = 'home' | 'tier' | 'redeem' | 'ipad-timer' | 'ipad-end';

export function RewardsModule({ onBack, tokensEarned, onSpendTokens }: RewardsModuleProps) {
  const [view, setView] = useState<RewardsView>('home');
  const [selectedTier, setSelectedTier] = useState<RewardTier | null>(null);
  const [selectedReward, setSelectedReward] = useState<TierReward | null>(null);
  const [showPraise, setShowPraise] = useState(false);
  const [currentPraise, setCurrentPraise] = useState('');
  const { playTokenEarned, playComplete } = useSound();
  
  // iPad timer state
  const [iPadTimeRemaining, setIPadTimeRemaining] = useState(0);
  const [iPadTimerRunning, setIPadTimerRunning] = useState(false);
  const [showTwoMinWarning, setShowTwoMinWarning] = useState(false);
  const [iPadEndStep, setIPadEndStep] = useState(0);

  const progress = getTierProgress(tokensEarned);

  const handleRedeem = (tier: RewardTier, reward: TierReward) => {
    if (tokensEarned < tier.tokenCost) {
      toast.error("Not enough tokens yet!");
      return;
    }

    // Spend tokens
    onSpendTokens(tier.tokenCost);
    playComplete();
    
    // If iPad reward, start the iPad timer
    if (reward.isIPad && reward.duration) {
      setSelectedReward(reward);
      setIPadTimeRemaining(reward.duration * 60); // Convert to seconds
      setView('ipad-timer');
      setIPadTimerRunning(true);
      startIPadTimer(reward.duration * 60);
    } else {
      toast.success(`Redeemed: ${reward.title}! 🎉`, {
        description: reward.description,
      });
      setView('home');
    }
  };

  const startIPadTimer = (seconds: number) => {
    const interval = setInterval(() => {
      setIPadTimeRemaining(prev => {
        if (prev <= 121 && prev > 120 && !showTwoMinWarning) {
          setShowTwoMinWarning(true);
          toast.warning('⚠️ 2 minutes remaining!', { duration: 5000 });
        }
        if (prev <= 1) {
          clearInterval(interval);
          setIPadTimerRunning(false);
          setView('ipad-end');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleIPadEndStep = (stepIndex: number) => {
    if (stepIndex === IPAD_END_RITUAL.length - 1) {
      // Clean ending!
      playTokenEarned();
      toast.success(`+${IPAD_CLEAN_END_BONUS} bonus token for clean ending! 🌟`);
      // Note: The parent component should handle adding the bonus token
      setView('home');
      setSelectedReward(null);
      setShowTwoMinWarning(false);
      setIPadEndStep(0);
    } else {
      setIPadEndStep(stepIndex + 1);
    }
  };

  const handlePraise = () => {
    const randomPraise = praiseLibrary[Math.floor(Math.random() * praiseLibrary.length)];
    setCurrentPraise(randomPraise.phrase);
    setShowPraise(true);
    setTimeout(() => setShowPraise(false), 3000);
  };

  // Praise popup
  if (showPraise) {
    return (
      <div className="fixed inset-0 z-50 bg-token/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <Sparkles className="w-16 h-16 text-token-foreground mb-6 animate-float" />
        <p className="text-3xl font-bold text-token-foreground mb-8">
          "{currentPraise}"
        </p>
        <button
          onClick={() => setShowPraise(false)}
          className="px-8 py-3 rounded-xl bg-token-foreground/20 text-token-foreground font-semibold"
        >
          Thanks!
        </button>
      </div>
    );
  }

  // iPad End Ritual
  if (view === 'ipad-end') {
    const currentStep = IPAD_END_RITUAL[iPadEndStep];
    
    return (
      <div className="min-h-screen bg-primary flex flex-col">
        <header className="flex items-center gap-4 p-4 safe-top">
          <div className="flex-1 text-center">
            <h1 className="font-semibold text-lg text-primary-foreground">iPad Time is Done!</h1>
            <span className="text-primary-foreground/70 text-sm">Follow the steps</span>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {/* Progress dots */}
          <div className="flex gap-2 mb-8">
            {IPAD_END_RITUAL.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < iPadEndStep ? 'bg-primary-foreground' : 
                  i === iPadEndStep ? 'bg-primary-foreground animate-pulse' : 
                  'bg-primary-foreground/30'
                }`}
              />
            ))}
          </div>

          {/* Current step */}
          <div className="text-8xl mb-6">{currentStep.emoji}</div>
          <p className="text-2xl font-bold text-primary-foreground text-center mb-8">
            {currentStep.instruction}
          </p>

          <button
            onClick={() => handleIPadEndStep(iPadEndStep)}
            className="giant-button bg-primary-foreground text-primary"
          >
            <Check className="w-6 h-6" />
            <span>Done!</span>
          </button>
        </div>
      </div>
    );
  }

  // iPad Timer
  if (view === 'ipad-timer' && selectedReward) {
    const minutes = Math.floor(iPadTimeRemaining / 60);
    const seconds = iPadTimeRemaining % 60;
    const isLowTime = iPadTimeRemaining <= 120;
    
    return (
      <div className={`min-h-screen flex flex-col ${isLowTime ? 'bg-destructive' : 'bg-calm'}`}>
        <header className="flex items-center gap-4 p-4 safe-top">
          <div className="flex-1 text-center">
            <h1 className="font-semibold text-lg text-white">iPad Time</h1>
            <span className="text-white/70 text-sm">{selectedReward.title}</span>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-8xl mb-6">📱</div>
          
          <div className={`font-mono text-7xl font-bold mb-4 ${isLowTime ? 'text-white animate-pulse' : 'text-white'}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>

          {isLowTime && (
            <div className="bg-white/20 rounded-2xl px-6 py-3 mb-6">
              <p className="text-white font-semibold text-center">
                ⚠️ Almost done! Get ready to save!
              </p>
            </div>
          )}

          <div className="bg-white/10 rounded-2xl p-4 w-full max-w-sm">
            <p className="text-white/80 text-sm text-center">
              Clean ending = +1 bonus token next time!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tier Detail View
  if (view === 'tier' && selectedTier) {
    const canAfford = tokensEarned >= selectedTier.tokenCost;
    
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button 
            onClick={() => setView('home')} 
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Tier {selectedTier.tier}: {selectedTier.name}</h1>
            <span className="hw-label">{selectedTier.subtitle}</span>
          </div>
          <div className={`px-3 py-1 rounded-full ${selectedTier.color} text-white text-sm font-bold`}>
            {selectedTier.tokenCost === 0 ? 'Free' : `${selectedTier.tokenCost} 🪙`}
          </div>
        </header>

        {!canAfford && selectedTier.tokenCost > 0 && (
          <div className="mx-4 mt-4 p-4 rounded-2xl bg-muted flex items-center gap-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Need {selectedTier.tokenCost - tokensEarned} more tokens to unlock
            </p>
          </div>
        )}

        <div className="p-4 grid grid-cols-2 gap-3">
          {selectedTier.rewards.map((reward) => (
            <button
              key={reward.id}
              onClick={() => canAfford && handleRedeem(selectedTier, reward)}
              disabled={!canAfford && selectedTier.tokenCost > 0}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-left
                ${canAfford || selectedTier.tokenCost === 0
                  ? 'bg-card border-border hover:border-token hover:scale-105' 
                  : 'bg-muted/50 border-muted opacity-50'
                }
                ${reward.isIPad ? 'ring-2 ring-primary ring-offset-2' : ''}
              `}
            >
              <span className="text-4xl">{reward.emoji}</span>
              <span className="font-medium text-sm text-center">{reward.title}</span>
              {reward.duration && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{reward.duration} min</span>
                </div>
              )}
              {reward.isIPad && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                  iPad
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Home View
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Rewards Store</h1>
          <span className="hw-label">iPad at Tier 4+</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-token/20 rounded-full">
          <span className="text-lg">🪙</span>
          <span className="font-mono font-bold text-token">{tokensEarned}</span>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Token Progress */}
        <div className="bg-card rounded-3xl p-5 border-2 border-border">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Your Progress</span>
            <span className="text-sm text-muted-foreground">
              {progress.tokensToNext > 0 
                ? `${progress.tokensToNext} to Tier ${progress.nextTier}` 
                : 'Max tier!'}
            </span>
          </div>
          
          {/* Tier milestone bar */}
          <div className="relative h-8 bg-muted rounded-full overflow-hidden mb-3">
            {/* Tier markers */}
            <div className="absolute inset-0 flex">
              <div className="w-[20%] border-r border-background/50" /> {/* 3 tokens = 20% */}
              <div className="w-[20%] border-r border-background/50" /> {/* 6 tokens = 40% */}
              <div className="w-[26.7%] border-r border-background/50" /> {/* 10 tokens = 66.7% */}
              <div className="flex-1" /> {/* 15 tokens = 100% */}
            </div>
            
            {/* Progress fill */}
            <div 
              className="h-full bg-gradient-to-r from-calm via-next to-token transition-all duration-500"
              style={{ width: `${Math.min((tokensEarned / 15) * 100, 100)}%` }}
            />
            
            {/* Token count */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono font-bold text-white drop-shadow-lg">{tokensEarned}/15</span>
            </div>
          </div>

          {/* Tier labels */}
          <div className="flex text-xs text-muted-foreground">
            <div className="w-[20%] text-center">
              <span className={tokensEarned >= 3 ? 'text-calm font-bold' : ''}>T2</span>
            </div>
            <div className="w-[20%] text-center">
              <span className={tokensEarned >= 6 ? 'text-next font-bold' : ''}>T3</span>
            </div>
            <div className="w-[26.7%] text-center">
              <span className={tokensEarned >= 10 ? 'text-primary font-bold' : ''}>📱T4</span>
            </div>
            <div className="flex-1 text-center">
              <span className={tokensEarned >= 15 ? 'text-token font-bold' : ''}>👑T5</span>
            </div>
          </div>
        </div>

        {/* Quick praise button */}
        <button
          onClick={handlePraise}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-token to-primary text-white font-semibold flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>Give Praise!</span>
        </button>

        {/* Reward Tiers */}
        <div className="space-y-3">
          {REWARD_TIERS.map((tier) => {
            const canAfford = tokensEarned >= tier.tokenCost;
            const hasIPad = tier.rewards.some(r => r.isIPad);
            
            return (
              <button
                key={tier.tier}
                onClick={() => {
                  setSelectedTier(tier);
                  setView('tier');
                }}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
                  ${canAfford || tier.tokenCost === 0
                    ? 'bg-card border-border hover:border-primary/50' 
                    : 'bg-muted/30 border-muted'
                  }
                `}
              >
                <div className={`w-14 h-14 rounded-2xl ${tier.color} flex items-center justify-center`}>
                  <span className="text-2xl">{tier.emoji}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Tier {tier.tier}: {tier.name}</span>
                    {hasIPad && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">iPad</span>}
                  </div>
                  <span className="text-sm text-muted-foreground">{tier.subtitle}</span>
                  <span className="text-xs text-muted-foreground block">
                    {tier.rewards.length} rewards • {tier.tokenCost === 0 ? 'Instant' : `${tier.tokenCost} tokens`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!canAfford && tier.tokenCost > 0 && <Lock className="w-4 h-4 text-muted-foreground" />}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Key rule reminder */}
        <div className="bg-muted/50 rounded-2xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Rule:</strong> iPad is for success, not meltdowns.
            <br />
            Offer Tier 1-2 for regulation. 🧘
          </p>
        </div>

        {/* Praise library for parents */}
        <div className="pt-2">
          <span className="hw-label block mb-3">Praise Library (Parents)</span>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {praiseLibrary.slice(0, 6).map((praise) => (
              <div
                key={praise.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
              >
                <span className={`text-xs px-2 py-1 rounded-full ${
                  praise.category === 'effort' ? 'bg-calm/20 text-calm' :
                  praise.category === 'bravery' ? 'bg-token/20 text-token' :
                  praise.category === 'flexibility' ? 'bg-next/20 text-next' :
                  'bg-primary/20 text-primary'
                }`}>
                  {praise.category}
                </span>
                <span className="text-sm">{praise.phrase}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
