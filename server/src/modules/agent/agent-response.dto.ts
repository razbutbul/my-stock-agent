import { StockQuoteDto } from '../stocks/stock-quote.dto';

export interface AgentResponseDto {
  message: string;
  toolsUsed: string[];
  stock?: StockQuoteDto;
}
