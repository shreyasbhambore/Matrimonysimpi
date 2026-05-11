# PROMPT 3 Database Migrations - Matrimony Platform

## Overview
These SQL files set up the database schema for PROMPT 3 (Profile Creation System + Premium User Dashboard).

## Files to Run (IN ORDER)

Run these SQL queries in your Supabase SQL Editor at: https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/sql/new

### 1. **01_create_profiles_table.sql**
Creates the main `profiles` table that stores user profile information including:
- Basic info (name, age, gender, location)
- Professional info (profession, education, income)
- Personal info (religion, height, body type, interests)
- Verification status (phone, photo, admin verified)
- Online status and timestamps

**Key Features:**
- Foreign key to `auth.users` table
- Automatic timestamps with `updated_at` trigger
- Row Level Security (RLS) policies
- Database indexes for search optimization

### 2. **02_create_profile_photos_table.sql**
Creates the `profile_photos` table for storing profile images with:
- Photo URLs and thumbnails
- Privacy levels (public, private, friends-only)
- Position order for gallery
- Blur levels for private photos
- Verification status

**Key Features:**
- Links to profiles table
- Privacy controls
- RLS policies for photo security

### 3. **03_create_shortlists_table.sql**
Creates the `shortlists` table for the save/bookmark feature:
- Tracks which profiles users have shortlisted
- Stores notes about shortlisted profiles
- Prevents duplicate and self-shortlists

**Key Features:**
- Efficient queries for "my shortlist"
- Prevents invalid data with constraints
- Indexed for performance

### 4. **04_create_profile_views_table.sql**
Creates the `profile_views` table for analytics:
- Tracks who viewed which profiles
- Stores view timestamp
- Used for "who viewed me" dashboard

**Key Features:**
- Efficient analytics queries
- Indexed for dashboard performance
- RLS for privacy

### 5. **05_create_user_settings_table.sql**
Creates the `user_settings` table for privacy and preferences:
- Privacy settings (who sees photos, contact info)
- Notification preferences
- Security settings (2FA, blocked users)

**Key Features:**
- One-to-one relationship with profiles
- Flexible privacy controls
- Notification management

## Installation Steps

1. **Copy all SQL files** from this scripts folder
2. **Go to your Supabase SQL Editor**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
3. **Run migrations in order**:
   - First, run `01_create_profiles_table.sql`
   - Then, run `02_create_profile_photos_table.sql`
   - Then, run `03_create_shortlists_table.sql`
   - Then, run `04_create_profile_views_table.sql`
   - Finally, run `05_create_user_settings_table.sql`

4. **Verify tables created**: Go to Table Editor in Supabase to confirm all tables exist

## Important Notes

- **ORDER MATTERS**: Run migrations in numerical order (01, 02, 03, 04, 05)
- **RLS POLICIES**: All tables have Row Level Security enabled for data privacy
- **SAFE MIGRATIONS**: These are idempotent (use `IF NOT EXISTS`) so they won't error if tables already exist
- **NO DATA LOSS**: These migrations only ADD new tables; they don't modify or delete existing ones
- **FOREIGN KEYS**: All tables properly reference `auth.users` for user authentication

## Database Relationships

```
auth.users
    ↓
    profiles (one-to-one)
    ├── profile_photos (one-to-many)
    ├── shortlists (one-to-many)
    ├── profile_views (one-to-many)
    └── user_settings (one-to-one)
```

## Next Steps After Running Migrations

After running these SQL files, the application code will:
1. Automatically create default `profiles` records when users sign up
2. Provide API routes for photo uploads
3. Handle shortlist operations
4. Track profile views
5. Manage privacy settings

The Next.js application is already configured to use these tables via Supabase client!

## Support

If you encounter any issues:
1. Check Supabase SQL error messages
2. Verify you're running migrations in correct order
3. Ensure your Supabase project is in the correct region
4. Check RLS policies are enabled in Supabase dashboard

---
**PROMPT 3 Database Setup** | Safe to run multiple times | No existing data will be affected
