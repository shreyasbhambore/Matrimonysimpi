# Google OAuth Setup Guide for Matrimony Platform

## Overview
This guide helps you set up Google OAuth authentication for your Matrimony platform using Supabase.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Google+ API
   - OAuth 2.0
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth 2.0 Client ID**
6. Choose **Web application**

## Step 2: Configure OAuth Consent Screen

1. Go to **OAuth consent screen**
2. Choose **External** user type
3. Fill in required fields:
   - App name: "Matrimony Simpi"
   - User support email: Your email
   - Developer contact: Your email

## Step 3: Create OAuth Client ID

1. Go to **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Select **Web application**
4. Add Authorized Redirect URIs:
   ```
   https://your-supabase-project.supabase.co/auth/v1/callback
   https://your-vercel-domain.vercel.app/auth/callback
   http://localhost:3000/auth/callback (for local development)
   ```
5. Copy the **Client ID** and **Client Secret**

## Step 4: Configure in Supabase

1. Go to your Supabase project: https://juunfortyihkifopdlud.supabase.co
2. Navigate to **Authentication** → **Providers**
3. Enable **Google**
4. Paste your Google OAuth **Client ID**
5. Paste your Google OAuth **Client Secret**
6. Save

## Step 5: Test Google OAuth

1. Go to your login page: `https://your-domain.vercel.app/login`
2. Click **Continue with Google**
3. You should be redirected to Google login
4. After authentication, you'll be redirected back to your app

## Troubleshooting

### "Redirect URI mismatch" Error
- Make sure your redirect URIs in Google Cloud Console match exactly
- Check for trailing slashes
- Verify the domain in the redirect URI matches your Vercel deployment

### OAuth Not Working Locally
- Add `http://localhost:3000/auth/callback` to your Google OAuth redirect URIs
- Make sure you're using `localhost:3000` (not `127.0.0.1`)

### User Not Created After Google Login
- Check Supabase authentication logs
- Verify user was created in `auth.users` table
- Check if profiles table has RLS policies blocking user creation

## Current OAuth Configuration

For your setup:
- **Supabase Project**: juunfortyihkifopdlud.supabase.co
- **Vercel Domain**: Check your Vercel deployment URL
- **Callback URL**: `https://your-vercel-domain.vercel.app/auth/callback`
