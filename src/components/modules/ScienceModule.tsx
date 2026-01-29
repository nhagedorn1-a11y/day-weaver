import { useState, useMemo } from 'react';
import { 
  SCIENCE_LANES, 
  scienceActivities, 
  labCards, 
  getActivitiesByLane,
  getLabCardById 
} from '@/data/scienceActivities';
import { ScienceActivity, LabCard } from '@/types/activities';
import { 
  ArrowLeft, ChevronRight, Clock, Star, Trophy, 
  Volume2, Check, HelpCircle, Lightbulb, BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { useSound } from '@/contexts/SoundContext';

interface ScienceModuleProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

type ScienceView = 'home' | 'lane' | 'activity' | 'cards' | 'cardDetail';

export function ScienceModule({ onBack, onTokensEarned }: ScienceModuleProps) {
  const { speakWord } = useSound();
  const [view, setView] = useState<ScienceView>('home');
  const [selectedLane, setSelectedLane] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<ScienceActivity | null>(null);
  const [selectedCard, setSelectedCard] = useState<LabCard | null>(null);
  const [activityStep, setActivityStep] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [unlockedCards, setUnlockedCards] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);

  const laneActivities = useMemo(() => 
    selectedLane ? getActivitiesByLane(selectedLane) : [],
    [selectedLane]
  );

  const laneInfo = SCIENCE_LANES.find(l => l.id === selectedLane);

  const handleLaneSelect = (laneId: string) => {
    setSelectedLane(laneId);
    setView('lane');
  };

  const handleActivitySelect = (activity: ScienceActivity) => {
    setSelectedActivity(activity);
    setActivityStep(0);
    setShowHint(false);
    setView('activity');
  };

  const handleActivityComplete = () => {
    if (!selectedActivity) return;

    // Unlock lab card if available
    if (selectedActivity.labCardId && !unlockedCards.includes(selectedActivity.labCardId)) {
      setUnlockedCards(prev => [...prev, selectedActivity.labCardId!]);
      const card = getLabCardById(selectedActivity.labCardId);
      if (card) {
        toast.success(`🔬 New Lab Card: ${card.title}!`);
      }
    }

    onTokensEarned(selectedActivity.tokenReward);
    toast.success(`+${selectedActivity.tokenReward} tokens for science exploration! 🔬`);
    setView('lane');
    setSelectedActivity(null);
  };

  const handleNextStep = () => {
    if (!selectedActivity) return;
    if (activityStep < selectedActivity.instructions.length - 1) {
      setActivityStep(prev => prev + 1);
      setShowHint(false);
    } else {
      handleActivityComplete();
    }
  };

  const handleCardTap = (card: LabCard) => {
    if (unlockedCards.includes(card.id)) {
      setSelectedCard(card);
      setView('cardDetail');
    }
  };

  // Card detail view
  if (view === 'cardDetail' && selectedCard) {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('cards')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">Lab Card</h1>
        </header>

        <div className="p-6 flex flex-col items-center">
          <div className="w-48 h-64 rounded-3xl bg-gradient-to-br from-token/20 to-calm/20 border-4 border-token flex flex-col items-center justify-center p-4 mb-6">
            <span className="text-6xl mb-2">{selectedCard.emoji}</span>
            <h2 className="text-lg font-bold text-center">{selectedCard.title}</h2>
            <span className="text-xs text-muted-foreground capitalize mt-1">{selectedCard.category}</span>
          </div>

          {/* Fun fact with audio */}
          <div className="bg-card rounded-2xl p-4 border border-border mb-4 w-full max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-token" />
              <span className="font-semibold">Fun Fact</span>
              <button 
                onClick={() => speakWord(selectedCard.funFact)}
                className="ml-auto w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Volume2 className="w-4 h-4 text-primary" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{selectedCard.funFact}</p>
          </div>

          {/* Try again challenge */}
          <div className="bg-calm/10 rounded-2xl p-4 border border-calm/30 w-full max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-calm" />
              <span className="font-semibold text-calm">Challenge</span>
            </div>
            <p className="text-sm">{selectedCard.tryAgainChallenge}</p>
          </div>
        </div>
      </div>
    );
  }

  // Cards collection view
  if (view === 'cards') {
    const cardsByCategory = SCIENCE_LANES.map(lane => ({
      ...lane,
      cards: labCards.filter(c => c.category === lane.id),
    }));

    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('home')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Lab Cards</h1>
            <span className="hw-label">{unlockedCards.length} / {labCards.length} collected</span>
          </div>
        </header>

        <div className="p-4 space-y-6">
          {cardsByCategory.map(category => (
            <div key={category.id}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{category.emoji}</span>
                <span className="font-semibold">{category.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {category.cards.filter(c => unlockedCards.includes(c.id)).length}/{category.cards.length}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {category.cards.map(card => {
                  const isUnlocked = unlockedCards.includes(card.id);
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardTap(card)}
                      disabled={!isUnlocked}
                      className={`
                        aspect-square rounded-xl flex flex-col items-center justify-center p-2
                        ${isUnlocked 
                          ? 'bg-card border-2 border-token hover:scale-105 transition-transform' 
                          : 'bg-muted/50 border border-dashed border-muted-foreground/30 opacity-50'
                        }
                      `}
                    >
                      <span className={`text-2xl ${!isUnlocked && 'opacity-30'}`}>
                        {isUnlocked ? card.emoji : '❓'}
                      </span>
                      {isUnlocked && (
                        <span className="text-[10px] font-medium text-center leading-tight mt-1 line-clamp-2">
                          {card.title}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Activity view
  if (view === 'activity' && selectedActivity) {
    const currentStep = selectedActivity.instructions[activityStep];
    const progress = ((activityStep + 1) / selectedActivity.instructions.length) * 100;

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('lane')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold">{selectedActivity.title}</h1>
            <span className="hw-label">Step {activityStep + 1} of {selectedActivity.instructions.length}</span>
          </div>
          <div className="flex items-center gap-1 text-token">
            <Star className="w-4 h-4" />
            <span className="text-sm font-bold">+{selectedActivity.tokenReward}</span>
          </div>
        </header>

        {/* Progress bar */}
        <div className="px-4 pt-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-8xl mb-6">{selectedActivity.icon}</span>
          
          <h2 className="text-2xl font-bold mb-4">{currentStep}</h2>

          {/* Materials (if any and first step) */}
          {selectedActivity.materials && activityStep === 0 && (
            <div className="bg-muted/50 rounded-2xl p-4 mb-6 w-full max-w-sm">
              <span className="text-sm font-semibold block mb-2">You'll need:</span>
              <ul className="text-sm text-muted-foreground text-left">
                {selectedActivity.materials.map((m, i) => (
                  <li key={i}>• {m}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Hint button */}
          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center gap-2 text-muted-foreground mb-4"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Need a hint?</span>
            </button>
          )}

          {showHint && (
            <div className="bg-primary/10 rounded-xl p-3 mb-4 max-w-sm">
              <p className="text-sm">Take your time! There's no wrong answer in science - just observe and explore.</p>
            </div>
          )}

          <button
            onClick={handleNextStep}
            className="giant-button bg-calm text-calm-foreground w-full max-w-xs"
          >
            <Check className="w-6 h-6" />
            <span>{activityStep === selectedActivity.instructions.length - 1 ? 'Complete!' : 'Done with this step'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Lane view
  if (view === 'lane' && laneInfo) {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('home')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-lg">{laneInfo.emoji} {laneInfo.name}</h1>
            <span className="hw-label">{laneActivities.length} activities</span>
          </div>
        </header>

        {/* Duration selector */}
        <div className="p-4 border-b border-border">
          <span className="hw-label block mb-2">Time available</span>
          <div className="flex gap-2">
            {[2, 5, 10, 15].map(mins => (
              <button
                key={mins}
                onClick={() => setSelectedDuration(mins)}
                className={`
                  flex-1 py-2 rounded-xl text-sm font-semibold transition-all
                  ${selectedDuration === mins 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                  }
                `}
              >
                {mins} min
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {laneActivities
            .filter(a => a.durationOptions.includes(selectedDuration))
            .map((activity) => {
              const hasCard = activity.labCardId && !unlockedCards.includes(activity.labCardId);
              
              return (
                <button
                  key={activity.id}
                  onClick={() => handleActivitySelect(activity)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
                >
                  <div className={`w-14 h-14 rounded-2xl ${laneInfo.color} flex items-center justify-center`}>
                    <span className="text-2xl">{activity.icon}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold block">{activity.title}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground capitalize">{activity.type}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star className="w-3 h-3 text-token" /> +{activity.tokenReward}
                      </span>
                      {hasCard && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-xs text-token font-medium">🃏 New card!</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex">
                      {Array.from({ length: activity.difficulty }).map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-primary ml-0.5" />
                      ))}
                      {Array.from({ length: 5 - activity.difficulty }).map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-muted ml-0.5" />
                      ))}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </button>
              );
            })}

          {laneActivities.filter(a => a.durationOptions.includes(selectedDuration)).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No {selectedDuration}-minute activities in this lane.</p>
              <p className="text-sm mt-1">Try a different time!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Home view
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">🔬 Explorer Lab</h1>
          <span className="hw-label">Discover and experiment!</span>
        </div>
        <button
          onClick={() => setView('cards')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-token/10 text-token"
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-sm font-semibold">{unlockedCards.length}</span>
        </button>
      </header>

      <div className="p-4 space-y-4">
        <p className="text-muted-foreground text-center">
          Real-world discovery activities! 🧪
        </p>

        {/* Science lanes grid */}
        <div className="grid grid-cols-2 gap-3">
          {SCIENCE_LANES.map((lane) => {
            const activities = getActivitiesByLane(lane.id);
            const laneCards = labCards.filter(c => c.category === lane.id);
            const unlockedInLane = laneCards.filter(c => unlockedCards.includes(c.id)).length;

            return (
              <button
                key={lane.id}
                onClick={() => handleLaneSelect(lane.id)}
                className="flex flex-col items-center gap-2 p-5 rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-all hover:scale-[1.02]"
              >
                <div className={`w-16 h-16 rounded-2xl ${lane.color} flex items-center justify-center`}>
                  <span className="text-3xl">{lane.emoji}</span>
                </div>
                <span className="font-bold text-center">{lane.name}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{activities.length} activities</span>
                  <span>•</span>
                  <span>🃏 {unlockedInLane}/{laneCards.length}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Lab Cards preview */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Recent Lab Cards</span>
            <button 
              onClick={() => setView('cards')}
              className="text-sm text-primary font-medium"
            >
              See all →
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {unlockedCards.length > 0 ? (
              unlockedCards.slice(-5).map(cardId => {
                const card = getLabCardById(cardId);
                if (!card) return null;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardTap(card)}
                    className="flex-shrink-0 w-16 h-20 rounded-xl bg-gradient-to-br from-token/20 to-calm/20 border-2 border-token flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl">{card.emoji}</span>
                    <span className="text-[9px] font-medium mt-1 text-center line-clamp-1 px-1">{card.title}</span>
                  </button>
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground py-4 w-full text-center">
                Complete activities to collect Lab Cards! 🃏
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
