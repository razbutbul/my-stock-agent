import { StocksService } from '../../stocks/stocks.service';
export declare class AgentToolsService {
    private readonly stocksService;
    private readonly handlers;
    constructor(stocksService: StocksService);
    getToolDefinitions(): import("openai/resources/index.js").ChatCompletionTool[];
    executeTool(name: string, args: Record<string, unknown>): Promise<unknown>;
    private getStockQuote;
}
