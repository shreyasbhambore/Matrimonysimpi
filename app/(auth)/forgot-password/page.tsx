"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-lg text-center">
            <CardHeader className="pb-2">
              <div className="flex justify-center mb-4">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="size-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-serif">Check Your Email</CardTitle>
              <CardDescription className="text-base">
                We{"'"}ve sent a password reset link
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground mb-6">
                If an account exists for {email}, you will receive a password reset link shortly.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
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
            <CardTitle className="text-2xl font-serif">Forgot Password?</CardTitle>
            <CardDescription>Enter your email to receive a reset link</CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
              <ArrowLeft className="size-4" />
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
