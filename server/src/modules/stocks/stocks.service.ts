import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import YahooFinance from 'yahoo-finance2';
import { StockQuoteDto } from './stock-quote.dto';

interface YahooStockQuote {
  symbol?: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  currency?: string;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  marketState?: string;
  regularMarketPreviousClose?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
}

@Injectable()
export class StocksService {
  private readonly yahooFinance = new YahooFinance();

  async getStockQuote(symbol: string): Promise<StockQuoteDto> {
    const normalizedSymbol = symbol.trim().toUpperCase();

    if (!normalizedSymbol) {
      throw new BadRequestException('Stock symbol is required');
    }

    try {
      const quote = (await this.yahooFinance.quote(normalizedSymbol, {
        fields: [
          'symbol',
          'shortName',
          'longName',
          'regularMarketPrice',
          'currency',
          'regularMarketChange',
          'regularMarketChangePercent',
          'marketState',
          'regularMarketPreviousClose',
          'regularMarketDayHigh',
          'regularMarketDayLow',
          'regularMarketVolume',
        ],
      })) as YahooStockQuote;

      if (!quote?.regularMarketPrice) {
        throw new NotFoundException(
          `No data found for symbol "${normalizedSymbol}"`,
        );
      }

      return {
        symbol: quote.symbol ?? normalizedSymbol,
        name: quote.longName ?? quote.shortName ?? normalizedSymbol,
        price: quote.regularMarketPrice,
        currency: quote.currency ?? 'USD',
        change: quote.regularMarketChange ?? null,
        changePercent: quote.regularMarketChangePercent ?? null,
        marketState: quote.marketState ?? 'UNKNOWN',
        previousClose: quote.regularMarketPreviousClose ?? null,
        dayHigh: quote.regularMarketDayHigh ?? null,
        dayLow: quote.regularMarketDayLow ?? null,
        volume: quote.regularMarketVolume ?? null,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new NotFoundException(
        `Could not fetch data for symbol "${normalizedSymbol}"`,
      );
    }
  }
}
