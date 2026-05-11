"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Loader2, Upload, Trash2, Star, Lock, Globe } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

interface Photo {
  id: string
  photo_url: string
  thumbnail_url: string | null
  position: number
  is_primary: boolean
  privacy_level: "public" | "private" | "friends-only"
  verified: boolean
  blur_level: number
  uploaded_at: string
}

export function ProfilePhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadPhotos()
  }, [])

  async function loadPhotos() {
    try {
      setLoading(true)
      setError(null)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("profile_photos")
        .select("*")
        .eq("user_id", user.id)
        .order("position", { ascending: true })

      if (error) throw error
      setPhotos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load photos")
    } finally {
      setLoading(false)
    }
  }

  async function handlePhotoUpload(file: File) {
    try {
      setUploading(true)
      setError(null)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `${user.id}/${timestamp}-${file.name}`

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(filename, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(filename)

      const photoUrl = data.publicUrl

      // Save photo record
      const { data: photoData, error: dbError } = await supabase
        .from("profile_photos")
        .insert({
          user_id: user.id,
          photo_url: photoUrl,
          thumbnail_url: photoUrl,
          position: photos.length,
          is_primary: photos.length === 0,
          privacy_level: "private",
        })
        .select()
        .single()

      if (dbError) throw dbError

      setPhotos([...photos, photoData])
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo")
    } finally {
      setUploading(false)
    }
  }

  async function deletePhoto(photoId: string) {
    try {
      setError(null)
      const { error } = await supabase
        .from("profile_photos")
        .delete()
        .eq("id", photoId)

      if (error) throw error

      setPhotos(photos.filter((p) => p.id !== photoId))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete photo")
    }
  }

  async function setAsPrimary(photoId: string) {
    try {
      setError(null)
      // Unset previous primary
      if (photos.some((p) => p.is_primary)) {
        const primaryPhoto = photos.find((p) => p.is_primary)
        if (primaryPhoto) {
          await supabase
            .from("profile_photos")
            .update({ is_primary: false })
            .eq("id", primaryPhoto.id)
        }
      }

      // Set new primary
      const { error } = await supabase
        .from("profile_photos")
        .update({ is_primary: true })
        .eq("id", photoId)

      if (error) throw error

      setPhotos(
        photos.map((p) => ({
          ...p,
          is_primary: p.id === photoId,
        }))
      )
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update photo")
    }
  }

  async function updatePrivacy(photoId: string, privacyLevel: "public" | "private" | "friends-only") {
    try {
      setError(null)
      const { error } = await supabase
        .from("profile_photos")
        .update({ privacy_level: privacyLevel })
        .eq("id", photoId)

      if (error) throw error

      setPhotos(
        photos.map((p) =>
          p.id === photoId ? { ...p, privacy_level: privacyLevel } : p
        )
      )
      setSuccess(true)
      setShowPrivacyDialog(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update privacy")
    }
  }

  const getPrivacyIcon = (level: string) => {
    switch (level) {
      case "public":
        return <Globe className="size-4" />
      case "friends-only":
        return <Lock className="size-4" />
      default:
        return <Lock className="size-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-40 bg-muted rounded animate-pulse" />
          <div className="h-4 w-60 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold">Profile Photos</h1>
        <p className="text-muted-foreground mt-1">
          Upload photos to make your profile more attractive
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
          <span className="text-sm">Photo updated successfully!</span>
        </div>
      )}

      {/* Upload Card */}
      <Card>
        <CardContent className="p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handlePhotoUpload(file)
            }}
            className="hidden"
          />

          <div className="text-center">
            <div
              className="w-full p-8 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                e.currentTarget.classList.add("bg-muted/50")
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("bg-muted/50")
              }}
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files[0]
                if (file?.type.startsWith("image/")) {
                  handlePhotoUpload(file)
                }
              }}
            >
              <Upload className="size-8 mx-auto text-muted-foreground mb-2" />
              <p className="font-medium mb-1">Drag photos here or click to upload</p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG or GIF (max. 5MB)
              </p>
            </div>

            {uploading && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Photos Grid */}
      {photos.length > 0 ? (
        <div>
          <h3 className="font-semibold mb-4">
            My Photos ({photos.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={photo.photo_url}
                    alt="Profile photo"
                    fill
                    className="object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                    <div className="flex gap-1">
                      {photo.is_primary && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="size-3 mr-1 fill-current" />
                          Primary
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {getPrivacyIcon(photo.privacy_level)}
                        <span className="ml-1">{photo.privacy_level}</span>
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!photo.is_primary && (
                      <button
                        onClick={() => setAsPrimary(photo.id)}
                        className="p-1.5 bg-white/80 hover:bg-white rounded-lg transition-colors"
                        title="Set as primary"
                      >
                        <Star className="size-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedPhoto(photo)
                        setShowPrivacyDialog(true)
                      }}
                      className="p-1.5 bg-white/80 hover:bg-white rounded-lg transition-colors"
                      title="Privacy"
                    >
                      {getPrivacyIcon(photo.privacy_level)}
                    </button>
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="p-1.5 bg-destructive/80 hover:bg-destructive rounded-lg transition-colors text-white"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No photos uploaded yet</p>
        </div>
      )}

      {/* Privacy Dialog */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Photo Privacy</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {(["public", "friends-only", "private"] as const).map((level) => (
              <button
                key={level}
                onClick={() =>
                  selectedPhoto && updatePrivacy(selectedPhoto.id, level)
                }
                className="w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  {getPrivacyIcon(level)}
                  <div>
                    <p className="font-medium capitalize">{level}</p>
                    <p className="text-xs text-muted-foreground">
                      {level === "public" &&
                        "Everyone can see this photo"}
                      {level === "friends-only" &&
                        "Only connections can see"}
                      {level === "private" &&
                        "Only you can see this photo"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
