/**
 * Centralized mock data for Campaign Analytics.
 *
 * Everything here is fictional. No production or customer data.
 *
 * Shape per campaign:
 *   details        — id, name, purpose, audience, status, owner
 *   period         — current + previous window labels and dates
 *   metrics        — headline counts for current and previous periods
 *   scoreDistribution / channels — derived breakdowns of the current period
 *   questions      — ordered, each with current + previous funnel and timing
 *   responses      — current + previous open-text answers
 *
 * Invariants held by hand (see verifyCampaign() at the bottom, which the
 * dev build asserts on import):
 *   - questions[0].reached          === metrics.respondents
 *   - questions[i+1].reached        === questions[i].completed
 *   - last question's completed     === metrics.completed
 *   - sum of per-question dropped   === metrics.incomplete
 *   - scoreDistribution sums to metrics.completed and weights to averageScore
 *   - channels sum to respondents / completed
 *
 * NOTE: response themes are deliberately NOT encoded here. Responses carry
 * text only; themes are discovered from that text downstream.
 */

/* ------------------------------------------------------------------ *
 * 1. Mortgage Customer Experience
 *    A declining campaign — document verification got worse this period.
 * ------------------------------------------------------------------ */

const mortgage = {
  id: 'mortgage-cx',
  name: 'Mortgage Customer Experience',
  purpose:
    'Post-closing survey sent to every borrower who completed a mortgage application, measuring the end-to-end lending experience.',
  audience: 'Borrowers who reached a decision on a mortgage application',
  industry: 'Financial services',
  status: 'Live',
  owner: 'Lending Insights',
  segments: ['First-time buyer', 'Refinance', 'Investment property', 'Jumbo'],

  period: {
    current: { label: 'Q3 2026 to date', start: '2026-07-01', end: '2026-08-26' },
    previous: { label: 'Q2 2026', start: '2026-04-01', end: '2026-06-30' },
  },

  metrics: {
    current: {
      respondents: 10000,
      completed: 6400,
      incomplete: 3600,
      completionRate: 64.0,
      averageScore: 3.8,
      medianCompletionSeconds: 268,
    },
    previous: {
      respondents: 9240,
      completed: 6150,
      incomplete: 3090,
      completionRate: 66.6,
      averageScore: 3.6,
      medianCompletionSeconds: 241,
    },
  },

  scoreDistribution: [
    { score: 1, label: '1 — Very poor', count: 320 },
    { score: 2, label: '2 — Poor', count: 580 },
    { score: 3, label: '3 — Neutral', count: 1160 },
    { score: 4, label: '4 — Good', count: 2340 },
    { score: 5, label: '5 — Excellent', count: 2000 },
  ],

  channels: [
    { channel: 'Email', sent: 5400, completed: 3620 },
    { channel: 'SMS', sent: 2600, completed: 1710 },
    { channel: 'In-app', sent: 1400, completed: 806 },
    { channel: 'QR / kiosk', sent: 600, completed: 264 },
  ],

  // Weekly dropout, summing exactly to metrics.<period>.respondents
  // and .incomplete. Verified on import by verifyCampaign().
  trend: {
    previous: [
      { weekStart: '2026-04-01', respondents: 709, dropped: 230 },
      { weekStart: '2026-04-08', respondents: 667, dropped: 218 },
      { weekStart: '2026-04-15', respondents: 752, dropped: 247 },
      { weekStart: '2026-04-22', respondents: 688, dropped: 227 },
      { weekStart: '2026-04-29', respondents: 737, dropped: 244 },
      { weekStart: '2026-05-06', respondents: 652, dropped: 217 },
      { weekStart: '2026-05-13', respondents: 766, dropped: 257 },
      { weekStart: '2026-05-20', respondents: 702, dropped: 236 },
      { weekStart: '2026-05-27', respondents: 730, dropped: 247 },
      { weekStart: '2026-06-03', respondents: 674, dropped: 229 },
      { weekStart: '2026-06-10', respondents: 745, dropped: 255 },
      { weekStart: '2026-06-17', respondents: 695, dropped: 239 },
      { weekStart: '2026-06-24', respondents: 723, dropped: 244 },
    ],
    current: [
      { weekStart: '2026-07-01', respondents: 1228, dropped: 375 },
      { weekStart: '2026-07-08', respondents: 1155, dropped: 370 },
      { weekStart: '2026-07-15', respondents: 1302, dropped: 436 },
      { weekStart: '2026-07-22', respondents: 1191, dropped: 417 },
      { weekStart: '2026-07-29', respondents: 1277, dropped: 466 },
      { weekStart: '2026-08-05', respondents: 1130, dropped: 429 },
      { weekStart: '2026-08-12', respondents: 1327, dropped: 524 },
      { weekStart: '2026-08-19', respondents: 1390, dropped: 583 },
    ],
  },

  questions: [
    {
      id: 'mtg-q1',
      order: 1,
      text: 'Overall, how satisfied were you with your mortgage application experience?',
      type: 'rating',
      required: true,
      current: { reached: 10000, completed: 9640, dropped: 360, avgSeconds: 9, medianSeconds: 7 },
      previous: { reached: 9240, completed: 8930, dropped: 310, avgSeconds: 9, medianSeconds: 7 },
    },
    {
      id: 'mtg-q2',
      order: 2,
      text: 'How clearly were your loan options explained to you?',
      type: 'rating',
      required: true,
      current: { reached: 9640, completed: 9350, dropped: 290, avgSeconds: 8, medianSeconds: 7 },
      previous: { reached: 8930, completed: 8680, dropped: 250, avgSeconds: 8, medianSeconds: 6 },
    },
    {
      id: 'mtg-q3',
      order: 3,
      text: 'What was the most difficult part of your application?',
      type: 'open_text',
      required: false,
      current: { reached: 9350, completed: 8710, dropped: 640, avgSeconds: 42, medianSeconds: 31 },
      previous: { reached: 8680, completed: 8150, dropped: 530, avgSeconds: 39, medianSeconds: 29 },
    },
    {
      id: 'mtg-q4',
      order: 4,
      text: 'How responsive was your loan officer?',
      type: 'rating',
      required: true,
      current: { reached: 8710, completed: 8420, dropped: 290, avgSeconds: 7, medianSeconds: 6 },
      previous: { reached: 8150, completed: 7900, dropped: 250, avgSeconds: 7, medianSeconds: 6 },
    },
    {
      id: 'mtg-q5',
      order: 5,
      text: 'Please describe any difficulties you had uploading or verifying your documents.',
      type: 'open_text',
      required: true,
      current: { reached: 8420, completed: 6640, dropped: 1780, avgSeconds: 78, medianSeconds: 61 },
      previous: { reached: 7900, completed: 7060, dropped: 840, avgSeconds: 61, medianSeconds: 48 },
    },
    {
      id: 'mtg-q6',
      order: 6,
      text: 'How satisfied were you with the closing process?',
      type: 'rating',
      required: true,
      current: { reached: 6640, completed: 6570, dropped: 70, avgSeconds: 8, medianSeconds: 7 },
      previous: { reached: 7060, completed: 6880, dropped: 180, avgSeconds: 8, medianSeconds: 7 },
    },
    {
      id: 'mtg-q7',
      order: 7,
      text: 'How likely are you to recommend us to a friend or colleague?',
      type: 'nps',
      required: true,
      current: { reached: 6570, completed: 6500, dropped: 70, avgSeconds: 11, medianSeconds: 9 },
      previous: { reached: 6880, completed: 6640, dropped: 240, avgSeconds: 11, medianSeconds: 9 },
    },
    {
      id: 'mtg-q8',
      order: 8,
      text: 'Would you consider us again for a future mortgage?',
      type: 'single_select',
      required: true,
      current: { reached: 6500, completed: 6450, dropped: 50, avgSeconds: 9, medianSeconds: 7 },
      previous: { reached: 6640, completed: 6440, dropped: 200, avgSeconds: 9, medianSeconds: 7 },
    },
    {
      id: 'mtg-q9',
      order: 9,
      text: 'Is there anything else you would like us to know?',
      type: 'open_text',
      required: false,
      current: { reached: 6450, completed: 6400, dropped: 50, avgSeconds: 95, medianSeconds: 64 },
      previous: { reached: 6440, completed: 6150, dropped: 290, avgSeconds: 88, medianSeconds: 60 },
    },
  ],

  responses: {
    current: [
      {
        id: 'mtg-c-01',
        questionId: 'mtg-q3',
        score: 2,
        channel: 'Email',
        segment: 'First-time buyer',
        submittedAt: '2026-07-08',
        text: "Honestly the hardest part was not knowing where I stood. Three weeks went by where I had no idea if my file was moving or sitting in someone's queue. I would have been fine with slow if somebody had just told me it was slow.",
      },
      {
        id: 'mtg-c-02',
        questionId: 'mtg-q3',
        score: 3,
        channel: 'SMS',
        segment: 'Refinance',
        submittedAt: '2026-07-11',
        text: 'Getting a straight answer on what my actual monthly payment would be. The number changed four times between pre-approval and closing and nobody walked me through why.',
      },
      {
        id: 'mtg-c-03',
        questionId: 'mtg-q3',
        score: 4,
        channel: 'Email',
        segment: 'Refinance',
        submittedAt: '2026-07-19',
        text: 'Not much honestly. My officer was on top of it. The rate lock window was tight and that was stressful but that is the market, not you.',
      },
      {
        id: 'mtg-c-04',
        questionId: 'mtg-q3',
        score: 1,
        channel: 'In-app',
        segment: 'First-time buyer',
        submittedAt: '2026-07-24',
        text: 'Being asked for the same paystubs three separate times by three different people. I started to wonder if anyone was actually reading what I sent.',
      },
      {
        id: 'mtg-c-05',
        questionId: 'mtg-q3',
        score: 3,
        channel: 'Email',
        segment: 'Jumbo',
        submittedAt: '2026-08-02',
        text: 'The self-employment income calculation. I run an S-corp and it took two underwriters and a CPA letter before anyone agreed on the number.',
      },
      {
        id: 'mtg-c-06',
        questionId: 'mtg-q5',
        score: 1,
        channel: 'In-app',
        segment: 'First-time buyer',
        submittedAt: '2026-07-06',
        text: 'The upload portal kept rejecting my bank statements as "unreadable" even though they were the official PDFs downloaded straight from my bank. I ended up screenshotting each page and uploading those instead. Took me most of a Saturday.',
      },
      {
        id: 'mtg-c-07',
        questionId: 'mtg-q5',
        score: 2,
        channel: 'SMS',
        segment: 'Refinance',
        submittedAt: '2026-07-14',
        text: 'Tried to do the whole thing from my phone since that is how I got the link. The document uploader does not work on mobile at all. Just spins. Had to wait until I was back at a laptop two days later.',
      },
      {
        id: 'mtg-c-08',
        questionId: 'mtg-q5',
        score: 2,
        channel: 'Email',
        segment: 'First-time buyer',
        submittedAt: '2026-07-21',
        text: 'There is a 5MB limit that nobody mentions until after the upload fails. My scanned tax returns were 11MB. I had no idea how to split a PDF and there was no help text explaining it.',
      },
      {
        id: 'mtg-c-09',
        questionId: 'mtg-q5',
        score: 3,
        channel: 'In-app',
        segment: 'Investment property',
        submittedAt: '2026-07-29',
        text: 'It worked eventually but I could never tell what had actually gone through. No confirmation email, no checkmark, nothing. I uploaded my W-2 four times just to be safe.',
      },
      {
        id: 'mtg-c-10',
        questionId: 'mtg-q5',
        score: 1,
        channel: 'Email',
        segment: 'Jumbo',
        submittedAt: '2026-08-05',
        text: 'The session timed out while I was gathering documents and I lost everything I had already attached. No warning, no autosave. I nearly gave up on the whole application at that point and went with another lender.',
      },
      {
        id: 'mtg-c-11',
        questionId: 'mtg-q5',
        score: 2,
        channel: 'SMS',
        segment: 'Refinance',
        submittedAt: '2026-08-11',
        text: 'Why do I need to upload documents you already have? I have banked with you for eleven years. You have my direct deposits.',
      },
      {
        id: 'mtg-c-12',
        questionId: 'mtg-q5',
        score: 4,
        channel: 'Email',
        segment: 'Refinance',
        submittedAt: '2026-08-18',
        text: 'Upload itself was fine on desktop. The frustrating part was the request list kept growing. Every time I cleared it, two more items appeared a few days later.',
      },
      {
        id: 'mtg-c-13',
        questionId: 'mtg-q9',
        score: 5,
        channel: 'Email',
        segment: 'Refinance',
        submittedAt: '2026-07-16',
        text: 'Denise in the Charlotte office was outstanding. She called me on a Sunday to explain the appraisal gap and stayed on the phone for forty minutes. Whatever you pay her it is not enough.',
      },
      {
        id: 'mtg-c-14',
        questionId: 'mtg-q9',
        score: 2,
        channel: 'In-app',
        segment: 'First-time buyer',
        submittedAt: '2026-08-09',
        text: 'This survey is too long and it asked me the same thing twice. I almost closed it. I only finished because I wanted to say something about the document thing.',
      },
      {
        id: 'mtg-c-15',
        questionId: 'mtg-q9',
        score: 3,
        channel: 'Email',
        segment: 'Investment property',
        submittedAt: '2026-08-20',
        text: 'Closing costs came in about $2,300 over the estimate. It was disclosed technically but it was buried and nobody flagged it to me verbally. That left a bad taste after an otherwise fine process.',
      },
    ],
    previous: [
      {
        id: 'mtg-p-01',
        questionId: 'mtg-q3',
        score: 3,
        channel: 'Email',
        segment: 'First-time buyer',
        submittedAt: '2026-04-09',
        text: 'Understanding the difference between the points options. I read the sheet three times and still had to ask my officer to explain it in plain English.',
      },
      {
        id: 'mtg-p-02',
        questionId: 'mtg-q3',
        score: 4,
        channel: 'SMS',
        segment: 'Refinance',
        submittedAt: '2026-04-22',
        text: 'Scheduling the appraisal around my work hours. Minor, but it took two weeks of back and forth.',
      },
      {
        id: 'mtg-p-03',
        questionId: 'mtg-q3',
        score: 2,
        channel: 'Email',
        segment: 'Jumbo',
        submittedAt: '2026-05-14',
        text: 'Reaching a human being. The 800 number put me in a loop twice and my officer only answered email.',
      },
      {
        id: 'mtg-p-04',
        questionId: 'mtg-q5',
        score: 3,
        channel: 'Email',
        segment: 'Refinance',
        submittedAt: '2026-04-17',
        text: 'It was fine. Took a couple of tries to get the file sizes right but the instructions were there once I looked for them.',
      },
      {
        id: 'mtg-p-05',
        questionId: 'mtg-q5',
        score: 4,
        channel: 'In-app',
        segment: 'First-time buyer',
        submittedAt: '2026-05-02',
        text: 'No real problems. I did everything from the laptop in one sitting and it went through.',
      },
      {
        id: 'mtg-p-06',
        questionId: 'mtg-q5',
        score: 2,
        channel: 'SMS',
        segment: 'Investment property',
        submittedAt: '2026-05-28',
        text: 'Had to resend my LLC operating agreement because the first copy came through blurry on your end. Annoying but they told me quickly so it was sorted in a day.',
      },
      {
        id: 'mtg-p-07',
        questionId: 'mtg-q5',
        score: 4,
        channel: 'Email',
        segment: 'Refinance',
        submittedAt: '2026-06-11',
        text: 'Straightforward. The checklist told me what was needed up front which I appreciated.',
      },
      {
        id: 'mtg-p-08',
        questionId: 'mtg-q9',
        score: 5,
        channel: 'Email',
        segment: 'First-time buyer',
        submittedAt: '2026-05-19',
        text: 'First time buying and I was terrified going in. The team talked me through every step without making me feel stupid. Closed on time.',
      },
      {
        id: 'mtg-p-09',
        questionId: 'mtg-q9',
        score: 3,
        channel: 'In-app',
        segment: 'Jumbo',
        submittedAt: '2026-06-24',
        text: 'Competitive rate, competent people, forgettable experience. Nothing went wrong and nothing stood out.',
      },
    ],
  },
}

