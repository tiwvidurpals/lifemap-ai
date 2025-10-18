import { supabase } from '@/integrations/supabase/client';
import { MonthGoal } from '@/types/database';

export async function fetchMonthGoals(): Promise<MonthGoal[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('month_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createMonthGoal(goal: Omit<MonthGoal, 'id' | 'user_id' | 'created_at'>): Promise<MonthGoal> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('month_goals')
    .insert([{ ...goal, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMonthGoal(id: string, goal: Partial<MonthGoal>): Promise<MonthGoal> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('month_goals')
    .update(goal)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMonthGoal(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('month_goals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}
