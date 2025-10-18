
import { supabase } from '@/integrations/supabase/client';
import { LifeGoal } from '@/types/database';

export async function fetchLifeGoals(): Promise<LifeGoal[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('life_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createLifeGoal(goal: Omit<LifeGoal, 'id' | 'user_id' | 'created_at'>): Promise<LifeGoal> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('life_goals')
    .insert([{ ...goal, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLifeGoal(id: string, goal: Partial<LifeGoal>): Promise<LifeGoal> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('life_goals')
    .update(goal)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLifeGoal(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('life_goals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}
