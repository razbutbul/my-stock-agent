import { Body, Controller, Post } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentChatDto } from './agent-chat.dto';
import { AgentResponseDto } from './agent-response.dto';
import { AnalyzeStockDto } from './analyze-stock.dto';
import { StockInsightDto } from './stock-insight.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('chat')
  chat(@Body() body: AgentChatDto): Promise<AgentResponseDto> {
    return this.agentService.chat(body.message);
  }

  @Post('analyze')
  analyzeStock(@Body() body: AnalyzeStockDto): Promise<StockInsightDto> {
    return this.agentService.analyzeStock(body.symbol);
  }
}
