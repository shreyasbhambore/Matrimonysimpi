import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProfileCard } from "@/components/cards/profile-card"

const featuredProfiles = [
  {
    id: "1",
    name: "Priya S.",
    age: 26,
    city: "Mumbai",
    profession: "Software Engineer",
    education: "B.Tech, IIT Mumbai",
    image: null,
  },
  {
    id: "2",
    name: "Rahul M.",
    age: 28,
    city: "Bangalore",
    profession: "Product Manager",
    education: "MBA, IIM Bangalore",
    image: null,
  },
  {
    id: "3",
    name: "Ananya K.",
    age: 25,
    city: "Delhi",
    profession: "Doctor",
    education: "MBBS, AIIMS Delhi",
    image: null,
  },
  {
    id: "4",
    name: "Vikram R.",
    age: 30,
    city: "Chennai",
    profession: "CA",
    education: "CA, B.Com",
    image: null,
  },
]

export function FeaturedProfiles() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Featured Profiles</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Discover verified profiles from our community. Start your journey to find a meaningful connection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/profiles">
            <Button size="lg" variant="outline">
              View All Profiles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
