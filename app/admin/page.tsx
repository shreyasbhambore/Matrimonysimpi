'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle } from 'lucide-react'
import { AdminDashboard } from '@/components/admin/admin-dashboard-v2'

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [adminId, setAdminId] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Check if admin is logged in via session storage
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if user has logged in with admin credentials
        const storedAuth = sessionStorage.getItem('admin_authenticated')
        if (storedAuth === 'true') {
          setIsAuthenticated(true)
        }
        setIsCheckingAuth(false)
      } catch (err) {
        console.error('[v0] Auth check error:', err)
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)

    try {
      // Hardcoded admin credentials
      const ADMIN_ID = 'admin'
      const ADMIN_PASSWORD = 'Supariking'

      if (adminId === ADMIN_ID && adminPassword === ADMIN_PASSWORD) {
        // Store auth in session storage
        sessionStorage.setItem('admin_authenticated', 'true')
        sessionStorage.setItem('admin_login_time', new Date().toISOString())
        setIsAuthenticated(true)
        console.log('[v0] Admin logged in successfully')
      } else {
        setLoginError('Invalid admin credentials. Please try again.')
      }
    } catch (err) {
      console.error('[v0] Login error:', err)
      setLoginError('An error occurred. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  // Admin Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-serif">Admin Portal</CardTitle>
              <CardDescription>Matrimony Platform Administration</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {loginError && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="admin-id" className="text-sm font-medium">
                    Admin ID
                  </label>
                  <Input
                    id="admin-id"
                    type="text"
                    placeholder="Enter admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                    disabled={isLoggingIn}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="admin-password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    disabled={isLoggingIn}
                    className="h-12"
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-base" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Logging in...' : 'Login to Admin Panel'}
                </Button>
              </form>

              <div className="mt-6 p-3 rounded-lg bg-muted">
                <p className="text-xs font-medium text-foreground mb-2">Demo Credentials:</p>
                <p className="text-xs text-muted-foreground">ID: admin</p>
                <p className="text-xs text-muted-foreground">Password: Supariking</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  return <AdminDashboard />
}
