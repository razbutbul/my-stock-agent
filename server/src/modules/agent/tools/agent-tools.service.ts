import { Injectable } from '@nestjs/common';
import { StocksService } from '../../stocks/stocks.service';
import type { AgentToolHandler, AgentToolName } from './tool.types';

function symbolTool(
  name: AgentToolName,
  description: string,
  execute: (symbol: string) => Promise<unknown>,
): AgentToolHandler {
  return {
    name,
    definition: {
      type: 'function',
      function: {
        name,
        description,
        parameters: {
          type: 'object',
          properties: {
            symbol: {
              type: 'string',
              description:
                'Stock ticker symbol, for example AAPL, MSFT, TSLA, NVDA',
            },
          },
          required: ['symbol'],
        },
      },
    },
    execute: (args) => {
      const symbol = args.symbol;

      if (typeof symbol !== 'string' || !symbol.trim()) {
        throw new Error(`${name} requires a non-empty symbol`);
      }

      return execute(symbol);
    },
  };
}

@Injectable()
export class AgentToolsService {
  private readonly handlers: Record<AgentToolName, AgentToolHandler>;

  constructor(private readonly stocksService: StocksService) {
    this.handlers = {
      get_stock_quote: symbolTool(
        'get_stock_quote',
        'Fetch live stock quote: current price, daily change, volume, day range, and market state. Call this first for any stock analysis.',
        (symbol) => this.stocksService.getStockQuote(symbol),
      ),
      get_stock_chart: symbolTool(
        'get_stock_chart',
        'Fetch daily and weekly OHLCV candle history for technical analysis: trend structure, momentum, support/resistance, volume confirmation, and 52-week range. Required before writing the technical section.',
        (symbol) => this.stocksService.getStockChart(symbol),
      ),
      get_stock_fundamentals: symbolTool(
        'get_stock_fundamentals',
        'Fetch business fundamentals and valuation: sector, industry, margins, revenue, growth, cash flow, debt, PE ratios, analyst targets, recommendation trend, upgrades/downgrades, and upcoming earnings.',
        (symbol) => this.stocksService.getStockFundamentals(symbol),
      ),
      get_stock_financials: symbolTool(
        'get_stock_financials',
        'Fetch quarterly financial history for the last 8 quarters: revenue, net income, operating income, free cash flow, assets, debt, and YoY growth rates.',
        (symbol) => this.stocksService.getStockFinancials(symbol),
      ),
      get_stock_news: symbolTool(
        'get_stock_news',
        'Fetch recent news articles for catalyst analysis: partnerships, contracts, earnings, product launches, analyst actions, and sector developments. Use only these articles for catalysts and deals — never invent news.',
        (symbol) => this.stocksService.getStockNews(symbol),
      ),
      get_stock_competitors: symbolTool(
        'get_stock_competitors',
        'Fetch similar stocks and leading competitors for competitive positioning analysis.',
        (symbol) => this.stocksService.getStockCompetitors(symbol),
      ),
    };
  }

  getToolDefinitions() {
    return Object.values(this.handlers).map((handler) => handler.definition);
  }

  async executeTool(
    name: string,
    args: Record<string, unknown>,
  ): Promise<unknown> {
    const handler = this.handlers[name as AgentToolName];

    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }

    return handler.execute(args);
  }
}
