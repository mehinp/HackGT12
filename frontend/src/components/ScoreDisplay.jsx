import React from 'react'
import ProgressBar from './ProgressBar.jsx'

export default function ScoreDisplay({ std = 0, ltt = 0, gs = 0 }) {
  const toPct = (v) => ((v + 3) / 6) * 100 // map [-3..3] → 0..100
  return (
    <div style={{ display:'grid', gap:12 }}>
      {[
        ['Short-term Discipline', std, '#f59e0b'],
        ['Long-term Trajectory', ltt, '#3b82f6'],
        ['Goal Score', gs, '#10b981'],
      ].map(([label, v, c]) => (
        <div key={label}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <strong>{label}</strong><span>{Number(v).toFixed(1)}</span>
          </div>
          <ProgressBar value={toPct(v)} color={c} />
        </div>
      ))}
    </div>
  )
}
