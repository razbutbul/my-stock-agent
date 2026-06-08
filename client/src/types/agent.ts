import type { StockQuote } from './stock';

export interface StockInsight {
  symbol: string;
  name: string;
  stock?: StockQuote;
  insights: string;
  toolsUsed: string[];
}
