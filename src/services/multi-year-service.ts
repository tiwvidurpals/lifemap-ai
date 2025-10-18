
import { supabase } from '@/integrations/supabase/client';
import { LongTermGoal } from '@/types/database';

export async function fetchLongTermGoals(): Promise<LongTermGoal[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('long_term_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createLongTermGoal(goal: Omit<LongTermGoal, 'id' | 'user_id' | 'created_at'>): Promise<LongTermGoal> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('long_term_goals')
    .insert([{ ...goal, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLongTermGoal(id: string, goal: Partial<LongTermGoal>): Promise<LongTermGoal> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('long_term_goals')
    .update(goal)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLongTermGoal(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('long_term_goals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}
