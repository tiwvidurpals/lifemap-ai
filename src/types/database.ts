
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
