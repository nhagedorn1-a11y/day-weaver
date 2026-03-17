import { useState } from 'react';
import { ChevronRight, Sparkles, Volume2, Zap, Heart, Star, Lock, AlertTriangle, Power, Shield } from 'lucide-react';
import { useEngagement } from './EngagementProvider';
import { SLIDER_META, type EngagementSliders } from './EngagementConfig';

interface EngagementControlsProps {
  onBack: () => void;
}

const AVAILABLE_INTERESTS = [
  'Poppy Playtime', 'Alphabet Lore', 'monsters', 'creepy toys',
  'dinosaurs', 'space', 'robots', 'animals', 'cars', 'trains',
  'superheroes', 'Nerf', 'Minecraft', 'Roblox',
];

export function EngagementControls({ onBack }: EngagementControlsProps) {
  const {
    config,
    updateSlider,
    toggleMaster,
    toggleSetting,
    setDailyCap,
    setBreakInterval,
    setSpecialInterests,
    setPIN,
    verifyPIN,
    isPinRequired,
    sensory,
    engineState,
    sessionMinutes,
    dailyMinutes,
    riskSignals,
    applyPreset,
  } = useEngagement();

  const [activeWarning, setActiveWarning] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pendingSlider, setPendingSlider] = useState<{ key: keyof EngagementSliders; value: number } | null>(null);

  const handleSliderChange = (key: keyof EngagementSliders, value: number) => {
    // Check if PIN required for this level
    if (isPinRequired(key, value) && config.parentLock.pinSet) {
      setPendingSlider({ key, value });
      return;
    }

    const warning = updateSlider(key, value);
    if (warning) {
      setActiveWarning(warning);
      setTimeout(() => setActiveWarning(null), 5000);
    }
  };

  const handlePinSubmit = () => {
    if (verifyPIN(pinInput)) {
      if (pendingSlider) {
        updateSlider(pendingSlider.key, pendingSlider.value);
        setPendingSlider(null);
      }
      setPinInput('');
    }
  };

  const handlePinSetup = () => {
    if (pinInput.length >= 4) {
      setPIN(pinInput);
      setPinInput('');
      setShowPinSetup(false);
    }
  };

  const toggleInterest = (interest: string) => {
    const current = config.specialInterests;
    if (current.includes(interest)) {
      setSpecialInterests(current.filter(i => i !== interest));
    } else {
      setSpecialInterests([...current, interest]);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground">
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back
      </button>

      <div>
        <h2 className="text-xl font-bold text-foreground">Vibe Controls</h2>
        <p className="text-sm text-muted-foreground">Customize engagement — everything is off by default</p>
      </div>

      {/* === MASTER TOGGLE === */}
      <div className={`p-4 rounded-2xl border-2 transition-all ${
        config.toggles.masterEnabled
          ? 'border-token bg-token/5'
          : 'border-border bg-card'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Power className={`w-6 h-6 ${config.toggles.masterEnabled ? 'text-token' : 'text-muted-foreground'}`} />
            <div>
              <p className="font-bold text-foreground">Engagement Engine</p>
              <p className="text-xs text-muted-foreground">
                {config.toggles.masterEnabled ? 'Active — surprise rewards enabled' : 'Off — calm & predictable'}
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleMaster(!config.toggles.masterEnabled)}
            className={`w-14 h-8 rounded-full transition-all relative ${
              config.toggles.masterEnabled ? 'bg-token' : 'bg-muted'
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-card shadow-md absolute top-1 transition-all ${
              config.toggles.masterEnabled ? 'left-7' : 'left-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Risk auto-defaults notice */}
      {riskSignals.isChild && (
        <div className="bg-calm/10 rounded-xl p-3 border border-calm/20 flex items-start gap-2">
          <Shield className="w-4 h-4 text-calm mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            <strong className="text-calm">Child Safety Active</strong> — All engagement defaults to OFF.
            {riskSignals.sensorySensitive && ' Sensory sliders are capped low.'}
            {riskSignals.hasOCD && ' Near-miss and streak mechanics are limited.'}
            {' '}A parent can enable features below.
          </p>
        </div>
      )}

      {/* Active warning */}
      {activeWarning && (
        <div className="bg-accent/10 rounded-xl p-3 border border-accent/30 flex items-start gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <p className="text-xs text-foreground">{activeWarning}</p>
        </div>
      )}

      {/* === PRESETS === */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Quick Presets</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => applyPreset('safe')}
            className="p-3 rounded-xl border-2 border-calm bg-calm/5 text-center hover:bg-calm/10 transition-all"
          >
            <span className="text-xl block mb-1">🧘</span>
            <span className="text-xs font-semibold">Calm & Safe</span>
          </button>
          <button
            onClick={() => applyPreset('moderate')}
            className="p-3 rounded-xl border-2 border-border bg-card text-center hover:border-token/30 transition-all"
          >
            <span className="text-xl block mb-1">⚡</span>
            <span className="text-xs font-semibold">Moderate</span>
          </button>
        </div>
      </div>

      {/* === PER-MECHANIC SLIDERS === */}
      {config.toggles.masterEnabled && (
        <div className="space-y-4">
          <label className="text-sm font-semibold text-foreground">Mechanic Controls</label>
          {SLIDER_META.map(meta => (
            <div key={meta.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <span>{meta.emoji}</span>
                  {meta.label}
                  {meta.requiresPin && config.parentLock.pinSet && (
                    <Lock className="w-3 h-3 text-muted-foreground" />
                  )}
                </label>
                <span className="text-xs text-muted-foreground font-mono w-6 text-right">
                  {config.sliders[meta.key]}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={config.sliders[meta.key]}
                onChange={e => handleSliderChange(meta.key, Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-token"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{meta.lowDesc}</span>
                <span>{meta.highDesc}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === SESSION CAP === */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Session Limits</label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Daily cap</span>
            <span className="text-sm font-mono text-foreground">{config.sessionCap.dailyCapMinutes} min</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={config.sessionCap.dailyCapMinutes}
            onChange={e => setDailyCap(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-calm"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Break reminder</span>
            <span className="text-sm font-mono text-foreground">{config.sessionCap.breakIntervalMinutes} min</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            step="5"
            value={config.sessionCap.breakIntervalMinutes}
            onChange={e => setBreakInterval(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-calm"
          />
        </div>
      </div>

      {/* === TOGGLES === */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Feature Toggles</label>
        {([
          { key: 'effortBadges' as const, label: 'Effort Badges', desc: 'Celebrate attempts, not perfection', safe: true },
          { key: 'specialInterests' as const, label: 'Special Interests', desc: 'Inject favorites into lessons', safe: true },
          { key: 'multipliers' as const, label: 'XP Multipliers', desc: 'Surprise 2×-5× rewards', safe: false },
          { key: 'zeroDelayMode' as const, label: 'Zero-Delay Mode', desc: 'Instant next task, no pauses', safe: false },
        ]).map(toggle => (
          <div key={toggle.key} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">{toggle.label}</p>
              <p className="text-xs text-muted-foreground">{toggle.desc}</p>
            </div>
            <button
              onClick={() => toggleSetting(toggle.key, !config.toggles[toggle.key])}
              className={`w-12 h-7 rounded-full transition-all relative ${
                config.toggles[toggle.key] ? 'bg-calm' : 'bg-muted'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-card shadow-sm absolute top-1 transition-all ${
                config.toggles[toggle.key] ? 'left-6' : 'left-1'
              }`} />
            </button>
          </div>
        ))}
      </div>

      {/* === SPECIAL INTERESTS === */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" />
          Special Interests
        </label>
        <p className="text-xs text-muted-foreground">Pick favorites to see them in lessons and rewards</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_INTERESTS.map(interest => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                config.specialInterests.includes(interest)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* === PARENT LOCK === */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          Parent Lock
        </label>
        {config.parentLock.pinSet ? (
          <p className="text-xs text-muted-foreground">
            PIN is set. Changes above level {config.parentLock.pinThreshold} require PIN.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Set a PIN to prevent unsupervised changes to high engagement levels.</p>
            {showPinSetup ? (
              <div className="flex gap-2">
                <input
                  type="password"
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  placeholder="4+ digit PIN"
                  maxLength={8}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm"
                />
                <button
                  onClick={handlePinSetup}
                  disabled={pinInput.length < 4}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
                >
                  Set
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowPinSetup(true)}
                className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium"
              >
                Set Parent PIN
              </button>
            )}
          </div>
        )}
      </div>

      {/* PIN entry for pending slider */}
      {pendingSlider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setPendingSlider(null)} />
          <div className="relative bg-card border-2 border-border rounded-2xl p-6 max-w-xs w-full space-y-4">
            <h3 className="font-bold text-foreground text-center">Parent PIN Required</h3>
            <p className="text-xs text-muted-foreground text-center">
              Changing this setting above level {config.parentLock.pinThreshold} requires the parent PIN.
            </p>
            <input
              type="password"
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              placeholder="Enter PIN"
              maxLength={8}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-center text-lg tracking-widest"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setPendingSlider(null); setPinInput(''); }}
                className="flex-1 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === STATS === */}
      <div className="bg-muted/50 rounded-2xl p-4 space-y-3 border border-border">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Star className="w-4 h-4 text-token" />
          Usage Stats
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Today</p>
            <p className="font-bold font-mono text-foreground">{dailyMinutes}m / {config.sessionCap.dailyCapMinutes}m</p>
          </div>
          <div>
            <p className="text-muted-foreground">Session</p>
            <p className="font-bold font-mono text-foreground">{sessionMinutes}m</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Attempts</p>
            <p className="font-bold font-mono text-foreground">{engineState.totalAttempts}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Surprises Found</p>
            <p className="font-bold font-mono text-foreground">{engineState.lifetimeSurprises}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Badges</p>
            <p className="font-bold font-mono text-foreground">{engineState.earnedBadges.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Streak</p>
            <p className="font-bold font-mono text-foreground">{engineState.streakDays} day{engineState.streakDays !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Ethical transparency */}
      <div className="bg-calm/10 rounded-xl p-3 border border-calm/20">
        <p className="text-xs text-muted-foreground">
          💡 This app uses optional engagement features (surprise rewards, streaks, effects) to motivate learning.
          There are <strong>no penalties</strong> — you can only earn, never lose.
          All features default to OFF for child profiles and can be fully controlled here.
          Break reminders and daily caps are always enforced.
        </p>
      </div>
    </div>
  );
}
