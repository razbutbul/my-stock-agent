import { StocksService } from './stocks.service';
import { StockQuoteDto } from './stock-quote.dto';
export declare class StocksController {
    private readonly stocksService;
    constructor(stocksService: StocksService);
    getStock(symbol: string): Promise<StockQuoteDto>;
}
