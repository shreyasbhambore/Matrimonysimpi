import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Users, Award } from "lucide-react"

export const metadata = {
  title: "About Us",
  description: "Learn about our trusted matrimony platform and our mission to help families find meaningful connections.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About Us</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We are a trusted community matrimony platform dedicated to helping families find meaningful connections. Our mission is to make the journey of finding a life partner simple, safe, and successful.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { icon: Heart, title: "Love & Care", description: "We treat every profile with respect and care" },
          { icon: Shield, title: "Trust & Safety", description: "100% verified profiles for your security" },
          { icon: Users, title: "Community", description: "Built specifically for our community values" },
          { icon: Award, title: "Quality", description: "Premium experience for premium matches" },
        ].map((value) => (
          <Card key={value.title} className="text-center">
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center size-14 rounded-xl bg-primary/10 mb-4">
                <value.icon className="size-7 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-serif font-bold mb-6">Our Story</h2>
        <div className="prose prose-lg mx-auto text-muted-foreground">
          <p className="mb-4">
            Founded in 2024, our platform was created with a simple goal: to modernize the traditional matchmaking experience while preserving the values that make it special.
          </p>
          <p className="mb-4">
            We understand that finding a life partner is one of the most important decisions in life. That{"'"}s why we{"'"}ve built a platform that combines technology with tradition, making it easier for families to connect while maintaining the trust and security they deserve.
          </p>
          <p>
            Today, we{"'"}re proud to have helped thousands of families find their perfect match. Our commitment to verified profiles, privacy, and quality service has made us a trusted name in the community.
          </p>
        </div>
      </div>
    </div>
  )
}
