# Social Login Setup Guide

This guide will help you configure Google, Facebook, Apple, and LinkedIn OAuth providers in your Supabase project.

## Prerequisites

- Supabase project with URL: `https://petwvoziixpaehhoergn.supabase.co`
- Admin access to your Supabase dashboard

## 1. Google OAuth Setup

### Step 1: Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `https://petwvoziixpaehhoergn.supabase.co/auth/v1/callback`
   - `http://localhost:8081/auth/callback` (for development)
7. Copy the **Client ID** and **Client Secret**

### Step 2: Supabase Configuration

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Google** provider
4. Enter your Google **Client ID** and **Client Secret**
5. Save the configuration

## 2. Facebook OAuth Setup

### Step 1: Facebook Developers

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app → "Consumer" → "Next"
3. Add "Facebook Login" product
4. Go to Facebook Login → Settings
5. Add Valid OAuth Redirect URIs:
   - `https://petwvoziixpaehhoergn.supabase.co/auth/v1/callback`
   - `http://localhost:8081/auth/callback` (for development)
6. Copy the **App ID** and **App Secret**

### Step 2: Supabase Configuration

1. In Supabase dashboard → **Authentication** → **Providers**
2. Enable **Facebook** provider
3. Enter your Facebook **App ID** and **App Secret**
4. Save the configuration

## 3. Apple OAuth Setup

### Step 1: Apple Developer Console

1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Create a new **App ID** with "Sign In with Apple" capability
3. Create a **Services ID** for web authentication
4. Configure the Services ID with your domain
5. Create a **Private Key** for Sign in with Apple
6. Download the `.p8` file and note the **Key ID**

### Step 2: Supabase Configuration

1. In Supabase dashboard → **Authentication** → **Providers**
2. Enable **Apple** provider
3. Enter your Apple credentials:
   - **Services ID**
   - **Team ID** (from Apple Developer account)
   - **Key ID** (from the private key)
   - **Private Key** (upload the .p8 file)
4. Save the configuration

## 4. LinkedIn OAuth Setup

### Step 1: LinkedIn Developer Portal

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Go to **Auth** tab
4. Add redirect URLs:
   - `https://petwvoziixpaehhoergn.supabase.co/auth/v1/callback`
   - `http://localhost:8081/auth/callback` (for development)
5. Copy the **Client ID** and **Client Secret**

### Step 2: Supabase Configuration

1. In Supabase dashboard → **Authentication** → **Providers**
2. Enable **LinkedIn** provider
3. Enter your LinkedIn **Client ID** and **Client Secret**
4. Save the configuration

## 5. Testing Your Setup

### Development Testing

1. Start your development server: `npm run dev`
2. Navigate to the auth page
3. Try each social login button
4. Check browser console for any errors

### Production Testing

1. Deploy your app to production
2. Update redirect URIs in each OAuth provider to include your production domain
3. Test social login in production environment

## 6. Troubleshooting

### Common Issues:

- **"Invalid redirect URI"**: Make sure redirect URIs match exactly in OAuth provider settings
- **"Provider not enabled"**: Check if the provider is enabled in Supabase dashboard
- **"Invalid credentials"**: Verify Client ID and Client Secret are correct
- **CORS errors**: Ensure your domain is added to authorized domains

### Debug Steps:

1. Check browser console for error messages
2. Verify Supabase project URL and anon key
3. Test with a simple OAuth flow first
4. Check Supabase logs in the dashboard

## 7. Security Considerations

- Keep your OAuth credentials secure
- Use environment variables for sensitive data
- Regularly rotate your OAuth secrets
- Monitor OAuth usage in your provider dashboards
- Set up proper redirect URI validation

## 8. Next Steps

Once all providers are configured:

1. Test each social login flow
2. Customize user metadata collection
3. Set up user profile completion flows
4. Configure email templates for social logins
5. Monitor authentication metrics

---

**Note**: This setup requires admin access to your Supabase project. If you don't have admin access, contact your project administrator to configure these OAuth providers.
