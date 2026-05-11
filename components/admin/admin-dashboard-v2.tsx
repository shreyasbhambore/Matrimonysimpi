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
import { createClient } from '@/lib/supabase/client'

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
  email: string
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

  const supabase = createClient()

  // Fetch admin data on mount
  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('[v0] Fetching admin data...')

      // Fetch users
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers()
      if (usersError) throw usersError
      setUsers(usersData?.users || [])

      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      if (profilesError) throw profilesError
      setProfiles(profilesData || [])

      // Fetch membership settings
      const { data: membershipData, error: membershipError } = await supabase
        .from('user_membership_settings')
        .select('*')
      if (membershipError) throw membershipError
      setMembershipSettings(membershipData || [])

      // Fetch global membership setting
      const { data: globalData, error: globalError } = await supabase
        .from('global_membership_settings')
        .select('is_membership_enabled')
        .eq('setting_key', 'MEMBERSHIP_FEATURE_ENABLED')
        .single()
      if (globalError && globalError.code !== 'PGRST116') throw globalError
      setGlobalMembershipEnabled(globalData?.is_membership_enabled || false)

      // Calculate stats
      const verifiedProfiles = (profilesData || []).filter((p) => p.is_verified).length
      const featuredProfiles = (profilesData || []).filter((p) => p.is_featured).length

      setStats({
        totalUsers: usersData?.users?.length || 0,
        totalProfiles: profilesData?.length || 0,
        verifiedProfiles,
        featuredProfiles,
        membershipEnabled: globalMembershipEnabled,
      })

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
      const { error } = await supabase.auth.admin.deleteUser(userId)
      if (error) throw error

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
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: true, verification_status: 'verified' })
        .eq('id', profileId)

      if (error) throw error

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
      const { error } = await supabase
        .from('profiles')
        .update({ is_featured: !isFeatured })
        .eq('id', profileId)

      if (error) throw error

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
      const { error } = await supabase.from('profiles').delete().eq('id', profileId)

      if (error) throw error

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
      const { error } = await supabase
        .from('user_membership_settings')
        .upsert({ user_id: userId, is_membership_active: !currentStatus }, { onConflict: 'user_id' })

      if (error) throw error

      setMembershipSettings(
        membershipSettings.map((m) =>
          m.user_id === userId ? { ...m, is_membership_active: !currentStatus } : m,
        ),
      )
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
      const { error } = await supabase
        .from('global_membership_settings')
        .upsert(
          {
            setting_key: 'MEMBERSHIP_FEATURE_ENABLED',
            is_membership_enabled: !globalMembershipEnabled,
          },
          { onConflict: 'setting_key' },
        )

      if (error) throw error

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
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
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
                          <p className="font-medium">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Edit2 className="size-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                                <DialogDescription>{user.email}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <Input value={user.email} disabled />
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
                              <p className="text-sm font-medium">{user.email}</p>
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
