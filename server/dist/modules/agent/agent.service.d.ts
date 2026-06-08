import { AgentResponseDto } from './agent-response.dto';
import { StockInsightDto } from './stock-insight.dto';
import { AgentPromptService } from './agent-prompt.service';
import { AgentToolsService } from './tools/agent-tools.service';
export declare class AgentService {
    private readonly agentToolsService;
    private readonly agentPromptService;
    constructor(agentToolsService: AgentToolsService, agentPromptService: AgentPromptService);
    chat(message: string): Promise<AgentResponseDto>;
    analyzeStock(symbol: string): Promise<StockInsightDto>;
    private createOpenAiClient;
    private runToolCall;
    private isStockQuote;
}
