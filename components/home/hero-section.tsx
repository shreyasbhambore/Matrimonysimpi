import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Shield, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 size-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 size-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="size-4" />
              Trusted by 10,000+ families
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight text-balance">
              Find Your Perfect{" "}
              <span className="text-primary">Life Partner</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Namdevsimpi Matrimony - Trusted platform for meaningful community connections. Join thousands of families who found their perfect match with us.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  Create Profile Free
                </Button>
              </Link>
              <Link href="/profiles">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
                  Browse Profiles
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { value: "10K+", label: "Verified Profiles" },
                { value: "5K+", label: "Happy Couples" },
                { value: "98%", label: "Trust Score" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-serif font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              {/* Main Card */}
              <div className="relative w-80 h-96 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-1">
                <div className="absolute inset-1 rounded-[22px] bg-card shadow-xl flex flex-col items-center justify-center gap-4">
                  <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="size-12 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold">Your Story Awaits</h3>
                  <p className="text-sm text-muted-foreground text-center px-6">
                    Begin your journey to find a meaningful connection
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="size-4 text-primary" />
                    <span className="text-sm font-medium">Join our community</span>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 size-16 rounded-2xl bg-accent/80 flex items-center justify-center shadow-lg">
                <Heart className="size-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 size-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <Shield className="size-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
