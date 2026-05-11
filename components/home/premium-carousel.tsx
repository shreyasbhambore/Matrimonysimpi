'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface FeaturedProfile {
  id: string
  name: string
  age: number
  city: string
  profession: string
  image: string | null
  verified: boolean
}

export function PremiumCarousel() {
  const [profiles, setProfiles] = useState<FeaturedProfile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoPlayTimerRef = useRef<NodeJS.Timeout>()

  // Fetch featured profiles from API
  useEffect(() => {
    const fetchFeaturedProfiles = async () => {
      try {
        const response = await fetch('/api/featured-profiles')
        if (response.ok) {
          const data = await response.json()
          setProfiles(data.profiles || [])
        }
      } catch (error) {
        console.error('Error fetching featured profiles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProfiles()
  }, [])

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || profiles.length === 0) return

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % profiles.length)
    }, 3000)

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current)
      }
    }
  }, [isAutoPlay, profiles.length])

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX)
    handleSwipe()
  }

  const handleSwipe = () => {
    if (touchStart - touchEnd > 50) {
      // Swiped left
      setCurrentIndex((prev) => (prev + 1) % profiles.length)
    }
    if (touchEnd - touchStart > 50) {
      // Swiped right
      setCurrentIndex((prev) => (prev - 1 + profiles.length) % profiles.length)
    }
  }

  // Navigation handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + profiles.length) % profiles.length)
    setIsAutoPlay(false)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % profiles.length)
    setIsAutoPlay(false)
  }

  const handleMouseEnter = () => {
    setIsAutoPlay(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlay(true)
  }

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Premium Featured Profiles
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Discover verified premium members from our community
            </p>
          </div>
          <div className="animate-pulse flex items-center justify-center h-96 bg-muted rounded-lg" />
        </div>
      </section>
    )
  }

  if (profiles.length === 0) {
    return null
  }

  // Calculate visible profiles based on screen size
  const getVisibleProfiles = () => {
    // Default mobile (1 card)
    let visibleCount = 1
    
    // Check for tablet (2 cards)
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      visibleCount = 2
    }
    
    // Check for desktop (3-4 cards)
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      visibleCount = 3
    }
    
    if (typeof window !== 'undefined' && window.innerWidth >= 1280) {
      visibleCount = 4
    }

    const visibleProfiles = []
    for (let i = 0; i < visibleCount; i++) {
      visibleProfiles.push(profiles[(currentIndex + i) % profiles.length])
    }
    return visibleProfiles
  }

  const visibleProfiles = getVisibleProfiles()

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Premium Collection
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Featured Premium Profiles
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Handpicked verified members looking for meaningful connections
          </p>
        </div>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative"
        >
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {visibleProfiles.map((profile) => (
              <div
                key={profile.id}
                className="animate-fade-in transition-all duration-500"
              >
                <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-accent/20 hover:border-accent/40 h-full">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                    {profile.image ? (
                      <Image
                        src={profile.image}
                        alt={profile.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent/50 mx-auto mb-2 flex items-center justify-center">
                            <span className="text-2xl font-serif font-bold text-primary-foreground">
                              {profile.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Verified Badge */}
                    {profile.verified && (
                      <Badge className="absolute top-3 right-3 bg-accent/90 text-accent-foreground border-0 shadow-lg">
                        ✓ Verified
                      </Badge>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-serif font-bold text-lg text-foreground">
                          {profile.name}
                        </h3>
                        <span className="text-sm font-medium text-muted-foreground">
                          {profile.age}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="size-4 shrink-0 text-primary" />
                          <span className="truncate font-medium">{profile.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="size-4 shrink-0 text-accent" />
                          <span className="truncate">{profile.profession}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link href={`/profiles/${profile.id}`} className="block w-full">
                          <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-200 z-10"
              aria-label="Previous profiles"
            >
              <ChevronLeft className="size-6" />
            </button>

            {/* Indicators */}
            <div className="flex gap-2 items-center">
              {profiles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsAutoPlay(false)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-primary/30 hover:bg-primary/50'
                  }`}
                  aria-label={`Go to profile ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-200 z-10"
              aria-label="Next profiles"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>

          {/* Auto-play Status */}
          <div className="text-center mt-4 text-xs text-muted-foreground">
            {isAutoPlay ? 'Auto-playing' : 'Paused'} • {currentIndex + 1} of {profiles.length}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/profiles">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
              Browse All Profiles
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </section>
  )
}
