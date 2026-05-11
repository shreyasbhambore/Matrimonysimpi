import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Middleware to check admin status
async function checkAdminAccess(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.role;
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await checkAdminAccess(supabase, user.id);
    if (!role) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const resourceType = searchParams.get("type"); // reports, users, profiles

    if (resourceType === "reports") {
      const status = searchParams.get("status") || "all";
      let query = supabase
        .from("reports")
        .select("*, profiles!reports_reported_user_id_fkey(*)");

      if (status !== "all") {
        query = query.eq("status", status);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ reports: data });
    }

    if (resourceType === "users") {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ users: data });
    }

    if (resourceType === "audit") {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ logs: data });
    }

    return NextResponse.json({ error: "Invalid resource type" }, { status: 400 });
  } catch (error) {
    console.error("[v0] Admin GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await checkAdminAccess(supabase, user.id);
    if (!role || !["admin", "superadmin"].includes(role)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { action, reportId, resolution, profileId, banReason } = await request.json();

    if (action === "resolve_report") {
      const { data, error } = await supabase
        .from("reports")
        .update({
          status: "resolved",
          resolution,
          resolved_by: user.id,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", reportId)
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Log action
      await supabase.from("audit_logs").insert({
        admin_id: user.id,
        action: "resolve_report",
        resource_type: "report",
        resource_id: reportId,
        changes: { resolution },
      });

      return NextResponse.json({ report: data[0] });
    }

    if (action === "ban_profile") {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          is_banned: true,
          ban_reason: banReason,
          banned_at: new Date().toISOString(),
          banned_by: user.id,
        })
        .eq("id", profileId)
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Log action
      await supabase.from("audit_logs").insert({
        admin_id: user.id,
        action: "ban_profile",
        resource_type: "profile",
        resource_id: profileId,
        changes: { ban_reason: banReason },
      });

      return NextResponse.json({ profile: data[0] });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[v0] Admin POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
