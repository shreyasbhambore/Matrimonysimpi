'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, XCircle, Users, FileText, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Report {
  id: number
  reporter_id: string
  reported_user_id: string
  report_type: string
  reason: string
  status: string
  created_at: string
}

interface User {
  id: string
  first_name: string
  email: string
  created_at: string
}

export function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resolvingId, setResolvingId] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [reportsRes, usersRes] = await Promise.all([
        fetch('/api/admin/manage?type=reports'),
        fetch('/api/admin/manage?type=users'),
      ])

      if (!reportsRes.ok || !usersRes.ok) {
        throw new Error('Unauthorized or failed to fetch')
      }

      const reportsData = await reportsRes.json()
      const usersData = await usersRes.json()

      setReports(reportsData.reports || [])
      setUsers(usersData.users || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleResolveReport = async (reportId: number, resolution: string) => {
    try {
      setResolvingId(reportId)
      const response = await fetch('/api/admin/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resolve_report',
          reportId,
          resolution,
        }),
      })

      if (!response.ok) throw new Error('Failed to resolve report')
      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve report')
    } finally {
      setResolvingId(null)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading admin dashboard...</div>
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  const pendingReports = reports.filter((r) => r.status === 'pending')

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Reports</p>
              <p className="text-3xl font-bold text-red-600">{pendingReports.length}</p>
            </div>
            <AlertCircle className="text-red-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{users.length}</p>
            </div>
            <Users className="text-blue-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Reports</p>
              <p className="text-3xl font-bold text-orange-600">{reports.length}</p>
            </div>
            <FileText className="text-orange-600" size={40} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reports" className="bg-white rounded-lg border">
        <TabsList className="border-b bg-gray-50 p-0">
          <TabsTrigger
            value="reports"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-6 py-3"
          >
            Reports ({pendingReports.length})
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-6 py-3"
          >
            Users ({users.length})
          </TabsTrigger>
        </TabsList>

        {/* Reports Tab */}
        <TabsContent value="reports" className="p-6">
          <div className="space-y-4">
            {reports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reports found</p>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className={`border rounded-lg p-4 ${
                    report.status === 'pending' ? 'bg-red-50 border-red-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg capitalize">
                          {report.report_type.replace(/_/g, ' ')}
                        </h3>
                        <StatusBadge status={report.status} />
                      </div>
                      <p className="text-gray-700 mb-2">{report.reason}</p>
                      <p className="text-sm text-gray-500">
                        Reported by: {report.reporter_id.slice(0, 8)}...
                      </p>
                      <p className="text-sm text-gray-500">
                        User ID: {report.reported_user_id.slice(0, 8)}...
                      </p>
                    </div>

                    {report.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() =>
                            handleResolveReport(
                              report.id,
                              'Investigated and determined to be valid. User warned.'
                            )
                          }
                          disabled={resolvingId === report.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Resolve
                        </Button>
                        <Button
                          onClick={() =>
                            handleResolveReport(
                              report.id,
                              'Investigated and found to be false report.'
                            )
                          }
                          disabled={resolvingId === report.id}
                          variant="outline"
                        >
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{user.first_name || 'N/A'}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: {
    [key: string]: { bg: string; text: string; icon: React.ReactNode }
  } = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: <AlertCircle size={14} />,
    },
    resolved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: <CheckCircle size={14} />,
    },
    dismissed: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: <XCircle size={14} />,
    },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
