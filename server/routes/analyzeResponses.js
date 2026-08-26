import { z } from 'zod'
import { structuredCall, handleRouteError } from '../lib/claude.js'

const Schema = z.object({
  overallSummary: z
    .string()
    .describe('Two or three sentences capturing what respondents are collectively saying.'),
  sentiment: z
    .object({
      positive: z.number().describe('Percent of responses that read as positive.'),
      neutral: z.number().describe('Percent that read as neutral or mixed.'),
      negative: z.number().describe('Percent that read as negative.'),
    })
    .describe('Whole numbers summing to 100.'),
  themes: z
    .array(
      z.object({
        name: z.string().describe('Short theme label, 2-5 words, drawn from what was actually said.'),
        responseCount: z
          .number()
          .int()
          .describe('How many of the supplied responses raise this theme.'),
        percentage: z
          .number()
          .describe('That count as a percent of the total supplied responses.'),
        sentiment: z.enum(['positive', 'neutral', 'negative', 'mixed']),
        summary: z.string().describe('One sentence on what respondents say under this theme.'),
        quote: z
          .string()
          .describe('A short verbatim fragment from one supplied response. Do not paraphrase.'),
      }),
    )
    .min(3),
  topPositiveTheme: z
    .string()
    .describe('Name of the strongest positive theme, copied exactly from the themes list. Empty string if none is positive.'),
  topNegativeTheme: z
    .string()
    .describe('Name of the strongest negative theme, copied exactly from the themes list. Empty string if none is negative.'),
})

const SYSTEM = `You read raw survey open-text answers and report what is actually in them.

Discover the themes from the text itself. You have no predefined theme list, and you must not force responses into generic survey-research categories. If respondents talk about a 5MB file limit, the theme is about the file limit — not "usability".

- Theme labels must be specific enough that someone who has not read the responses learns something from the label alone.
- Themes may overlap, so their percentages need not sum to 100. Sentiment percentages must sum to 100.
- responseCount is a count of supplied responses; percentage is that count over the total supplied. Both are yours to determine by reading — count carefully.
- Every quote must be a verbatim fragment copied from a supplied response. Never invent or paraphrase a quote.
- Order themes by how many responses raise them, most first.
- topPositiveTheme and topNegativeTheme must each be a name copied exactly from your themes list, or an empty string when no theme carries that sentiment.`

export default function analyzeResponses(req, res) {
  const { campaign, question, period, responses } = req.body ?? {}

  if (!Array.isArray(responses) || responses.length === 0) {
    return res.status(400).json({ error: 'responses must be a non-empty array' })
  }

  const prompt = [
    `CAMPAIGN: ${campaign?.name ?? 'Unknown'}`,
    campaign?.purpose ? `PURPOSE: ${campaign.purpose}` : null,
    period ? `PERIOD: ${period}` : null,
    question?.text ? `QUESTION: "${question.text}"` : 'Across several open-text questions.',
    '',
    `${responses.length} RESPONSES TO ANALYZE:`,
    ...responses.map((r, i) => {
      const meta = [
        r.score != null ? `score ${r.score}/5` : null,
        r.segment,
        r.channel,
      ]
        .filter(Boolean)
        .join(', ')
      return `${i + 1}. ${meta ? `(${meta}) ` : ''}"${r.text}"`
    }),
  ]
    .filter((line) => line !== null)
    .join('\n')

  structuredCall({ system: SYSTEM, prompt, schema: Schema })
    // Length hints are advisory in the JSON schema, so cap here.
    .then((result) => res.json({ ...result, themes: result.themes.slice(0, 6) }))
    .catch((error) => handleRouteError(res, error, 'analyze-responses'))
}
