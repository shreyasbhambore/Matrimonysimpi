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

    // Fetch all filter reference data
    const [rashiRes, nakshatraRes, gotraRes] = await Promise.all([
      supabase.from("rashi_reference").select("*").order("name"),
      supabase.from("nakshatra_reference").select("*").order("name"),
      supabase.from("gotra_reference").select("*").order("name"),
    ])

    if (rashiRes.error || nakshatraRes.error || gotraRes.error) {
      return NextResponse.json(
        { error: "Failed to fetch filter options" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      filters: {
        rashi: rashiRes.data || [],
        nakshatra: nakshatraRes.data || [],
        gotra: gotraRes.data || [],
        karnatakaCities: [
          'Bangalore', 'Mysore', 'Mangalore', 'Udupi', 'Hubli', 'Belgaum',
          'Tumkur', 'Davangere', 'Hassan', 'Chikmagalur', 'Chitradurga', 'Raichur',
          'Koppal', 'Bellary', 'Kolar', 'Chikballapur'
        ],
      },
    })
  } catch (error) {
    console.error("[v0] Filters API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
