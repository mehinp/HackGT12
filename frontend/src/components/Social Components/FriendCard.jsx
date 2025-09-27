import React from 'react'

/**
 * Friend card with score/level and action buttons.
 * Props:
 *  - friend: { id, name, handle, avatarUrl, score, level }
 *  - onCompare?: (id) => void
 *  - onRemove?: (id) => void
 *  - onMessage?: (id) => void
 *  - footer?: ReactNode (optional custom footer area)
 */
export default function FriendCard({ friend, onCompare, onRemove, onMessage, footer }) {
  if (!friend) return null

  return (
    <div style={wrap}>
      <div style={left}>
        <img
          src={friend.avatarUrl || `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(friend.handle || friend.name || 'friend')}`}
          alt={friend.name || 'Friend'}
          style={avatar}
        />
        <div>
          <div style={{ fontWeight: 700, lineHeight: 1.1 }}>
            {friend.name || friend.handle || 'Friend'}
          </div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            @{friend.handle || 'unknown'}
          </div>
        </div>
      </div>

      <div style={stats}>
        <div style={pill}>
          <span style={{ fontSize: 11, color: '#6b7280' }}>Score</span>
          <strong>{Number(friend.score ?? 0).toFixed(0)}</strong>
        </div>
        <div style={pill}>
          <span style={{ fontSize: 11, color: '#6b7280' }}>Level</span>
          <strong>{Number(friend.level ?? 1)}</strong>
        </div>
      </div>

      <div style={actions}>
        {onCompare && <button style={btn} onClick={() => onCompare(friend.id)} title="Compare">⇄ Compare</button>}
        {onMessage && <button style={btn} onClick={() => onMessage(friend.id)} title="Message">💬 Message</button>}
        {onRemove && <button style={{ ...btn, color: '#dc2626', borderColor: '#fecaca' }} onClick={() => onRemove(friend.id)} title="Remove">🗑 Remove</button>}
      </div>

      {footer && <div style={{ gridColumn: '1 / -1' }}>{footer}</div>}
    </div>
  )
}

const wrap = {
  display: 'grid',
  gridTemplateColumns: '1fr auto auto',
  gap: 12,
  alignItems: 'center',
  border: '1px solid #eee',
  borderRadius: 12,
  padding: 12,
  background: '#fff',
}
const left = { display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }
const avatar = { width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', background: '#f3f4f6' }
const stats = { display: 'flex', gap: 8, alignItems: 'center' }
const pill = { background: '#f9fafb', border: '1px solid #eee', borderRadius: 10, padding: '6px 10px', display: 'grid', gap: 2, justifyItems: 'center' }
const actions = { display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }
const btn = { border: '1px solid #e5e7eb', background: '#fff', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }
