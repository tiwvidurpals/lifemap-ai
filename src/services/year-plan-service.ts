
import { supabase } from '@/lib/supabase';
import { YearGoal } from '@/types/database';

export async function fetchYearGoals(): Promise<YearGoal[]> {
  const { data, error } = await supabase
    .from('year_goals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createYearGoal(goal: Omit<YearGoal, 'id' | 'user_id' | 'created_at'>): Promise<YearGoal> {
  const { data, error } = await supabase
    .from('year_goals')
    .insert([goal])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateYearGoal(id: string, goal: Partial<YearGoal>): Promise<YearGoal> {
  const { data, error } = await supabase
    .from('year_goals')
    .update(goal)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteYearGoal(id: string): Promise<void> {
  const { error } = await supabase
    .from('year_goals')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
