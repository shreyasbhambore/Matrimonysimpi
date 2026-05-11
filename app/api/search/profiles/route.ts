import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      age_min = 18,
      age_max = 65,
      religion,
      caste,
      location,
      city,
      occupation,
      height_min,
      height_max,
      annual_income_min,
      annual_income_max,
      marital_status,
      education,
      education_status,
      page = 1,
      limit = 20,
    } = body;

    // Build filters
    let query = supabase
      .from("profiles")
      .select("*, profile_photos(*)", { count: "exact" })
      .neq("id", user.id); // Don't show own profile

    // Age filter (using age column directly)
    if (age_min) {
      query = query.gte("age", age_min);
    }
    if (age_max) {
      query = query.lte("age", age_max);
    }

    // Religion filter
    if (religion) {
      query = query.eq("religion", religion);
    }

    // Caste filter
    if (caste) {
      query = query.eq("caste", caste);
    }

    // State/Location filter
    if (location) {
      query = query.ilike("state", `%${location}%`);
    }

    // City filter (specific city in Karnataka)
    if (city) {
      query = query.ilike("city", `%${city}%`);
    }

    // Profession/Occupation filter
    if (occupation) {
      query = query.ilike("profession", `%${occupation}%`);
    }

    // Education filter
    if (education) {
      query = query.eq("education", education);
    }

    // Education status filter (working, student, etc.)
    if (education_status) {
      query = query.eq("education_status", education_status);
    }

    // Marital status filter
    if (marital_status) {
      query = query.eq("marital_status", marital_status);
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      profiles: data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("[v0] Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
