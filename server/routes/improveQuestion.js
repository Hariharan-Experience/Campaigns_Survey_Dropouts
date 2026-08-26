import { z } from 'zod'
import { structuredCall, handleRouteError } from '../lib/claude.js'

const Schema = z.object({
  diagnosis: z
    .string()
    .describe('One or two sentences on why this question is likely losing respondents.'),
  options: z
    .array(
      z.object({
        wording: z.string().describe('The full rewritten question text.'),
        rationale: z.string().describe('One sentence: what this wording fixes.'),
      }),
    )
    .min(3),
  recommended: z.object({
    wording: z
      .string()
      .describe('Copy of whichever option you recommend, word for word.'),
    why: z.string().describe('One or two sentences on why this one wins.'),
  }),
  nextStep: z
    .string()
    .describe('One concrete next action the researcher should take.'),
})

const SYSTEM = `You improve the WORDING of a single survey question that is losing respondents.

Hard scope limit — you may only propose changes to the question's text:
- Rewriting, shortening, splitting the ask, softening, or changing what is asked.
- You may NOT propose changes to the survey platform, upload widgets, file limits, mobile support, autosave, question order, making a question optional, page layout, incentives, reminders, or any product or engineering fix.
- If the response text blames a product problem, you may say so in the diagnosis, but every option you return must still be a question rewording.

Return EXACTLY three options in the options array — not two, not four. Three.

Give three distinct options — genuinely different approaches, not three phrasings of the same sentence. The recommended wording must be copied word for word from one of the three options.`

export default function improveQuestion(req, res) {
  const { question, metrics, campaign, contributors, sampleResponses } = req.body ?? {}

  if (!question?.text) {
    return res.status(400).json({ error: 'question.text is required' })
  }

  const prompt = [
    `CAMPAIGN: ${campaign?.name ?? 'Unknown'}`,
    campaign?.purpose ? `PURPOSE: ${campaign.purpose}` : null,
    campaign?.audience ? `AUDIENCE: ${campaign.audience}` : null,
    '',
    `QUESTION ${question.order ?? ''} (${question.type ?? 'unknown type'}${question.required ? ', required' : ', optional'}):`,
    `"${question.text}"`,
    '',
    'CALCULATED METRICS (already computed — do not recompute):',
    `- Reached: ${metrics?.reached}`,
    `- Dropped here: ${metrics?.dropped}`,
    `- Dropout rate: ${metrics?.dropoutRate}%`,
    `- Previous period dropout rate: ${metrics?.previousDropoutRate}%`,
    `- Change: ${metrics?.change} percentage points`,
    `- Average time on question: ${metrics?.avgSeconds}s`,
    `- Status band: ${metrics?.status}`,
    '',
    contributors?.length
      ? `CONTRIBUTORS THE APPLICATION FLAGGED:\n${contributors.map((c) => `- ${c}`).join('\n')}`
      : null,
    '',
    sampleResponses?.length
      ? `WHAT RESPONDENTS WHO DID ANSWER SAID:\n${sampleResponses.map((t) => `- "${t}"`).join('\n')}`
      : 'No open-text answers are available for this question.',
  ]
    .filter((line) => line !== null)
    .join('\n')

  structuredCall({ system: SYSTEM, prompt, schema: Schema })
    // The array-length hint is advisory in the JSON schema, so cap it here.
    .then((result) => res.json({ ...result, options: result.options.slice(0, 3) }))
    .catch((error) => handleRouteError(res, error, 'improve-question'))
}
