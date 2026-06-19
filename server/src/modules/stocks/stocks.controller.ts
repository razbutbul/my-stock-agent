import { Controller, Get, Param } from '@nestjs/common';
import { StockChartDto } from './stock-chart.dto';
import { StockCompetitorsDto } from './stock-competitors.dto';
import { StockFinancialsDto } from './stock-financials.dto';
import { StockFundamentalsDto } from './stock-fundamentals.dto';
import { HotStocksDto } from './stock-hot.dto';
import { StockNewsDto } from './stock-news.dto';
import { StockQuoteDto } from './stock-quote.dto';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('hot')
  getHotStocks(): Promise<HotStocksDto> {
    return this.stocksService.getHotStocks();
  }

  @Get(':symbol/chart')
  getChart(@Param('symbol') symbol: string): Promise<StockChartDto> {
    return this.stocksService.getStockChart(symbol);
  }

  @Get(':symbol/fundamentals')
  getFundamentals(@Param('symbol') symbol: string): Promise<StockFundamentalsDto> {
    return this.stocksService.getStockFundamentals(symbol);
  }

  @Get(':symbol/financials')
  getFinancials(@Param('symbol') symbol: string): Promise<StockFinancialsDto> {
    return this.stocksService.getStockFinancials(symbol);
  }

  @Get(':symbol/news')
  getNews(@Param('symbol') symbol: string): Promise<StockNewsDto> {
    return this.stocksService.getStockNews(symbol);
  }

  @Get(':symbol/competitors')
  getCompetitors(@Param('symbol') symbol: string): Promise<StockCompetitorsDto> {
    return this.stocksService.getStockCompetitors(symbol);
  }

  @Get(':symbol')
  getStock(@Param('symbol') symbol: string): Promise<StockQuoteDto> {
    return this.stocksService.getStockQuote(symbol);
  }
}
