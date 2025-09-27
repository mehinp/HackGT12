import React, { useMemo, useState } from 'react'

/**
 * Simple reaction picker + reaction list.
 * Props:
 *  - subjectId: string|number                // the thing being reacted to (friend, post, period)
 *  - reactions: Array<{ id, fromUserId, toUserId?, subjectId?, emoji, createdAt? }>
 *  - onReact?: (emoji: string) => void       // called when user picks an emoji
 *  - allowed?: string[]                      // emojis to show in the picker
 *  - currentUserId?: string|number
 */
export default function ReactionSystem({
  subjectId,
  reactions = [],
  onReact,
  allowed = ['👍','🔥','💯','🎯','👏','💪','🧠','🚀'],
  currentUserId
}) {
  const [open, setOpen] = useState(false)

  // Filter reactions for this subject (if subject-level)
  const items = useMemo(
    () => (subjectId ? reactions.filter(r => r.subjectId === subjectId) : reactions),
    [reactions, subjectId]
  )

  // Aggregate counts per emoji
  const counts = useMemo(() => {
    const map = new Map()
    for (const r of items) map.set(r.emoji, (map.get(r.emoji) || 0) + 1)
    return [...map.entries()].sort((a,b) => b[1] - a[1]) // by frequency
  }, [items])

  const handlePick = (emoji) => {
    onReact?.(emoji)
    setOpen(false)
  }

  return (
    <div style={wrap}>
      {/* existing reaction chips */}
      <div style={chipRow}>
        {counts.length === 0 && <span style={{ color: '#6b7280', fontSize: 12 }}>Be the first to react</span>}
        {counts.map(([emoji, n]) => (
          <span key={emoji} style={chip} title={`${n} reaction${n>1?'s':''}`}>
            <span style={{ fontSize: 14, marginRight: 6 }}>{emoji}</span>
            <b>{n}</b>
          </span>
        ))}
      </div>

      {/* add reaction button / picker */}
      <div style={{ position: 'relative' }}>
        <button style={addBtn} onClick={() => setOpen(v => !v)} title="Add reaction">＋ React</button>
        {open && (
          <div style={picker} onMouseLeave={() => setOpen(false)}>
            {allowed.map((e) => (
              <button key={e} style={emojiBtn} onClick={() => handlePick(e)}>{e}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const wrap = { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }
const chipRow = { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }
const chip = { padding: '4px 8px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 999, display: 'inline-flex', alignItems: 'center' }
const addBtn = { border: '1px solid #e5e7eb', background: '#fff', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }
const picker = { position: 'absolute', top: '110%', left: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6, boxShadow: '0 10px 24px rgba(0,0,0,.1)', zIndex: 10 }
const emojiBtn = { fontSize: 18, padding: 6, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 6 }
