import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Zap } from "lucide-react"

export const metadata = {
  title: "Membership Plans",
  description: "Choose the perfect membership plan to find your life partner",
}

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Get started with basic features",
    features: [
      "Create your profile",
      "Browse profiles",
      "Send up to 5 interests/month",
      "Basic search filters",
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "999",
    description: "Most popular choice for serious seekers",
    features: [
      "Everything in Free",
      "Unlimited interests",
      "View contact details",
      "Advanced search filters",
      "Priority customer support",
      "Profile highlighting",
    ],
    popular: true,
  },
  {
    name: "Elite",
    price: "2999",
    description: "For dedicated matchmaking experience",
    features: [
      "Everything in Premium",
      "Personal relationship manager",
      "Handpicked matches",
      "Profile verification badge",
      "Featured profile placement",
      "Direct messaging",
    ],
    popular: false,
  },
]

export default function MembershipPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge className="mb-4" variant="secondary">Membership Plans</Badge>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
          Find Your Perfect Plan
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose a plan that suits your needs and start your journey to finding your life partner
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 mx-auto mb-3">
                {plan.name === "Free" && <Zap className="size-6 text-primary" />}
                {plan.name === "Premium" && <Star className="size-6 text-primary" />}
                {plan.name === "Elite" && <Crown className="size-6 text-primary" />}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-4xl font-bold">₹{plan.price}</span>
                {plan.price !== "0" && <span className="text-muted-foreground">/month</span>}
              </div>
              <ul className="space-y-3 text-left">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="size-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                {plan.price === "0" ? "Get Started" : "Subscribe Now"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ Note */}
      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          Have questions? Check our <a href="/faq" className="text-primary hover:underline">FAQ</a> or <a href="/contact" className="text-primary hover:underline">contact us</a>
        </p>
      </div>
    </div>
  )
}
