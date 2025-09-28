import { useMemo } from 'react'

/**
 * Basic score model:
 * - spending: negative when over a target
 * - saving: positive when savings grow
 * - budgeting: consistency measure (lower variance => higher)
 * - goals: average goal progress mapped to [-3..+3]
 */
export default function useScoreCalculation({ purchases = [], savings = [], goals = [] , targets = {} }) {
  return useMemo(() => {
    // spending: compare sum to target
    const month = new Date().toISOString().slice(0,7)
    const monthPurch = purchases.filter(p => new Date(p.ts).toISOString().slice(0,7) === month)
    const totalSpend = monthPurch.reduce((s,p)=>s+(p.amount_cents||0),0)/100
    const spendTarget = targets.monthlySpend || 1000
    const spending = clamp(mapRatio(totalSpend, spendTarget, invert=true), -3, 3)

    // saving: slope of savings over last points
    const slope = linSlope(savings.map((v,i)=>[i, v]))
    const saving = clamp(slope / 100, -3, 3) // naive scale

    // budgeting: inverse stddev of daily spend
    const daily = {}
    for (const p of monthPurch) {
      const d = new Date(p.ts).toISOString().slice(0,10)
      daily[d] = (daily[d]||0) + (p.amount_cents||0)/100
    }
    const arr = Object.values(daily)
    const mean = arr.reduce((s,v)=>s+v,0)/(arr.length||1)
    const variance = arr.reduce((s,v)=>s+(v-mean)**2,0)/(arr.length||1)
    const std = Math.sqrt(variance)
    const budgeting = clamp(3 - (std / (mean || 1)), -3, 3)

    // goals: average of progressPct to [-3..3] (50%->0, 100%->+3)
    const mapped = goals.map(g => {
      const p = (g.progressPct ?? 0) / 100
      return clamp((p - 0.5) * 6, -3, 3)
    })
    const goalsScore = mapped.length ? mapped.reduce((a,b)=>a+b,0)/mapped.length : 0

    const overall = clamp((spending + saving + budgeting + goalsScore)/4, -3, 3)
    return { spending, saving, budgeting, goals: goalsScore, overall }
  }, [purchases, savings, goals, targets])
}

// helpers
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)) }
function mapRatio(val, target, invert=false){
  if (!target) return 0
  const r = val/target
  // r=1 -> 0; r=0 -> +3; r=2 -> -3
  const x = 1 - r
  const s = x * 3
  return invert ? s : -s
}
function linSlope(points){
  if (points.length < 2) return 0
  const n = points.length
  const sumX = points.reduce((s,[x])=>s+x,0)
  const sumY = points.reduce((s,[,y])=>s+y,0)
  const sumXY = points.reduce((s,[x,y])=>s+x*y,0)
  const sumXX = points.reduce((s,[x])=>s+x*x,0)
  const denom = (n*sumXX - sumX*sumX) || 1
  return (n*sumXY - sumX*sumY) / denom
}