/* ------------------------------------------------------------------ *
 * 2. Healthcare Experience
 *    An improving campaign — the billing question was shortened and
 *    dropout at that step fell.
 * ------------------------------------------------------------------ */

const healthcare = {
  id: 'healthcare-cx',
  name: 'Healthcare Experience',
  purpose:
    'Post-visit patient experience survey sent 24 hours after any completed appointment across the clinic network.',
  audience: 'Patients who attended an appointment in the last 24 hours',
  industry: 'Healthcare',
  status: 'Live',
  owner: 'Patient Experience Office',
  segments: ['Primary care', 'Specialist', 'Urgent care', 'Telehealth'],

  period: {
    current: { label: 'Jul–Aug 2026', start: '2026-07-01', end: '2026-08-26' },
    previous: { label: 'May–Jun 2026', start: '2026-05-01', end: '2026-06-30' },
  },

  metrics: {
    current: {
      respondents: 6800,
      completed: 4760,
      incomplete: 2040,
      completionRate: 70.0,
      averageScore: 4.2,
      medianCompletionSeconds: 194,
    },
    previous: {
      respondents: 6400,
      completed: 4220,
      incomplete: 2180,
      completionRate: 65.9,
      averageScore: 4.0,
      medianCompletionSeconds: 228,
    },
  },

  scoreDistribution: [
    { score: 1, label: '1 — Very poor', count: 110 },
    { score: 2, label: '2 — Poor', count: 230 },
    { score: 3, label: '3 — Neutral', count: 479 },
    { score: 4, label: '4 — Good', count: 1720 },
    { score: 5, label: '5 — Excellent', count: 2221 },
  ],

  channels: [
    { channel: 'Email', sent: 3200, completed: 2290 },
    { channel: 'SMS', sent: 2400, completed: 1700 },
    { channel: 'Patient portal', sent: 900, completed: 610 },
    { channel: 'QR / kiosk', sent: 300, completed: 160 },
  ],

  // Weekly dropout, summing exactly to metrics.<period>.respondents
  // and .incomplete. Verified on import by verifyCampaign().
  trend: {
    previous: [
      { weekStart: '2026-05-01', respondents: 733, dropped: 260 },
      { weekStart: '2026-05-08', respondents: 689, dropped: 242 },
      { weekStart: '2026-05-15', respondents: 777, dropped: 270 },
      { weekStart: '2026-05-22', respondents: 711, dropped: 244 },
      { weekStart: '2026-05-29', respondents: 762, dropped: 259 },
      { weekStart: '2026-06-05', respondents: 674, dropped: 227 },
      { weekStart: '2026-06-12', respondents: 791, dropped: 263 },
      { weekStart: '2026-06-19', respondents: 725, dropped: 238 },
      { weekStart: '2026-06-26', respondents: 538, dropped: 177 },
    ],
    current: [
      { weekStart: '2026-07-01', respondents: 835, dropped: 280 },
      { weekStart: '2026-07-08', respondents: 785, dropped: 255 },
      { weekStart: '2026-07-15', respondents: 885, dropped: 279 },
      { weekStart: '2026-07-22', respondents: 810, dropped: 247 },
      { weekStart: '2026-07-29', respondents: 869, dropped: 256 },
      { weekStart: '2026-08-05', respondents: 768, dropped: 219 },
      { weekStart: '2026-08-12', respondents: 902, dropped: 248 },
      { weekStart: '2026-08-19', respondents: 946, dropped: 256 },
    ],
  },

  questions: [
    {
      id: 'hc-q1',
      order: 1,
      text: 'Overall, how would you rate your visit?',
      type: 'rating',
      required: true,
      current: { reached: 6800, completed: 6610, dropped: 190, avgSeconds: 8, medianSeconds: 6 },
      previous: { reached: 6400, completed: 6180, dropped: 220, avgSeconds: 8, medianSeconds: 6 },
    },
    {
      id: 'hc-q2',
      order: 2,
      text: 'How well did your provider listen to your concerns?',
      type: 'rating',
      required: true,
      current: { reached: 6610, completed: 6420, dropped: 190, avgSeconds: 9, medianSeconds: 7 },
      previous: { reached: 6180, completed: 5950, dropped: 230, avgSeconds: 9, medianSeconds: 7 },
    },
    {
      id: 'hc-q3',
      order: 3,
      text: 'In your own words, how did your provider explain your care plan?',
      type: 'open_text',
      required: false,
      current: { reached: 6420, completed: 6080, dropped: 340, avgSeconds: 38, medianSeconds: 28 },
      previous: { reached: 5950, completed: 5580, dropped: 370, avgSeconds: 40, medianSeconds: 30 },
    },
    {
      id: 'hc-q4',
      order: 4,
      text: 'Tell us about scheduling, check-in, and billing for this visit.',
      type: 'open_text',
      required: true,
      current: { reached: 6080, completed: 5240, dropped: 840, avgSeconds: 72, medianSeconds: 55 },
      previous: { reached: 5580, completed: 4560, dropped: 1020, avgSeconds: 104, medianSeconds: 81 },
    },
    {
      id: 'hc-q5',
      order: 5,
      text: 'How would you rate the cleanliness and comfort of the facility?',
      type: 'rating',
      required: true,
      current: { reached: 5240, completed: 5080, dropped: 160, avgSeconds: 7, medianSeconds: 6 },
      previous: { reached: 4560, completed: 4400, dropped: 160, avgSeconds: 7, medianSeconds: 6 },
    },
    {
      id: 'hc-q6',
      order: 6,
      text: 'How satisfied were you with your wait time?',
      type: 'rating',
      required: true,
      current: { reached: 5080, completed: 4930, dropped: 150, avgSeconds: 8, medianSeconds: 6 },
      previous: { reached: 4400, completed: 4300, dropped: 100, avgSeconds: 8, medianSeconds: 6 },
    },
    {
      id: 'hc-q7',
      order: 7,
      text: 'How likely are you to recommend this practice to family or friends?',
      type: 'nps',
      required: true,
      current: { reached: 4930, completed: 4840, dropped: 90, avgSeconds: 10, medianSeconds: 8 },
      previous: { reached: 4300, completed: 4260, dropped: 40, avgSeconds: 10, medianSeconds: 8 },
    },
    {
      id: 'hc-q8',
      order: 8,
      text: 'Is there anything else you would like to share about your visit?',
      type: 'open_text',
      required: false,
      current: { reached: 4840, completed: 4760, dropped: 80, avgSeconds: 88, medianSeconds: 57 },
      previous: { reached: 4260, completed: 4220, dropped: 40, avgSeconds: 84, medianSeconds: 55 },
    },
  ],

  responses: {
    current: [
      {
        id: 'hc-c-01',
        questionId: 'hc-q3',
        score: 5,
        channel: 'SMS',
        segment: 'Primary care',
        submittedAt: '2026-07-03',
        text: 'Dr. Okafor drew the whole thing out on paper for me. I am 74 and I actually understood my medication schedule for the first time. I took the paper home and put it on the fridge.',
      },
      {
        id: 'hc-c-02',
        questionId: 'hc-q3',
        score: 2,
        channel: 'Email',
        segment: 'Specialist',
        submittedAt: '2026-07-10',
        text: 'He talked at me for six minutes using words I did not understand and then left. I found out what my diagnosis actually meant by reading the after-visit summary in the parking lot.',
      },
      {
        id: 'hc-c-03',
        questionId: 'hc-q3',
        score: 4,
        channel: 'Patient portal',
        segment: 'Telehealth',
        submittedAt: '2026-07-18',
        text: 'Clear and patient over video. She shared her screen to show me the lab trend which I thought was a nice touch. Connection dropped once but she called back right away.',
      },
      {
        id: 'hc-c-04',
        questionId: 'hc-q3',
        score: 3,
        channel: 'SMS',
        segment: 'Urgent care',
        submittedAt: '2026-08-01',
        text: 'Fine but rushed. I could tell there were a lot of people waiting. I did not feel like I could ask a second question.',
      },
      {
        id: 'hc-c-05',
        questionId: 'hc-q4',
        score: 4,
        channel: 'SMS',
        segment: 'Primary care',
        submittedAt: '2026-07-07',
        text: 'Check-in on the tablet was quick this time. Much better than the clipboard. Billing I have not seen yet so I cannot say.',
      },
      {
        id: 'hc-c-06',
        questionId: 'hc-q4',
        score: 2,
        channel: 'Email',
        segment: 'Specialist',
        submittedAt: '2026-07-15',
        text: 'I was quoted a $40 copay at the desk and then received a bill for $310 six weeks later with no explanation of the difference. I have called twice and been transferred both times without resolution.',
      },
      {
        id: 'hc-c-07',
        questionId: 'hc-q4',
        score: 3,
        channel: 'Patient portal',
        segment: 'Primary care',
        submittedAt: '2026-07-23',
        text: 'Scheduling online is easy now, that is a real improvement. Check-in still asked me to re-enter my insurance even though nothing has changed in two years.',
      },
      {
        id: 'hc-c-08',
        questionId: 'hc-q4',
        score: 5,
        channel: 'SMS',
        segment: 'Urgent care',
        submittedAt: '2026-07-30',
        text: 'Walked in, scanned the QR code, was in a room in eleven minutes. No complaints at all.',
      },
      {
        id: 'hc-c-09',
        questionId: 'hc-q4',
        score: 1,
        channel: 'Email',
        segment: 'Specialist',
        submittedAt: '2026-08-06',
        text: 'The referral was never sent. I showed up for an appointment that the specialist office had no record of, after taking a half day off work. Nobody apologized.',
      },
      {
        id: 'hc-c-10',
        questionId: 'hc-q4',
        score: 3,
        channel: 'Patient portal',
        segment: 'Telehealth',
        submittedAt: '2026-08-14',
        text: 'Getting a video link that works should not require three emails. Once I was in it was smooth.',
      },
      {
        id: 'hc-c-11',
        questionId: 'hc-q8',
        score: 5,
        channel: 'SMS',
        segment: 'Primary care',
        submittedAt: '2026-07-12',
        text: 'The front desk staff at the Westside location remember my name. In a system this big that means something.',
      },
      {
        id: 'hc-c-12',
        questionId: 'hc-q8',
        score: 2,
        channel: 'Email',
        segment: 'Urgent care',
        submittedAt: '2026-08-04',
        text: 'Two hours in the waiting room with a child running a fever. I understand triage but nobody came out to tell us anything for the first ninety minutes.',
      },
      {
        id: 'hc-c-13',
        questionId: 'hc-q8',
        score: 4,
        channel: 'Patient portal',
        segment: 'Specialist',
        submittedAt: '2026-08-17',
        text: 'Care was excellent. The parking situation at the medical campus is genuinely awful and I nearly missed my slot circling the garage.',
      },
      {
        id: 'hc-c-14',
        questionId: 'hc-q8',
        score: 3,
        channel: 'SMS',
        segment: 'Telehealth',
        submittedAt: '2026-08-22',
        text: 'Please stop sending three reminder texts for one appointment. One is plenty.',
      },
    ],
    previous: [
      {
        id: 'hc-p-01',
        questionId: 'hc-q3',
        score: 4,
        channel: 'SMS',
        segment: 'Primary care',
        submittedAt: '2026-05-06',
        text: 'She explained the blood pressure numbers well and wrote down what to watch for. No complaints.',
      },
      {
        id: 'hc-p-02',
        questionId: 'hc-q3',
        score: 2,
        channel: 'Email',
        segment: 'Specialist',
        submittedAt: '2026-05-21',
        text: 'Very technical. I nodded along and then had to look everything up at home.',
      },
      {
        id: 'hc-p-03',
        questionId: 'hc-q4',
        score: 1,
        channel: 'Email',
        segment: 'Primary care',
        submittedAt: '2026-05-08',
        text: 'This question is enormous. You are asking me about three completely different things in one box and I do not have the energy for it after a doctor visit.',
      },
      {
        id: 'hc-p-04',
        questionId: 'hc-q4',
        score: 2,
        channel: 'Patient portal',
        segment: 'Specialist',
        submittedAt: '2026-05-19',
        text: 'Billing is a nightmare. I received four separate statements for one visit, from the clinic, the lab, the radiologist and someone called a hospitalist I never met.',
      },
      {
        id: 'hc-p-05',
        questionId: 'hc-q4',
        score: 3,
        channel: 'SMS',
        segment: 'Urgent care',
        submittedAt: '2026-06-02',
        text: 'Check-in fine. Scheduling fine. Billing unclear. Hard to answer all three at once so I am mostly talking about the bill.',
      },
      {
        id: 'hc-p-06',
        questionId: 'hc-q4',
        score: 4,
        channel: 'SMS',
        segment: 'Primary care',
        submittedAt: '2026-06-18',
        text: 'Getting an appointment took nine days which felt long for something urgent-ish, but the visit itself was well run.',
      },
      {
        id: 'hc-p-07',
        questionId: 'hc-q8',
        score: 5,
        channel: 'Patient portal',
        segment: 'Telehealth',
        submittedAt: '2026-05-27',
        text: 'Telehealth saved me a 50 mile round trip. More of this please.',
      },
      {
        id: 'hc-p-08',
        questionId: 'hc-q8',
        score: 3,
        channel: 'Email',
        segment: 'Specialist',
        submittedAt: '2026-06-09',
        text: 'The doctor was good. Everything around the doctor was disorganized.',
      },
      {
        id: 'hc-p-09',
        questionId: 'hc-q8',
        score: 4,
        channel: 'SMS',
        segment: 'Urgent care',
        submittedAt: '2026-06-25',
        text: 'Quick visit for stitches. In and out in under an hour on a Saturday. Impressed.',
      },
    ],
  },
}

