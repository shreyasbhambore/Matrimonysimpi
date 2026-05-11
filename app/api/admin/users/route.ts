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
        { error: "Only admins can manage users" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, userId, userData } = body

    if (action === "update_user") {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...userData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

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
          action_type: "UPDATE_USER",
          entity_type: "user",
          entity_id: userId,
          new_values: userData,
          description: "User updated by admin",
        })
    } else if (action === "delete_user") {
      // Soft delete or hard delete based on requirement
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId)

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
          action_type: "DELETE_USER",
          entity_type: "user",
          entity_id: userId,
          description: "User deleted by admin",
        })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] User management API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
