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
        { error: "Only admins can manage featured profiles" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, profileId, displayOrder, isActive } = body

    if (action === "add_featured") {
      const { error } = await supabase
        .from("featured_profiles")
        .insert({
          profile_id: profileId,
          display_order: displayOrder,
          featured_by: user.id,
          is_active: isActive || true,
        })

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    } else if (action === "remove_featured") {
      const { error } = await supabase
        .from("featured_profiles")
        .delete()
        .eq("profile_id", profileId)

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    } else if (action === "update_featured") {
      const { error } = await supabase
        .from("featured_profiles")
        .update({
          display_order: displayOrder,
          is_active: isActive,
        })
        .eq("profile_id", profileId)

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Featured profiles management API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
