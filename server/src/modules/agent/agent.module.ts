import { Module } from '@nestjs/common';
import { StocksModule } from '../stocks/stocks.module';
import { AgentController } from './agent.controller';
import { AgentPromptService } from './agent-prompt.service';
import { AgentService } from './agent.service';
import { AgentToolsService } from './tools/agent-tools.service';

@Module({
  imports: [StocksModule],
  controllers: [AgentController],
  providers: [AgentPromptService, AgentService, AgentToolsService],
  exports: [AgentService],
})
export class AgentModule {}
