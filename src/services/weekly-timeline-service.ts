import { supabase } from '@/integrations/supabase/client';
import { WeeklyTimelineEntry } from '@/types/database';

export async function fetchWeeklyTimeline(): Promise<WeeklyTimelineEntry[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('weekly_timeline')
    .select('*')
    .eq('user_id', user.id)
    .order('start_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createWeeklyTimelineEntry(entry: Omit<WeeklyTimelineEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<WeeklyTimelineEntry> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('weekly_timeline')
    .insert([{ ...entry, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateWeeklyTimelineEntry(id: string, entry: Partial<WeeklyTimelineEntry>): Promise<WeeklyTimelineEntry> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('weekly_timeline')
    .update(entry)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWeeklyTimelineEntry(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('weekly_timeline')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

export async function upsertWeeklyTimelineEntry(entry: Omit<WeeklyTimelineEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<WeeklyTimelineEntry> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('weekly_timeline')
    .upsert([{ ...entry, user_id: user.id }], { 
      onConflict: 'user_id,week_id',
      ignoreDuplicates: false 
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
