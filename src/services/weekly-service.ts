
import { supabase } from '@/lib/supabase';
import { WeeklyTask } from '@/types/database';

export async function fetchWeeklyTasks(): Promise<WeeklyTask[]> {
  const { data, error } = await supabase
    .from('weekly_tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createWeeklyTask(task: Omit<WeeklyTask, 'id' | 'user_id' | 'created_at'>): Promise<WeeklyTask> {
  const { data, error } = await supabase
    .from('weekly_tasks')
    .insert([task])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateWeeklyTask(id: string, task: Partial<WeeklyTask>): Promise<WeeklyTask> {
  const { data, error } = await supabase
    .from('weekly_tasks')
    .update(task)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWeeklyTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('weekly_tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
