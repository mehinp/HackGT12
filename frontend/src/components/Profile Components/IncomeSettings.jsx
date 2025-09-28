import React, { useState } from 'react'

export default function IncomeSettings({ value = {}, onChange }) {
  const [form, setForm] = useState({
    employer: value.employer || '',
    monthlyIncome: value.monthlyIncome || '',
    paySchedule: value.paySchedule || 'monthly', // monthly | biweekly | weekly
  })

  const update = (k, v) => {
    const next = { ...form, [k]: v }
    setForm(next)
    onChange?.(next)
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <label>
        <div>Employer</div>
        <input value={form.employer} onChange={e=>update('employer', e.target.value)} />
      </label>
      <label>
        <div>Monthly Income ($)</div>
        <input type="number" value={form.monthlyIncome} onChange={e=>update('monthlyIncome', Number(e.target.value))} />
      </label>
      <label>
        <div>Pay Schedule</div>
        <select value={form.paySchedule} onChange={e=>update('paySchedule', e.target.value)}>
          <option value="monthly">Monthly</option>
          <option value="biweekly">Biweekly</option>
          <option value="weekly">Weekly</option>
        </select>
      </label>
    </div>
  )
}
