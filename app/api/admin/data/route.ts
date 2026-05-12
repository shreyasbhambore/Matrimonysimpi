import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

// Create a service role client for admin operations
function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase service role environment variables")
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    // Use anon client to verify the user is authenticated
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    )

    // Verify user is authenticated (optional - the admin page already checks this)
    const { data: { user } } = await supabase.auth.getUser()

    // Use service role client for admin operations
    const adminSupabase = createServiceRoleClient()

    // Fetch all users using service role
    const { data: usersData, error: usersError } = await adminSupabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error("[v0] Error fetching users:", usersError)
      return NextResponse.json(
        { error: "Failed to fetch users: " + usersError.message },
        { status: 500 }
      )
    }

    // Fetch all profiles
    const { data: profilesData, error: profilesError } = await adminSupabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (profilesError) {
      console.error("[v0] Error fetching profiles:", profilesError)
      // Continue even if profiles fail - might not have table yet
    }

    // Fetch membership settings
    const { data: membershipData, error: membershipError } = await adminSupabase
      .from("user_membership_settings")
      .select("*")

    if (membershipError) {
      console.error("[v0] Error fetching membership settings:", membershipError)
      // Continue - table might not exist yet
    }

    // Fetch global membership settings
    const { data: globalData, error: globalError } = await adminSupabase
      .from("global_membership_settings")
      .select("is_membership_enabled")
      .eq("setting_key", "MEMBERSHIP_FEATURE_ENABLED")
      .single()

    // Calculate stats
    const profiles = profilesData || []
    const verifiedProfiles = profiles.filter((p: any) => p.is_verified).length
    const featuredProfiles = profiles.filter((p: any) => p.is_featured).length

    return NextResponse.json({
      users: usersData?.users || [],
      profiles: profiles,
      membershipSettings: membershipData || [],
      globalMembershipEnabled: globalData?.is_membership_enabled || false,
      stats: {
        totalUsers: usersData?.users?.length || 0,
        totalProfiles: profiles.length,
        verifiedProfiles,
        featuredProfiles,
        membershipEnabled: globalData?.is_membership_enabled || false,
      },
    })
  } catch (error) {
    console.error("[v0] Admin data API error:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    )
  }
}

// Handle admin actions (delete user, verify profile, etc.)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, profileId, data } = body

    const adminSupabase = createServiceRoleClient()

    switch (action) {
      case "delete_user": {
        const { error } = await adminSupabase.auth.admin.deleteUser(userId)
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 })
        }
        return NextResponse.json({ success: true })
      }

      case "verify_profile": {
        const { error } = await adminSupabase
          .from("profiles")
          .update({ is_verified: true, verification_status: "verified" })
          .eq("id", profileId)
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 })
        }
        return NextResponse.json({ success: true })
      }

      case "toggle_featured": {
        const { is_featured } = data
        const { error } = await adminSupabase
          .from("profiles")
          .update({ is_featured })
          .eq("id", profileId)
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 })
        }
        return NextResponse.json({ success: true })
      }

      case "delete_profile": {
        const { error } = await adminSupabase
          .from("profiles")
          .delete()
          .eq("id", profileId)
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 })
        }
        return NextResponse.json({ success: true })
      }

      case "toggle_user_membership": {
        const { is_membership_active } = data
        const { error } = await adminSupabase
          .from("user_membership_settings")
          .upsert(
            { user_id: userId, is_membership_active },
            { onConflict: "user_id" }
          )
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 })
        }
        return NextResponse.json({ success: true })
      }

      case "toggle_global_membership": {
        const { is_membership_enabled } = data
        const { error } = await adminSupabase
          .from("global_membership_settings")
          .upsert(
            {
              setting_key: "MEMBERSHIP_FEATURE_ENABLED",
              is_membership_enabled,
            },
            { onConflict: "setting_key" }
          )
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 })
        }
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Admin action error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
