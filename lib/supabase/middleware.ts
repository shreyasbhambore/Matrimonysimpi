import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase isn't configured yet, just pass through without auth checks
  // This prevents the entire site from breaking when env vars are missing
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[v0] Supabase env vars not configured - skipping auth middleware')
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protected routes
    const protectedPaths = ['/dashboard', '/profile', '/settings', '/onboarding']
    const isProtected = protectedPaths.some(path =>
      request.nextUrl.pathname.startsWith(path),
    )

    if (isProtected && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Redirect logged in users away from auth pages
    const authPaths = ['/login', '/register']
    const isAuthPage = authPaths.some(path =>
      request.nextUrl.pathname.startsWith(path),
    )

    if (isAuthPage && user) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error('[v0] Middleware error:', error)
    // On any error, allow the request to continue rather than blocking the entire site
    return supabaseResponse
  }
}
