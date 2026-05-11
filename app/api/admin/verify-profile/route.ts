import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

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
        { error: "Only admins can verify profiles" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, profileId, isVerified } = body

    if (action === "verify_profile") {
      const { error } = await supabase
        .from("profiles")
        .update({
          verified_admin: isVerified,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profileId)

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      // Log admin action
      await supabase
        .from("admin_actions_log")
        .insert({
          admin_id: user.id,
          action_type: "VERIFY_PROFILE",
          entity_type: "profile",
          entity_id: profileId,
          new_values: { verified_admin: isVerified },
          description: `Profile ${isVerified ? "verified" : "unverified"}`,
        })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Profile verification API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
