import { supabase } from '@/lib/supabase';
import { 
  createNote, 
  createLifeGoal, 
  createLongTermGoal, 
  createYearGoal,
  upsertWeeklyTimelineEntry,
  createMonthGoal,
  upsertDailyCommitment
} from './index';

// Migration service to move data from localStorage to database
export class DataMigrationService {
  static async migrateAllData(): Promise<{ success: boolean; message: string; migrated: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const migrated = {
        notes: 0,
        lifeGoals: 0,
        longTermGoals: 0,
        yearGoals: 0,
        weeklyTimeline: 0,
        monthGoals: 0,
        dailyCommitments: 0
      };

      // Migrate notes
      const notesData = localStorage.getItem('notes');
      if (notesData) {
        const notes = JSON.parse(notesData);
        for (const note of notes) {
          try {
            await createNote({
              title: note.title,
              content: note.content,
              tags: note.tags || []
            });
            migrated.notes++;
          } catch (error) {
            console.warn('Failed to migrate note:', note.title, error);
          }
        }
      }

      // Migrate life goals
      const lifeGoalsData = localStorage.getItem('lifeGoals');
      if (lifeGoalsData) {
        const lifeGoals = JSON.parse(lifeGoalsData);
        for (const goal of lifeGoals) {
          try {
            await createLifeGoal({
              title: goal.title,
              description: goal.description || '',
              category: goal.category,
              actions: goal.actions || []
            });
            migrated.lifeGoals++;
          } catch (error) {
            console.warn('Failed to migrate life goal:', goal.title, error);
          }
        }
      }

      // Migrate multi-year goals
      const multiYearGoalsData = localStorage.getItem('multiYearGoals');
      if (multiYearGoalsData) {
        const multiYearGoals = JSON.parse(multiYearGoalsData);
        for (const goal of multiYearGoals) {
          try {
            await createLongTermGoal({
              title: goal.title,
              description: goal.description || '',
              timeframe: goal.timeframe,
              actions: goal.actions || []
            });
            migrated.longTermGoals++;
          } catch (error) {
            console.warn('Failed to migrate multi-year goal:', goal.title, error);
          }
        }
      }

      // Migrate year goals
      const yearGoalsData = localStorage.getItem('yearGoals');
      if (yearGoalsData) {
        const yearGoals = JSON.parse(yearGoalsData);
        for (const goal of yearGoals) {
          try {
            await createYearGoal({
              quarter: 'Q1', // Default quarter since localStorage doesn't have this
              title: goal.title,
              description: goal.description || '',
              status: goal.completed ? 'completed' : 'pending'
            });
            migrated.yearGoals++;
          } catch (error) {
            console.warn('Failed to migrate year goal:', goal.title, error);
          }
        }
      }

      // Migrate weekly timeline
      const weeklyTimelineData = localStorage.getItem('weeklyTimeline');
      if (weeklyTimelineData) {
        const weeklyTimeline = JSON.parse(weeklyTimelineData);
        for (const week of weeklyTimeline) {
          try {
            await upsertWeeklyTimelineEntry({
              week_id: week.id,
              start_date: week.startDate,
              end_date: week.endDate,
              title: week.title,
              notes: week.notes || '',
              color: week.color || ''
            });
            migrated.weeklyTimeline++;
          } catch (error) {
            console.warn('Failed to migrate weekly timeline entry:', week.id, error);
          }
        }
      }

      // Migrate month goals
      const monthGoalsData = localStorage.getItem('monthGoals');
      if (monthGoalsData) {
        const monthGoals = JSON.parse(monthGoalsData);
        for (const goal of monthGoals) {
          try {
            await createMonthGoal({
              month: new Date().toISOString().slice(0, 7), // Current month as default
              title: goal.title,
              description: goal.description || '',
              actions: goal.actions || [],
              completed: goal.completed || false
            });
            migrated.monthGoals++;
          } catch (error) {
            console.warn('Failed to migrate month goal:', goal.title, error);
          }
        }
      }

      // Migrate daily commitments
      const yearDORData = localStorage.getItem('yearDOR');
      if (yearDORData) {
        const yearDOR = JSON.parse(yearDORData);
        if (yearDOR.content) {
          try {
            await upsertDailyCommitment({
              commitment_type: 'year',
              content: yearDOR.content,
              last_signed: yearDOR.lastSigned || null
            });
            migrated.dailyCommitments++;
          } catch (error) {
            console.warn('Failed to migrate year DOR:', error);
          }
        }
      }

      const monthDORData = localStorage.getItem('monthDOR');
      if (monthDORData) {
        const monthDOR = JSON.parse(monthDORData);
        if (monthDOR.content) {
          try {
            await upsertDailyCommitment({
              commitment_type: 'month',
              content: monthDOR.content,
              last_signed: monthDOR.lastSigned || null
            });
            migrated.dailyCommitments++;
          } catch (error) {
            console.warn('Failed to migrate month DOR:', error);
          }
        }
      }

      return {
        success: true,
        message: 'Data migration completed successfully',
        migrated
      };

    } catch (error) {
      console.error('Migration failed:', error);
      return {
        success: false,
        message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        migrated: {}
      };
    }
  }

  static async clearLocalStorage(): Promise<void> {
    const keys = [
      'notes',
      'lifeGoals',
      'lifeGoalCategories',
      'multiYearGoals',
      'yearGoals',
      'yearDOR',
      'monthGoals',
      'monthDOR',
      'weeklyTimeline'
    ];

    keys.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static hasLocalStorageData(): boolean {
    const keys = [
      'notes',
      'lifeGoals',
      'multiYearGoals',
      'yearGoals',
      'monthGoals',
      'weeklyTimeline'
    ];

    return keys.some(key => {
      const data = localStorage.getItem(key);
      return data && JSON.parse(data).length > 0;
    });
  }
}

