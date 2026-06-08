import { Controller, Get, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StockQuoteDto } from './stock-quote.dto';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get(':symbol')
  getStock(@Param('symbol') symbol: string): Promise<StockQuoteDto> {
    return this.stocksService.getStockQuote(symbol);
  }
}
