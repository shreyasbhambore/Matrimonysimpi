'use client'

import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Image,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Plus,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface DashboardStats {
  totalUsers: number
  totalProfiles: number
  verifiedProfiles: number
  pendingReports: number
  membershipEnabled: boolean
}

interface Profile {
  id: string
  name: string
  age: number
  city: string
  profession: string
  verified: boolean
  is_featured: boolean
}

interface User {
  id: string
  email: string
  name: string
  created_at: string
  verified: boolean
}

interface Report {
  id: string
  type: string
  status: string
  reason: string
  created_at: string
}

interface MembershipSettings {
  user_id: string
  is_membership_active: boolean
  membership_type: string
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [membershipSettings, setMembershipSettings] = useState<MembershipSettings[]>([])
  const [globalMembershipEnabled, setGlobalMembershipEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all admin data
  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      // In a real app, these would be API calls
      // For now, using mock data
      setStats({
        totalUsers: 1245,
        totalProfiles: 892,
        verifiedProfiles: 745,
        pendingReports: 12,
        membershipEnabled: globalMembershipEnabled,
      })

      setUsers([
        {
          id: '1',
          email: 'user1@example.com',
          name: 'Priya S.',
          created_at: '2024-01-15',
          verified: true,
        },
        {
          id: '2',
          email: 'user2@example.com',
          name: 'Rahul M.',
          created_at: '2024-01-16',
          verified: false,
        },
      ])

      setProfiles([
        {
          id: '1',
          name: 'Priya S.',
          age: 26,
          city: 'Bangalore',
          profession: 'Software Engineer',
          verified: true,
          is_featured: true,
        },
        {
          id: '2',
          name: 'Rahul M.',
          age: 28,
          city: 'Bangalore',
          profession: 'Product Manager',
          verified: true,
          is_featured: false,
        },
      ])

      setReports([
        {
          id: '1',
          type: 'Inappropriate content',
          status: 'pending',
          reason: 'User posted offensive content',
          created_at: '2024-01-20',
        },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleMembership = async (userId: string, enabled: boolean) => {
    try {
      // API call would go here
      setMembershipSettings((prev) => [
        ...prev.filter((m) => m.user_id !== userId),
        { user_id: userId, is_membership_active: enabled, membership_type: 'premium' },
      ])
    } catch (err) {
      console.error('Failed to update membership:', err)
    }
  }

  const handleToggleGlobalMembership = async () => {
    try {
      // API call would go here
      setGlobalMembershipEnabled(!globalMembershipEnabled)
      setStats((prev) =>
        prev ? { ...prev, membershipEnabled: !globalMembershipEnabled } : null
      )
    } catch (err) {
      console.error('Failed to toggle global membership:', err)
    }
  }

  const handleToggleFeatured = async (profileId: string, featured: boolean) => {
    try {
      // API call would go here
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId ? { ...p, is_featured: featured } : p
        )
      )
    } catch (err) {
      console.error('Failed to toggle featured:', err)
    }
  }

  const handleVerifyProfile = async (profileId: string) => {
    try {
      // API call would go here
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId ? { ...p, verified: true } : p
        )
      )
    } catch (err) {
      console.error('Failed to verify profile:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage users, profiles, and settings</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="size-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="profiles" className="gap-2">
              <Image className="size-4" />
              <span className="hidden sm:inline">Profiles</span>
            </TabsTrigger>
            <TabsTrigger value="membership" className="gap-2">
              <Settings className="size-4" />
              <span className="hidden sm:inline">Membership</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <AlertCircle className="size-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                  <p className="text-xs text-muted-foreground mt-1">+5 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Verified Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.verifiedProfiles}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats && Math.round((stats.verifiedProfiles / stats.totalProfiles) * 100)}% verified
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalProfiles}</div>
                  <p className="text-xs text-muted-foreground mt-1">+12 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats?.pendingReports}</div>
                  <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {globalMembershipEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Global toggle</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="gap-2">
                    <Plus className="size-4" />
                    Add User
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Edit className="size-4" />
                    Edit Settings
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Eye className="size-4" />
                    View Reports
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Users className="size-4" />
                    Manage Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all platform users</CardDescription>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Plus className="size-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.verified && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="size-3" />
                            Verified
                          </Badge>
                        )}
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
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
          <TabsContent value="profiles">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Management</CardTitle>
                    <CardDescription>Manage featured profiles for carousel</CardDescription>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Plus className="size-4" />
                    Add Featured
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {profile.age} • {profile.city} • {profile.profession}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {profile.verified && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="size-3" />
                            Verified
                          </Badge>
                        )}
                        {profile.is_featured && (
                          <Badge variant="secondary" className="gap-1">
                            <Eye className="size-3" />
                            Featured
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeatured(profile.id, !profile.is_featured)}
                        >
                          {profile.is_featured ? 'Unfeature' : 'Feature'}
                        </Button>
                        {!profile.verified && (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyProfile(profile.id)}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Membership Tab */}
          <TabsContent value="membership" className="space-y-6">
            {/* Global Toggle */}
            <Card>
              <CardHeader>
                <CardTitle>Global Membership Settings</CardTitle>
                <CardDescription>Control membership feature visibility for all users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div>
                    <h3 className="font-medium">Membership Feature</h3>
                    <p className="text-sm text-muted-foreground">
                      {globalMembershipEnabled ? 'Currently enabled' : 'Currently disabled'}
                    </p>
                  </div>
                  <Button
                    variant={globalMembershipEnabled ? 'default' : 'outline'}
                    onClick={handleToggleGlobalMembership}
                  >
                    {globalMembershipEnabled ? 'Disable' : 'Enable'} Feature
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Per-User Membership */}
            <Card>
              <CardHeader>
                <CardTitle>Per-User Membership Control</CardTitle>
                <CardDescription>Toggle premium membership for individual users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => {
                    const userMembership = membershipSettings.find((m) => m.user_id === user.id)
                    const isActive = userMembership?.is_membership_active || false

                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={isActive ? 'default' : 'outline'}
                            className="gap-1"
                          >
                            {isActive ? 'Premium' : 'Free'}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleMembership(user.id, !isActive)}
                          >
                            {isActive ? 'Revoke' : 'Grant'}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Reports</CardTitle>
                    <CardDescription>Review and manage reported content</CardDescription>
                  </div>
                  <Badge variant="default" className="gap-1">
                    <AlertCircle className="size-3" />
                    {reports.filter((r) => r.status === 'pending').length} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-4 rounded-lg border ${
                        report.status === 'pending'
                          ? 'bg-destructive/5 border-destructive/20'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{report.type}</h3>
                          <p className="text-sm text-muted-foreground">{report.reason}</p>
                        </div>
                        <Badge
                          variant={report.status === 'pending' ? 'default' : 'secondary'}
                          className="gap-1"
                        >
                          {report.status === 'pending' && <AlertCircle className="size-3" />}
                          {report.status === 'resolved' && <CheckCircle className="size-3" />}
                          {report.status === 'dismissed' && <XCircle className="size-3" />}
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Reported {new Date(report.created_at).toLocaleDateString()}
                      </p>
                      {report.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm">Investigate</Button>
                          <Button size="sm" variant="outline">
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
