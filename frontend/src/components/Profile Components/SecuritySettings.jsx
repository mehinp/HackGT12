import React, { useState } from 'react'

export default function SecuritySettings({ onPasswordChange }) {
  const [cur, setCur] = useState('')
  const [n1, setN1] = useState('')
  const [n2, setN2] = useState('')
  const [msg, setMsg] = useState(null)

  const change = () => {
    if (n1.length < 8) return setMsg('Password must be at least 8 characters.')
    if (n1 !== n2) return setMsg('New passwords do not match.')
    onPasswordChange?.(cur, n1)
    setMsg('Password updated ✔')
    setCur(''); setN1(''); setN2('')
  }

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <label><div>Current Password</div>
        <input type="password" value={cur} onChange={e=>setCur(e.target.value)} />
      </label>
      <label><div>New Password</div>
        <input type="password" value={n1} onChange={e=>setN1(e.target.value)} />
      </label>
      <label><div>Confirm New Password</div>
        <input type="password" value={n2} onChange={e=>setN2(e.target.value)} />
      </label>
      <button onClick={change}>Update Password</button>
      {msg && <div style={{ fontSize: 13, opacity: .8 }}>{msg}</div>}
    </div>
  )
}
