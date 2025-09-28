import React from 'react'
import ScoreImpactIndicator from './ScoreImpactIndicator.jsx'

export default function PurchaseItem({ item, onDelete, onEdit }) {
  if (!item) return null
  const amount = (item.amount_cents ?? 0) / 100

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'center', border: '1px solid #eee', borderRadius: 10, padding: 10 }}>
      <div>
        <div style={{ fontWeight: 600 }}>{item.merchant || 'Purchase'}</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          {new Date(item.ts || Date.now()).toLocaleString()} · {item.category || 'uncategorized'}
        </div>
      </div>
      <div style={{ textAlign: 'right', minWidth: 90 }}>${amount.toFixed(2)}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <ScoreImpactIndicator delta={item.scoreDelta || 0} />
        {onEdit && <button onClick={()=>onEdit(item)} title="Edit">✎</button>}
        {onDelete && <button onClick={()=>onDelete(item.id)} title="Delete" style={{ color: '#dc2626' }}>🗑</button>}
      </div>
    </div>
  )
}
