import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const link = ({ isActive }) => ({
    padding: '10px 12px',
    borderRadius: 8,
    color: isActive ? '#fff' : '#111827',
    background: isActive ? '#2563eb' : 'transparent',
    textDecoration: 'none',
    display: 'block'
  })

  return (
    <aside style={{ minWidth: 200, borderRight:'1px solid #eee', padding: 12, display:'grid', gap:6 }}>
      <NavLink to="/" style={link}>Dashboard</NavLink>
      <NavLink to="/purchases" style={link}>Purchases</NavLink>
      <NavLink to="/goals" style={link}>Goals</NavLink>
      <NavLink to="/social" style={link}>Social</NavLink>
      <NavLink to="/profile" style={link}>Profile</NavLink>
    </aside>
  )
}
