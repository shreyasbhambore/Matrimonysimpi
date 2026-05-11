'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Heart, Lightbulb, Calendar, MapPin, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ForumCategory {
  id: number
  name: string
  description: string
  icon: string
  posts_count: number
}

const defaultCategories = [
  { id: 1, name: 'General Discussion', description: 'General topics and announcements', icon: 'MessageCircle', posts_count: 0 },
  { id: 2, name: 'Success Stories', description: 'Share and celebrate success stories', icon: 'Heart', posts_count: 0 },
  { id: 3, name: 'Advice & Tips', description: 'Tips, advice, and guidance', icon: 'Lightbulb', posts_count: 0 },
  { id: 4, name: 'Events & Meetups', description: 'Organize and discuss community events', icon: 'Calendar', posts_count: 0 },
  { id: 5, name: 'Regional Groups', description: 'Connect with people from your region', icon: 'MapPin', posts_count: 0 },
]

const iconMap: { [key: string]: any } = {
  MessageCircle,
  Heart,
  Lightbulb,
  Calendar,
  MapPin,
}

export function ForumBrowser() {
  const [categories, setCategories] = useState<ForumCategory[]>(defaultCategories)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Community Forum</h1>
          <p className="text-lg text-muted-foreground">Join discussions, share experiences, and connect with our community</p>
          <Link href="/community/forum/new-post">
            <Button className="mt-6" size="lg">
              <Plus className="mr-2 size-5" />
              Create New Post
            </Button>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.icon]
            return (
              <Link href={`/community/forum/${category.id}`} key={category.id}>
                <div className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="size-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{category.posts_count} posts</span>
                    <ArrowRight className="size-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
