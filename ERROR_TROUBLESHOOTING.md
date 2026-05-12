## Admin Dashboard - Error Troubleshooting Guide

This guide helps diagnose and fix common errors when running the Admin Dashboard.

---

## Common Errors and Solutions

### 1. TypeScript Build Errors

**Error**: `Type 'string | undefined' is not assignable to type 'string'`

**Cause**: Supabase Auth `User` type has `email` as optional (string | undefined)

**Solution**: ✅ Already fixed in `/components/admin/admin-dashboard-v2.tsx`
- Changed interface to `email?: string`
- Added fallback displays: `user.email || 'No email'`

---

### 2. "supabase.auth.admin is not a function"

**Error**: Runtime error when calling `supabase.auth.admin.listUsers()`

**Cause**: Browser client uses anon key, not service role key. Admin methods require service role.

**Solution**: ✅ Fixed by creating API route
- Use `/api/admin/data` endpoint instead
- API route uses `SUPABASE_SERVICE_ROLE_KEY` (server-side)
- All admin operations go through the API

---

### 3. "SUPABASE_SERVICE_ROLE_KEY not configured"

**Error**: 
```
Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set
```

**Cause**: Missing environment variable in Vercel

**Solution**:
1. Go to Vercel Project Settings > Vars
2. Add: `SUPABASE_SERVICE_ROLE_KEY` = (your service role key from Supabase)
3. Redeploy: `git push` to trigger redeploy
4. If still failing, try Preview environment - need to add var to Preview Vars too

**Where to find Service Role Key:**
- Supabase Dashboard > Settings > API > Service Role Secret
- Copy the full key (it's long)

---

### 4. "relation 'user_membership_unique' already exists"

**Error**:
```sql
ERROR: 42P07: relation "user_membership_unique" already exists
```

**Cause**: Constraint already exists in your database from previous run

**Solution**: ✅ Fixed in updated SQL script
- Run the updated script from `/scripts/24_admin_dashboard_requirements.sql`
- It safely drops and recreates constraints
- Uses `DO` blocks to handle conflicts

**Manual fix if needed**:
```sql
-- Drop the conflicting constraint
ALTER TABLE user_membership_settings 
DROP CONSTRAINT IF EXISTS user_membership_unique;

-- Add it back
ALTER TABLE user_membership_settings 
ADD CONSTRAINT user_membership_unique UNIQUE(user_id);
```

---

### 5. "Failed to fetch admin data"

**Error**: Shows error toast in admin dashboard UI

**Cause**: Multiple possible causes - check these:

**Solutions**:

a) **Check API route is responding**
```
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to load admin dashboard
4. Look for `/api/admin/data` request
5. Check response status and body
```

b) **Verify environment variables**
```bash
# These must be set in Vercel:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

c) **Check Supabase URL and keys are correct**
```sql
-- Test connection in Supabase SQL Editor:
SELECT auth.uid();  -- Should work
```

d) **Check RLS policies allow access**
```sql
-- Verify policies exist:
SELECT * FROM pg_policies WHERE tablename = 'profiles';
SELECT * FROM pg_policies WHERE tablename = 'user_membership_settings';
```

---

### 6. "No users/profiles showing"

**Error**: Admin dashboard loads but shows empty lists

**Cause**: Either no data exists OR RLS prevents access

**Solutions**:

a) **Check data exists**
```sql
SELECT COUNT(*) as user_count FROM profiles;
-- Should return a number > 0
```

b) **Check RLS policies**
```sql
-- For profiles table:
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Should show:
-- - "Authenticated users can view all profiles"
-- - "Authenticated users can update profiles"
-- - "Authenticated users can delete profiles"
```

c) **Temporarily disable RLS to test** (not for production!)
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- Reload dashboard
-- If data shows, RLS policy issue

-- Re-enable and fix policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

---

### 7. "Cannot delete user - 403 Forbidden"

**Error**: Delete user button fails with permission error

**Cause**: Service role key doesn't have admin privileges OR API not using service role

**Solutions**:

a) **Verify API is using service role**
- Check `/app/api/admin/data/route.ts`
- Should use: `const supabase = createServiceRoleClient()`
- NOT the browser client

b) **Verify service role key is correct**
```bash
# In your Vercel environment:
echo $SUPABASE_SERVICE_ROLE_KEY
# Should output a long string starting with "eyJ..."
```

c) **Check Supabase auth settings**
- Go to Supabase > Auth > User Management
- Service role should have full access by default

---

### 8. "DialogTrigger error - asChild prop not recognized"

**Error**:
```
Type '{ asChild: boolean; }' is not assignable to type...
```

**Cause**: Project uses Base UI not Radix UI - different API

**Solution**: ✅ Already fixed
- Changed from: `<DialogTrigger asChild>`
- Changed to: `<DialogTrigger render={<Button ... />}>`
- Base UI uses `render` prop instead of `asChild`

---

### 9. "Membership settings not updating"

**Error**: Toggle membership button doesn't persist changes

**Cause**: Either no UNIQUE constraint on `user_id` OR RLS blocking update

**Solutions**:

a) **Check UNIQUE constraint exists**
```sql
SELECT constraint_name FROM information_schema.table_constraints 
WHERE table_name = 'user_membership_settings';
-- Should list: user_membership_unique
```

b) **Check RLS allows updates**
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'user_membership_settings';
-- Should include update policy for authenticated users
```

