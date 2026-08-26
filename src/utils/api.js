const API_BASE = '/api'

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  let payload = null
  try {
    payload = await res.json()
  } catch {
    throw new Error(
      `Server returned ${res.status} with no JSON body. Is the API server running on port 5000?`,
    )
  }

  if (!res.ok) throw new Error(payload?.error ?? `Request failed (${res.status})`)
  return payload
}

export const improveQuestion = (body) => post('/improve-question', body)
export const analyzeResponses = (body) => post('/analyze-responses', body)
