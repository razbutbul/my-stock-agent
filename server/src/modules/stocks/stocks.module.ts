import { Module } from '@nestjs/common';
import { SecEdgarService } from './sec-edgar.service';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

@Module({
  controllers: [StocksController],
  providers: [SecEdgarService, StocksService],
  exports: [StocksService],
})
export class StocksModule {}
