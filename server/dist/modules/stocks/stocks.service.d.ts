import { StockQuoteDto } from './stock-quote.dto';
export declare class StocksService {
    private readonly yahooFinance;
    getStockQuote(symbol: string): Promise<StockQuoteDto>;
}
