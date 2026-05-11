"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronDown } from "lucide-react"
import { AdvancedFilters } from "@/components/filters/advanced-filters"

export function QuickSearch() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  const handleApplyFilters = (filters: Record<string, string>) => {
    setActiveFilters(Object.keys(filters).length)
    // In a real app, you would pass these filters to the profiles page or search API
  }

  return (
    <section className="py-12 md:py-16 bg-card border-y">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold">Find Your Match</h2>
          <p className="text-muted-foreground mt-2">Search from thousands of verified profiles</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {/* Quick Search */}
          <div className="bg-background rounded-2xl shadow-lg border p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Gender */}
              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Looking for" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bride">Bride</SelectItem>
                  <SelectItem value="groom">Groom</SelectItem>
                </SelectContent>
              </Select>

              {/* Age */}
              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-25">18 - 25 years</SelectItem>
                  <SelectItem value="26-30">26 - 30 years</SelectItem>
                  <SelectItem value="31-35">31 - 35 years</SelectItem>
                  <SelectItem value="36-40">36 - 40 years</SelectItem>
                  <SelectItem value="40+">40+ years</SelectItem>
                </SelectContent>
              </Select>

              {/* Religion */}
              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Religion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Religions</SelectItem>
                  <SelectItem value="hindu">Hindu</SelectItem>
                  <SelectItem value="muslim">Muslim</SelectItem>
                  <SelectItem value="christian">Christian</SelectItem>
                  <SelectItem value="sikh">Sikh</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              {/* City */}
              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Karnataka City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="mysore">Mysore</SelectItem>
                  <SelectItem value="mangalore">Mangalore</SelectItem>
                  <SelectItem value="hubli">Hubli</SelectItem>
                  <SelectItem value="belgaum">Belgaum</SelectItem>
                  <SelectItem value="tumkur">Tumkur</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              {/* Search Button */}
              <Button size="lg" className="h-12 w-full">
                <Search className="size-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm md:text-base"
            >
              <span>Advanced Filters</span>
              {activeFilters > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                  {activeFilters}
                </span>
              )}
              <ChevronDown
                className={`size-5 transition-transform duration-300 ${
                  showAdvancedFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="bg-background rounded-2xl shadow-lg border p-4 md:p-6">
              <AdvancedFilters onApply={handleApplyFilters} compact={false} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
