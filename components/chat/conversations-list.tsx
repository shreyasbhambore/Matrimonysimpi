'use client'

import { useEffect, useState } from 'react'
import { Loader, MessageCircle } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface Conversation {
  id: number
  user_1_id: string
  user_2_id: string
  last_message_at: string
  last_message_id: number
}

export function ConversationsList({
  currentUserId,
  onSelectConversation,
}: {
  currentUserId: string
  onSelectConversation: (userId: string, conversationId: number) => void
}) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadConversations()
  }, [currentUserId])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chat/messages')
      if (!response.ok) throw new Error('Failed to load conversations')
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="animate-spin text-gray-400" size={32} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border">
      <div className="border-b p-4">
        <h2 className="font-semibold text-lg">Conversations</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4 text-red-600 text-sm bg-red-50 border-b">
            {error}
          </div>
        )}

        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <MessageCircle size={48} className="text-gray-300 mb-4" />
            <p>No conversations yet</p>
            <p className="text-sm text-gray-400 mt-2">Start a conversation by sending an interest</p>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conversation) => {
              const otherUserId =
                conversation.user_1_id === currentUserId
                  ? conversation.user_2_id
                  : conversation.user_1_id

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(otherUserId, conversation.id)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-semibold mb-2">
                        {otherUserId.slice(0, 1).toUpperCase()}
                      </div>
                      <p className="font-medium text-gray-900">User ID: {otherUserId.slice(0, 8)}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(conversation.last_message_at).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
