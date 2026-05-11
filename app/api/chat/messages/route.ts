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
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      // Get user's conversations
      const { data, error } = await supabase
        .from("conversations")
        .select("*, messages(count)")
        .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`)
        .order("last_message_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ conversations: data });
    }

    // Get specific conversation messages
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("[v0] Chat GET error:", error);
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

    const { otherUserId, content, conversationId } = await request.json();

    if (!content || !otherUserId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let convoId = conversationId;

    // If no conversation, create one
    if (!convoId) {
      const [user1, user2] = user.id < otherUserId ? [user.id, otherUserId] : [otherUserId, user.id];

      const { data: existingConvo, error: fetchError } = await supabase
        .from("conversations")
        .select("id")
        .eq("user_1_id", user1)
        .eq("user_2_id", user2)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        return NextResponse.json({ error: fetchError.message }, { status: 400 });
      }

      if (existingConvo) {
        convoId = existingConvo.id;
      } else {
        const { data: newConvo, error: createError } = await supabase
          .from("conversations")
          .insert({
            user_1_id: user1,
            user_2_id: user2,
          })
          .select()
          .single();

        if (createError) {
          return NextResponse.json({ error: createError.message }, { status: 400 });
        }

        convoId = newConvo.id;
      }
    }

    // Insert message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: convoId,
        sender_id: user.id,
        content,
      })
      .select()
      .single();

    if (messageError) {
      return NextResponse.json({ error: messageError.message }, { status: 400 });
    }

    // Update conversation last message time
    await supabase
      .from("conversations")
      .update({
        last_message_id: message.id,
        last_message_at: new Date().toISOString(),
      })
      .eq("id", convoId);

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("[v0] Chat POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
