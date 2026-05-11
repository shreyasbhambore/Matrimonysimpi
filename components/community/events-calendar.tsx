'use client'

import { useState } from 'react'
import { Calendar, MapPin, Users, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Event {
  id: number
  title: string
  description: string
  event_date: string
  location: string
  city: string
  capacity: number
  rsvp_count: number
}

const sampleEvents: Event[] = [
  {
    id: 1,
    title: 'Namdevsimpi Community Meetup - Bangalore',
    description: 'Join us for a casual meetup to connect with like-minded members from the community.',
    event_date: '2025-06-15T10:00:00',
    location: 'Bangalore Convention Center, BTM Layout',
    city: 'Bangalore',
    capacity: 100,
    rsvp_count: 42,
  },
  {
    id: 2,
    title: 'Success Stories Sharing Session',
    description: 'Listen to inspiring stories from successfully matched couples.',
    event_date: '2025-06-22T18:00:00',
    location: 'Online - Zoom',
    city: 'Online',
    capacity: 500,
    rsvp_count: 156,
  },
  {
    id: 3,
    title: 'Mysor Regional Meetup',
    description: 'Connect with members from Mysore and surrounding regions.',
    event_date: '2025-07-05T11:00:00',
    location: 'Mysore Plaza, Mysore',
    city: 'Mysore',
    capacity: 60,
    rsvp_count: 28,
  },
]

export function EventsCalendar() {
  const [events, setEvents] = useState<Event[]>(sampleEvents)
  const [rsvpedEvents, setRsvpedEvents] = useState<Set<number>>(new Set())

  const handleRSVP = (eventId: number) => {
    setRsvpedEvents((prev) => {
      const updated = new Set(prev)
      if (updated.has(eventId)) {
        updated.delete(eventId)
      } else {
        updated.add(eventId)
      }
      return updated
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Community Events</h1>
          <p className="text-lg text-muted-foreground">Join events, meetups, and celebrations</p>
          <Link href="/community/events/create">
            <Button className="mt-6" size="lg">
              <Plus className="mr-2 size-5" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-muted-foreground mb-4">{event.description}</p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-primary" />
                      {formatDate(event.event_date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-primary" />
                      {event.rsvp_count} / {event.capacity} RSVPs
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleRSVP(event.id)}
                  variant={rsvpedEvents.has(event.id) ? 'default' : 'outline'}
                  className="whitespace-nowrap"
                >
                  {rsvpedEvents.has(event.id) ? 'Attending' : 'RSVP Now'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
