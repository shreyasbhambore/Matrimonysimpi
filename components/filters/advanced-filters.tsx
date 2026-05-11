'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface FilterOption {
  label: string
  value: string
}

interface AdvancedFiltersProps {
  onApply?: (filters: Record<string, string>) => void
  compact?: boolean
}

const FILTER_OPTIONS = {
  rashi: [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ],
  nakshatra: [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni'
  ],
  gotra: [
    'Kasyapa', 'Vasishtha', 'Bhrigu', 'Atri', 'Kutsa',
    'Gautama', 'Vishvamitra', 'Agastya'
  ],
  horoscope_match: [
    'Very High (90-100)', 'High (70-89)', 'Medium (50-69)', 'Low (Below 50)', 'Any'
  ],
  karnataka_cities: [
    'Bangalore', 'Mysore', 'Mangalore', 'Udupi', 'Hubli', 'Belgaum',
    'Tumkur', 'Davangere', 'Hassan', 'Chikmagalur', 'Chitradurga', 'Raichur',
    'Koppal', 'Bellary', 'Kolar', 'Chikballapur'
  ]
}

export function AdvancedFilters({ onApply, compact = false }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<Record<string, string>>({
    rashi: '',
    nakshatra: '',
    gotra: '',
    horoscope_match: '',
    city: ''
  })

  const [isOpen, setIsOpen] = useState(!compact)

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value
    }))
  }

  const handleApply = () => {
    if (onApply) {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      )
      onApply(activeFilters)
    }
  }

  const handleReset = () => {
    setFilters({
      rashi: '',
      nakshatra: '',
      gotra: '',
      horoscope_match: '',
      city: ''
    })
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== '').length

  if (compact) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-lg border hover:bg-muted transition-colors"
        >
          <span className="font-medium">Advanced Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-primary rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rashi */}
              <Select value={filters.rashi} onValueChange={(value) => handleFilterChange('rashi', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Rashi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Rashi</SelectItem>
                  {FILTER_OPTIONS.rashi.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Nakshatra */}
              <Select value={filters.nakshatra} onValueChange={(value) => handleFilterChange('nakshatra', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Nakshatra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Nakshatra</SelectItem>
                  {FILTER_OPTIONS.nakshatra.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Gotra */}
              <Select value={filters.gotra} onValueChange={(value) => handleFilterChange('gotra', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gotra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Gotra</SelectItem>
                  {FILTER_OPTIONS.gotra.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Horoscope Match */}
              <Select value={filters.horoscope_match} onValueChange={(value) => handleFilterChange('horoscope_match', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Horoscope Compatibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Match</SelectItem>
                  {FILTER_OPTIONS.horoscope_match.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* City */}
              <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
                <SelectTrigger className="md:col-span-2">
                  <SelectValue placeholder="Select Karnataka City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Cities</SelectItem>
                  {FILTER_OPTIONS.karnataka_cities.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleApply} className="flex-1" size="sm">
                Apply Filters
              </Button>
              {activeFilterCount > 0 && (
                <Button onClick={handleReset} variant="outline" size="sm" className="flex-1">
                  Clear All
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Full width filters (for profiles page)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Rashi */}
        <Select value={filters.rashi} onValueChange={(value) => handleFilterChange('rashi', value)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Rashi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Rashi</SelectItem>
            {FILTER_OPTIONS.rashi.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Nakshatra */}
        <Select value={filters.nakshatra} onValueChange={(value) => handleFilterChange('nakshatra', value)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Nakshatra" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Nakshatra</SelectItem>
            {FILTER_OPTIONS.nakshatra.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Gotra */}
        <Select value={filters.gotra} onValueChange={(value) => handleFilterChange('gotra', value)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Gotra" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Gotra</SelectItem>
            {FILTER_OPTIONS.gotra.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Horoscope Match */}
        <Select value={filters.horoscope_match} onValueChange={(value) => handleFilterChange('horoscope_match', value)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Horoscope" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Match</SelectItem>
            {FILTER_OPTIONS.horoscope_match.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Apply Button */}
        <Button onClick={handleApply} size="lg" className="h-12 w-full">
          Apply
        </Button>
      </div>

      {/* City Filter on second row */}
      <div className="max-w-lg">
        <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Karnataka Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Cities</SelectItem>
            {FILTER_OPTIONS.karnataka_cities.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(filters).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                >
                  <span>{value}</span>
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="hover:text-primary/70"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )
          )}
          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
