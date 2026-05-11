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

    // Fetch featured profiles (limit 10-15 for carousel)
    const { data: featuredProfiles, error } = await supabase
      .from("featured_profiles")
      .select(`
        *,
        profile:profiles(
          id,
          full_name,
          age,
          city,
          profession,
          verified_admin,
          profile_photos(photo_url, is_primary)
        )
      `)
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(15)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Transform data for carousel
    const profiles = (featuredProfiles || []).map((fp: any) => ({
      id: fp.profile_id,
      name: fp.profile.full_name,
      age: fp.profile.age,
      city: fp.profile.city,
      profession: fp.profile.profession,
      verified: fp.profile.verified_admin,
      image: fp.profile.profile_photos?.[0]?.photo_url || null,
    }))

    return NextResponse.json({
      profiles,
      total: profiles.length,
    })
  } catch (error) {
    console.error("[v0] Featured profiles API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
