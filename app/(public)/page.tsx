import { HeroSection } from "@/components/home/hero-section"
import { QuickSearch } from "@/components/home/quick-search"
import { FeaturedProfiles } from "@/components/home/featured-profiles"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { SuccessStories } from "@/components/home/success-stories"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickSearch />
      <FeaturedProfiles />
      <WhyChooseUs />
      <SuccessStories />
      <CTASection />
    </>
  )
}
