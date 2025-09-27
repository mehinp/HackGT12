import React from 'react'

export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null
  return (
    <div style={backdrop} onClick={onClose}>
      <div style={panel} onClick={e=>e.stopPropagation()}>
        {title && <div style={header}><strong>{title}</strong></div>}
        <div style={{ padding: 16 }}>{children}</div>
        {footer && <div style={footerStyle}>{footer}</div>}
      </div>
    </div>
  )
}

const backdrop = { position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }
const panel = { background:'#fff', borderRadius:12, minWidth:320, maxWidth:640, width:'90%', boxShadow:'0 10px 30px rgba(0,0,0,.2)' }
const header = { padding:16, borderBottom:'1px solid #eee' }
const footerStyle = { padding:16, borderTop:'1px solid #eee', display:'flex', justifyContent:'flex-end', gap:8 }
