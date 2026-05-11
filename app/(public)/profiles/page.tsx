import { ProfileCard } from "@/components/cards/profile-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"

const profiles = [
  { id: "1", name: "Priya S.", age: 26, city: "Mumbai", profession: "Software Engineer", education: "B.Tech, IIT Mumbai", image: null },
  { id: "2", name: "Rahul M.", age: 28, city: "Bangalore", profession: "Product Manager", education: "MBA, IIM Bangalore", image: null },
  { id: "3", name: "Ananya K.", age: 25, city: "Delhi", profession: "Doctor", education: "MBBS, AIIMS Delhi", image: null },
  { id: "4", name: "Vikram R.", age: 30, city: "Chennai", profession: "CA", education: "CA, B.Com", image: null },
  { id: "5", name: "Meera J.", age: 27, city: "Pune", profession: "Teacher", education: "M.Ed", image: null },
  { id: "6", name: "Arjun P.", age: 29, city: "Hyderabad", profession: "Engineer", education: "B.Tech", image: null },
  { id: "7", name: "Sneha R.", age: 24, city: "Kolkata", profession: "Designer", education: "B.Des", image: null },
  { id: "8", name: "Karthik N.", age: 31, city: "Bangalore", profession: "Entrepreneur", education: "MBA", image: null },
]

export const metadata = {
  title: "Browse Profiles",
  description: "Find your perfect match from thousands of verified profiles",
}

export default function ProfilesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold">Browse Profiles</h1>
        <p className="text-muted-foreground mt-2">Find your perfect match from verified profiles</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input placeholder="Search by name or ID" className="pl-10 h-11" />
          </div>
          <Select>
            <SelectTrigger className="w-full md:w-40 h-11">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-40 h-11">
              <SelectValue placeholder="Age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="18-25">18-25</SelectItem>
              <SelectItem value="26-30">26-30</SelectItem>
              <SelectItem value="31-35">31-35</SelectItem>
              <SelectItem value="36+">36+</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-11">
            <SlidersHorizontal className="size-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing {profiles.length} profiles</p>
        <Select defaultValue="recent">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="relevant">Most Relevant</SelectItem>
            <SelectItem value="age-asc">Age: Low to High</SelectItem>
            <SelectItem value="age-desc">Age: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">
          Load More Profiles
        </Button>
      </div>
    </div>
  )
}
