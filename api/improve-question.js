// Vercel serverless entry for POST /api/improve-question.
// Reuses the Express route handler in server/ verbatim — @vercel/node gives
// the same (req, res) shape Express does, so nothing there needs to change.
import improveQuestion from '../server/routes/improveQuestion.js'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  return improveQuestion(req, res)
}
