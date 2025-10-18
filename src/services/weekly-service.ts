
import { supabase } from '@/integrations/supabase/client';
import { WeeklyTask } from '@/types/database';

export async function fetchWeeklyTasks(): Promise<WeeklyTask[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('weekly_tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createWeeklyTask(task: Omit<WeeklyTask, 'id' | 'user_id' | 'created_at'>): Promise<WeeklyTask> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('weekly_tasks')
    .insert([{ ...task, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateWeeklyTask(id: string, task: Partial<WeeklyTask>): Promise<WeeklyTask> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('weekly_tasks')
    .update(task)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWeeklyTask(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('weekly_tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}
