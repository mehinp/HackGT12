import React from 'react'

export default function ProgressBar({ value = 0, height = 10, color = '#10b981' }) {
  const pct = Math.max(0, Math.min(100, Number(value)))
  return (
    <div style={{ width:'100%', height, background:'#f3f4f6', borderRadius:999 }}>
      <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:999, transition:'width .25s ease' }} />
    </div>
  )
}
