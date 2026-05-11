import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, Send, Users, CheckCircle, Edit } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const stats = [
    { label: "Profile Views", value: "24", icon: Eye, change: "+5 this week" },
    { label: "Interests Received", value: "12", icon: Heart, change: "+3 new" },
    { label: "Interests Sent", value: "8", icon: Send, change: "2 accepted" },
    { label: "Matches", value: "5", icon: Users, change: "2 pending" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">
            Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {"Here's"} what{"'s"} happening with your profile
          </p>
        </div>
        <Link href="/dashboard/edit-profile">
          <Button>
            <Edit className="size-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Profile Completion */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">Profile Completion</h3>
                <Badge variant="secondary">40% Complete</Badge>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[40%] bg-primary rounded-full" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Complete your profile to get more visibility and better matches
              </p>
            </div>
            <Link href="/onboarding">
              <Button variant="outline">Complete Profile</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="size-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/dashboard/matches">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Users className="size-5" />
                <span className="text-xs">View Matches</span>
              </Button>
            </Link>
            <Link href="/dashboard/interests">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Heart className="size-5" />
                <span className="text-xs">Interests</span>
              </Button>
            </Link>
            <Link href="/dashboard/edit-profile">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Edit className="size-5" />
                <span className="text-xs">Edit Profile</span>
              </Button>
            </Link>
            <Link href="/dashboard/membership">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <CheckCircle className="size-5" />
                <span className="text-xs">Upgrade</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
