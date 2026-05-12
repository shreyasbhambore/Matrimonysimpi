'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Image,
  Settings2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Plus,
  Eye,
  EyeOff,
  LogOut,
  Star,
  StarOff,
  Search,
  Loader,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface DashboardStats {
  totalUsers: number
  totalProfiles: number
  verifiedProfiles: number
  featuredProfiles: number
  membershipEnabled: boolean
}

interface Profile {
  id: string
  user_id: string
  full_name: string
  email: string
  age?: number
  gender?: string
  city?: string
  profession?: string
  is_verified: boolean
  is_featured?: boolean
  verification_status?: string
  profile_photo_url?: string
  created_at: string
}

interface User {
  id: string
  email?: string
  created_at: string
  user_metadata?: {
    full_name?: string
  }
}

interface MembershipSetting {
  user_id: string
  is_membership_active: boolean
}

export function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [membershipSettings, setMembershipSettings] = useState<MembershipSetting[]>([])
  const [globalMembershipEnabled, setGlobalMembershipEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [editingMembership, setEditingMembership] = useState<string | null>(null)

  // Fetch admin data on mount
  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('[v0] Fetching admin data via API...')

      // Fetch all admin data from the API route (uses service role key)
      const response = await fetch('/api/admin/data')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch admin data')
      }

      setUsers(data.users || [])
      setProfiles(data.profiles || [])
      setMembershipSettings(data.membershipSettings || [])
      setGlobalMembershipEnabled(data.globalMembershipEnabled || false)
      setStats(data.stats)

      console.log('[v0] Admin data fetched successfully')
    } catch (err) {
      console.error('[v0] Error fetching admin data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch admin data')
    } finally {
      setLoading(false)
    }
  }

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      setLoading(true)
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_user', userId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setUsers(users.filter((u) => u.id !== userId))
      console.log('[v0] User deleted successfully')
    } catch (err) {
      console.error('[v0] Error deleting user:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    } finally {
      setLoading(false)
    }
  }

  // Verify profile
  const handleVerifyProfile = async (profileId: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_profile', profileId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setProfiles(profiles.map((p) => (p.id === profileId ? { ...p, is_verified: true } : p)))
      console.log('[v0] Profile verified')
    } catch (err) {
      console.error('[v0] Error verifying profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to verify profile')
    } finally {
      setLoading(false)
    }
  }

  // Toggle featured profile
  const handleToggleFeatured = async (profileId: string, isFeatured: boolean) => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_featured', profileId, data: { is_featured: !isFeatured } }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setProfiles(profiles.map((p) => (p.id === profileId ? { ...p, is_featured: !isFeatured } : p)))
      console.log('[v0] Profile featured toggle updated')
    } catch (err) {
      console.error('[v0] Error toggling featured:', err)
      setError(err instanceof Error ? err.message : 'Failed to update featured status')
    } finally {
      setLoading(false)
    }
  }

  // Delete profile
  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return

    try {
      setLoading(true)
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_profile', profileId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setProfiles(profiles.filter((p) => p.id !== profileId))
      console.log('[v0] Profile deleted')
    } catch (err) {
      console.error('[v0] Error deleting profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete profile')
    } finally {
      setLoading(false)
    }
  }

  // Toggle user membership
  const handleToggleMembership = async (userId: string, currentStatus: boolean) => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_user_membership',
          userId,
          data: { is_membership_active: !currentStatus },
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      // Update local state - add if not exists, update if exists
      const existingIndex = membershipSettings.findIndex((m) => m.user_id === userId)
      if (existingIndex >= 0) {
        setMembershipSettings(
          membershipSettings.map((m) =>
            m.user_id === userId ? { ...m, is_membership_active: !currentStatus } : m,
          ),
        )
      } else {
        setMembershipSettings([
          ...membershipSettings,
          { user_id: userId, is_membership_active: !currentStatus },
        ])
      }
      console.log('[v0] Membership status updated')
    } catch (err) {
      console.error('[v0] Error updating membership:', err)
      setError(err instanceof Error ? err.message : 'Failed to update membership')
    } finally {
      setLoading(false)
    }
  }

  // Toggle global membership
  const handleToggleGlobalMembership = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_global_membership',
          data: { is_membership_enabled: !globalMembershipEnabled },
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setGlobalMembershipEnabled(!globalMembershipEnabled)
      if (stats) {
        setStats({ ...stats, membershipEnabled: !globalMembershipEnabled })
      }
      console.log('[v0] Global membership setting updated')
    } catch (err) {
      console.error('[v0] Error updating global membership:', err)
      setError(err instanceof Error ? err.message : 'Failed to update global membership')
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const handleLogout = () => {
    try {
      // Clear admin session storage
      sessionStorage.removeItem('admin_authenticated')
      sessionStorage.removeItem('admin_login_time')
      router.push('/admin')
    } catch (err) {
      console.error('[v0] Logout error:', err)
    }
  }

  const filteredProfiles = profiles.filter(
    (p) =>
      p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings2 className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Matrimony Platform Management</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="size-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 m-4 rounded-lg flex gap-2">
          <AlertCircle className="size-5 shrink-0" />
          <div>
            <p className="font-medium">{error}</p>
            <button onClick={() => setError(null)} className="text-sm underline">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading && !stats ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader className="size-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Registered members</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalProfiles || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Created profiles</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Verified Profiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.verifiedProfiles || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Approved profiles</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Featured Profiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.featuredProfiles || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">In carousel</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Membership</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.membershipEnabled ? 'Enabled' : 'Disabled'}
                    </div>
                    <Badge className="mt-1" variant={stats?.membershipEnabled ? 'default' : 'outline'}>
                      {stats?.membershipEnabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common admin operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button variant="outline" className="w-full">
                      <Plus className="size-4 mr-2" />
                      Add Profile
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Search className="size-4 mr-2" />
                      View Reports
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Users className="size-4 mr-2" />
                      Email Users
                    </Button>
                    <Button variant="outline" className="w-full" onClick={fetchAdminData}>
                      <Loader className="size-4 mr-2" />
                      Refresh Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage platform users ({users.length} total)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.email || 'No email'}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger
                              render={
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                />
                              }
                            >
                              <Edit2 className="size-4" />
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                                <DialogDescription>{user.email || 'No email'}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <Input value={user.email || ''} disabled />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Joined</label>
                                  <Input
                                    value={new Date(user.created_at).toLocaleDateString()}
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  Delete User
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profiles Tab */}
            <TabsContent value="profiles" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Management</CardTitle>
                  <CardDescription>Manage user profiles ({profiles.length} total)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search profiles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="border rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{profile.full_name}</p>
                            {profile.is_verified && (
                              <CheckCircle className="size-4 text-green-500" />
                            )}
                            {profile.is_featured && <Star className="size-4 text-yellow-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {profile.email} • {profile.city} • {profile.profession}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!profile.is_verified && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerifyProfile(profile.id)}
                            >
                              <CheckCircle className="size-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleFeatured(profile.id, profile.is_featured || false)}
                          >
                            {profile.is_featured ? (
                              <StarOff className="size-4" />
                            ) : (
                              <Star className="size-4" />
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProfile(profile.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Global Settings</CardTitle>
                  <CardDescription>Configure platform-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Membership Feature</p>
                      <p className="text-sm text-muted-foreground">
                        {globalMembershipEnabled ? 'Members' : 'All users'} can see membership-only content
                      </p>
                    </div>
                    <Button
                      onClick={handleToggleGlobalMembership}
                      variant={globalMembershipEnabled ? 'default' : 'outline'}
                    >
                      {globalMembershipEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">User Membership Management</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {users.map((user) => {
                        const membership = membershipSettings.find((m) => m.user_id === user.id)
                        const isActive = membership?.is_membership_active || false
                        return (
                          <div
                            key={user.id}
                            className="border rounded-lg p-3 flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-medium">{user.email || 'No email'}</p>
                              <p className="text-xs text-muted-foreground">
                                {isActive ? 'Member' : 'Free'}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleToggleMembership(user.id, isActive)}
                              variant={isActive ? 'default' : 'outline'}
                            >
                              {isActive ? 'Remove' : 'Add'}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
