import { useState } from 'react';
import { ReadingProfile } from '@/types/reading';
import { readingLessons } from '@/data/readingLessons';
import { ArrowLeft, Check, Clock, Star } from 'lucide-react';

interface ReadingSetupProps {
  profile: ReadingProfile;
  onSave: (updates: Partial<ReadingProfile>) => void;
  onBack: () => void;
}

export function ReadingSetup({ profile, onSave, onBack }: ReadingSetupProps) {
  const [sessionMinutes, setSessionMinutes] = useState(profile.sessionMinutes);
  const [tokenRewardEnabled, setTokenRewardEnabled] = useState(profile.tokenRewardEnabled);
  const [selectedLessonId, setSelectedLessonId] = useState(profile.currentLessonId);

  const handleSave = () => {
    onSave({
      sessionMinutes,
      tokenRewardEnabled,
      currentLessonId: selectedLessonId,
    });
    onBack();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 safe-top border-b border-border">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-lg">Reading Settings</h1>
      </header>

      <div className="p-6 space-y-8">
        {/* Session length */}
        <div>
          <label className="hw-label block mb-3">Session Length</label>
          <div className="flex gap-3">
            {([5, 7, 10] as const).map((mins) => (
              <button
                key={mins}
                onClick={() => setSessionMinutes(mins)}
                className={`
                  flex-1 py-4 rounded-2xl border-2 font-semibold text-center transition-all
                  ${sessionMinutes === mins 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-card border-border hover:border-primary/50'
                  }
                `}
              >
                <Clock className="w-5 h-5 mx-auto mb-1" />
                <span>{mins} min</span>
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Short sessions keep reading positive. 5–7 minutes is ideal.
          </p>
        </div>

        {/* Token reward toggle */}
        <div>
          <label className="hw-label block mb-3">Token Rewards</label>
          <button
            onClick={() => setTokenRewardEnabled(!tokenRewardEnabled)}
            className={`
              w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all
              ${tokenRewardEnabled 
                ? 'bg-token/10 border-token' 
                : 'bg-card border-border'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <Star className={`w-6 h-6 ${tokenRewardEnabled ? 'text-token' : 'text-muted-foreground'}`} />
              <div className="text-left">
                <span className="font-medium block">Award tokens for reading</span>
                <span className="text-sm text-muted-foreground">
                  Earn tokens for effort and completion
                </span>
              </div>
            </div>
            <div className={`
              w-12 h-7 rounded-full relative transition-colors
              ${tokenRewardEnabled ? 'bg-token' : 'bg-muted'}
            `}>
              <div className={`
                w-5 h-5 rounded-full bg-white absolute top-1 transition-transform
                ${tokenRewardEnabled ? 'translate-x-6' : 'translate-x-1'}
              `} />
            </div>
          </button>
        </div>

        {/* Lesson selector */}
        <div>
          <label className="hw-label block mb-3">Current Lesson</label>
          <div className="space-y-2">
            {readingLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all
                  ${selectedLessonId === lesson.id 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-card border-border hover:border-primary/50'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${selectedLessonId === lesson.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                `}>
                  {lesson.order}
                </div>
                <div className="flex-1">
                  <span className="font-medium block">{lesson.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {lesson.newGraphemes.map(g => g.phoneme).join(', ')}
                  </span>
                </div>
                {selectedLessonId === lesson.id && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
