import React from 'react'

export default function ScoreImpactIndicator({ delta = 0 }) {
  const color = delta > 0 ? '#16a34a' : delta < 0 ? '#dc2626' : '#6b7280'
  const sign = delta > 0 ? '+' : ''
  return (
    <span style={{ color, fontWeight: 600 }} title="Score impact">
      {sign}{delta.toFixed(1)}
    </span>
  )
}
