## Admin Dashboard Implementation Guide

This document provides step-by-step instructions for setting up the Admin Dashboard with your Supabase instance.

---

## Prerequisites

- **Supabase Project**: Your own instance (different from the original)
- **Vercel Account**: Your own (different from the original)
- **Environment Variables**: Supabase URL, Anon Key, and **Service Role Key**

---

## Step 1: Environment Variables Setup

Add these to your Vercel project settings under **Vars**:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is REQUIRED for admin operations. You can find it in your Supabase dashboard under Settings > API.

---

## Step 2: Database Setup - Run SQL Migration

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents from `/scripts/24_admin_dashboard_requirements.sql`
5. Click **Run**

**What this script does:**
- Adds `is_verified`, `is_featured`, and other columns to the `profiles` table
- Updates the `user_membership_settings` table with safe constraint handling
- Creates/updates `global_membership_settings` table
- Sets up Row Level Security (RLS) policies for admin access

**If you get constraint errors:**
- The script safely handles existing constraints using `DO` blocks
- If issues persist, check your existing table structure first

---

## Step 3: Verify Database Setup

Run these queries in Supabase SQL Editor to verify:

```sql
-- Check profiles table columns
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY column_name;

-- Check user_membership_settings exists
SELECT COUNT(*) FROM user_membership_settings LIMIT 1;

-- Check global_membership_settings
SELECT * FROM global_membership_settings;
```

---

## Step 4: How the Admin Dashboard Works

### Architecture Overview

**Browser → Admin Component → API Route → Supabase Service Role**

The admin dashboard does NOT directly call Supabase auth.admin methods. Instead:

1. **Admin Component** (`/components/admin/admin-dashboard-v2.tsx`)
   - Fetches data via API route
   - Updates state locally
   - Shows UI for management

2. **Admin API Route** (`/app/api/admin/data/route.ts`)
   - Uses service role key (server-side)
   - Handles: list users, verify profiles, delete profiles, toggle featured, manage memberships
   - Returns JSON responses

3. **Supabase**
   - Stores all data
   - Authenticates service role
   - Enforces RLS policies

### Key Files

```
/app/api/admin/data/route.ts       - API route (uses service role)
/app/admin/page.tsx                - Admin page layout
/components/admin/admin-dashboard-v2.tsx - Main dashboard component
/components/admin/admin-login.tsx  - Login page for admins
/scripts/24_admin_dashboard_requirements.sql - Database migration
```

---

## Step 5: Access the Admin Dashboard

1. Navigate to `/admin` in your app
2. Enter admin credentials (requires `admin_authenticated` in sessionStorage)
3. View and manage:
   - Users
   - Profiles (verify, feature, delete)
   - Membership settings
   - Global membership toggle

---

## Admin Features

### 1. User Management
- View all users from Supabase Auth
- Delete users from auth system
- See user join dates

### 2. Profile Management
- View all user profiles
- Verify profiles (mark as verified)
- Toggle profiles as featured
- Delete profiles
- Search/filter profiles

### 3. Membership Settings
- Toggle membership status per user
- View/manage membership expiry dates
- Toggle global membership feature

### 4. Statistics Dashboard
- Total users count
- Total profiles count
- Verified profiles count
- Featured profiles count

---

## API Endpoints

### GET `/api/admin/data`
Fetches all admin data (requires authentication)

**Response:**
```json
{
  "users": [...],
  "profiles": [...],
  "membershipSettings": [...],
  "globalMembershipEnabled": true/false,
  "stats": {
    "totalUsers": 0,
    "totalProfiles": 0,
    "verifiedProfiles": 0,
    "featuredProfiles": 0,
    "membershipEnabled": true/false
  }
}
```

### POST `/api/admin/data`
Performs admin actions

**Body examples:**
```json
{ "action": "delete_user", "userId": "uuid" }
{ "action": "verify_profile", "profileId": "uuid" }
{ "action": "toggle_featured", "profileId": "uuid", "data": { "is_featured": true } }
{ "action": "delete_profile", "profileId": "uuid" }
{ "action": "toggle_user_membership", "userId": "uuid", "data": { "is_membership_active": true } }
{ "action": "toggle_global_membership", "data": { "is_membership_enabled": true } }
```

---

## Troubleshooting

### Error: "SUPABASE_SERVICE_ROLE_KEY not configured"
- Check Vercel environment variables
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is added (not `SUPABASE_SERVICE_KEY`)
- Redeploy after adding env var

### Error: "Failed to fetch admin data"
- Check browser console for error details
- Verify Supabase URL and keys are correct
- Ensure RLS policies are in place (run SQL script again)

### Error: "Constraint already exists"
- The safe SQL script handles this automatically
- If persists, drop the constraint manually:
```sql
ALTER TABLE user_membership_settings 
DROP CONSTRAINT IF EXISTS user_membership_unique;
```

### Users/Profiles not loading
- Check that tables exist: `SELECT * FROM profiles LIMIT 1;`
- Verify RLS policies allow authenticated users
- Check API route response in Network tab

### Can't delete users
- The service role has admin privileges - this should work
- Verify `auth.admin` is accessible with your service key
- Check Supabase logs for errors

---

## Security Considerations

1. **Service Role Key**: Never expose this in client-side code. It's server-only in the API route.
2. **API Authentication**: The `/api/admin/data` route should check admin status before allowing operations.
3. **RLS Policies**: All operations bypass RLS when using service role, ensuring admin access.
4. **Session Management**: Admin session stored in sessionStorage - consider upgrading to secure HTTP-only cookies.

---

## Next Steps

1. ✅ Set up environment variables
2. ✅ Run SQL migration script
3. ✅ Access `/admin` endpoint
4. ✅ Test user management features
5. Consider adding role-based access control (RBAC)
6. Consider adding audit logs for admin actions

---

## Support

For issues specific to:
- **Supabase**: Check Supabase documentation at supabase.com
- **Vercel**: Check Vercel documentation at vercel.com
- **Admin Dashboard Code**: Review the code files mentioned above
