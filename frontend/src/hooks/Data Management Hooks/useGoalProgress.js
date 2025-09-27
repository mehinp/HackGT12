import { useMemo } from 'react'

/**
 * Computes per-goal progress percentage based on purchases categories/labels
 * goals: [{ id, name, targetMonthlyCents, category }]
 * purchases: [{ amount_cents, category, ts }]
 */
export default function useGoalProgress(goals = [], purchases = []) {
  return useMemo(() => {
    const monthKey = new Date().toISOString().slice(0,7) // YYYY-MM
    const byCat = {}
    for (const p of purchases) {
      const k = new Date(p.ts).toISOString().slice(0,7)
      if (k !== monthKey) continue
      const cat = p.category || 'other'
      byCat[cat] = (byCat[cat] || 0) + (p.amount_cents || 0)
    }
    return goals.map(g => {
      const spentCents = g.category ? (byCat[g.category] || 0) : 0
      const pct = g.targetMonthlyCents ? Math.min(100, (spentCents / g.targetMonthlyCents) * 100) : 0
      return { goalId: g.id, name: g.name, progressPct: Math.round(pct), spentCents }
    })
  }, [goals, purchases])
}
