
export type WeeklyTask = {
  id: string;
  user_id: string;
  day: string;
  time: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at?: string;
};

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
};

export type YearGoal = {
  id: string;
  user_id: string;
  quarter: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  created_at?: string;
};

export type LongTermGoal = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  timeframe: "2years" | "5years";
  actions: string[];
  created_at?: string;
};

export type LifeGoal = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  actions: string[];
  created_at?: string;
};

export type WeeklyTimelineEntry = {
  id: string;
  user_id: string;
  week_id: string;
  start_date: string;
  end_date: string;
  title: string;
  notes: string;
  color: string;
  created_at?: string;
  updated_at?: string;
};

export type MonthGoal = {
  id: string;
  user_id: string;
  month: string;
  title: string;
  description?: string;
  actions: string[];
  completed: boolean;
  created_at?: string;
};

export type DailyCommitment = {
  id: string;
  user_id: string;
  commitment_type: 'year' | 'month';
  content: string;
  last_signed?: string;
  created_at?: string;
  updated_at?: string;
};
