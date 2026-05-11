"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heart, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isChecking, setIsChecking] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          router.push("/dashboard")
        }
      } catch (err) {
        console.error("[v0] Auth check error:", err)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validate inputs
      if (!email || !password) {
        setError("Please fill in all fields")
        setLoading(false)
        return
      }

      if (email.trim().length === 0 || password.trim().length === 0) {
        setError("Please enter valid email and password")
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        setLoading(false)
        return
      }

      const supabase = createClient()

      console.log("[v0] Attempting login with email:", email)

      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      })

      console.log("[v0] Sign in response:", { data, error: signInError })

      if (signInError) {
        console.error("[v0] Sign in error:", signInError)
        
        if (signInError.status === 400 || signInError.message?.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check and try again.")
        } else if (signInError.status === 422) {
          setError("Invalid email format. Please provide a valid email address.")
        } else if (signInError.status === 429) {
          setError("Too many login attempts. Please try again later.")
        } else if (signInError.message?.includes("Email not confirmed")) {
          setError("Please verify your email before logging in.")
        } else {
          setError(signInError.message || "Failed to sign in. Please try again.")
        }
        setLoading(false)
        return
      }

      if (!data?.session) {
        console.error("[v0] No session created after login")
        setError("Login successful but session not created. Please try again.")
        setLoading(false)
        return
      }

      console.log("[v0] Login successful, redirecting to dashboard")
      setSuccess("Login successful! Redirecting...")
      
      // Wait a moment for user to see success message
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 500)
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true)
      const supabase = createClient()
      
      console.log("[v0] Starting Google OAuth flow")
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      console.log("[v0] Google OAuth response:", { data, error })

      if (error) {
        console.error("[v0] Google OAuth error:", error)
        setError(error.message || "Failed to sign in with Google. Please try again.")
        setLoading(false)
      }
    } catch (err) {
      console.error("[v0] Google login error:", err)
      setError(err instanceof Error ? err.message : "Failed to sign in with Google")
      setLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Heart className="size-7 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
            <CardDescription>Sign in to continue your journey</CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20 flex gap-2 items-start">
                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200 flex gap-2 items-start">
                <CheckCircle className="size-4 mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                or continue with
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full h-12"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="size-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Register Free
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border space-y-2">
          <p className="text-xs font-medium text-foreground">Demo Credentials:</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Admin Account:</strong></p>
            <p>Email: admin@matrimonysimpi.com</p>
            <p>Password: Supariking</p>
          </div>
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <p><strong>Test User Account:</strong></p>
            <p>Email: priya.sharma@example.com</p>
            <p>Password: Supariking</p>
          </div>
        </div>
      </div>
    </div>
  )
}
