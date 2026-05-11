'use client'

import { useState, useEffect } from 'react'
import { ChatMessaging } from '@/components/chat/chat-messaging'
import { ConversationsList } from '@/components/chat/conversations-list'

export default function ChatPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        setCurrentUserId(data.user?.id || null)
      } catch (error) {
        console.error('[v0] Failed to fetch user:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!currentUserId) {
    return <div className="p-8 text-center text-red-600">Please log in to access chat</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r">
        <ConversationsList
          currentUserId={currentUserId}
          onSelectConversation={(userId, conversationId) => {
            setSelectedUser(userId)
            setSelectedConversationId(conversationId)
          }}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex items-center justify-center">
        {selectedUser ? (
          <ChatMessaging
            key={selectedUser}
            currentUserId={currentUserId}
            otherUserId={selectedUser}
          />
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
