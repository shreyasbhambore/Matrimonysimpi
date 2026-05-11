'use client'

import { useEffect, useState } from 'react'
import { Heart, MapPin, Briefcase, Search, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface Profile {
  id: string
  first_name: string
  age: number
  location: string
  occupation: string
  religion: string
  education: string
  profile_photo_url?: string
  profile_photos?: Array<{ url: string; is_primary: boolean }>
}

export function MatchesDiscovery() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [filters, setFilters] = useState({
    age_min: 18,
    age_max: 65,
    location: '',
    religion: '',
    education: '',
  })

  useEffect(() => {
    searchProfiles()
  }, [])

  const searchProfiles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/search/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      })

      if (!response.ok) throw new Error('Failed to search profiles')
      const data = await response.json()
      setProfiles(data.profiles || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search profiles')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchProfiles()
  }

  const sendInterest = async (profileId: string) => {
    try {
      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_id: profileId,
          action: 'send',
          message: 'I am interested in connecting with you!',
        }),
      })

      if (!response.ok) throw new Error('Failed to send interest')
      alert('Interest sent successfully!')
      // Optionally refresh profiles
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to send interest')
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Discover Matches</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-6 mb-8 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="65"
                  value={filters.age_min}
                  onChange={(e) =>
                    setFilters({ ...filters, age_min: parseInt(e.target.value) })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="65"
                  value={filters.age_max}
                  onChange={(e) =>
                    setFilters({ ...filters, age_max: parseInt(e.target.value) })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City or region"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Religion
                </label>
                <select
                  value={filters.religion}
                  onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Any</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Buddhist">Buddhist</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education
                </label>
                <select
                  value={filters.education}
                  onChange={(e) => setFilters({ ...filters, education: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Any</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : <Search size={20} />}
              {loading ? 'Searching...' : 'Search Matches'}
            </Button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader className="animate-spin text-gray-400" size={40} />
            </div>
          ) : profiles.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p>No profiles found. Try adjusting your filters.</p>
            </div>
          ) : (
            profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition"
              >
                {/* Profile Photo */}
                <div className="relative h-64 bg-gray-200">
                  {profile.profile_photos?.[0]?.url ? (
                    <Image
                      src={profile.profile_photos[0].url}
                      alt={profile.first_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No photo
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    {profile.first_name}, {profile.age}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600 my-3">
                    {profile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        {profile.location}
                      </div>
                    )}
                    {profile.occupation && (
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-gray-400" />
                        {profile.occupation}
                      </div>
                    )}
                    {profile.education && (
                      <div className="text-sm">{profile.education}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => sendInterest(profile.id)}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                    >
                      <Heart size={18} className="mr-2" />
                      Interested
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
