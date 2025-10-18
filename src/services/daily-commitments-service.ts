import { supabase } from '@/integrations/supabase/client';
import { DailyCommitment } from '@/types/database';

export async function fetchDailyCommitments(): Promise<DailyCommitment[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('daily_commitments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as DailyCommitment[];
}

export async function createDailyCommitment(commitment: Omit<DailyCommitment, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<DailyCommitment> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('daily_commitments')
    .insert([{ ...commitment, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data as DailyCommitment;
}

export async function updateDailyCommitment(id: string, commitment: Partial<DailyCommitment>): Promise<DailyCommitment> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('daily_commitments')
    .update(commitment)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as DailyCommitment;
}

export async function deleteDailyCommitment(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('daily_commitments')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

export async function upsertDailyCommitment(commitment: Omit<DailyCommitment, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<DailyCommitment> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('daily_commitments')
    .upsert([{ ...commitment, user_id: user.id }], { 
      onConflict: 'user_id,commitment_type',
      ignoreDuplicates: false 
    })
    .select()
    .single();

  if (error) throw error;
  return data as DailyCommitment;
}
