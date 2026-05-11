import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

export const metadata = {
  title: "Matches | Matrimony",
  description: "Browse and explore profiles",
}

export default function MatchesPage() {
  // Placeholder - will be implemented in PROMPT 4 for advanced matching
  const matches = [
    {
      id: 1,
      name: "Sarah",
      age: 26,
      city: "Mumbai",
      profession: "Software Engineer",
    },
    {
      id: 2,
      name: "Priya",
      age: 24,
      city: "Bangalore",
      profession: "Doctor",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold">Matches</h1>
        <p className="text-muted-foreground mt-1">
          Explore profiles matched for you
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="cursor-pointer">
          Age: 20-30
        </Badge>
        <Badge variant="secondary" className="cursor-pointer">
          Location: All
        </Badge>
        <Badge variant="secondary" className="cursor-pointer">
          Religion: All
        </Badge>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.length > 0 ? (
          matches.map((match) => (
            <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <span className="text-muted-foreground">Photo</span>
              </div>
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg">{match.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {match.age} • {match.city}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {match.profession}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    View
                  </Button>
                  <Button className="flex-1">Interest</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">No matches found</p>
            <p className="text-muted-foreground">
              Complete your profile to get better matches
            </p>
          </div>
        )}
      </div>

      {/* Note */}
      <Card className="bg-muted/50 border-none">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Note: Advanced matching algorithm coming soon in PROMPT 4
        </CardContent>
      </Card>
    </div>
  )
}
