// GET /api/health — confirms the deployment has an Anthropic key configured.
import { MODEL, getClient } from '../server/lib/claude.js'

export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    model: MODEL,
    anthropicConfigured: Boolean(getClient()),
  })
}
