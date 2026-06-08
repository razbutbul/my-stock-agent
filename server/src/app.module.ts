import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { AgentModule } from './modules/agent/agent.module';
import { StocksModule } from './modules/stocks/stocks.module';

@Module({
  imports: [HealthModule, AgentModule, StocksModule],
})
export class AppModule {}
