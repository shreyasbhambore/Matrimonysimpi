import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <Heart className="size-12 mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
          Start Your Journey Today
        </h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
          Join thousands of families who have found their perfect match. Create your profile for free and begin your search.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Register Free
            </Button>
          </Link>
          <Link href="/profiles">
            <Button size="lg" variant="outline" className="text-base px-8 bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
              Explore Profiles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
