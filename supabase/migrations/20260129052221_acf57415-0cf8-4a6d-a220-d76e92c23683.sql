-- Track daily summaries for narrative generation
CREATE TABLE IF NOT EXISTS public.daily_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL,
  tasks_completed integer DEFAULT 0,
  tokens_earned integer DEFAULT 0,
  calm_toolkit_uses integer DEFAULT 0,
  hardest_task text,
  bravery_attempts integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;

-- RLS policies for user access
CREATE POLICY "Users can view own summaries" ON public.daily_summaries
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own summaries" ON public.daily_summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own summaries" ON public.daily_summaries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own summaries" ON public.daily_summaries
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_daily_summaries_updated_at
  BEFORE UPDATE ON public.daily_summaries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();