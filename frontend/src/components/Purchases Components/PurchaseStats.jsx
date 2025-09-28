import React, { useMemo } from 'react'
import Chart from '../Chart.jsx'
import ProgressBar from '../ProgressBar.jsx'

export default function PurchaseStats({ items = [], monthlyTarget = 0 }) {
  const { total, byDay } = useMemo(() => {
    const sum = items.reduce((s, p) => s + (p.amount_cents||0), 0) / 100
    const map = {}
    for (const p of items) {
      const d = new Date(p.ts).toISOString().slice(0,10)
      map[d] = (map[d] || 0) + (p.amount_cents||0)/100
    }
    const series = Object.entries(map).sort(([a],[b]) => a.localeCompare(b)).map(([date, v]) => ({ date, value: v }))
    return { total: sum, byDay: series }
  }, [items])

  const pct = monthlyTarget > 0 ? Math.min(100, (total / monthlyTarget) * 100) : 0

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div><strong>Total this month:</strong> ${total.toFixed(2)}</div>
      <Chart data={byDay} />
      <div>
        <div style={{ marginBottom: 6 }}>Progress to target (${monthlyTarget}/mo)</div>
        <ProgressBar value={pct} />
      </div>
    </div>
  )
}
