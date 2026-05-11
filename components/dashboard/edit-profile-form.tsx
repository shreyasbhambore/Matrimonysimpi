"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
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
  children: string | null
  income_range: string | null
  family_type: string | null
  family_values: string | null
  smoking: string | null
  drinking: string | null
  dietary_preference: string | null
  interests: string[] | null
  profile_completion_percent: number
}

export function EditProfileForm() {
  const [profile, setProfile] = useState<Partial<ProfileData> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      setLoading(true)
      setError(null)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) throw error
      setProfile(data || { id: user.id })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile")
      setProfile({ id: "" })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(formData: Partial<ProfileData>) {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Calculate profile completion percentage
      const fields = [
        formData.full_name,
        formData.age,
        formData.gender,
        formData.city,
        formData.profession,
        formData.education,
        formData.about_me,
        formData.religion,
        formData.height,
      ]
      const completedFields = fields.filter(Boolean).length
      const completionPercent = Math.round((completedFields / fields.length) * 100)

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...formData,
          profile_completion_percent: completionPercent,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      setSuccess(true)
      setProfile(formData)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold">Edit Profile</h1>
        <p className="text-muted-foreground mt-1">
          Update your profile information to get better matches
        </p>
      </div>

      {/* Completion Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-2">Profile Completion</h3>
              <p className="text-sm text-muted-foreground">
                {profile?.profile_completion_percent || 0}% Complete
              </p>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${profile?.profile_completion_percent || 0}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <span className="text-sm">Profile updated successfully!</span>
        </div>
      )}

      {/* Form Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic details about you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Full Name"
                value={profile?.full_name || ""}
                onChange={(value) => setProfile({ ...profile, full_name: value })}
                placeholder="Your full name"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Age"
                  type="number"
                  value={profile?.age?.toString() || ""}
                  onChange={(value) => setProfile({ ...profile, age: value ? parseInt(value) : null })}
                  placeholder="25"
                />
                <FormSelect
                  label="Gender"
                  value={profile?.gender || ""}
                  onChange={(value) => setProfile({ ...profile, gender: value })}
                  options={[
                    { label: "Select Gender", value: "" },
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="City"
                  value={profile?.city || ""}
                  onChange={(value) => setProfile({ ...profile, city: value })}
                  placeholder="Your city"
                />
                <FormField
                  label="State"
                  value={profile?.state || ""}
                  onChange={(value) => setProfile({ ...profile, state: value })}
                  placeholder="Your state"
                />
              </div>
              <FormField
                label="Country"
                value={profile?.country || ""}
                onChange={(value) => setProfile({ ...profile, country: value })}
                placeholder="Your country"
              />
              <FormTextarea
                label="About Me"
                value={profile?.about_me || ""}
                onChange={(value) => setProfile({ ...profile, about_me: value })}
                placeholder="Tell us about yourself..."
                rows={4}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Height"
                  value={profile?.height || ""}
                  onChange={(value) => setProfile({ ...profile, height: value })}
                  placeholder={'e.g., 5\'10"'}
                />
                <FormSelect
                  label="Body Type"
                  value={profile?.body_type || ""}
                  onChange={(value) => setProfile({ ...profile, body_type: value })}
                  options={[
                    { label: "Select Body Type", value: "" },
                    { label: "Slim", value: "slim" },
                    { label: "Athletic", value: "athletic" },
                    { label: "Average", value: "average" },
                    { label: "Heavy", value: "heavy" },
                  ]}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => handleSave({ ...profile })}
                disabled={saving}
              >
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                {saving ? "Saving..." : "Save Personal Info"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Education & Career</CardTitle>
              <CardDescription>Your professional background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Education"
                value={profile?.education || ""}
                onChange={(value) => setProfile({ ...profile, education: value })}
                placeholder="e.g., Bachelor of Science"
              />
              <FormField
                label="Profession"
                value={profile?.profession || ""}
                onChange={(value) => setProfile({ ...profile, profession: value })}
                placeholder="Your job title"
              />
              <FormSelect
                label="Income Range"
                value={profile?.income_range || ""}
                onChange={(value) => setProfile({ ...profile, income_range: value })}
                options={[
                  { label: "Select Income Range", value: "" },
                  { label: "Below 25L", value: "below-25l" },
                  { label: "25L - 50L", value: "25l-50l" },
                  { label: "50L - 75L", value: "50l-75l" },
                  { label: "75L - 1Cr", value: "75l-1cr" },
                  { label: "Above 1Cr", value: "above-1cr" },
                ]}
              />
              <Button
                className="w-full"
                onClick={() => handleSave({ ...profile })}
                disabled={saving}
              >
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                {saving ? "Saving..." : "Save Education Info"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lifestyle Tab */}
        <TabsContent value="lifestyle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lifestyle</CardTitle>
              <CardDescription>Your personal preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormSelect
                label="Religion"
                value={profile?.religion || ""}
                onChange={(value) => setProfile({ ...profile, religion: value })}
                options={[
                  { label: "Select Religion", value: "" },
                  { label: "Hindu", value: "hindu" },
                  { label: "Muslim", value: "muslim" },
                  { label: "Christian", value: "christian" },
                  { label: "Sikh", value: "sikh" },
                  { label: "Buddhist", value: "buddhist" },
                  { label: "Jain", value: "jain" },
                  { label: "Other", value: "other" },
                ]}
              />
              <FormField
                label="Caste"
                value={profile?.caste || ""}
                onChange={(value) => setProfile({ ...profile, caste: value })}
                placeholder="Optional"
              />
              <FormField
                label="Mother Tongue"
                value={profile?.mother_tongue || ""}
                onChange={(value) => setProfile({ ...profile, mother_tongue: value })}
                placeholder="Your native language"
              />
              <FormSelect
                label="Smoking"
                value={profile?.smoking || ""}
                onChange={(value) => setProfile({ ...profile, smoking: value })}
                options={[
                  { label: "Select", value: "" },
                  { label: "Never", value: "never" },
                  { label: "Occasionally", value: "occasionally" },
                  { label: "Regularly", value: "regularly" },
                ]}
              />
              <FormSelect
                label="Drinking"
                value={profile?.drinking || ""}
                onChange={(value) => setProfile({ ...profile, drinking: value })}
                options={[
                  { label: "Select", value: "" },
                  { label: "Never", value: "never" },
                  { label: "Occasionally", value: "occasionally" },
                  { label: "Regularly", value: "regularly" },
                ]}
              />
              <FormSelect
                label="Dietary Preference"
                value={profile?.dietary_preference || ""}
                onChange={(value) => setProfile({ ...profile, dietary_preference: value })}
                options={[
                  { label: "Select", value: "" },
                  { label: "Vegetarian", value: "vegetarian" },
                  { label: "Non-Vegetarian", value: "non-vegetarian" },
                  { label: "Vegan", value: "vegan" },
                ]}
              />
              <Button
                className="w-full"
                onClick={() => handleSave({ ...profile })}
                disabled={saving}
              >
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                {saving ? "Saving..." : "Save Lifestyle Info"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Family Tab */}
        <TabsContent value="family" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Family</CardTitle>
              <CardDescription>Your family background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormSelect
                label="Marital Status"
                value={profile?.marital_status || ""}
                onChange={(value) => setProfile({ ...profile, marital_status: value })}
                options={[
                  { label: "Select", value: "" },
                  { label: "Never Married", value: "never-married" },
                  { label: "Divorced", value: "divorced" },
                  { label: "Widowed", value: "widowed" },
                ]}
              />
              <FormSelect
                label="Children"
                value={profile?.children || ""}
                onChange={(value) => setProfile({ ...profile, children: value })}
                options={[
                  { label: "Select", value: "" },
                  { label: "No", value: "no" },
                  { label: "Yes, living with me", value: "yes-with-me" },
                  { label: "Yes, not with me", value: "yes-not-with-me" },
                ]}
              />
              <FormField
                label="Family Type"
                value={profile?.family_type || ""}
                onChange={(value) => setProfile({ ...profile, family_type: value })}
                placeholder="e.g., Nuclear, Joint"
              />
              <FormField
                label="Family Values"
                value={profile?.family_values || ""}
                onChange={(value) => setProfile({ ...profile, family_values: value })}
                placeholder="Your family values"
              />
              <Button
                className="w-full"
                onClick={() => handleSave({ ...profile })}
                disabled={saving}
              >
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                {saving ? "Saving..." : "Save Family Info"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>What I{"'"}m Looking For</CardTitle>
              <CardDescription>Your preferences in a partner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Interests</label>
                <div className="p-3 bg-muted rounded-lg border min-h-24">
                  <div className="flex flex-wrap gap-2">
                    {(profile?.interests || []).map((interest, i) => (
                      <Badge key={i} variant="secondary">
                        {interest}
                        <button
                          className="ml-1 text-xs opacity-70 hover:opacity-100"
                          onClick={() =>
                            setProfile({
                              ...profile,
                              interests: profile?.interests?.filter((_, idx) => idx !== i),
                            })
                          }
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Add interests by typing and pressing Enter
                </p>
              </div>
              <Button
                className="w-full"
                onClick={() => handleSave({ ...profile })}
                disabled={saving}
              >
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Form Field Components
function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full p-2.5 rounded-lg border border-input bg-transparent text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
      />
    </div>
  )
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 px-2.5 py-1 rounded-lg border border-input bg-transparent text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
