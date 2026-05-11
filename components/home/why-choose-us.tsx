import { Card, CardContent } from "@/components/ui/card"
import { Shield, Users, Heart, Lock } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "Every profile is manually verified to ensure authenticity and trust.",
  },
  {
    icon: Lock,
    title: "Secure Platform",
    description: "Your data is protected with industry-standard encryption and privacy controls.",
  },
  {
    icon: Users,
    title: "Community Focused",
    description: "Built specifically for our community with cultural values in mind.",
  },
  {
    icon: Heart,
    title: "Trusted Matches",
    description: "Smart matching based on compatibility, values, and preferences.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Why Choose Namdevsimpi Matrimony</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            We are committed to helping you find your perfect life partner with trust and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center border-0 shadow-none bg-transparent">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 mb-4">
                  <feature.icon className="size-8 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
