Build an initial monorepo structure for a future Stock Analyst Agent system.

Goal:
Create two folders:

1. server - NestJS backend
2. client - React frontend

For now, do NOT integrate OpenAI or Yahoo Finance yet.
Only prepare a clean architecture and one basic test endpoint.

Backend requirements:

- Create a NestJS app inside /server
- Use a clean layered structure:
  - src/modules/health
  - src/modules/agent
  - src/modules/stocks
  - src/common
  - src/config
- Implement one working endpoint:
  GET /api/health
- Response should be:
  {
  "status": "ok",
  "service": "stock-agent-server"
  }
- Add CORS support for the React client.
- Add global prefix: /api
- Keep files small and readable.
- Use TypeScript.
- Do not add database yet.
- Do not add authentication yet.
- Do not add Yahoo Finance yet.
- Do not add OpenAI yet.
- Add placeholder services for:
  - AgentService
  - StocksService
    with TODO comments explaining that later they will connect to OpenAI and Yahoo Finance.

Frontend requirements:

- Create a React app inside /client
- Use TypeScript
- Create a basic folder structure:
  - src/api
  - src/components
  - src/pages
  - src/hooks
  - src/types
- Create a simple page called HomePage
- HomePage should call GET http://localhost:3000/api/health
- Display the server status on the screen.
- Add loading and error states.
- Keep styling simple.
- Do not add complex UI libraries yet.

Project requirements:

- Add README.md in the root explaining:
  - how to run server
  - how to run client
  - what the future plan is
- Add package.json scripts if needed.
- Make sure both projects can run locally.s
- Prefer simple, clean, maintainable code.
- Do not over-engineer.

Future architecture context:
This project will later become a Stock Analyst Agent:

- React will be the chat/dashboard UI.
- NestJS will expose API endpoints.
- AgentService will call an LLM such as OpenAI.
- StocksService will use yahoo-finance2 to fetch stock prices, candles, charts, and basic financial data.
- Later we will add tools such as:
  - getStockPrice
  - getStockHistory
  - compareStocks
  - analyzePortfolio

Please generate the files and folder structure now.
