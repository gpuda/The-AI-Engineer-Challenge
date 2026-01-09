'use client'

import { useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      return
    }

    setLoading(true)
    setError(null)
    setReply('')

    try {
//      const response = await fetch('http://127.0.0.1:8000/api/chat', {
//        method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//        body: JSON.stringify({ message }),
//      })

    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
    const url = base ? `${base}/api/chat` : "/api/chat"

    const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()
      setReply(data.reply || 'No reply received')
      setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while sending your message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            AI Chat Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Ask me anything! I'm here to help and support you on your journey.
          </p>
        </div>

        {/* Chat Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Your Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">
              <span className="font-semibold">Error:</span> {error}
            </p>
          </div>
        )}

        {/* Reply Card */}
        {reply && (
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-secondary">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Assistant Reply
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {reply}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="ml-3 text-gray-600">Waiting for response...</span>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
