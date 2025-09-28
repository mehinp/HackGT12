import React from 'react'

export default function LoadingSpinner({ size = 24 }) {
  const s = size + 'px'
  const style = {
    width: s, height: s, borderRadius: '50%',
    border: '3px solid #e5e7eb', borderTopColor: '#2563eb',
    animation: 'spin 1s linear infinite'
  }
  return (
    <div style={style}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
