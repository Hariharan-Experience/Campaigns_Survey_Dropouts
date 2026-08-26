import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load .env from this file's own directory, so the server works no matter
// which cwd it is launched from.
dotenv.config({
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env'),
})

const { default: improveQuestion } = await import('./routes/improveQuestion.js')
const { default: analyzeResponses } = await import('./routes/analyzeResponses.js')
const { MODEL, getClient } = await import('./lib/claude.js')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    model: MODEL,
    anthropicConfigured: Boolean(getClient()),
  })
})

app.post('/api/improve-question', improveQuestion)
app.post('/api/analyze-responses', analyzeResponses)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Model: ${MODEL}`)
  if (!getClient()) {
    console.warn('ANTHROPIC_API_KEY is not set — the AI routes will return 503.')
  }
})
