import { useState } from 'react';
import { rewards } from '@/data/sampleSchedule';
import { praiseLibrary } from '@/data/appContent';
import { ArrowLeft, Star, Gift, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface RewardsModuleProps {
  onBack: () => void;
  tokensEarned: number;
  onSpendTokens: (amount: number) => void;
}

export function RewardsModule({ onBack, tokensEarned, onSpendTokens }: RewardsModuleProps) {
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [redeemingReward, setRedeemingReward] = useState(false);
  const [showPraise, setShowPraise] = useState(false);
  const [currentPraise, setCurrentPraise] = useState('');

  const handleRedeem = (rewardId: string, cost: number) => {
    if (tokensEarned < cost) {
      toast.error("Not enough tokens yet!");
      return;
    }

    setRedeemingReward(true);
    setSelectedReward(rewardId);

    // Show celebration
    setTimeout(() => {
      onSpendTokens(cost);
      const reward = rewards.find(r => r.id === rewardId);
      toast.success(`You earned: ${reward?.title}! 🎉`);
      setRedeemingReward(false);
      setSelectedReward(null);
    }, 1500);
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

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Rewards Store</h1>
          <span className="hw-label">Spend your tokens!</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-token/20 rounded-full">
          <Star className="w-5 h-5 text-token" />
          <span className="font-mono font-bold text-token">{tokensEarned}</span>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Quick praise button */}
        <button
          onClick={handlePraise}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-token to-primary text-white font-semibold flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>Give Praise!</span>
        </button>

        {/* Rewards by category */}
        {(['small', 'medium', 'big'] as const).map((category) => {
          const categoryRewards = rewards.filter(r => r.category === category);
          const categoryLabels = {
            small: 'Quick Wins',
            medium: 'Good Rewards',
            big: 'Big Rewards',
          };

          return (
            <div key={category}>
              <span className="hw-label block mb-3">{categoryLabels[category]}</span>
              <div className="grid grid-cols-2 gap-3">
                {categoryRewards.map((reward) => {
                  const canAfford = tokensEarned >= reward.cost;
                  const isSelected = selectedReward === reward.id;

                  return (
                    <button
                      key={reward.id}
                      onClick={() => handleRedeem(reward.id, reward.cost)}
                      disabled={!canAfford || redeemingReward}
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
                        ${canAfford 
                          ? 'bg-card border-border hover:border-token hover:scale-105' 
                          : 'bg-muted/50 border-muted opacity-50'
                        }
                        ${isSelected && redeemingReward ? 'scale-110 border-token bg-token/20' : ''}
                      `}
                    >
                      <span className="text-4xl">{reward.icon}</span>
                      <span className="font-medium text-sm text-center">{reward.title}</span>
                      <div className={`flex items-center gap-1 ${canAfford ? 'text-token' : 'text-muted-foreground'}`}>
                        <Star className="w-4 h-4" />
                        <span className="font-mono font-bold">{reward.cost}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Praise library for parents */}
        <div className="pt-4">
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
