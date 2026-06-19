import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { AgentModule } from './modules/agent/agent.module';
import { StocksModule } from './modules/stocks/stocks.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AgentModule,
    StocksModule,
    FavoritesModule,
  ],
})
export class AppModule {}
