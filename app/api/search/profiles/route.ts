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
      occupation,
      height_min,
      height_max,
      annual_income_min,
      annual_income_max,
      marital_status,
      education,
      page = 1,
      limit = 20,
    } = body;

    // Build filters
    let query = supabase
      .from("profiles")
      .select("*, profile_photos(*)", { count: "exact" })
      .neq("user_id", user.id) // Don't show own profile
      .eq("profile_visibility", "public");

    // Age filter
    if (age_min || age_max) {
      const currentYear = new Date().getFullYear();
      if (age_min) {
        query = query.lte("date_of_birth", new Date(currentYear - age_min, 0, 1).toISOString());
      }
      if (age_max) {
        query = query.gte("date_of_birth", new Date(currentYear - age_max, 11, 31).toISOString());
      }
    }

    // Religion filter
    if (religion) {
      query = query.eq("religion", religion);
    }

    // Caste filter
    if (caste) {
      query = query.eq("caste", caste);
    }

    // Location filter
    if (location) {
      query = query.ilike("location", `%${location}%`);
    }

    // Occupation filter
    if (occupation) {
      query = query.ilike("occupation", `%${occupation}%`);
    }

    // Height filter
    if (height_min || height_max) {
      if (height_min) {
        query = query.gte("height", height_min);
      }
      if (height_max) {
        query = query.lte("height", height_max);
      }
    }

    // Annual income filter
    if (annual_income_min || annual_income_max) {
      if (annual_income_min) {
        query = query.gte("annual_income", annual_income_min);
      }
      if (annual_income_max) {
        query = query.lte("annual_income", annual_income_max);
      }
    }

    // Marital status filter
    if (marital_status) {
      query = query.eq("marital_status", marital_status);
    }

    // Education filter
    if (education) {
      query = query.eq("education", education);
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
