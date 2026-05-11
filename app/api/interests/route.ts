import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all"; // sent, received, all
    const status = searchParams.get("status") || "all"; // pending, accepted, rejected, all

    let query = supabase
      .from("interests")
      .select("*, profiles!interests_sender_id_fkey(*), profiles!interests_receiver_id_fkey(*)");

    if (type === "sent") {
      query = query.eq("sender_id", user.id);
    } else if (type === "received") {
      query = query.eq("receiver_id", user.id);
    } else {
      query = query.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
    }

    if (status !== "all") {
      query = query.eq("status", status);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ interests: data });
  } catch (error) {
    console.error("[v0] Interests GET error:", error);
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

    const { receiver_id, message, action } = await request.json();

    // Validate receiver
    if (!receiver_id || receiver_id === user.id) {
      return NextResponse.json(
        { error: "Invalid receiver" },
        { status: 400 }
      );
    }

    if (action === "send") {
      const { data, error } = await supabase
        .from("interests")
        .insert({
          sender_id: user.id,
          receiver_id,
          message,
          status: "pending",
        })
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ interest: data[0] }, { status: 201 });
    }

    if (action === "accept" || action === "reject" || action === "withdraw") {
      const newStatus = action === "accept" ? "accepted" : action === "reject" ? "rejected" : "withdrawn";

      const { data, error } = await supabase
        .from("interests")
        .update({ status: newStatus })
        .eq("id", receiver_id)
        .eq(action === "withdraw" ? "sender_id" : "receiver_id", user.id)
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (data.length === 0) {
        return NextResponse.json(
          { error: "Interest not found or unauthorized" },
          { status: 404 }
        );
      }

      return NextResponse.json({ interest: data[0] });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[v0] Interests POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
