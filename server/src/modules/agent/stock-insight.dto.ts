import { StockQuoteDto } from '../stocks/stock-quote.dto';

export interface StockInsightDto {
  symbol: string;
  name: string;
  stock?: StockQuoteDto;
  insights: string;
  toolsUsed: string[];
}
