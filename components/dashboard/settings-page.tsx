"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Loader2, Eye, Mail, Shield, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface UserSettings {
  id: string
  profile_visibility: "public" | "premium-only" | "hidden"
  who_sees_photos: "everyone" | "verified" | "premium" | "none"
  who_sees_contact: "everyone" | "verified" | "premium" | "none"
  allow_profile_views: boolean
  email_notifications: boolean
  new_interest_notifications: boolean
  profile_view_notifications: boolean
  shortlist_notifications: boolean
  match_suggestions_notifications: boolean
  two_factor_enabled: boolean
}

export function SettingsPage() {
  const [settings, setSettings] = useState<Partial<UserSettings> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      setLoading(true)
      setError(null)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error && error.code !== "PGRST116") throw error

      // If no settings exist, create defaults
      if (!data) {
        const defaultSettings: Partial<UserSettings> = {
          id: user.id,
          profile_visibility: "public",
          who_sees_photos: "premium",
          who_sees_contact: "premium",
          allow_profile_views: true,
          email_notifications: true,
          new_interest_notifications: true,
          profile_view_notifications: true,
          shortlist_notifications: true,
          match_suggestions_notifications: true,
          two_factor_enabled: false,
        }
        setSettings(defaultSettings)
      } else {
        setSettings(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("user_settings")
        .upsert({
          id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings")
    } finally {
      setSaving(false)
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
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your privacy, notifications, and account preferences
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
          <span className="text-sm">Settings saved successfully!</span>
        </div>
      )}

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="size-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>Control who can see your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingSelect
            label="Profile Visibility"
            value={settings?.profile_visibility || "public"}
            onChange={(value) =>
              setSettings({
                ...settings,
                profile_visibility: value as "public" | "premium-only" | "hidden",
              })
            }
            options={[
              { label: "Public - Everyone can see", value: "public" },
              { label: "Premium Only - Premium users can see", value: "premium-only" },
              { label: "Hidden - Nobody can see", value: "hidden" },
            ]}
          />

          <SettingSelect
            label="Who Sees Your Photos"
            value={settings?.who_sees_photos || "premium"}
            onChange={(value) =>
              setSettings({
                ...settings,
                who_sees_photos: value as "everyone" | "verified" | "premium" | "none",
              })
            }
            options={[
              { label: "Everyone", value: "everyone" },
              { label: "Verified Users", value: "verified" },
              { label: "Premium Members", value: "premium" },
              { label: "Nobody", value: "none" },
            ]}
          />

          <SettingSelect
            label="Who Sees Your Contact Info"
            value={settings?.who_sees_contact || "premium"}
            onChange={(value) =>
              setSettings({
                ...settings,
                who_sees_contact: value as "everyone" | "verified" | "premium" | "none",
              })
            }
            options={[
              { label: "Everyone", value: "everyone" },
              { label: "Verified Users", value: "verified" },
              { label: "Premium Members", value: "premium" },
              { label: "Nobody", value: "none" },
            ]}
          />

          <SettingToggle
            label="Allow Profile Views"
            description="Let others see when your profile is visited"
            value={settings?.allow_profile_views ?? true}
            onChange={(value) =>
              setSettings({ ...settings, allow_profile_views: value })
            }
          />
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="size-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Control how we notify you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingToggle
            label="Email Notifications"
            description="Receive emails about important updates"
            value={settings?.email_notifications ?? true}
            onChange={(value) =>
              setSettings({ ...settings, email_notifications: value })
            }
          />

          <SettingToggle
            label="New Interest Notifications"
            description="Get notified when someone shows interest"
            value={settings?.new_interest_notifications ?? true}
            onChange={(value) =>
              setSettings({
                ...settings,
                new_interest_notifications: value,
              })
            }
          />

          <SettingToggle
            label="Profile View Notifications"
            description="Get notified when someone views your profile"
            value={settings?.profile_view_notifications ?? true}
            onChange={(value) =>
              setSettings({
                ...settings,
                profile_view_notifications: value,
              })
            }
          />

          <SettingToggle
            label="Shortlist Notifications"
            description="Get notified when someone saves your profile"
            value={settings?.shortlist_notifications ?? true}
            onChange={(value) =>
              setSettings({
                ...settings,
                shortlist_notifications: value,
              })
            }
          />

          <SettingToggle
            label="Match Suggestions"
            description="Get personalized match recommendations"
            value={settings?.match_suggestions_notifications ?? true}
            onChange={(value) =>
              setSettings({
                ...settings,
                match_suggestions_notifications: value,
              })
            }
          />
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Security
          </CardTitle>
          <CardDescription>Protect your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingToggle
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            value={settings?.two_factor_enabled ?? false}
            onChange={(value) =>
              setSettings({ ...settings, two_factor_enabled: value })
            }
          />
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="size-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
          <p className="text-xs text-muted-foreground">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        size="lg"
        className="w-full"
        onClick={handleSave}
        disabled={saving}
      >
        {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}

function SettingSelect({
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
      <label className="text-sm font-medium mb-2 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent transition-colors"
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

function SettingToggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}
