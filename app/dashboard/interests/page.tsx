import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export const metadata = {
  title: "Interests | Matrimony",
  description: "Manage your interests and matches",
}

export default function InterestsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold">Interests</h1>
        <p className="text-muted-foreground mt-1">
          Interests you{"'"}ve sent and received
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button className="px-4 py-2 border-b-2 border-primary font-medium">
          Sent ({0})
        </button>
        <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
          Received ({0})
        </button>
        <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
          Accepted ({0})
        </button>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="p-12 text-center">
          <Heart className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold mb-2">No interests sent yet</p>
          <p className="text-muted-foreground mb-4">
            Browse profiles and send interests to connect with potential matches
          </p>
          <Button>
            <Heart className="size-4 mr-2" />
            Browse Profiles
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
