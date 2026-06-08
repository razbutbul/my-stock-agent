import { Injectable } from '@nestjs/common';
import { StocksService } from '../../stocks/stocks.service';
import { StockQuoteDto } from '../../stocks/stock-quote.dto';
import type { AgentToolHandler, AgentToolName } from './tool.types';

@Injectable()
export class AgentToolsService {
  private readonly handlers: Record<AgentToolName, AgentToolHandler>;

  constructor(private readonly stocksService: StocksService) {
    this.handlers = {
      get_stock_quote: {
        name: 'get_stock_quote',
        definition: {
          type: 'function',
          function: {
            name: 'get_stock_quote',
            description:
              'Fetch live stock quote data (price, volume, daily change, market state) for a ticker symbol. Use this whenever the user asks for stock insights, analysis, price, or performance of a specific company.',
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
        execute: (args) => this.getStockQuote(args),
      },
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

  private getStockQuote(args: Record<string, unknown>): Promise<StockQuoteDto> {
    const symbol = args.symbol;

    if (typeof symbol !== 'string' || !symbol.trim()) {
      throw new Error('get_stock_quote requires a non-empty symbol');
    }

    return this.stocksService.getStockQuote(symbol);
  }
}
