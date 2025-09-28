import React, { useState } from 'react'

export default function NotificationSettings({ value = {}, onChange }) {
  const [pref, setPref] = useState({
    email: value.email ?? true,
    push: value.push ?? false,
    weeklySummary: value.weeklySummary ?? true,
    goalAlerts: value.goalAlerts ?? true,
  })

  const update = (k, v) => {
    const next = { ...pref, [k]: v }
    setPref(next)
    onChange?.(next)
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {[
        ['email', 'Email notifications'],
        ['push', 'Push notifications'],
        ['weeklySummary', 'Weekly summary'],
        ['goalAlerts', 'Goal progress alerts'],
      ].map(([k, label]) => (
        <label key={k} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={!!pref[k]} onChange={e=>update(k, e.target.checked)} />
          <span>{label}</span>
        </label>
      ))}
    </div>
  )
}
