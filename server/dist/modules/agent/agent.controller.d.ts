import { AgentService } from './agent.service';
import { AgentChatDto } from './agent-chat.dto';
import { AgentResponseDto } from './agent-response.dto';
import { AnalyzeStockDto } from './analyze-stock.dto';
import { StockInsightDto } from './stock-insight.dto';
export declare class AgentController {
    private readonly agentService;
    constructor(agentService: AgentService);
    chat(body: AgentChatDto): Promise<AgentResponseDto>;
    analyzeStock(body: AnalyzeStockDto): Promise<StockInsightDto>;
}
