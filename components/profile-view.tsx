"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Star,
  Share2,
  Flag,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

interface ProfileData {
  id: string
  full_name: string
  age: number | null
  gender: string | null
  city: string | null
  state: string | null
  country: string | null
  profession: string | null
  education: string | null
  about_me: string | null
  religion: string | null
  caste: string | null
  mother_tongue: string | null
  height: string | null
  body_type: string | null
  marital_status: string | null
  family_type: string | null
  verified_phone: boolean
  verified_photo: boolean
  verified_admin: boolean
  online_status: boolean
}

interface Photo {
  id: string
  photo_url: string
  is_primary: boolean
}

export function ProfileView({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [userId])

  async function loadProfile() {
    try {
      setLoading(true)
      setError(null)

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (profileError) throw profileError

      const { data: photoData, error: photoError } = await supabase
        .from("profile_photos")
        .select("id, photo_url, is_primary")
        .eq("user_id", userId)
        .in("privacy_level", ["public", "friends-only"])
        .order("is_primary", { ascending: false })

      if (photoError) throw photoError

      setProfile(profileData)
      setPhotos(photoData || [])

      // Check if shortlisted
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: shortlistData } = await supabase
          .from("shortlists")
          .select("id")
          .eq("user_id", user.id)
          .eq("shortlisted_user_id", userId)
          .single()

        setIsShortlisted(!!shortlistData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  async function toggleShortlist() {
    try {
      setActionLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      if (isShortlisted) {
        const { error } = await supabase
          .from("shortlists")
          .delete()
          .eq("user_id", user.id)
          .eq("shortlisted_user_id", userId)

        if (error) throw error
        setIsShortlisted(false)
      } else {
        const { error } = await supabase
          .from("shortlists")
          .insert({
            user_id: user.id,
            shortlisted_user_id: userId,
          })

        if (error) throw error
        setIsShortlisted(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update shortlist")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="size-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-semibold">Profile not found</p>
          <p className="text-muted-foreground">{error || "Unable to load profile"}</p>
        </div>
      </div>
    )
  }

  const primaryPhoto = photos.find((p) => p.is_primary) || photos[0]

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Profile Header with Photo */}
      <div className="relative">
        {primaryPhoto ? (
          <div className="relative w-full h-96 bg-muted">
            <Image
              src={primaryPhoto.photo_url}
              alt={profile.full_name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-96 bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">No photos available</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full w-12 h-12 p-0"
            onClick={toggleShortlist}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Star
                className={`size-5 ${isShortlisted ? "fill-current" : ""}`}
              />
            )}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full w-12 h-12 p-0"
          >
            <Share2 className="size-5" />
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="container mx-auto px-4 -mt-12 relative z-10">
        {/* Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-serif font-bold">
                    {profile.full_name}
                  </h1>
                  {profile.verified_admin && (
                    <Badge variant="secondary">
                      <CheckCircle2 className="size-3 mr-1 fill-current" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-muted-foreground">
                  {profile.age && `${profile.age} years`}
                  {profile.age && profile.city && " • "}
                  {profile.city}
                  {profile.state && `, ${profile.state}`}
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => {}}
                disabled={actionLoading}
              >
                <Heart className="size-5 mr-2" />
                Send Interest
              </Button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profile.profession && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Profession
                  </p>
                  <p className="font-medium">{profile.profession}</p>
                </div>
              )}
              {profile.education && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Education
                  </p>
                  <p className="font-medium">{profile.education}</p>
                </div>
              )}
              {profile.height && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Height</p>
                  <p className="font-medium">{profile.height}</p>
                </div>
              )}
              {profile.religion && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Religion
                  </p>
                  <p className="font-medium">{profile.religion}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Details Sections */}
        <div className="grid gap-6">
          {/* About */}
          {profile.about_me && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">About</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.about_me}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Career & Education */}
          {(profile.profession || profile.education) && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Career & Education</h3>
                <div className="space-y-3">
                  {profile.education && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Education
                      </p>
                      <p className="font-medium">{profile.education}</p>
                    </div>
                  )}
                  {profile.profession && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Profession
                      </p>
                      <p className="font-medium">{profile.profession}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lifestyle */}
          {(profile.religion || profile.caste || profile.mother_tongue) && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Lifestyle</h3>
                <div className="space-y-3">
                  {profile.religion && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Religion
                      </p>
                      <p className="font-medium">{profile.religion}</p>
                    </div>
                  )}
                  {profile.caste && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Caste</p>
                      <p className="font-medium">{profile.caste}</p>
                    </div>
                  )}
                  {profile.mother_tongue && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Mother Tongue
                      </p>
                      <p className="font-medium">{profile.mother_tongue}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Family */}
          {(profile.family_type || profile.marital_status) && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Family</h3>
                <div className="space-y-3">
                  {profile.marital_status && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Marital Status
                      </p>
                      <p className="font-medium">{profile.marital_status}</p>
                    </div>
                  )}
                  {profile.family_type && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Family Type
                      </p>
                      <p className="font-medium">{profile.family_type}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Photo Gallery */}
          {photos.length > 1 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Photos</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                    >
                      <Image
                        src={photo.photo_url}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-card p-4">
        <div className="container mx-auto flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={toggleShortlist}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <Star
                className={`size-4 mr-2 ${
                  isShortlisted ? "fill-current" : ""
                }`}
              />
            )}
            {isShortlisted ? "Shortlisted" : "Shortlist"}
          </Button>
          <Button className="flex-1">
            <Heart className="size-4 mr-2" />
            Send Interest
          </Button>
          <Button variant="ghost" size="icon">
            <Flag className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
