"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Loader2,
  Star,
  Heart,
  X,
  CheckCircle2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface ShortlistedProfile {
  id: string
  full_name: string
  age: number | null
  gender: string | null
  city: string | null
  state: string | null
  profession: string | null
  verified_admin: boolean
  profile_photo: string | null
  created_at: string
}

export function ShortlistedProfiles() {
  const [profiles, setProfiles] = useState<ShortlistedProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadShortlistedProfiles()
  }, [])

  async function loadShortlistedProfiles() {
    try {
      setLoading(true)
      setError(null)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Get shortlisted profile IDs
      const { data: shortlistData, error: shortlistError } = await supabase
        .from("shortlists")
        .select("shortlisted_user_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (shortlistError) throw shortlistError

      if (!shortlistData || shortlistData.length === 0) {
        setProfiles([])
        return
      }

      // Get profile details for each shortlisted user
      const shortlistedIds = shortlistData.map((s) => s.shortlisted_user_id)
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, age, gender, city, state, profession, verified_admin")
        .in("id", shortlistedIds)

      if (profilesError) throw profilesError

      // Get primary photos for each profile
      const { data: photosData, error: photosError } = await supabase
        .from("profile_photos")
        .select("user_id, photo_url, is_primary")
        .in("user_id", shortlistedIds)

      if (photosError) throw photosError

      // Combine data
      const shortlistedProfiles = profilesData.map((profile) => {
        const photo = photosData.find(
          (p) => p.user_id === profile.id && p.is_primary
        )
        const shortlistItem = shortlistData.find(
          (s) => s.shortlisted_user_id === profile.id
        )
        return {
          ...profile,
          profile_photo: photo?.photo_url || null,
          created_at: shortlistItem?.created_at || "",
        }
      })

      setProfiles(shortlistedProfiles)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load shortlisted profiles")
    } finally {
      setLoading(false)
    }
  }

  async function removeFromShortlist(profileId: string) {
    try {
      setRemovingId(profileId)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("shortlists")
        .delete()
        .eq("user_id", user.id)
        .eq("shortlisted_user_id", profileId)

      if (error) throw error

      setProfiles(profiles.filter((p) => p.id !== profileId))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove from shortlist")
    } finally {
      setRemovingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-40 bg-muted rounded animate-pulse" />
          <div className="h-4 w-60 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold">Shortlisted Profiles</h1>
        <p className="text-muted-foreground mt-1">
          Your saved profiles for later consideration
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          <AlertCircle className="size-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 text-green-700 rounded-lg border border-green-500/20">
          <CheckCircle2 className="size-5 flex-shrink-0" />
          <span className="text-sm">Profile removed from shortlist!</span>
        </div>
      )}

      {/* Count Badge */}
      {profiles.length > 0 && (
        <div>
          <Badge variant="secondary">
            <Star className="size-3 mr-1 fill-current" />
            {profiles.length} Shortlisted
          </Badge>
        </div>
      )}

      {/* Profiles Grid */}
      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                {/* Photo */}
                <div className="relative w-full md:w-40 h-40">
                  {profile.profile_photo ? (
                    <Image
                      src={profile.profile_photo}
                      alt={profile.full_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No photo</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <CardContent className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {profile.full_name}
                          </h3>
                          {profile.verified_admin && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle2 className="size-3 mr-1 fill-current" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {profile.age} years
                          {profile.city && ` • ${profile.city}`}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1 text-sm mb-4">
                      {profile.profession && (
                        <p className="text-muted-foreground">
                          {profile.profession}
                        </p>
                      )}
                      {profile.state && (
                        <p className="text-muted-foreground">
                          {profile.state}
                          {profile.state && ", India"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/profiles/${profile.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromShortlist(profile.id)}
                      disabled={removingId === profile.id}
                    >
                      {removingId === profile.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <X className="size-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Star className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">No shortlisted profiles</p>
            <p className="text-muted-foreground mb-4">
              Start exploring profiles to shortlist and save them for later
            </p>
            <Link href="/dashboard/matches">
              <Button>
                <Heart className="size-4 mr-2" />
                Browse Profiles
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
