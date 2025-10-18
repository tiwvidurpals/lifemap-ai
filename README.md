# LifeMap AI

A comprehensive life planning and goal management application built with React, TypeScript, and Supabase.

## Features

- **Notes Management**: Create, edit, and organize notes with tags
- **Life Goals**: Set and track long-term life goals by category
- **Multi-Year Planning**: Plan goals for 2-5 year timeframes
- **Year Planning**: Quarterly goal setting and tracking
- **Month Planning**: Monthly goal management
- **Weekly Timeline**: Weekly planning and reflection
- **User Authentication**: Secure login with multiple providers
- **Cloud Storage**: All data stored securely in Supabase

## Quick Start

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up Supabase (see SUPABASE_SETUP.md for detailed instructions)
# Create a .env.local file with your Supabase credentials:
# VITE_SUPABASE_URL=https://your-project-id.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Database Setup

This application uses Supabase for data storage and authentication. **You must set up Supabase before the app will work properly.**

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions.

## What technologies are used for this project?

This project is built with:

- **Frontend**: Vite, TypeScript, React
- **UI Components**: shadcn-ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React hooks, TanStack Query
- **Authentication**: Supabase Auth with OAuth providers
- **Database**: PostgreSQL with Row Level Security

## Data Migration

The app includes automatic data migration from localStorage to the cloud database. When users first log in, they'll be prompted to migrate any existing local data to their cloud account.

## Security

- All data is protected with Row Level Security (RLS)
- User authentication required for all operations
- Data is isolated per user
- Secure API keys and environment variables

## Deployment

The app is ready for deployment on platforms like Vercel, Netlify, or any static hosting service. Make sure to:

1. Set up your Supabase project
2. Configure environment variables
3. Update authentication URLs for your domain
4. Deploy your application

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for production deployment details.
