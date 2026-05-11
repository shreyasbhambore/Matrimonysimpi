'use client'

import { useEffect, useState } from 'react'
import { Heart, X, Clock, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface Interest {
  id: number
  sender_id: string
  receiver_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  message: string
  created_at: string
}

interface Profile {
  id: string
  first_name: string
  age: number
  location: string
  occupation: string
  profile_photo_url?: string
}

export function InterestsManager() {
  const [interests, setInterests] = useState<Interest[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'received' | 'sent'>('received')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInterests()
  }, [tab])

  const fetchInterests = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/interests?type=${tab}`)
      if (!response.ok) throw new Error('Failed to fetch interests')
      const data = await response.json()
      setInterests(data.interests || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = async (interestId: number, action: 'accept' | 'reject') => {
    try {
      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver_id: interestId, action }),
      })
      if (!response.ok) throw new Error('Failed to respond to interest')
      await fetchInterests()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleWithdraw = async (interestId: number) => {
    try {
      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver_id: interestId, action: 'withdraw' }),
      })
      if (!response.ok) throw new Error('Failed to withdraw interest')
      await fetchInterests()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading interests...</div>
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Interest Management</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setTab('received')}
          className={`px-4 py-2 font-medium ${
            tab === 'received'
              ? 'border-b-2 border-pink-500 text-pink-600'
              : 'text-gray-600'
          }`}
        >
          Interests Received ({interests.filter(i => i.status === 'pending').length})
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`px-4 py-2 font-medium ${
            tab === 'sent'
              ? 'border-b-2 border-pink-500 text-pink-600'
              : 'text-gray-600'
          }`}
        >
          Interests Sent
        </button>
      </div>

      {/* Interests List */}
      <div className="space-y-4">
        {interests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Heart className="mx-auto mb-4 text-gray-300" size={48} />
            <p>No interests {tab === 'received' ? 'received' : 'sent'} yet</p>
          </div>
        ) : (
          interests.map((interest) => (
            <div
              key={interest.id}
              className="border rounded-lg p-4 flex items-start justify-between hover:shadow-md transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">Interest {interest.status}</h3>
                  <StatusBadge status={interest.status} />
                </div>
                {interest.message && (
                  <p className="text-gray-600 mb-2 italic">"{interest.message}"</p>
                )}
                <p className="text-sm text-gray-500">
                  {new Date(interest.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                {tab === 'received' && interest.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleResponse(interest.id, 'accept')}
                      className="bg-pink-500 hover:bg-pink-600 text-white"
                    >
                      <Check size={16} className="mr-2" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleResponse(interest.id, 'reject')}
                      variant="outline"
                    >
                      <X size={16} className="mr-2" />
                      Decline
                    </Button>
                  </>
                )}
                {tab === 'sent' && interest.status === 'pending' && (
                  <Button
                    onClick={() => handleWithdraw(interest.id)}
                    variant="outline"
                  >
                    <X size={16} className="mr-2" />
                    Withdraw
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    accepted: { bg: 'bg-green-100', text: 'text-green-800', icon: Check },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: X },
    withdrawn: { bg: 'bg-gray-100', text: 'text-gray-800', icon: X },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${config.bg} ${config.text}`}>
      <Icon size={14} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
