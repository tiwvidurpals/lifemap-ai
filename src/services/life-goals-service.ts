
import { supabase } from '@/lib/supabase';
import { LifeGoal } from '@/types/database';

export async function fetchLifeGoals(): Promise<LifeGoal[]> {
  const { data, error } = await supabase
    .from('life_goals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createLifeGoal(goal: Omit<LifeGoal, 'id' | 'user_id' | 'created_at'>): Promise<LifeGoal> {
  const { data, error } = await supabase
    .from('life_goals')
    .insert([goal])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLifeGoal(id: string, goal: Partial<LifeGoal>): Promise<LifeGoal> {
  const { data, error } = await supabase
    .from('life_goals')
    .update(goal)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLifeGoal(id: string): Promise<void> {
  const { error } = await supabase
    .from('life_goals')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
