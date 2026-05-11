import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
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

    // Get global membership settings
    const { data: settings, error } = await supabase
      .from("global_membership_settings")
      .select("*")
      .eq("setting_key", "MEMBERSHIP_FEATURE_ENABLED")
      .single()

    if (error && error.code !== "PGRST116") {
      return NextResponse.json(
        { error: "Failed to fetch membership settings" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      membershipEnabled: settings?.is_membership_enabled || false,
    })
  } catch (error) {
    console.error("[v0] Membership API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json(
        { error: "Only admins can modify membership settings" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, userId, isEnabled, membershipType } = body

    if (action === "toggle_user_membership") {
      // Update per-user membership
      const { error: updateError } = await supabase
        .from("membership_settings")
        .upsert({
          user_id: userId,
          is_membership_active: isEnabled,
          membership_type: membershipType || "premium",
          updated_at: new Date().toISOString(),
        })

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 400 }
        )
      }
    } else if (action === "toggle_global_membership") {
      // Update global membership setting
      const { error: updateError } = await supabase
        .from("global_membership_settings")
        .update({
          is_membership_enabled: isEnabled,
          updated_at: new Date().toISOString(),
        })
        .eq("setting_key", "MEMBERSHIP_FEATURE_ENABLED")

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Membership POST API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
