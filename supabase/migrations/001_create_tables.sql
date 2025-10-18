-- Create tables for LifeMap AI application

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create life_goals table
CREATE TABLE IF NOT EXISTS life_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    category TEXT NOT NULL,
    actions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create year_goals table
CREATE TABLE IF NOT EXISTS year_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quarter TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create long_term_goals table
CREATE TABLE IF NOT EXISTS long_term_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    timeframe TEXT NOT NULL CHECK (timeframe IN ('2years', '5years')),
    actions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weekly_tasks table
CREATE TABLE IF NOT EXISTS weekly_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weekly_timeline table
CREATE TABLE IF NOT EXISTS weekly_timeline (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    week_id TEXT NOT NULL, -- Format: "2024-1" for year-week
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    title TEXT NOT NULL,
    notes TEXT DEFAULT '',
    color TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_id)
);

-- Create month_goals table
CREATE TABLE IF NOT EXISTS month_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    month TEXT NOT NULL, -- Format: "2024-01"
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    actions TEXT[] DEFAULT '{}',
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_commitments table
CREATE TABLE IF NOT EXISTS daily_commitments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    commitment_type TEXT NOT NULL CHECK (commitment_type IN ('year', 'month')),
    content TEXT NOT NULL,
    last_signed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, commitment_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
CREATE INDEX IF NOT EXISTS idx_life_goals_user_id ON life_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_life_goals_category ON life_goals(category);
CREATE INDEX IF NOT EXISTS idx_year_goals_user_id ON year_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_year_goals_quarter ON year_goals(quarter);
CREATE INDEX IF NOT EXISTS idx_long_term_goals_user_id ON long_term_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_long_term_goals_timeframe ON long_term_goals(timeframe);
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_user_id ON weekly_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_timeline_user_id ON weekly_timeline(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_timeline_week_id ON weekly_timeline(week_id);
CREATE INDEX IF NOT EXISTS idx_month_goals_user_id ON month_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_month_goals_month ON month_goals(month);
CREATE INDEX IF NOT EXISTS idx_daily_commitments_user_id ON daily_commitments(user_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE year_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE long_term_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE month_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_commitments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notes
CREATE POLICY "Users can view their own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for life_goals
CREATE POLICY "Users can view their own life goals" ON life_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own life goals" ON life_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own life goals" ON life_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own life goals" ON life_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for year_goals
CREATE POLICY "Users can view their own year goals" ON year_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own year goals" ON year_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own year goals" ON year_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own year goals" ON year_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for long_term_goals
CREATE POLICY "Users can view their own long term goals" ON long_term_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own long term goals" ON long_term_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own long term goals" ON long_term_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own long term goals" ON long_term_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for weekly_tasks
CREATE POLICY "Users can view their own weekly tasks" ON weekly_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly tasks" ON weekly_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly tasks" ON weekly_tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly tasks" ON weekly_tasks
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for weekly_timeline
CREATE POLICY "Users can view their own weekly timeline" ON weekly_timeline
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly timeline" ON weekly_timeline
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly timeline" ON weekly_timeline
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly timeline" ON weekly_timeline
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for month_goals
CREATE POLICY "Users can view their own month goals" ON month_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own month goals" ON month_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own month goals" ON month_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own month goals" ON month_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for daily_commitments
CREATE POLICY "Users can view their own daily commitments" ON daily_commitments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily commitments" ON daily_commitments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily commitments" ON daily_commitments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily commitments" ON daily_commitments
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_timeline_updated_at BEFORE UPDATE ON weekly_timeline
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_commitments_updated_at BEFORE UPDATE ON daily_commitments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

