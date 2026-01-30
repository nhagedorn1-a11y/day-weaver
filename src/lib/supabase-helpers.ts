import { toast } from '@/hooks/use-toast';

/**
 * Unwrap a Supabase response and throw on error.
 * Shows a toast notification for user feedback.
 * 
 * Usage:
 *   const data = await must(supabase.from('table').select(), 'Loading items');
 */
export async function must<T>(
  promise: PromiseLike<{ data: T; error: any }>,
  context: string
): Promise<T> {
  const { data, error } = await promise;
  
  if (error) {
    console.error(`[Supabase Error] ${context}:`, error);
    
    toast({
      variant: 'destructive',
      title: 'Something went wrong',
      description: `${context}: ${error.message ?? 'Please try again'}`,
    });
    
    throw new Error(`${context}: ${error.message ?? error}`);
  }
  
  return data;
}

/**
 * Unwrap a Supabase response, returning null on error instead of throwing.
 * Shows a toast notification for user feedback.
 * 
 * Usage:
 *   const data = await soft(supabase.from('table').select(), 'Loading items');
 *   if (!data) return; // Error already shown to user
 */
export async function soft<T>(
  promise: PromiseLike<{ data: T; error: any }>,
  context: string
): Promise<T | null> {
  const { data, error } = await promise;
  
  if (error) {
    console.error(`[Supabase Error] ${context}:`, error);
    
    toast({
      variant: 'destructive',
      title: 'Something went wrong',
      description: `${context}: ${error.message ?? 'Please try again'}`,
    });
    
    return null;
  }
  
  return data;
}

/**
 * Retry a function with exponential backoff.
 * 
 * Usage:
 *   const data = await retry(() => must(supabase.from('table').select(), 'Load'), 3);
 */
export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (i < attempts - 1) {
        // Wait with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}
