# Prompts used to build this

This project was built through a sequence of prompts to Claude Code, in the
order given below, verbatim.

## Tool
Claude Code

---

## Prompt 1 — Plan the feature (no code)

> I am building a 3-hour hackathon MVP called:
>
> "Survey Dropout & Response Intelligence"
>
> The repository is empty.
>
> Build a mock Campaign Analytics feature with two sections:
>
> 1. Dropout Insights
> 2. Response Intelligence
>
> The feature should help researchers understand:
> - where respondents drop out
> - which questions have high friction
> - what respondents are saying
> - what changed compared with the previous period
> - how a high-dropout question can be improved
>
> Use:
> - React
> - Vite
> - React Router
> - Plain CSS
> - Mock data
> - Node.js/Express for the Anthropic integration
>
> Do not use real Experience.com APIs, production data, a database, authentication, or Redux.
>
> First inspect the repository and propose a simple implementation plan and file structure.
>
> Do not code yet.

## Prompt 2 — Project setup

> Implement the project setup from the previous plan.
>
> Create a React + Vite application with React Router.
>
> Create:
>
> src/components
> src/data
> src/pages
> src/utils
> src/context
> server
>
> Remove the default Vite demo.
>
> Create a basic Campaign Analytics application shell.
>
> Make sure npm run dev works.
>
> Do not build the intelligence features yet.

## Prompt 3 — Dashboard mockup

> Build a polished mock Campaign Analytics dashboard.
>
> Show:
>
> Respondents: 10,000
> Completed: 6,400
> Incomplete: 3,600
> Completion Rate: 64%
> Average Score: 3.8 / 5
>
> Add:
> Survey Dropout & Response Intelligence
>
> Clicking it should open:
>
> /campaign/analytics/intelligence
>
> Use a clean enterprise analytics design with:
> - sidebar
> - header
> - white cards
> - light background
> - clear typography
> - blue primary actions
>
> Use mock data only.

## Prompt 4 — Centralized mock data

> Create centralized mock data.
>
> Create three fictional campaigns with different purposes:
>
> 1. Mortgage Customer Experience
> 2. Healthcare Experience
> 3. Employee Experience
>
> Each campaign should contain:
> - campaign details
> - current-period metrics
> - previous-period metrics
> - survey questions
> - question respondent counts
> - response times
> - current response texts
> - previous response texts
>
> Create realistic fictional response text.
>
> Do not define response themes in the data. Themes will be discovered dynamically from the response text later.

## Prompt 5 — Dropout Insights (calculations + funnel + table)

> Build the Dropout Insights section using the existing mockSurveyData.
>
> Calculate dynamically:
> - Reached
> - Dropped
> - Dropout Rate
> - Completion Rate
> - Previous Period
> - Change
> - Status
>
> Status:
> <10% Healthy
> 10–20% Watch
> >=20% High Friction
>
> Add a respondent funnel and table with:
> Question, Type, Reached, Dropped, Dropout Rate, Completion Rate, Previous Period, Change, Avg. Time, Status, Analyze.
>
> Do not hard-code the highest-dropout question.

## Prompt 6 — Extend with AI features (Question Analysis, Response Intelligence, Compare, Survey Analysis)

> Extend the existing Survey Dropout & Response Intelligence feature.
>
> 1. Add Question Analysis with:
> - question metrics
> - possible contributors
> - [Improve Question]
>
> Create POST /api/improve-question using the existing Anthropic SDK.
> Send the selected question and analytics context.
> Return 3 improved question wordings, a recommended version, and a next step.
> Only recommend question-text changes.
>
> 2. Build Response Intelligence with [Analyze Responses].
> Create POST /api/analyze-responses.
> Use Claude to dynamically discover themes, theme percentages, sentiment, and a concise summary from the selected campaign's response text.
> Do not hard-code themes.
>
> 3. Add Compare for current vs previous:
> - Completion Rate
> - Highest Dropout
> - Response Themes
>
> 4. Add [Analyze Survey].
> Create POST /api/analyze-survey and send the calculated findings to Claude.
> Return:
> - summary
> - key findings
> - combined insight
> - recommended investigations
>
> Claude should interpret application-calculated numbers, not calculate them.
>
> Keep outputs concise and return structured JSON.

## Prompt 7 — Date filter, CSV export, survey editor, polish

