// Vercel serverless entry for POST /api/analyze-responses.
import analyzeResponses from '../server/routes/analyzeResponses.js'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  return analyzeResponses(req, res)
}
