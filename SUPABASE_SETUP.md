# Supabase Setup Guide for LifeMap AI

This guide will walk you through setting up Supabase for your LifeMap AI application to store all user data in the cloud.

## Prerequisites

- A Supabase account (free tier available)
- Your LifeMap AI project ready for deployment

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: `lifemap-ai` (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the region closest to your users
4. Click "Create new project"
5. Wait for the project to be created (usually takes 1-2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - Keep this secret!

## Step 3: Update Your Environment Variables

1. In your project root, create a `.env.local` file (if it doesn't exist)
2. Add the following variables:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the placeholder values with your actual Supabase credentials.

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase/migrations/001_create_tables.sql`
4. Click "Run" to execute the migration
5. You should see "Success. No rows returned" if everything worked correctly

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your domain:
   - For development: `http://localhost:5173`
   - For production: `https://your-domain.com`
3. Under **Redirect URLs**, add:
   - `http://localhost:5173/auth/callback` (for development)
   - `https://your-domain.com/auth/callback` (for production)

## Step 6: Enable Social Login (Optional)

If you want to enable Google, GitHub, or other social logins:

1. Go to **Authentication** → **Providers**
2. Enable the providers you want (e.g., Google, GitHub)
3. For each provider, you'll need to:
   - Create OAuth apps in their respective platforms
   - Add the client ID and secret to Supabase
   - Configure redirect URLs

### Google OAuth Setup:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set **Application type** to "Web application"
6. Add authorized redirect URIs:
   - `https://your-project-id.supabase.co/auth/v1/callback`
7. Copy the Client ID and Client Secret to Supabase

### GitHub OAuth Setup:

1. Go to GitHub → **Settings** → **Developer settings** → **OAuth Apps**
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: LifeMap AI
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-project-id.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret to Supabase

## Step 7: Test Your Setup

1. Start your development server: `npm run dev`
2. Try creating an account and logging in
3. Create some notes, goals, etc.
4. Check your Supabase dashboard → **Table Editor** to see if data is being stored
5. Try logging out and back in to ensure data persists

## Step 8: Deploy to Production

1. Update your environment variables in your hosting platform:

   - Vercel: Add to **Environment Variables** in project settings
   - Netlify: Add to **Site settings** → **Environment variables**
   - Other platforms: Follow their specific instructions

2. Update your Supabase **Site URL** and **Redirect URLs** to use your production domain

3. Deploy your application

## Step 9: Monitor and Maintain

1. **Monitor Usage**: Check your Supabase dashboard for API usage, database size, etc.
2. **Backup**: Supabase automatically backs up your database, but you can also export data manually
3. **Scaling**: Upgrade your Supabase plan as your user base grows

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**:

   - Check that your environment variables are correctly set
   - Ensure you're using the `anon` key, not the `service_role` key in your frontend

2. **"Row Level Security" errors**:

   - Make sure you ran the migration script completely
   - Check that RLS policies are properly set up

3. **Authentication not working**:

   - Verify your Site URL and Redirect URLs are correct
   - Check that your domain is properly configured

4. **Data not persisting**:
   - Check browser console for errors
   - Verify database tables exist and have the correct schema
   - Ensure user authentication is working

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Join the [Supabase Discord](https://discord.supabase.com)
- Check your project's GitHub issues

## Security Best Practices

1. **Never expose your service_role key** in frontend code
2. **Use Row Level Security (RLS)** - already configured in the migration
3. **Regularly rotate your API keys**
4. **Monitor your API usage** for unusual patterns
5. **Keep your Supabase project updated**

## Database Schema Overview

Your database includes these tables:

- `notes` - User notes with tags
- `life_goals` - Long-term life goals by category
- `year_goals` - Yearly goals by quarter
- `long_term_goals` - 2-5 year goals
- `weekly_tasks` - Weekly task management
- `weekly_timeline` - Weekly planning and notes
- `month_goals` - Monthly goals
- `daily_commitments` - Daily commitments for year/month

All tables include:

- `user_id` for data isolation
- `created_at` timestamps
- Row Level Security policies
- Proper indexes for performance

## Next Steps

Once your Supabase setup is complete:

1. Test all features thoroughly
2. Set up monitoring and alerts
3. Plan for scaling as your user base grows
4. Consider adding more advanced features like real-time updates

Your LifeMap AI app is now fully cloud-enabled with secure, scalable data storage!

