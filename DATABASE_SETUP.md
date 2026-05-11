# Database Setup Guide for New Supabase Account

## Overview
You have 5 new SQL migration scripts to run in your Supabase project. These scripts add support for:
- Profile filters (Gotra, Rashi, Nakshatra, Horoscope Match)
- Featured profiles carousel management
- Membership settings (per-user and global toggle)
- Admin dashboard enhancements
- Filter reference data

## Steps to Run Migrations

### 1. Connect to Your Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Login to your account
3. Select your project
4. Go to **SQL Editor** in the left sidebar
5. Click **New Query**

### 2. Run Each Migration Script in Order

Run these scripts in sequence, waiting for each to complete:

**Script 1: 17_add_profile_filters.sql**
- Adds: Gotra, Rashi, Nakshatra, Horoscope Match columns to profiles table
- Creates indexes for filter searches
- Location: `/scripts/17_add_profile_filters.sql`

**Script 2: 18_create_featured_profiles_table.sql**
- Creates: featured_profiles table for carousel management
- Includes RLS policies for admin access
- Location: `/scripts/18_create_featured_profiles_table.sql`

**Script 3: 19_create_membership_settings_table.sql**
- Creates: membership_settings table (per-user toggle)
- Creates: global_membership_settings table (site-wide toggle)
- Includes RLS policies for user and admin access
- Location: `/scripts/19_create_membership_settings_table.sql`

**Script 4: 20_update_admin_users_table.sql**
- Updates: admin_users table with new permission columns
- Creates: admin_actions_log table for audit trail
- Includes RLS policies for admin access
- Location: `/scripts/20_update_admin_users_table.sql`

**Script 5: 21_create_filter_reference_tables.sql**
- Creates: gotra_reference, rashi_reference, nakshatra_reference tables
- Creates: horoscope_compatibility reference table
- Populates: Common values for Rashi, Nakshatra, Gotra
- Includes RLS policies for public read access
- Location: `/scripts/21_create_filter_reference_tables.sql`

### 3. Environment Variables to Set

After running the scripts, you need to set these environment variables in your Vercel project:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Where to find these values:
1. Go to Supabase project dashboard
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → Use for `SUPABASE_SERVICE_ROLE_KEY`

### 4. Verify in Vercel

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add the three variables above
4. Redeploy your application

## Troubleshooting

**If you get a "table already exists" error:**
- This is fine! The scripts use `IF NOT EXISTS` to prevent errors
- The script will skip creating tables that already exist

**If you get permission denied errors:**
- Make sure you're logged in with an admin account
- Verify you're using the correct Supabase project

**If queries fail to run:**
- Check the SQL syntax in the error message
- Copy each script carefully and run one at a time
- Ensure you wait for each script to complete before running the next

## Database Schema Summary

### New Tables Created:
1. **featured_profiles** - Stores featured carousel profiles
2. **membership_settings** - Per-user membership configuration
3. **global_membership_settings** - Site-wide membership feature toggle
4. **admin_actions_log** - Audit trail of admin dashboard actions
5. **gotra_reference** - Reference data for Gotra values
6. **rashi_reference** - Reference data for Rashi zodiac signs
7. **nakshatra_reference** - Reference data for Nakshatra
8. **horoscope_compatibility** - Rashi compatibility matrix

### Modified Tables:
1. **profiles** - Added: gotra, rashi, nakshatra, horoscope_match columns
2. **admin_users** - Added: new permission columns and audit tracking

## Next Steps

Once all scripts are running:
1. Update your `.env.local` file with the environment variables
2. Test the login functionality
3. Access the admin dashboard to configure featured profiles
4. Test the carousel on the homepage
5. Configure membership settings in the admin panel

For any issues, check the console logs and verify all scripts ran successfully in Supabase.
