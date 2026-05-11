'use client'

import { useEffect, useState, useRef } from 'react'
import { Send, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@supabase/supabase-js'

interface Message {
  id: number
  sender_id: string
  content: string
  created_at: string
  is_read: boolean
}

interface Conversation {
  id: number
  user_1_id: string
  user_2_id: string
  last_message_at: string
}

export function ChatMessaging({ currentUserId, otherUserId }: { currentUserId: string; otherUserId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabaseRef = useRef<any>(null)

  // Initialize Supabase client
  useEffect(() => {
    supabaseRef.current = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
  }, [])

  // Load messages on mount
  useEffect(() => {
    loadMessages()
  }, [otherUserId])

  // Subscribe to new messages in real-time
  useEffect(() => {
    if (!conversationId || !supabaseRef.current) return

    const subscription = supabaseRef.current
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: any) => {
        setMessages((prev) => [...prev, payload.new])
        scrollToBottom()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [conversationId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/chat/messages?conversationId=${conversationId || 'new'}`)
      if (!response.ok) throw new Error('Failed to load messages')
      const data = await response.json()
      setMessages(data.messages || [])
      if (data.conversationId) setConversationId(data.conversationId)
      setTimeout(scrollToBottom, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    try {
      setSending(true)
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otherUserId,
          content: inputValue,
          conversationId,
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')
      const data = await response.json()
      
      if (data.message) {
        setMessages((prev) => [...prev, data.message])
        setInputValue('')
        if (data.conversationId) setConversationId(data.conversationId)
        scrollToBottom()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg border">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="font-semibold text-lg">Message</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin text-gray-400" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender_id === currentUserId
                    ? 'bg-pink-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.sender_id === currentUserId ? 'text-pink-100' : 'text-gray-500'}`}>
                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} className="border-t p-4 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-50"
        />
        <Button
          type="submit"
          disabled={sending || !inputValue.trim()}
          className="bg-pink-500 hover:bg-pink-600 text-white"
        >
          {sending ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
        </Button>
      </form>
    </div>
  )
}
