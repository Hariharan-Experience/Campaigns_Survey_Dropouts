import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'

export const MODEL = 'claude-opus-5'

let client = null

export function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null
  if (!client) client = new Anthropic()
  return client
}

/**
 * Every prompt in this app hands Claude numbers the application already
 * computed. Claude's job is to read them, never to recompute them — this
 * rule is repeated in each route's own system prompt too.
 */
export const GROUND_RULES = `You are a survey research analyst working inside an analytics product.

Rules that override everything else:
- Every figure you are given has already been calculated by the application. Never recalculate, re-derive, estimate, or invent a number. Quote the figures you are given exactly as given.
- If you want to reference a number that is not in the payload, do not state it. Describe the pattern qualitatively instead.
- Be concise. This output renders in a compact dashboard panel, not a report.
- Write plainly. No filler, no restating the question, no "it is important to note".
- Ground every claim in the supplied data. If the data does not support a claim, leave it out.`

/**
 * One structured call. Returns the validated object, or throws with a
 * message the route can surface.
 */
export async function structuredCall({ system, prompt, schema, effort = 'medium' }) {
  const anthropic = getClient()
  if (!anthropic) {
    const err = new Error(
      'ANTHROPIC_API_KEY is not set. Add it to server/.env and restart the server.',
    )
    err.status = 503
    throw err
  }

  const attempt = async () =>
    anthropic.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      system: `${GROUND_RULES}\n\n${system}`,
      messages: [{ role: 'user', content: prompt }],
      output_config: {
        effort,
        format: zodOutputFormat(schema, 'analysis'),
      },
    })

  // The API can transiently return 429/529 under load. Back off and retry
  // rather than surfacing a raw provider error to the researcher.
  let response
  for (let i = 0; ; i++) {
    try {
      response = await attempt()
      break
    } catch (e) {
      const transient = e?.status === 429 || e?.status === 529 || e?.status >= 500
      if (!transient || i >= 3) {
        if (transient) {
          const err = new Error(
            'Claude is busy right now. Wait a moment and try again.',
          )
          err.status = 503
          throw err
        }
        throw e
      }
      await new Promise((r) => setTimeout(r, 1500 * 2 ** i))
    }
  }

  if (response.stop_reason === 'refusal') {
    const err = new Error('The model declined to answer this request.')
    err.status = 422
    throw err
  }

  if (!response.parsed_output) {
    const err = new Error('The model returned output that did not match the expected shape.')
    err.status = 502
    throw err
  }

  return response.parsed_output
}

/** Shared express error handling for the Claude routes. */
export function handleRouteError(res, error, label) {
  const status = error.status ?? error.status_code ?? 500
  console.error(`[${label}] ${status} — ${error.message}`)
  res.status(status >= 400 && status < 600 ? status : 500).json({
    error: error.message ?? 'Unexpected error',
  })
}