/* ------------------------------------------------------------------ *
 * 3. Employee Experience
 *    A declining campaign — the leadership question drives dropout and
 *    scores fell after a reorganization.
 * ------------------------------------------------------------------ */

const employee = {
  id: 'employee-ex',
  name: 'Employee Experience',
  purpose:
    'Twice-yearly engagement pulse sent to all permanent staff, tracking sentiment on leadership, workload, tooling and recognition.',
  audience: 'All permanent employees with 90+ days tenure',
  industry: 'Internal / People Ops',
  status: 'Closed',
  owner: 'People Analytics',
  segments: ['Engineering', 'Sales', 'Support', 'Operations', 'Field'],

  period: {
    current: { label: 'Aug 2026 pulse', start: '2026-08-03', end: '2026-08-21' },
    previous: { label: 'Feb 2026 pulse', start: '2026-02-02', end: '2026-02-20' },
  },

  metrics: {
    current: {
      respondents: 2400,
      completed: 1560,
      incomplete: 840,
      completionRate: 65.0,
      averageScore: 3.5,
      medianCompletionSeconds: 312,
    },
    previous: {
      respondents: 2280,
      completed: 1610,
      incomplete: 670,
      completionRate: 70.6,
      averageScore: 3.8,
      medianCompletionSeconds: 289,
    },
  },

  scoreDistribution: [
    { score: 1, label: '1 — Very poor', count: 130 },
    { score: 2, label: '2 — Poor', count: 250 },
    { score: 3, label: '3 — Neutral', count: 320 },
    { score: 4, label: '4 — Good', count: 430 },
    { score: 5, label: '5 — Excellent', count: 430 },
  ],

  channels: [
    { channel: 'Email', sent: 1500, completed: 980 },
    { channel: 'Slack', sent: 700, completed: 460 },
    { channel: 'SMS', sent: 150, completed: 85 },
    { channel: 'QR / kiosk', sent: 50, completed: 35 },
  ],

  // Weekly dropout, summing exactly to metrics.<period>.respondents
  // and .incomplete. Verified on import by verifyCampaign().
  trend: {
    previous: [
      { weekStart: '2026-02-02', respondents: 845, dropped: 241 },
      { weekStart: '2026-02-09', respondents: 795, dropped: 233 },
      { weekStart: '2026-02-16', respondents: 640, dropped: 196 },
    ],
    current: [
      { weekStart: '2026-08-03', respondents: 890, dropped: 280 },
      { weekStart: '2026-08-10', respondents: 836, dropped: 293 },
      { weekStart: '2026-08-17', respondents: 674, dropped: 267 },
    ],
  },

  questions: [
    {
      id: 'emp-q1',
      order: 1,
      text: 'How satisfied are you working here right now?',
      type: 'rating',
      required: true,
      current: { reached: 2400, completed: 2330, dropped: 70, avgSeconds: 8, medianSeconds: 7 },
      previous: { reached: 2280, completed: 2220, dropped: 60, avgSeconds: 8, medianSeconds: 7 },
    },
    {
      id: 'emp-q2',
      order: 2,
      text: 'Do you have the tools and information you need to do your job well?',
      type: 'rating',
      required: true,
      current: { reached: 2330, completed: 2250, dropped: 80, avgSeconds: 8, medianSeconds: 7 },
      previous: { reached: 2220, completed: 2160, dropped: 60, avgSeconds: 8, medianSeconds: 7 },
    },
    {
      id: 'emp-q3',
      order: 3,
      text: 'How supported do you feel by your direct manager?',
      type: 'rating',
      required: true,
      current: { reached: 2250, completed: 2140, dropped: 110, avgSeconds: 9, medianSeconds: 7 },
      previous: { reached: 2160, completed: 2080, dropped: 80, avgSeconds: 9, medianSeconds: 7 },
    },
    {
      id: 'emp-q4',
      order: 4,
      text: 'How confident are you in the direction set by senior leadership, and why?',
      type: 'open_text',
      required: true,
      current: { reached: 2140, completed: 1810, dropped: 330, avgSeconds: 86, medianSeconds: 68 },
      previous: { reached: 2080, completed: 1870, dropped: 210, avgSeconds: 74, medianSeconds: 58 },
    },
    {
      id: 'emp-q5',
      order: 5,
      text: 'Is your current workload sustainable?',
      type: 'rating',
      required: true,
      current: { reached: 1810, completed: 1750, dropped: 60, avgSeconds: 9, medianSeconds: 7 },
      previous: { reached: 1870, completed: 1810, dropped: 60, avgSeconds: 9, medianSeconds: 7 },
    },
    {
      id: 'emp-q6',
      order: 6,
      text: 'Do you feel recognized for the work you do?',
      type: 'rating',
      required: true,
      current: { reached: 1750, completed: 1690, dropped: 60, avgSeconds: 8, medianSeconds: 7 },
      previous: { reached: 1810, completed: 1750, dropped: 60, avgSeconds: 8, medianSeconds: 7 },
    },
    {
      id: 'emp-q7',
      order: 7,
      text: 'What one change would most improve your day to day?',
      type: 'open_text',
      required: false,
      current: { reached: 1690, completed: 1640, dropped: 50, avgSeconds: 64, medianSeconds: 47 },
      previous: { reached: 1750, completed: 1700, dropped: 50, avgSeconds: 61, medianSeconds: 45 },
    },
    {
      id: 'emp-q8',
      order: 8,
      text: 'How likely are you to recommend this company as a place to work?',
      type: 'nps',
      required: true,
      current: { reached: 1640, completed: 1600, dropped: 40, avgSeconds: 10, medianSeconds: 8 },
      previous: { reached: 1700, completed: 1660, dropped: 40, avgSeconds: 10, medianSeconds: 8 },
    },
    {
      id: 'emp-q9',
      order: 9,
      text: 'Anything else you want leadership to hear?',
      type: 'open_text',
      required: false,
      current: { reached: 1600, completed: 1560, dropped: 40, avgSeconds: 72, medianSeconds: 51 },
      previous: { reached: 1660, completed: 1610, dropped: 50, avgSeconds: 69, medianSeconds: 49 },
    },
  ],

  responses: {
    current: [
      {
        id: 'emp-c-01',
        questionId: 'emp-q4',
        score: 2,
        channel: 'Email',
        segment: 'Engineering',
        submittedAt: '2026-08-04',
        text: 'Not confident. We have changed strategy three times in eighteen months and each time the previous plan was described as a great success on the way out the door. I do not know what we are building toward.',
      },
      {
        id: 'emp-c-02',
        questionId: 'emp-q4',
        score: 1,
        channel: 'Slack',
        segment: 'Support',
        submittedAt: '2026-08-05',
        text: 'I am not answering this honestly in a survey that asks for my department, my tenure and my location on the first screen. You can work out who I am from that. Ask this anonymously or do not ask it.',
      },
      {
        id: 'emp-c-03',
        questionId: 'emp-q4',
        score: 4,
        channel: 'Email',
        segment: 'Sales',
        submittedAt: '2026-08-06',
        text: 'Reasonably confident. The enterprise pivot makes sense to me and the numbers back it up. My concern is less the direction and more whether we have the headcount to execute it.',
      },
      {
        id: 'emp-c-04',
        questionId: 'emp-q4',
        score: 2,
        channel: 'Slack',
        segment: 'Operations',
        submittedAt: '2026-08-07',
        text: 'The all-hands slides look great. The reality on my team is that we lost four people in the reorg and were told to absorb the work. Those two stories cannot both be true.',
      },
      {
        id: 'emp-c-05',
        questionId: 'emp-q4',
        score: 3,
        channel: 'Email',
        segment: 'Engineering',
        submittedAt: '2026-08-10',
        text: 'Mixed. I trust my VP completely. Above that level it gets vague. Decisions appear fully formed and we are asked to be excited about them.',
      },
      {
        id: 'emp-c-06',
        questionId: 'emp-q4',
        score: 5,
        channel: 'Email',
        segment: 'Field',
        submittedAt: '2026-08-12',
        text: 'Very confident actually. The regional restructure was handled well and for the first time in years I understand how my territory ladders up to the company goal.',
      },
      {
        id: 'emp-c-07',
        questionId: 'emp-q4',
        score: 2,
        channel: 'Slack',
        segment: 'Support',
        submittedAt: '2026-08-14',
        text: 'This question is too big to answer in a text box and I do not believe anything I write here gets read. Last pulse we raised staffing and nothing visible happened.',
      },
      {
        id: 'emp-c-08',
        questionId: 'emp-q7',
        score: 2,
        channel: 'Email',
        segment: 'Engineering',
        submittedAt: '2026-08-08',
        text: 'Fewer meetings. I counted 19 recurring invites on my calendar last week. I write code on Saturdays because that is the only uninterrupted time I get.',
      },
      {
        id: 'emp-c-09',
        questionId: 'emp-q7',
        score: 3,
        channel: 'Slack',
        segment: 'Support',
        submittedAt: '2026-08-11',
        text: 'Give us a real knowledge base. I answer the same twelve questions every day by searching old Slack threads because the internal docs were last updated in 2024.',
      },
      {
        id: 'emp-c-10',
        questionId: 'emp-q7',
        score: 3,
        channel: 'Email',
        segment: 'Sales',
        submittedAt: '2026-08-13',
        text: 'Fix the CRM. I spend the first hour of every day fighting it and the mobile version is unusable in the field, which is exactly where I need it.',
      },
      {
        id: 'emp-c-11',
        questionId: 'emp-q7',
        score: 4,
        channel: 'Email',
        segment: 'Operations',
        submittedAt: '2026-08-17',
        text: 'Honestly? Clarity on who owns what after the reorg. I am not blocked by workload, I am blocked by not knowing who to ask.',
      },
      {
        id: 'emp-c-12',
        questionId: 'emp-q9',
        score: 2,
        channel: 'Slack',
        segment: 'Engineering',
        submittedAt: '2026-08-15',
        text: 'The return to office policy was announced by email on a Friday afternoon with three weeks notice. Several people on my team have childcare arranged around the old policy. It was handled carelessly.',
      },
      {
        id: 'emp-c-13',
        questionId: 'emp-q9',
        score: 5,
        channel: 'Email',
        segment: 'Field',
        submittedAt: '2026-08-18',
        text: 'My manager is the reason I am still here. Whatever the leadership development program is doing, keep doing it at that level.',
      },
      {
        id: 'emp-c-14',
        questionId: 'emp-q9',
        score: 1,
        channel: 'Email',
        segment: 'Support',
        submittedAt: '2026-08-19',
        text: 'Pay. Everything else in this survey is secondary. Two people on my team left this quarter for roughly 20 percent more at competitors doing the same work.',
      },
      {
        id: 'emp-c-15',
        questionId: 'emp-q9',
        score: 3,
        channel: 'Slack',
        segment: 'Sales',
        submittedAt: '2026-08-20',
        text: 'Tell us what happened with the last survey before asking us to fill in another one.',
      },
    ],
    previous: [
      {
        id: 'emp-p-01',
        questionId: 'emp-q4',
        score: 4,
        channel: 'Email',
        segment: 'Engineering',
        submittedAt: '2026-02-04',
        text: 'Fairly confident. The three year plan was communicated clearly in January and the roadmap I work on lines up with it.',
      },
      {
        id: 'emp-p-02',
        questionId: 'emp-q4',
        score: 3,
        channel: 'Slack',
        segment: 'Support',
        submittedAt: '2026-02-06',
        text: 'Neutral. Leadership seems competent but they are distant. I could not name half the executive team.',
      },
      {
        id: 'emp-p-03',
        questionId: 'emp-q4',
        score: 5,
        channel: 'Email',
        segment: 'Sales',
        submittedAt: '2026-02-09',
        text: 'Confident. We hit the number two quarters running and the strategy has not moved. That consistency is worth a lot.',
      },
      {
        id: 'emp-p-04',
        questionId: 'emp-q4',
        score: 2,
        channel: 'Email',
        segment: 'Operations',
        submittedAt: '2026-02-11',
        text: 'Hard to say. The hiring freeze came without explanation right after we were told to scale up. Those messages did not fit together.',
      },
      {
        id: 'emp-p-05',
        questionId: 'emp-q7',
        score: 3,
        channel: 'Email',
        segment: 'Engineering',
        submittedAt: '2026-02-10',
        text: 'Faster build times. Twenty minutes of waiting per change adds up to most of a day each week.',
      },
      {
        id: 'emp-p-06',
        questionId: 'emp-q7',
        score: 4,
        channel: 'Slack',
        segment: 'Support',
        submittedAt: '2026-02-13',
        text: 'More predictable shift scheduling. Two weeks notice instead of four days would change my life.',
      },
      {
        id: 'emp-p-07',
        questionId: 'emp-q7',
        score: 3,
        channel: 'Email',
        segment: 'Field',
        submittedAt: '2026-02-17',
        text: 'Expense reimbursement that does not take six weeks. I am floating company travel on a personal card.',
      },
      {
        id: 'emp-p-08',
        questionId: 'emp-q9',
        score: 4,
        channel: 'Email',
        segment: 'Sales',
        submittedAt: '2026-02-14',
        text: 'Good place to work. The new parental leave policy made a real difference for my family and people noticed.',
      },
      {
        id: 'emp-p-09',
        questionId: 'emp-q9',
        score: 2,
        channel: 'Slack',
        segment: 'Operations',
        submittedAt: '2026-02-19',
        text: 'Promotion criteria are still a mystery. I have asked three times what the bar is for the next level and got three different answers.',
      },
    ],
  },
}

