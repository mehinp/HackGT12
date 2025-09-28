import { authService } from './authService'

const BASE = import.meta.env?.VITE_API_BASE ?? 'http://143.215.104.239:8080'

// Helper: throw on non-OK and return parsed JSON
async function toJsonOrThrow(res) {
  let body;
  try { body = await res.json(); } catch { /* ignore parse error */ }
  if (!res.ok) {
    const msg = body?.message || body?.error || `Request failed (${res.status})`
    throw new Error(msg)
  }
  return body
}

// Helper: always hand back an array of goals
function normalizeGoals(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.goals)) return payload.goals
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export const goalService = {
  async createGoal(goalData) {
    const res = await authService.authenticatedRequest(`${BASE}/goals/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // If your API uses cookies/sessions, keep this here; if bearer tokens are used,
      // your authService likely injects Authorization instead.
      credentials: 'include',
      body: JSON.stringify(goalData)
    })
    return toJsonOrThrow(res)
  },

  async getUserGoals() {
    const res = await authService.authenticatedRequest(`${BASE}/goals/my-goals`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    })
    const json = await toJsonOrThrow(res)
    return normalizeGoals(json)
  }
}
