import React, { useState } from 'react'

/**
 * Controlled chat input with Enter=send, Shift+Enter=new line
 * Props:
 *  - onSend: (text: string) => void
 *  - disabled?: boolean
 *  - placeholder?: string
 */
export default function ChatInput({ onSend, disabled = false, placeholder = 'Type a message…' }) {
  const [text, setText] = useState('')

  const send = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend?.(trimmed)
    setText('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        rows={1}
        style={{
          flex: 1,
          resize: 'none',
          padding: '10px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          font: 'inherit',
          lineHeight: 1.4,
        }}
        disabled={disabled}
      />
      <button
        onClick={send}
        disabled={disabled || !text.trim()}
        style={{
          border: '1px solid #e5e7eb',
          background: '#111827',
          color: '#fff',
          borderRadius: 10,
          padding: '10px 14px',
          cursor: disabled || !text.trim() ? 'not-allowed' : 'pointer',
        }}
        title="Send (Enter)"
      >
        Send
      </button>
    </div>
  )
}
