import React from 'react'

/**
 * Minimal message bubble
 * Props:
 *  - sender: 'user' | 'bot'
 *  - text: string
 *  - timestamp?: Date|string|number
 */
export default function MessageBubble({ sender = 'bot', text = '', timestamp }) {
  const isUser = sender === 'user'
  const time =
    timestamp ? new Date(timestamp).toLocaleTimeString() : ''

  const wrap = {
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
  }

  const bubble = {
    maxWidth: '75%',
    padding: '10px 12px',
    borderRadius: 12,
    background: isUser ? '#2563eb' : '#f3f4f6',
    color: isUser ? '#fff' : '#111827',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  }

  const meta = {
    fontSize: 11,
    opacity: 0.7,
    marginTop: 4,
    textAlign: isUser ? 'right' : 'left',
  }

  return (
    <div style={{ margin: '6px 0' }}>
      <div style={wrap}>
        <div style={bubble}>{text}</div>
      </div>
      {time && <div style={meta}>{time}</div>}
    </div>
  )
}
