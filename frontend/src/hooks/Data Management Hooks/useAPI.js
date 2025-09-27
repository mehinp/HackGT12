// Tiny API helper. Set VITE_API in .env (e.g., http://localhost:8080)
const BASE = import.meta?.env?.VITE_API || ''

export default function useAPI() {
  async function req(path, init = {}) {
    const res = await fetch(BASE + path, {
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
      credentials: 'include',
      ...init,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `${res.status} ${res.statusText}`)
    }
    const ct = res.headers.get('content-type') || ''
    return ct.includes('application/json') ? res.json() : res.text()
  }
  return {
    get: (p) => req(p),
    post: (p, body) => req(p, { method: 'POST', body: JSON.stringify(body) }),
    del: (p) => req(p, { method: 'DELETE' }),
    put: (p, body) => req(p, { method: 'PUT', body: JSON.stringify(body) }),
  }
}
