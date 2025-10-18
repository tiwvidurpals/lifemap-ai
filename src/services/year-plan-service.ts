
import { supabase } from '@/integrations/supabase/client';
import { YearGoal } from '@/types/database';

export async function fetchYearGoals(): Promise<YearGoal[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('year_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createYearGoal(goal: Omit<YearGoal, 'id' | 'user_id' | 'created_at'>): Promise<YearGoal> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('year_goals')
    .insert([{ ...goal, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateYearGoal(id: string, goal: Partial<YearGoal>): Promise<YearGoal> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('year_goals')
    .update(goal)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteYearGoal(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('year_goals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}