/* ------------------------------------------------------------------ *
 * Exports and helpers
 * ------------------------------------------------------------------ */

export const campaigns = [mortgage, healthcare, employee]

export const DEFAULT_CAMPAIGN_ID = mortgage.id

export function getCampaign(id) {
  return campaigns.find((c) => c.id === id) ?? campaigns[0]
}

/** Open-text questions are the ones theme discovery will run over. */
export function openTextQuestions(campaign) {
  return campaign.questions.filter((q) => q.type === 'open_text')
}

export function responsesForQuestion(campaign, questionId, period = 'current') {
  return campaign.responses[period].filter((r) => r.questionId === questionId)
}

/** Dropout rate for one question in one period, as a percentage. */
export function dropoutRate(question, period = 'current') {
  const { reached, dropped } = question[period]
  return (dropped / reached) * 100
}

/**
 * Headline deltas vs the previous period. Counts are percent change;
 * rates and scores are point change, since a percentage of a percentage
 * misleads.
 */
export function headlineDeltas(campaign) {
  const { current: c, previous: p } = campaign.metrics
  const pctChange = (now, before) => ((now - before) / before) * 100
  return {
    respondents: pctChange(c.respondents, p.respondents),
    completed: pctChange(c.completed, p.completed),
    incomplete: pctChange(c.incomplete, p.incomplete),
    completionRate: c.completionRate - p.completionRate,
    averageScore: c.averageScore - p.averageScore,
  }
}

