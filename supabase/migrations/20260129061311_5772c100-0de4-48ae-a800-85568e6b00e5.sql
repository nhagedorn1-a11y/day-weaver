-- Create schedules table for storing user task schedules
CREATE TABLE public.schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'star',
  duration INTEGER DEFAULT 5,
  tokens INTEGER DEFAULT 1,
  scheduled_time TEXT,
  completed BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  schedule_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learning_progress table for tracking academic progress
CREATE TABLE public.learning_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject TEXT NOT NULL, -- 'reading', 'math', 'writing', 'science'
  current_lesson_id TEXT NOT NULL DEFAULT 'lesson-1',
  current_lesson_index INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  total_problems INTEGER DEFAULT 0,
  session_minutes INTEGER DEFAULT 7,
  level TEXT DEFAULT 'concrete', -- For math CPA approach
  last_session_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, subject)
);

-- Create token_balances table for tracking earned tokens
CREATE TABLE public.token_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  balance INTEGER DEFAULT 0,
  lifetime_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_balances ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schedules
CREATE POLICY "Users can view their own schedules" 
ON public.schedules FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own schedules" 
ON public.schedules FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules" 
ON public.schedules FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedules" 
ON public.schedules FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for learning_progress
CREATE POLICY "Users can view their own learning progress" 
ON public.learning_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own learning progress" 
ON public.learning_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning progress" 
ON public.learning_progress FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for token_balances
CREATE POLICY "Users can view their own token balance" 
ON public.token_balances FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own token balance" 
ON public.token_balances FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own token balance" 
ON public.token_balances FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_schedules_updated_at
BEFORE UPDATE ON public.schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_progress_updated_at
BEFORE UPDATE ON public.learning_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_token_balances_updated_at
BEFORE UPDATE ON public.token_balances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();