# Stock Analyst Agent

Monorepo for a future Stock Analyst Agent system with a NestJS backend and a React frontend.

## Project structure

```
├── server/   # NestJS API
└── client/   # React UI
```

## Run the server

```bash
cd server
npm install
npm run start:dev
```

The API runs at `http://localhost:3000` with a global prefix of `/api`.

Health check: `GET http://localhost:3000/api/health`

Stock quote: `GET http://localhost:3000/api/stocks/:symbol`

AI analysis: `POST http://localhost:3000/api/agent/analyze` with body `{ "symbol": "AAPL" }`

### OpenAI API key

Add your key in `server/src/config/openai.config.ts`:

```ts
export const openaiConfig = {
  apiKey: 'sk-...',
  model: 'gpt-4o-mini',
};
```

## Run the client

```bash
cd client
npm install
npm run dev
```

The UI runs at `http://localhost:5173` and calls the server health endpoint on load.

## Root scripts

From the project root:

```bash
npm run server   # start NestJS in dev mode
npm run client   # start React dev server
```

## Future plan

This project will grow into a full Stock Analyst Agent:

- **React client** — chat and dashboard UI for stock analysis
- **NestJS server** — REST API for the agent and stock data
- **AgentService** — OpenAI-powered stock insights (basic analysis by symbol)
- **StocksService** — stock data via `yahoo-finance2` (prices, history, charts, financials)

Planned agent tools:

- `getStockPrice`
- `getStockHistory`
- `compareStocks`
- `analyzePortfolio`

Not yet implemented: database, authentication, advanced agent tools.
