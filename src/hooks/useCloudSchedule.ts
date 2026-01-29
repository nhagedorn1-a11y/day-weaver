import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TASK_ICONS } from '@/types/jackos';
import { toast } from 'sonner';

interface UseCloudScheduleResult {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  reorderTasks: (tasks: Task[]) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  resetDailyTasks: () => Promise<void>;
  syncFromCloud: () => Promise<void>;
}

export function useCloudSchedule(userId: string | null): UseCloudScheduleResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from cloud
  const syncFromCloud = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error: fetchError } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', userId)
        .eq('schedule_date', today)
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const cloudTasks: Task[] = data.map(item => ({
          id: item.id,
          title: item.title,
          icon: item.icon,
          duration: item.duration || 5,
          tokens: item.tokens || 1,
          scheduledTime: item.scheduled_time || undefined,
          completed: item.completed || false,
          category: 'routine' as const,
        }));
        setTasks(cloudTasks);
      }
      setError(null);
    } catch (err) {
      console.error('Error syncing schedule:', err);
      setError('Failed to sync schedule');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Initial sync
  useEffect(() => {
    syncFromCloud();
  }, [syncFromCloud]);

  // Add a new task
  const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
    if (!userId) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error: insertError } = await supabase
        .from('schedules')
        .insert({
          user_id: userId,
          title: task.title,
          icon: task.icon,
          duration: task.duration,
          tokens: task.tokens,
          scheduled_time: task.scheduledTime,
          completed: task.completed || false,
          sort_order: tasks.length,
          schedule_date: today,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        const newTask: Task = {
          id: data.id,
          title: data.title,
          icon: data.icon,
          duration: data.duration || 5,
          tokens: data.tokens || 1,
          scheduledTime: data.scheduled_time || undefined,
          completed: data.completed || false,
          category: 'routine' as const,
        };
        setTasks(prev => [...prev, newTask]);
      }
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error('Failed to add task');
    }
  }, [userId, tasks.length]);

  // Update a task
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!userId) return;

    try {
      const { error: updateError } = await supabase
        .from('schedules')
        .update({
          title: updates.title,
          icon: updates.icon,
          duration: updates.duration,
          tokens: updates.tokens,
          scheduled_time: updates.scheduledTime,
          completed: updates.completed,
        })
        .eq('id', taskId)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, ...updates } : t
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
    }
  }, [userId]);

  // Delete a task
  const deleteTask = useCallback(async (taskId: string) => {
    if (!userId) return;

    try {
      const { error: deleteError } = await supabase
        .from('schedules')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
    }
  }, [userId]);

  // Reorder tasks
  const reorderTasks = useCallback(async (newTasks: Task[]) => {
    if (!userId) return;

    setTasks(newTasks);

    try {
      // Update sort_order for all tasks
      const updates = newTasks.map((task, index) => 
        supabase
          .from('schedules')
          .update({ sort_order: index })
          .eq('id', task.id)
          .eq('user_id', userId)
      );

      await Promise.all(updates);
    } catch (err) {
      console.error('Error reordering tasks:', err);
      toast.error('Failed to save order');
    }
  }, [userId]);

  // Complete a task
  const completeTask = useCallback(async (taskId: string) => {
    await updateTask(taskId, { completed: true });
  }, [updateTask]);

  // Reset daily tasks (for a new day)
  const resetDailyTasks = useCallback(async () => {
    if (!userId) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Copy yesterday's tasks as template for today
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const { data: yesterdayTasks } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', userId)
        .eq('schedule_date', yesterdayStr)
        .order('sort_order', { ascending: true });

      if (yesterdayTasks && yesterdayTasks.length > 0) {
        const newTasks = yesterdayTasks.map((task, index) => ({
          user_id: userId,
          title: task.title,
          icon: task.icon,
          duration: task.duration,
          tokens: task.tokens,
          scheduled_time: task.scheduled_time,
          completed: false,
          sort_order: index,
          schedule_date: today,
        }));

        await supabase.from('schedules').insert(newTasks);
        await syncFromCloud();
      }
    } catch (err) {
      console.error('Error resetting tasks:', err);
    }
  }, [userId, syncFromCloud]);

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    completeTask,
    resetDailyTasks,
    syncFromCloud,
  };
}
