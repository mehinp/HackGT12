import React from 'react'
import PurchaseItem from './PurchaseItem.jsx'

export default function PurchasesList({ items = [], onDelete, onEdit, emptyText = 'No purchases yet.' }) {
  if (!items.length) return <div style={{ color: '#6b7280' }}>{emptyText}</div>
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {items.map(p => <PurchaseItem key={p.id} item={p} onDelete={onDelete} onEdit={onEdit} />)}
    </div>
  )
}