c) **Insert a test record**
```sql
INSERT INTO user_membership_settings (user_id, is_membership_active)
VALUES ('your-user-id', true)
ON CONFLICT (user_id) DO UPDATE SET is_membership_active = true;
```

---

### 10. "401 Unauthorized - Admin not authenticated"

**Error**: Can't access admin dashboard

**Cause**: Admin authentication check failing

**Solutions**:

a) **Check admin login page works**
- Navigate to `/admin`
- Enter admin credentials
- Should set `sessionStorage.admin_authenticated = true`

b) **Check sessionStorage in browser**
```javascript
// In DevTools Console:
console.log(sessionStorage.getItem('admin_authenticated'));
// Should output: 'true' or null
```

c) **Check login logic in admin-login component**
- Verify the credential check is working
- Check if login form is submitting

---

## Debug Commands

### Check current database state:

```sql
-- Users count
SELECT COUNT(*) as total_users FROM auth.users;

-- Profiles with verification status
SELECT id, is_verified, is_featured, created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- Membership settings
SELECT user_id, is_membership_active, membership_expiry 
FROM user_membership_settings 
LIMIT 10;

-- Global settings
SELECT setting_key, is_membership_enabled 
FROM global_membership_settings;

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_membership_settings', 'global_membership_settings');
```

### Test API endpoint:

```bash
# Test with curl
curl -X GET https://your-app.vercel.app/api/admin/data \
  -H "Authorization: Bearer your-session-token"

# Should return JSON with users, profiles, stats
```

### Check environment variables:

```bash
# In Vercel Environment:
# Settings > Vars > Check these exist:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY ⚠️ CRITICAL
```

---

## Getting Help

1. **Check the logs**:
   - Browser Console (F12)
   - Vercel Logs: Project Settings > Deployments > Logs
   - Supabase Logs: Auth > Logs

2. **Verify your setup**:
   - Run all verification queries in section 3 above
   - Check all environment variables are set
   - Confirm SQL migration ran successfully

3. **Still stuck?**
   - Check the implementation guide: `ADMIN_DASHBOARD_SETUP.md`
   - Review the API route code: `/app/api/admin/data/route.ts`
   - Review the component code: `/components/admin/admin-dashboard-v2.tsx`

---

## Quick Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel Vars
- [ ] SQL migration script ran without errors
- [ ] Profiles table has `is_verified` and `is_featured` columns
- [ ] `user_membership_settings` table exists with UNIQUE constraint
- [ ] `global_membership_settings` table exists
- [ ] RLS policies are in place on all three tables
- [ ] Admin can login to `/admin`
- [ ] API endpoint `/api/admin/data` responds with data
- [ ] No errors in browser console
- [ ] No errors in Vercel logs
