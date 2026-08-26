# Survey Dropout & Response Intelligence — Setup Guide

## Project Structure

```
hackathon-aug26/
├── src/                          # React frontend
│   ├── main.jsx                  # Vite entry point
│   ├── App.jsx                   # Router setup
│   ├── index.css                 # Global styles
│   ├── pages/
│   │   ├── CampaignAnalytics.jsx # Main dashboard
│   │   └── CampaignAnalytics.css
│   ├── components/               # (empty, placeholder)
│   ├── context/
│   │   └── AnalyticsContext.jsx  # App state
│   ├── data/
│   │   └── mockData.js           # Mock campaigns & data
│   └── utils/
│       └── api.js                # API client
├── server/                       # Express backend
│   ├── server.js                 # API server
│   ├── package.json
│   └── .env                      # (ANTHROPIC_API_KEY)
├── index.html                    # Vite HTML entry
├── vite.config.js                # Vite configuration
└── package.json
```

## Prerequisites

- Node.js 18+
- npm

## Installation

### Frontend (Root Directory)

```bash
npm install
```

### Backend (Server Directory)

```bash
cd server
npm install
cd ..
```

## Running the Project

### Option 1: Run Frontend Only (for UI development)

```bash
npm run dev
```

Frontend will start at `http://localhost:5176` (or next available port)

### Option 2: Run Frontend + Backend (for full integration)

#### Terminal 1 — Backend:
```bash
cd server
npm start
```
Backend runs on `http://localhost:5000`

#### Terminal 2 — Frontend:
```bash
npm run dev
```
Frontend runs on `http://localhost:5176` (or next available port)

The Vite config proxies `/api/*` requests to the backend automatically.

## Features Built So Far

- [x] React + Vite setup with React Router
- [x] Basic page shell (CampaignAnalytics)
- [x] Campaign selector dropdown
- [x] Mock data with 2 campaigns
- [x] CSS styling for header and layout
- [x] Context setup for app state
- [x] API utility functions
- [x] Express backend with CORS

## TODO — Next Phase

- [ ] Dropout Insights section (funnel visualization)
- [ ] Response Intelligence section
- [ ] Anthropic integration for insights
- [ ] Metric cards and comparison badges
- [ ] Responsive mobile design refinement

## Environment Variables

### Frontend
- No frontend env vars needed for MVP

### Backend (server/.env)
```
PORT=5000
ANTHROPIC_API_KEY=your_key_here
```

## Verifying Setup

1. Open http://localhost:5176 (or shown port)
2. You should see the Campaign Analytics page
3. The dropdown should list "Q3 2026 Customer Satisfaction Survey" and "Q2 2026 Product Feedback"
4. Two placeholder sections (Dropout Insights & Response Intelligence)
