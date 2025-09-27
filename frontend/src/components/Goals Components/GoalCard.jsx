import React from 'react'

/**
 * Minimal goal card with default export
 * Props:
 *  - goal: { id, name, targetMonthly, progressPct (0-100) }
 *  - onEdit(id), onDelete(id)
 */
export default function GoalCard({ goal, onEdit, onDelete }) {
  if (!goal) return null
  const pct = Math.max(0, Math.min(100, Number(goal.progressPct ?? 0)))

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 12,
      background: '#fff',
      display: 'grid',
      gap: 8
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontWeight: 600 }}>{goal.name}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            Target: ${Number(goal.targetMonthly ?? 0).toLocaleString()}/mo
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {onEdit && (
            <button onClick={() => onEdit(goal.id)} style={btnStyle}>Edit</button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(goal.id)} style={{ ...btnStyle, color: '#dc2626', borderColor: '#fecaca' }}>
              Delete
            </button>
          )}
        </div>
      </div>

      {/* progress bar */}
      <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999 }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: '#3b82f6',
          borderRadius: 999,
          transition: 'width .2s ease'
        }}/>
      </div>

      <div style={{ fontSize: 12, color: '#374151' }}>
        Progress: {pct}%
      </div>
    </div>
  )
}

const btnStyle = {
  border: '1px solid #e5e7eb',
  padding: '6px 10px',
  borderRadius: 8,
  fontSize: 12,
  background: '#f9fafb',
  cursor: 'pointer'
}
