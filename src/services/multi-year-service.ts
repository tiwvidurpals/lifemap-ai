
import { supabase } from '@/lib/supabase';
import { LongTermGoal } from '@/types/database';

export async function fetchLongTermGoals(): Promise<LongTermGoal[]> {
  const { data, error } = await supabase
    .from('longterm_goals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createLongTermGoal(goal: Omit<LongTermGoal, 'id' | 'user_id' | 'created_at'>): Promise<LongTermGoal> {
  const { data, error } = await supabase
    .from('longterm_goals')
    .insert([goal])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLongTermGoal(id: string, goal: Partial<LongTermGoal>): Promise<LongTermGoal> {
  const { data, error } = await supabase
    .from('longterm_goals')
    .update(goal)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLongTermGoal(id: string): Promise<void> {
  const { error } = await supabase
    .from('longterm_goals')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