> Extend the existing Survey Dropout & Response Intelligence feature.
>
> Add:
> - shared date filter: Last 7 Days, Last 30 Days, Last 90 Days, This Quarter, Previous Quarter
> - browser CSV export for Dropout Data, Response Themes, and Full Analysis
>
> Create mock /campaign/survey.
>
> Add:
> - [ Use Suggested Text ] to update local draft text
> - [ View Question ] to navigate, scroll, and highlight the selected question
> - [ Back to Intelligence ]
>
> Polish the UI as a native Campaign Analytics experience with a clear funnel, table, AI panel, loading/error states, and responsive layout.
>
> Do not add unrelated features.

## Prompt 8 — Run it locally

> Run the application in the localhost

Followed by:

> use port 3000 and 8080

## Prompt 9 — Rebuild into two sections, fix the API key, wire real theme discovery

> Update the existing Survey Dropout & Response Intelligence prototype. Do not rebuild it.
>
> 1. UI
> Keep exactly two sections:
> - Survey Dropout
> - Survey Intelligence
>
> Remove the respondent funnel and any separate Compare/Analyze sections.
>
> Keep the shared:
> - Campaign selector
> - Date filter
> - Export
>
> 2. Survey Dropout
> Show a clear question-level table.
>
> Columns:
> - Survey Question
> - Type
> - Respondents Reached
> - Respondents Dropped
> - Dropout Rate
> - Completion Rate
> - Previous Period
> - Current Period
> - Change vs Previous
> - Avg. Answer Time
> - Status
> - Analyze
>
> Use "Change vs Previous" instead of "Change".
>
> Do not show a respondent funnel.
>
> Keep all dropout calculations deterministic and dynamic.
>
> 3. Question Analysis
> Analyze opens an inline panel/drawer showing:
> - question details
> - current dropout
> - previous-period dropout
> - change vs previous
> - possible contributors
> - average answer time
> - status
>
> Add:
> [ Improve Question with AI ]
>
> Only suggest question-text changes because the campaign may already be active.
>
> Show:
> - AI analysis
> - possible contributors
> - 3 improved versions
> - recommended version
> - recommended next step
>
> Allow:
> [ Use Suggested Text ]
>
> Update only local draft state.
>
> 4. Survey Intelligence
> Use the selected campaign's mock response text.
>
> Call Claude through the existing backend to dynamically discover:
> - top themes
> - response count
> - percentage
> - theme summary
> - positive/neutral/negative sentiment
> - top positive theme
> - top negative theme
> - overall summary
>
> Do not hard-code theme names.
> Themes must change based on the actual response text and selected campaign.
>
> 5. Anthropic
> I already added ANTHROPIC_API_KEY to server/.env.
>
> Use the existing key through the backend.
> Do not ask for another key.
> Do not expose the key to React.
>
> Fix the current error:
> "ANTHROPIC_API_KEY is not set. Add it to server/.env and restart the server."
>
> Make sure server/.env is loaded correctly by the backend process.
>
> 6. Date and Export
> Keep:
> Last 7 Days
> Last 30 Days
> Last 90 Days
> This Quarter
> Previous Quarter
>
> Export:
> - Dropout Data
> - Response Themes
> - Full Analysis
>
> Use the existing mock datasets.
>
> 7. UI
> Make the two sections very clear:
>
> Survey Dropout
> "Where are respondents dropping out?"
>
> Survey Intelligence
> "What are respondents saying?"
>
> Keep the current styling and avoid unnecessary changes.
>
> Reuse existing components and data.
> Do not add unrelated features.

Followed mid-turn by:

> Put only Survey Dropout & Response Intelligence table remove all others UI parts and use bootstrap for styles

## Prompt 10 — README

> Update README.MD file based on my project

## Prompt 11 — Potential Completion Gain column, README rewrite

> Add "Potential Completion Gain" = question dropout rate.
>
> Example:
> Q5 Dropout: 23.5%
> Potential Completion Gain: Up to +23.5 pts
>
> Remove table columns:
> - Previous Period
> - Current Period
> - Change
>
> Label Potential Completion Gain as an estimated upper bound, not a guaranteed result.
>
> Keep other functionality unchanged.
>
> Also create/update README.md with:
> - Problem
> - Solution
> - Features
> - Tech stack
> - Claude usage
> - Run instructions
> - Demo flow

## Prompt 12 — Export this log

> export all the prompt which i gave in the context in the prompt.md file
