import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LearningProgress {
  subject: string;
  currentLessonId: string;
  currentLessonIndex: number;
  streak: number;
  totalMinutes: number;
  totalProblems: number;
  sessionMinutes: number;
  level: string;
  lastSessionDate: string | null;
}

interface UseCloudProgressResult {
  progress: Record<string, LearningProgress>;
  tokenBalance: number;
  lifetimeTokens: number;
  isLoading: boolean;
  updateProgress: (subject: string, updates: Partial<LearningProgress>) => Promise<void>;
  addTokens: (amount: number) => Promise<void>;
  spendTokens: (amount: number) => Promise<boolean>;
  syncFromCloud: () => Promise<void>;
}

const DEFAULT_PROGRESS: LearningProgress = {
  subject: '',
  currentLessonId: 'lesson-1',
  currentLessonIndex: 0,
  streak: 0,
  totalMinutes: 0,
  totalProblems: 0,
  sessionMinutes: 7,
  level: 'concrete',
  lastSessionDate: null,
};

export function useCloudProgress(userId: string | null): UseCloudProgressResult {
  const [progress, setProgress] = useState<Record<string, LearningProgress>>({});
  const [tokenBalance, setTokenBalance] = useState(0);
  const [lifetimeTokens, setLifetimeTokens] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Sync all progress from cloud
  const syncFromCloud = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch learning progress
      const { data: progressData, error: progressError } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId);

      if (progressError) throw progressError;

      if (progressData) {
        const progressMap: Record<string, LearningProgress> = {};
        progressData.forEach(item => {
          progressMap[item.subject] = {
            subject: item.subject,
            currentLessonId: item.current_lesson_id,
            currentLessonIndex: item.current_lesson_index || 0,
            streak: item.streak || 0,
            totalMinutes: item.total_minutes || 0,
            totalProblems: item.total_problems || 0,
            sessionMinutes: item.session_minutes || 7,
            level: item.level || 'concrete',
            lastSessionDate: item.last_session_date,
          };
        });
        setProgress(progressMap);
      }

      // Fetch token balance
      const { data: tokenData, error: tokenError } = await supabase
        .from('token_balances')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (tokenError) throw tokenError;

      if (tokenData) {
        setTokenBalance(tokenData.balance || 0);
        setLifetimeTokens(tokenData.lifetime_earned || 0);
      }
    } catch (err) {
      console.error('Error syncing progress:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Initial sync
  useEffect(() => {
    syncFromCloud();
  }, [syncFromCloud]);

  // Update learning progress for a subject
  const updateProgress = useCallback(async (subject: string, updates: Partial<LearningProgress>) => {
    if (!userId) return;

    try {
      const current = progress[subject] || { ...DEFAULT_PROGRESS, subject };
      const updated = { ...current, ...updates };

      const { error: upsertError } = await supabase
        .from('learning_progress')
        .upsert({
          user_id: userId,
          subject,
          current_lesson_id: updated.currentLessonId,
          current_lesson_index: updated.currentLessonIndex,
          streak: updated.streak,
          total_minutes: updated.totalMinutes,
          total_problems: updated.totalProblems,
          session_minutes: updated.sessionMinutes,
          level: updated.level,
          last_session_date: updated.lastSessionDate,
        }, {
          onConflict: 'user_id,subject'
        });

      if (upsertError) throw upsertError;

      setProgress(prev => ({
        ...prev,
        [subject]: updated,
      }));
    } catch (err) {
      console.error('Error updating progress:', err);
      toast.error('Failed to save progress');
    }
  }, [userId, progress]);

  // Add tokens
  const addTokens = useCallback(async (amount: number) => {
    if (!userId || amount <= 0) return;

    try {
      const newBalance = tokenBalance + amount;
      const newLifetime = lifetimeTokens + amount;

      const { error: upsertError } = await supabase
        .from('token_balances')
        .upsert({
          user_id: userId,
          balance: newBalance,
          lifetime_earned: newLifetime,
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;

      setTokenBalance(newBalance);
      setLifetimeTokens(newLifetime);
    } catch (err) {
      console.error('Error adding tokens:', err);
      toast.error('Failed to save tokens');
    }
  }, [userId, tokenBalance, lifetimeTokens]);

  // Spend tokens
  const spendTokens = useCallback(async (amount: number): Promise<boolean> => {
    if (!userId || amount <= 0 || amount > tokenBalance) return false;

    try {
      const newBalance = tokenBalance - amount;

      const { error: updateError } = await supabase
        .from('token_balances')
        .update({ balance: newBalance })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setTokenBalance(newBalance);
      return true;
    } catch (err) {
      console.error('Error spending tokens:', err);
      toast.error('Failed to spend tokens');
      return false;
    }
  }, [userId, tokenBalance]);

  return {
    progress,
    tokenBalance,
    lifetimeTokens,
    isLoading,
    updateProgress,
    addTokens,
    spendTokens,
    syncFromCloud,
  };
}