/**
 * Questions ranked by how much dropout worsened against the previous
 * period. Positive `change` means the question got worse.
 */
export function frictionRanking(campaign) {
  return campaign.questions
    .map((q) => {
      const now = dropoutRate(q, 'current')
      const before = dropoutRate(q, 'previous')
      return { question: q, current: now, previous: before, change: now - before }
    })
    .sort((a, b) => b.current - a.current)
}

/* --- Dev-only consistency check ------------------------------------ */

function verifyCampaign(c) {
  const errors = []
  const { respondents, completed, incomplete, averageScore } = c.metrics.current

  if (respondents !== completed + incomplete) {
    errors.push('completed + incomplete !== respondents')
  }

  for (const period of ['current', 'previous']) {
    const qs = c.questions
    const m = c.metrics[period]
    if (qs[0][period].reached !== m.respondents) {
      errors.push(`${period}: first question reached !== respondents`)
    }
    qs.forEach((q, i) => {
      const s = q[period]
      if (s.reached - s.dropped !== s.completed) {
        errors.push(`${period}: ${q.id} reached - dropped !== completed`)
      }
      if (i > 0 && qs[i - 1][period].completed !== s.reached) {
        errors.push(`${period}: ${q.id} reached !== previous question completed`)
      }
    })
    if (qs[qs.length - 1][period].completed !== m.completed) {
      errors.push(`${period}: last question completed !== metrics.completed`)
    }
    const dropped = qs.reduce((sum, q) => sum + q[period].dropped, 0)
    if (dropped !== m.incomplete) {
      errors.push(`${period}: per-question dropped sums to ${dropped}, not ${m.incomplete}`)
    }
  }

  const distTotal = c.scoreDistribution.reduce((s, d) => s + d.count, 0)
  if (distTotal !== completed) {
    errors.push(`scoreDistribution sums to ${distTotal}, not ${completed}`)
  }
  const weighted =
    c.scoreDistribution.reduce((s, d) => s + d.score * d.count, 0) / distTotal
  if (Math.abs(weighted - averageScore) > 0.05) {
    errors.push(`scoreDistribution weights to ${weighted.toFixed(2)}, not ${averageScore}`)
  }

  for (const period of ['current', 'previous']) {
    const weeks = c.trend?.[period] ?? []
    const m = c.metrics[period]
    const seen = weeks.reduce((sum, w) => sum + w.respondents, 0)
    const left = weeks.reduce((sum, w) => sum + w.dropped, 0)
    if (!weeks.length) errors.push(`${period}: no trend buckets`)
    if (seen !== m.respondents) {
      errors.push(`${period}: trend respondents sum to ${seen}, not ${m.respondents}`)
    }
    if (left !== m.incomplete) {
      errors.push(`${period}: trend dropped sums to ${left}, not ${m.incomplete}`)
    }
    if (weeks.some((w) => w.dropped > w.respondents)) {
      errors.push(`${period}: a trend week drops more than it receives`)
    }
  }

  const sent = c.channels.reduce((s, ch) => s + ch.sent, 0)
  const chDone = c.channels.reduce((s, ch) => s + ch.completed, 0)
  if (sent !== respondents) errors.push(`channels sent ${sent}, not ${respondents}`)
  if (chDone !== completed) errors.push(`channels completed ${chDone}, not ${completed}`)

  return errors
}

if (import.meta.env?.DEV) {
  for (const c of campaigns) {
    const errors = verifyCampaign(c)
    if (errors.length) {
      console.error(`[mockData] ${c.name} is inconsistent:`, errors)
    }
  }
}
