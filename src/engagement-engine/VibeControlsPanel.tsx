import { ChevronRight, Sparkles, Volume2, Zap, Heart, Star } from 'lucide-react';
import { useEngagement, VibeMode } from './EngagementProvider';
import { childProfile } from '@/data/childProfile';

interface VibeControlsPanelProps {
  onBack: () => void;
}

const VIBE_MODES: Array<{ id: VibeMode; label: string; emoji: string; description: string }> = [
  { id: 'calm', label: 'Calm', emoji: '🧘', description: 'Soft, gentle celebrations' },
  { id: 'balanced', label: 'Balanced', emoji: '⚖️', description: 'Medium effects' },
  { id: 'energized', label: 'Energized', emoji: '⚡', description: 'Big, exciting celebrations' },
];

const AVAILABLE_INTERESTS = [
  'Poppy Playtime', 'Alphabet Lore', 'monsters', 'creepy toys',
  'dinosaurs', 'space', 'robots', 'animals', 'cars', 'trains',
  'superheroes', 'Nerf', 'Minecraft', 'Roblox',
];

export function VibeControlsPanel({ onBack }: VibeControlsPanelProps) {
  const {
    vibe,
    setVibeMode,
    setParticleIntensity,
    setSoundIntensity,
    setSpecialInterests,
    state,
    sessionMinutes,
    dailyMinutes,
  } = useEngagement();

  const toggleInterest = (interest: string) => {
    const current = vibe.specialInterests;
    if (current.includes(interest)) {
      setSpecialInterests(current.filter(i => i !== interest));
    } else {
      setSpecialInterests([...current, interest]);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back
      </button>

      <div>
        <h2 className="text-xl font-bold text-foreground">Vibe Controls</h2>
        <p className="text-sm text-muted-foreground">Customize how celebrations feel</p>
      </div>

      {/* Vibe Mode Selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Celebration Style</label>
        <div className="grid grid-cols-3 gap-2">
          {VIBE_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => setVibeMode(mode.id)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                vibe.mode === mode.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <span className="text-2xl block mb-1">{mode.emoji}</span>
              <span className="text-xs font-semibold">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Particle Intensity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-token" />
            Sparkle Amount
          </label>
          <span className="text-xs text-muted-foreground font-mono">
            {Math.round(vibe.particleIntensity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(vibe.particleIntensity * 100)}
          onChange={e => setParticleIntensity(Number(e.target.value) / 100)}
          className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-token"
        />
      </div>

      {/* Sound Intensity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-calm" />
            Sound Effects
          </label>
          <span className="text-xs text-muted-foreground font-mono">
            {Math.round(vibe.soundIntensity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(vibe.soundIntensity * 100)}
          onChange={e => setSoundIntensity(Number(e.target.value) / 100)}
          className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-calm"
        />
      </div>

      {/* Special Interests */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" />
          Special Interests
        </label>
        <p className="text-xs text-muted-foreground">
          Pick favorites to see them in lessons and rewards
        </p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_INTERESTS.map(interest => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                vibe.specialInterests.includes(interest)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-muted/50 rounded-2xl p-4 space-y-3 border border-border">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Star className="w-4 h-4 text-token" />
          Engagement Stats
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Total Attempts</p>
            <p className="font-bold font-mono text-foreground">{state.totalAttempts}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Surprises Found</p>
            <p className="font-bold font-mono text-foreground">{state.lifetimeSurprises}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Badges Earned</p>
            <p className="font-bold font-mono text-foreground">{state.earnedBadges.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Session Time</p>
            <p className="font-bold font-mono text-foreground">{sessionMinutes}m</p>
          </div>
        </div>
      </div>

      {/* Ethical transparency */}
      <div className="bg-calm/10 rounded-xl p-3 border border-calm/20">
        <p className="text-xs text-muted-foreground">
          💡 This app uses surprise rewards and celebrations to make learning exciting. 
          There are no penalties — you can only earn, never lose. 
          Break reminders help keep your brain fresh!
        </p>
      </div>
    </div>
  );
}
