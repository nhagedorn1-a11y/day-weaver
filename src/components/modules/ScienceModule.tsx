import { useState, useMemo } from 'react';
import { scienceConcepts, getConceptsByCategory, getActivitiesForConcept } from '@/data/scienceLibrary';
import { ScienceConcept, ScienceActivity } from '@/types/academics';
import { 
  Beaker, ArrowLeft, Leaf, Globe, Atom, Star as StarIcon, 
  ChevronRight, Check, Eye, HelpCircle, FlaskConical 
} from 'lucide-react';
import { toast } from 'sonner';

interface ScienceModuleProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

type ScienceView = 'home' | 'category' | 'activity';

const CATEGORIES = [
  { id: 'life', name: 'Life Science', emoji: '🌱', icon: Leaf, color: 'bg-calm' },
  { id: 'earth', name: 'Earth Science', emoji: '🌍', icon: Globe, color: 'bg-primary' },
  { id: 'physical', name: 'Physical Science', emoji: '⚡', icon: Atom, color: 'bg-token' },
  { id: 'space', name: 'Space Science', emoji: '🚀', icon: StarIcon, color: 'bg-next' },
] as const;

export function ScienceModule({ onBack, onTokensEarned }: ScienceModuleProps) {
  const [view, setView] = useState<ScienceView>('home');
  const [selectedCategory, setSelectedCategory] = useState<'life' | 'earth' | 'physical' | 'space'>('life');
  const [selectedConcept, setSelectedConcept] = useState<ScienceConcept | null>(null);
  const [activityIndex, setActivityIndex] = useState(0);

  const categoryConcepts = useMemo(() => 
    getConceptsByCategory(selectedCategory), [selectedCategory]
  );

  const currentActivities = useMemo(() => 
    selectedConcept ? getActivitiesForConcept(selectedConcept.id) : [], 
    [selectedConcept]
  );

  const handleCategorySelect = (category: typeof selectedCategory) => {
    setSelectedCategory(category);
    setView('category');
  };

  const handleConceptSelect = (concept: ScienceConcept) => {
    setSelectedConcept(concept);
    setActivityIndex(0);
    setView('activity');
  };

  const handleActivityComplete = () => {
    if (activityIndex < currentActivities.length - 1) {
      setActivityIndex(prev => prev + 1);
      toast.success('Great observation! 🔍');
    } else {
      onTokensEarned(2);
      toast.success('+2 tokens for science exploration! 🔬');
      setView('category');
    }
  };

  // Activity view
  if (view === 'activity' && selectedConcept && currentActivities[activityIndex]) {
    const activity = currentActivities[activityIndex];
    
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('category')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold">{selectedConcept.name}</h1>
            <span className="hw-label">{activityIndex + 1} of {currentActivities.length}</span>
          </div>
        </header>

        <div className="p-6 flex flex-col items-center">
          <span className="text-8xl mb-6">{activity.visualCue}</span>
          <h2 className="text-2xl font-bold text-center mb-4">{activity.title}</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-sm">
            {activity.prompt}
          </p>

          {/* Activity type indicator */}
          <div className="flex items-center gap-2 mb-8">
            {activity.type === 'observe' && <Eye className="w-5 h-5 text-primary" />}
            {activity.type === 'classify' && <FlaskConical className="w-5 h-5 text-primary" />}
            {activity.type === 'predict' && <HelpCircle className="w-5 h-5 text-primary" />}
            {activity.type === 'experiment' && <Beaker className="w-5 h-5 text-primary" />}
            <span className="text-sm font-medium text-muted-foreground capitalize">{activity.type}</span>
          </div>

          {/* Materials (if any) */}
          {activity.materials && (
            <div className="bg-muted/50 rounded-2xl p-4 mb-6 w-full max-w-sm">
              <span className="text-sm font-semibold block mb-2">You'll need:</span>
              <ul className="text-sm text-muted-foreground">
                {activity.materials.map((m, i) => (
                  <li key={i}>• {m}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleActivityComplete}
            className="giant-button bg-calm text-calm-foreground"
          >
            <Check className="w-6 h-6" />
            <span>I Did It!</span>
          </button>
        </div>
      </div>
    );
  }

  // Category view
  if (view === 'category') {
    const categoryInfo = CATEGORIES.find(c => c.id === selectedCategory)!;
    
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('home')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-lg">{categoryInfo.emoji} {categoryInfo.name}</h1>
            <span className="hw-label">Choose a topic</span>
          </div>
        </header>

        <div className="p-4 space-y-3">
          {categoryConcepts.map((concept) => (
            <button
              key={concept.id}
              onClick={() => handleConceptSelect(concept)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
            >
              <span className="text-4xl">{concept.emoji}</span>
              <div className="flex-1 text-left">
                <span className="font-semibold block">{concept.name}</span>
                <span className="text-sm text-muted-foreground">{concept.description}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
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
        <div>
          <h1 className="font-semibold text-lg">Science Lab</h1>
          <span className="hw-label">Explore and discover!</span>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <p className="text-muted-foreground text-center mb-6">
          Pick a topic to explore 🔍
        </p>

        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="w-full flex items-center gap-4 p-6 rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-all hover:scale-[1.02]"
            >
              <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center`}>
                <span className="text-3xl">{category.emoji}</span>
              </div>
              <div className="flex-1 text-left">
                <span className="font-bold text-lg block">{category.name}</span>
                <span className="text-sm text-muted-foreground">
                  {getConceptsByCategory(category.id).length} topics
                </span>
              </div>
              <ChevronRight className="w-6 h-6 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
