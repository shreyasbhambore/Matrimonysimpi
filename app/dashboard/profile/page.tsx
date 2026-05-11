"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ProfileView } from "@/components/profile-view"
import { Loader2 } from "lucide-react"

export default function MyProfilePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  if (!userId) {
    return <div>Not authenticated</div>
  }

  return <ProfileView userId={userId} />
}
