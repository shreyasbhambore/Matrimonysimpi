import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, GraduationCap, User } from "lucide-react"

interface ProfileCardProps {
  profile: {
    id: string
    name: string
    age: number
    city: string
    profession: string
    education: string
    image: string | null
  }
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-muted">
        {profile.image ? (
          <img
            src={profile.image}
            alt={profile.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <User className="size-20 text-muted-foreground/50" />
          </div>
        )}
        <Badge className="absolute top-3 right-3 bg-primary/90">Verified</Badge>
      </div>

      <CardContent className="p-4">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="font-serif font-semibold text-lg">{profile.name}</h3>
          <span className="text-sm text-muted-foreground">{profile.age} yrs</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{profile.city}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="size-4 shrink-0" />
            <span className="truncate">{profile.profession}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="size-4 shrink-0" />
            <span className="truncate">{profile.education}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/profiles/${profile.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
