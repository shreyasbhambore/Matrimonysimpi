"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function QuickSearch() {
  return (
    <section className="py-12 md:py-16 bg-card border-y">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold">Find Your Match</h2>
          <p className="text-muted-foreground mt-2">Search from thousands of verified profiles</p>
        </div>

        <div className="max-w-4xl mx-auto">
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

              {/* Community */}
              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Community" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Communities</SelectItem>
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
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
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
        </div>
      </div>
    </section>
  )
}
