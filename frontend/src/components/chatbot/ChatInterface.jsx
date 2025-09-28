import React, { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble.jsx'
import ChatInput from './ChatInput.jsx'

/**
 * Simple chat interface (list + input)
 * Props:
 *  - messages: Array<{ id: string|number, text: string, sender: 'user'|'bot', timestamp?: any }>
 *  - onSendMessage: (text: string) => void
 *  - isTyping?: boolean
 */
export default function ChatInterface({ messages = [], onSendMessage, isTyping = false }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* message list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, background: '#fff' }}>
        {messages.map((m) => (
          <MessageBubble
            key={m.id ?? `${m.sender}-${Math.random()}`}
            sender={m.sender}
            text={m.text}
            timestamp={m.timestamp}
          />
        ))}
        {isTyping && (
          <div style={{ color: '#6b7280', fontSize: 13, marginTop: 6 }}>Assistant is typing…</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div style={{ padding: 12, borderTop: '1px solid #e5e7eb', background: '#fafafa' }}>
        <ChatInput onSend={onSendMessage} disabled={isTyping} />
      </div>
    </div>
  )
}
